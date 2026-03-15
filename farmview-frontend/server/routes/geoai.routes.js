/**
 * GeoAI Routes - Crop Intelligence API
 * Combines satellite data, NDVI, and Gemini AI for crop analysis
 */

const express = require('express');
const router = express.Router();
const geoAIService = require('../services/geoAIService');
const sentinelService = require('../services/sentinelService');
const Property = require('../models/Property.model');
const { protect } = require('../middleware/auth.middleware');

/**
 * POST /api/geoai/analyze-crop
 * Comprehensive crop analysis using GeoAI
 */
router.post('/analyze-crop', protect, async (req, res) => {
  try {
    const {
      propertyId,
      includeImage = true,
      weatherData,
      soilData,
      previousCrop,
      cropStage
    } = req.body;

    // Get property details
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    console.log(`🌾 Analyzing crop for property: ${property.surveyNumber || property.propertyName}`);

    // Validate boundary structure - try boundary first, then location
    const coordinates = property.boundary?.coordinates?.[0] || property.location?.coordinates?.[0];
    
    console.log('Property coordinate structure:', {
      hasBoundary: !!property.boundary,
      boundaryCoordinates: property.boundary?.coordinates?.length || 0,
      hasLocation: !!property.location,
      locationCoordinates: property.location?.coordinates?.length || 0,
      usingSource: coordinates ? (property.boundary?.coordinates?.[0] ? 'boundary' : 'location') : 'none',
      coordinateCount: Array.isArray(coordinates) ? coordinates.length : 0
    });

    // Calculate NDVI data
    let ndviData, satelliteImage;
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      return res.status(400).json({ 
        error: 'Property has no valid boundary coordinates',
        hint: 'Please draw property boundaries on the map in the Property page'
      });
    }

    try {
      const bbox = calculateBBox(coordinates);
      
      // Try to get NDVI analysis
      try {
        ndviData = await sentinelService.calculateNDVI({
          bbox,
          fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          toDate: new Date().toISOString().split('T')[0],
          cloudCoverage: 30
        });
      } catch (ndviError) {
        console.warn('⚠️  Sentinel data unavailable, using estimated values:', ndviError.message);
        // Use estimated/mock NDVI data when satellite data isn't available
        ndviData = {
          mean: 0.55,
          min: 0.2,
          max: 0.75,
          median: 0.58,
          stdDev: 0.15,
          healthyPercentage: 45,
          moderatePercentage: 35,
          stressedPercentage: 20,
          estimatedFromFallback: true
        };
      }

      // Get satellite image if requested
      if (includeImage) {
        try {
          const imageResult = await sentinelService.getSatelliteImage({
            bbox,
            fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            toDate: new Date().toISOString().split('T')[0],
            cloudCoverage: 30
          });
          satelliteImage = imageResult.imageBuffer;
        } catch (imgError) {
          console.warn('⚠️  Satellite image unavailable:', imgError.message);
          // Continue without image
        }
      }
    } catch (coordError) {
      console.error('Error processing coordinates:', coordError);
      return res.status(400).json({ 
        error: 'Invalid property boundary coordinates',
        details: coordError.message 
      });
    }

    // Analyze with GeoAI
    const analysis = await geoAIService.analyzeCropHealth({
      ndviData,
      satelliteImage,
      location: {
        lat: property.location.coordinates[1],
        lng: property.location.coordinates[0],
        region: property.district
      },
      weatherData: weatherData || {},
      soilData: soilData || property.soilType || {},
      previousCrop,
      cropStage
    });

    res.json({
      success: true,
      propertyId: property._id,
      surveyNumber: property.surveyNumber,
      analysis,
      ndviSummary: {
        mean: ndviData.mean,
        healthyPercentage: ndviData.healthyPercentage,
        stressedPercentage: ndviData.stressedPercentage
      },
      timestamp: new Date()
    });

  } catch (error) {
    console.error('❌ Crop analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze crop',
      message: error.message
    });
  }
});

/**
 * POST /api/geoai/identify-crop
 * Identify crop type from satellite imagery + NDVI
 */
router.post('/identify-crop', protect, async (req, res) => {
  try {
    const { propertyId, seasonData } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    console.log(`🔍 Identifying crop for property: ${property.surveyNumber || property.propertyName}`);

    // Get coordinates - try boundary first, then location
    const coordinates = property.boundary?.coordinates?.[0] || property.location?.coordinates?.[0];
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      return res.status(400).json({ 
        error: 'Property boundary not defined. Please draw property boundary first.' 
      });
    }

    const bbox = calculateBBox(coordinates);

    // Get satellite image and NDVI with fallback to mock data
    let imageResult, ndviData;
    
    try {
      [imageResult, ndviData] = await Promise.all([
        sentinelService.getSatelliteImage({
          bbox,
          fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          toDate: new Date().toISOString().split('T')[0],
          cloudCoverage: 30
        }),
        sentinelService.calculateNDVI({
          bbox,
          fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          toDate: new Date().toISOString().split('T')[0],
          cloudCoverage: 30
        })
      ]);
    } catch (sentinelError) {
      console.warn('⚠️ Sentinel Hub unavailable, using mock data for crop identification');
      
      // Mock satellite image (small placeholder)
      imageResult = {
        imageBuffer: Buffer.from('mock-image-data'),
        metadata: { source: 'mock', reason: 'Sentinel Hub data unavailable' }
      };
      
      // Mock NDVI data
      ndviData = {
        mean: 0.55,
        min: 0.2,
        max: 0.85,
        healthyPercentage: 45,
        moderatePercentage: 35,
        stressedPercentage: 20,
        source: 'mock',
        reason: 'No satellite data available for this location/date'
      };
    }

    // Identify crop with GeoAI
    const identification = await geoAIService.identifyCropType({
      satelliteImage: imageResult.imageBuffer,
      ndviData,
      location: {
        lat: property.location.coordinates[1],
        lng: property.location.coordinates[0],
        region: property.district
      },
      seasonData
    });

    res.json({
      success: true,
      propertyId: property._id,
      identification,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('❌ Crop identification error:', error);
    res.status(500).json({
      error: 'Failed to identify crop',
      message: error.message
    });
  }
});

/**
 * POST /api/geoai/recommend-crop
 * Get crop recommendation for next season
 */
router.post('/recommend-crop', protect, async (req, res) => {
  try {
    const {
      propertyId,
      currentCrop,
      weatherHistory,
      marketData
    } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    console.log(`💡 Generating crop recommendation for: ${property.surveyNumber || property.propertyName}`);

    // Get coordinates - try boundary first, then location
    const coordinates = property.boundary?.coordinates?.[0] || property.location?.coordinates?.[0];
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      return res.status(400).json({ 
        error: 'Property boundary not defined. Please draw property boundary first.' 
      });
    }

    // Get NDVI history (last 6 months)
    const bbox = calculateBBox(coordinates);
    const ndviHistory = await getNDVIHistory(bbox, 6);

    // Get recommendation from GeoAI
    const recommendation = await geoAIService.recommendNextCrop({
      currentCrop,
      soilData: property.soilType || {},
      weatherHistory: weatherHistory || {},
      ndviHistory,
      location: {
        lat: property.location.coordinates[1],
        lng: property.location.coordinates[0]
      },
      farmSize: property.area,
      marketData
    });

    res.json({
      success: true,
      propertyId: property._id,
      recommendation,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('❌ Crop recommendation error:', error);
    res.status(500).json({
      error: 'Failed to generate recommendation',
      message: error.message
    });
  }
});

/**
 * POST /api/geoai/detect-issues
 * Detect crop health issues (pests, disease, stress)
 */
router.post('/detect-issues', protect, async (req, res) => {
  try {
    const {
      propertyId,
      cropType,
      cropStage,
      weatherData
    } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    console.log(`🔬 Detecting issues for: ${property.surveyNumber || property.propertyName}`);

    // Get coordinates - try boundary first, then location
    const coordinates = property.boundary?.coordinates?.[0] || property.location?.coordinates?.[0];
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      return res.status(400).json({ 
        error: 'Property boundary not defined. Please draw property boundary first.' 
      });
    }

    const bbox = calculateBBox(coordinates);

    // Get current data with fallback to mock data
    let imageResult, ndviData, ndviHistory;
    
    try {
      [imageResult, ndviData, ndviHistory] = await Promise.all([
        sentinelService.getSatelliteImage({
          bbox,
          fromDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          toDate: new Date().toISOString().split('T')[0],
          cloudCoverage: 30
        }),
        sentinelService.calculateNDVI({
          bbox,
          fromDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          toDate: new Date().toISOString().split('T')[0],
          cloudCoverage: 30
        }),
        getNDVIHistory(bbox, 1) // Last month
      ]);
    } catch (sentinelError) {
      console.warn('⚠️ Sentinel Hub unavailable, using mock data for issue detection');
      
      // Mock satellite image
      imageResult = {
        imageBuffer: Buffer.from('mock-image-data'),
        metadata: { source: 'mock', reason: 'Sentinel Hub data unavailable' }
      };
      
      // Mock NDVI data
      ndviData = {
        mean: 0.52,
        min: 0.18,
        max: 0.82,
        healthyPercentage: 42,
        moderatePercentage: 38,
        stressedPercentage: 20,
        change: -0.05,
        lowNDVIPercentage: 20,
        source: 'mock',
        reason: 'No satellite data available for this location/date'
      };
      
      // Mock NDVI history
      ndviHistory = [
        { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), mean: 0.57 },
        { date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), mean: 0.55 },
        { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), mean: 0.53 },
        { date: new Date(), mean: 0.52 }
      ];
    }

    // Detect issues with GeoAI
    const issueDetection = await geoAIService.detectCropIssues({
      satelliteImage: imageResult.imageBuffer,
      ndviData,
      ndviHistory,
      weatherData: weatherData || {},
      cropType,
      cropStage
    });

    res.json({
      success: true,
      propertyId: property._id,
      issueDetection,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('❌ Issue detection error:', error);
    res.status(500).json({
      error: 'Failed to detect issues',
      message: error.message
    });
  }
});

/**
 * POST /api/geoai/predict-yield
 * Predict crop yield based on NDVI and conditions
 */
router.post('/predict-yield', protect, async (req, res) => {
  try {
    const {
      propertyId,
      cropType,
      cropStage,
      weatherData,
      soilData
    } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    console.log(`📊 Predicting yield for: ${property.surveyNumber || property.propertyName}`);

    // Get coordinates - try boundary first, then location
    const coordinates = property.boundary?.coordinates?.[0] || property.location?.coordinates?.[0];
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      return res.status(400).json({ 
        error: 'Property boundary not defined. Please draw property boundary first.' 
      });
    }

    // Get NDVI history for the growing season
    const bbox = calculateBBox(coordinates);
    const ndviHistory = await getNDVIHistory(bbox, 3);

    // Predict yield with GeoAI
    const yieldPrediction = await geoAIService.predictYield({
      cropType,
      ndviHistory,
      weatherData: weatherData || {},
      soilData: soilData || property.soilType || {},
      farmSize: property.area,
      cropStage
    });

    res.json({
      success: true,
      propertyId: property._id,
      yieldPrediction,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('❌ Yield prediction error:', error);
    res.status(500).json({
      error: 'Failed to predict yield',
      message: error.message
    });
  }
});

/**
 * POST /api/geoai/farming-advice
 * Get practical farming advice based on analysis
 */
router.post('/farming-advice', protect, async (req, res) => {
  try {
    const {
      cropType,
      issues,
      season,
      location,
      farmerExperience
    } = req.body;

    console.log(`💬 Generating farming advice for ${cropType}`);

    const advice = await geoAIService.generateFarmingAdvice({
      cropType,
      issues,
      season,
      location,
      farmerExperience
    });

    res.json({
      success: true,
      advice,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('❌ Advice generation error:', error);
    res.status(500).json({
      error: 'Failed to generate advice',
      message: error.message
    });
  }
});

/**
 * Helper: Calculate bounding box from coordinates
 */
function calculateBBox(coordinates) {
  if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
    console.error('Invalid coordinates provided to calculateBBox');
    throw new Error('Invalid boundary coordinates');
  }

  // Flatten coordinates if they're nested (e.g., [[[[lon, lat]]]])
  let flatCoords = coordinates;
  while (Array.isArray(flatCoords[0]) && Array.isArray(flatCoords[0][0])) {
    flatCoords = flatCoords[0];
  }

  if (!Array.isArray(flatCoords) || flatCoords.length === 0) {
    console.error('Could not flatten coordinates properly');
    throw new Error('Invalid boundary coordinates structure');
  }

  let minLon = Infinity, minLat = Infinity;
  let maxLon = -Infinity, maxLat = -Infinity;

  flatCoords.forEach(coord => {
    if (!coord || !Array.isArray(coord) || coord.length < 2) {
      console.warn('Skipping invalid coordinate:', coord);
      return;
    }
    const [lon, lat] = coord;
    if (typeof lon === 'number' && typeof lat === 'number') {
      minLon = Math.min(minLon, lon);
      minLat = Math.min(minLat, lat);
      maxLon = Math.max(maxLon, lon);
      maxLat = Math.max(maxLat, lat);
    }
  });

  if (!isFinite(minLon) || !isFinite(minLat) || !isFinite(maxLon) || !isFinite(maxLat)) {
    console.error('Could not calculate valid bounding box');
    throw new Error('Invalid coordinate values');
  }

  console.log(`📍 Calculated BBox: [${minLon}, ${minLat}, ${maxLon}, ${maxLat}]`);
  return [minLon, minLat, maxLon, maxLat];
}

/**
 * Helper: Get NDVI history for multiple time periods
 */
async function getNDVIHistory(bbox, monthsBack = 3) {
  const history = [];
  const now = new Date();

  for (let i = 0; i < monthsBack; i++) {
    const toDate = new Date(now.getTime() - i * 30 * 24 * 60 * 60 * 1000);
    const fromDate = new Date(toDate.getTime() - 15 * 24 * 60 * 60 * 1000);

    try {
      const ndviData = await sentinelService.calculateNDVI({
        bbox,
        fromDate: fromDate.toISOString().split('T')[0],
        toDate: toDate.toISOString().split('T')[0],
        cloudCoverage: 50
      });

      history.push({
        date: toDate.toISOString().split('T')[0],
        mean: ndviData.mean,
        healthyPercentage: ndviData.healthyPercentage,
        stressedPercentage: ndviData.stressedPercentage
      });
    } catch (error) {
      console.warn(`⚠️ Failed to get NDVI for ${toDate.toISOString()}`);
    }
  }

  return history;
}

module.exports = router;
