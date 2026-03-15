/**
 * GeoAI Service - Crop Intelligence using Groq AI + Satellite Data
 * Combines NDVI, satellite imagery, weather, and soil data for crop analysis
 */

const Groq = require('groq-sdk');
const axios = require('axios');

class GeoAIService {
  constructor() {
    this.groq = new Groq({
      apiKey: process.env.GROQ_API_KEY
    });
    this.model = 'llama-3.3-70b-versatile';
  }

  /**
   * Analyze crop type and health from satellite data + NDVI
   */
  async analyzeCropHealth({
    ndviData,
    satelliteImage,
    location,
    weatherData,
    soilData,
    previousCrop,
    cropStage
  }) {
    try {
      console.log('🌾 Starting GeoAI crop analysis...');

      // Prepare comprehensive prompt for Groq
      const prompt = this.buildAnalysisPrompt({
        ndviData,
        location,
        weatherData,
        soilData,
        previousCrop,
        cropStage
      });

      // Call Groq AI (text-only, no image support)
      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert agricultural scientist analyzing crop health data. Provide detailed, structured analysis in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 2000
      });

      const analysis = completion.choices[0]?.message?.content;
      
      if (!analysis) {
        console.warn('⚠️ No response from Groq AI, using default analysis');
        return {
          cropIdentification: {
            likelyCrop: 'Unable to determine',
            confidence: 30,
            reasoning: 'Insufficient data for identification'
          },
          healthAssessment: {
            overallHealth: 'Fair',
            healthScore: 60,
            ndviInterpretation: 'Based on limited mock data'
          },
          detectedIssues: [{
            issue: 'Limited data availability',
            severity: 'Medium',
            recommendation: 'Conduct field inspection'
          }],
          cropRecommendation: {
            nextCrop: 'Consult local expert',
            reasoning: 'Need more data for accurate recommendation'
          },
          actionableInsights: [
            'Regular field monitoring recommended',
            'Consider manual crop health assessment',
            'Retry analysis when satellite data available'
          ]
        };
      }

      console.log('✅ GeoAI analysis completed');

      // Parse the structured response
      return this.parseJsonFromResponse(analysis);

    } catch (error) {
      console.error('❌ GeoAI analysis failed:', error.message);
      return {
        cropIdentification: {
          likelyCrop: 'Analysis Error',
          confidence: 0,
          reasoning: error.message
        },
        healthAssessment: {
          overallHealth: 'Unknown',
          healthScore: 0,
          ndviInterpretation: 'Analysis failed'
        },
        detectedIssues: [{
          issue: 'Analysis error',
          severity: 'Low',
          recommendation: 'Try again later'
        }],
        cropRecommendation: {
          nextCrop: 'Unable to recommend',
          reasoning: 'Analysis incomplete'
        },
        actionableInsights: ['Retry analysis', 'Check system status'],
        error: error.message
      };
    }
  }

  /**
   * Identify crop type from satellite imagery + NDVI patterns
   */
  async identifyCropType({
    satelliteImage,
    ndviData,
    location,
    seasonData
  }) {
    try {
      console.log('🔍 Identifying crop type with GeoAI...');

      const prompt = `
You are an expert agricultural scientist analyzing vegetation data to identify crop types.

**Location Data:**
- Latitude: ${location.lat}
- Longitude: ${location.lng}
- Region: ${location.region || 'Unknown'}

**NDVI Analysis:**
- Mean NDVI: ${ndviData.mean?.toFixed(3) || 'N/A'}
- Min NDVI: ${ndviData.min?.toFixed(3) || 'N/A'}
- Max NDVI: ${ndviData.max?.toFixed(3) || 'N/A'}
- Std Dev: ${ndviData.stdDev?.toFixed(3) || 'N/A'}
- Healthy Vegetation %: ${ndviData.healthyPercentage?.toFixed(1) || 'N/A'}%

**Season/Time:** ${seasonData || 'Current season'}

**Task:**
1. Analyze NDVI patterns typical for different crops
2. Consider geographic location and season
3. Identify the most likely crop type

**Output Format (JSON):**
{
  "cropType": "Primary crop name",
  "confidence": 85,
  "alternativeCrops": ["Possible alternative 1", "Possible alternative 2"],
  "reasoning": "Detailed explanation of identification",
  "cropCharacteristics": {
    "pattern": "NDVI pattern description",
    "ndviSignature": "NDVI range interpretation",
    "seasonalMatch": "Season compatibility"
  }
}

Provide only valid JSON response.`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert agricultural scientist. Analyze the data and provide crop identification in valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: this.model,
        temperature: 0.6,
        max_tokens: 1000
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        console.warn('⚠️ No response from Groq AI, using default crop identification');
        return {
          identification: {
            cropType: 'Unable to identify',
            confidence: 30,
            reasoning: 'Insufficient satellite data for accurate identification'
          },
          alternatives: [
            { crop: 'Rice', probability: 25, reasoning: 'Common in region' },
            { crop: 'Wheat', probability: 20, reasoning: 'Seasonal crop' }
          ],
          recommendations: ['Conduct physical inspection', 'Use local agricultural knowledge']
        };
      }
      
      return this.parseJsonFromResponse(response);

    } catch (error) {
      console.error('❌ Crop identification failed:', error.message);
      return {
        identification: {
          cropType: 'Analysis Error',
          confidence: 0,
          reasoning: 'Unable to complete analysis: ' + error.message
        },
        alternatives: [],
        recommendations: ['Try again later', 'Consult local agricultural expert'],
        error: error.message
      };
    }
  }

  /**
   * Get crop recommendation for the next season
   */
  async recommendNextCrop({
    currentCrop,
    soilData,
    weatherHistory,
    ndviHistory,
    location,
    farmSize,
    marketData
  }) {
    try {
      console.log('💡 Generating crop recommendation...');

      const prompt = `
You are an agricultural expert providing crop rotation and selection recommendations.

**Current Situation:**
- Current/Previous Crop: ${currentCrop || 'Unknown'}
- Location: ${location.lat}, ${location.lng}
- Farm Size: ${farmSize || 'N/A'} hectares

**Soil Analysis:**
${JSON.stringify(soilData, null, 2)}

**Weather History (Last 6 months):**
${JSON.stringify(weatherHistory, null, 2)}

**NDVI Performance History:**
${JSON.stringify(ndviHistory, null, 2)}

**Market Data (if available):**
${JSON.stringify(marketData, null, 2)}

**Task:**
Recommend the best crop(s) for the next planting season considering:
1. Crop rotation principles (avoid monoculture)
2. Soil nutrient recovery
3. Climate suitability
4. Water requirements vs availability
5. Market demand and profitability
6. Pest/disease risk management

**Output Format (JSON):**
{
  "primaryRecommendation": {
    "cropName": "Recommended crop",
    "confidence": 90,
    "expectedYield": "Estimated yield range",
    "profitability": "High/Medium/Low",
    "reasoning": "Why this crop is best"
  },
  "alternativeOptions": [
    {
      "cropName": "Alternative 1",
      "confidence": 75,
      "pros": ["Advantage 1", "Advantage 2"],
      "cons": ["Disadvantage 1"]
    }
  ],
  "soilPreparation": ["Step 1", "Step 2", "Step 3"],
  "riskFactors": ["Risk 1", "Risk 2"],
  "estimatedROI": "Expected return on investment",
  "waterRequirement": "Low/Medium/High",
  "seasonalTiming": "Best planting window"
}

Provide only valid JSON response.`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an agricultural expert. Provide crop recommendations in valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        console.warn('⚠️ No response from Groq AI, using default crop recommendation');
        return {
          primaryRecommendation: {
            cropName: 'Consult local expert',
            confidence: 30,
            expectedYield: 'Unable to estimate',
            profitability: 'Unknown',
            reasoning: 'Insufficient data for accurate recommendation'
          },
          alternativeOptions: [{
            cropName: 'Visit agricultural office',
            confidence: 20,
            pros: ['Professional guidance', 'Local expertise'],
            cons: ['Requires in-person visit']
          }],
          soilPreparation: ['Standard land preparation', 'Soil testing recommended'],
          riskFactors: ['Data unavailability', 'Limited satellite coverage'],
          estimatedROI: 'Unable to estimate',
          waterRequirement: 'Unknown',
          seasonalTiming: 'Consult local agricultural calendar'
        };
      }
      
      return this.parseJsonFromResponse(response);

    } catch (error) {
      console.error('❌ Crop recommendation failed:', error.message);
      return {
        primaryRecommendation: {
          cropName: 'Analysis Error',
          confidence: 0,
          expectedYield: 'N/A',
          profitability: 'Unknown',
          reasoning: 'Unable to complete analysis: ' + error.message
        },
        alternativeOptions: [],
        soilPreparation: ['Retry analysis'],
        riskFactors: ['Analysis failed'],
        estimatedROI: 'N/A',
        waterRequirement: 'Unknown',
        seasonalTiming: 'Unknown',
        error: error.message
      };
    }
  }

  /**
   * Detect crop issues (pests, diseases, drought, nutrient deficiency)
   */
  async detectCropIssues({
    satelliteImage,
    ndviData,
    ndviHistory,
    weatherData,
    cropType,
    cropStage
  }) {
    try {
      console.log('🔬 Detecting crop health issues...');

      const prompt = `
You are a plant pathologist analyzing crop health using vegetation indices and environmental data.

**Crop Information:**
- Crop Type: ${cropType || 'Unknown'}
- Growth Stage: ${cropStage || 'Unknown'}

**Current NDVI Analysis:**
- Mean NDVI: ${ndviData.mean?.toFixed(3)}
- NDVI Drop from Previous: ${ndviData.change || 'N/A'}
- Affected Area: ${ndviData.lowNDVIPercentage?.toFixed(1)}%

**NDVI Trend (Last 30 days):**
${JSON.stringify(ndviHistory, null, 2)}

**Weather Conditions:**
${JSON.stringify(weatherData, null, 2)}

**Task:**
Analyze the NDVI data and environmental conditions to detect:
1. Disease symptoms (NDVI drops, irregular patterns)
2. Pest damage patterns (localized NDVI reduction)
3. Drought stress (low NDVI + high temperature)
4. Waterlogging (low NDVI + excessive rainfall)
5. Nutrient deficiency (gradual NDVI decline)

**Output Format (JSON):**
{
  "healthStatus": "Healthy/At Risk/Critical",
  "overallScore": 75,
  "detectedIssues": [
    {
      "type": "Pest/Disease/Drought/Nutrient/Waterlogging",
      "severity": "Low/Medium/High/Critical",
      "confidence": 85,
      "affectedArea": "15% of field",
      "symptoms": ["Symptom 1", "Symptom 2"],
      "location": "Based on NDVI pattern",
      "urgency": "Immediate/Soon/Monitor"
    }
  ],
  "recommendations": [
    {
      "action": "Specific action to take",
      "priority": "High/Medium/Low",
      "timing": "When to act",
      "expectedCost": "Estimated cost",
      "expectedBenefit": "Expected outcome"
    }
  ],
  "preventiveMeasures": ["Prevention tip 1", "Prevention tip 2"],
  "yieldImpact": "Estimated yield loss if not treated",
  "monitoringAdvice": "How often to check and what to watch"
}

Provide only valid JSON response.`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a plant pathologist expert. Analyze crop health data and provide insights in valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: this.model,
        temperature: 0.6,
        max_tokens: 2000
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        console.warn('⚠️ No response from Groq AI, using default issue detection');
        return {
          healthStatus: 'At Risk',
          overallScore: 65,
          detectedIssues: [{
            type: 'Data Unavailable',
            severity: 'Medium',
            confidence: 50,
            affectedArea: 'Unable to determine',
            symptoms: ['Limited satellite data', 'Analysis based on mock NDVI values'],
            location: 'Entire field',
            urgency: 'Monitor'
          }],
          recommendations: [{
            action: 'Conduct physical field inspection',
            priority: 'Medium',
            timing: 'Within next 3-5 days',
            expectedCost: 'Minimal - visual inspection',
            expectedBenefit: 'Better understanding of actual field conditions'
          }],
          preventiveMeasures: ['Regular field monitoring', 'Keep records of crop health'],
          yieldImpact: 'Unable to estimate without satellite data',
          monitoringAdvice: 'Weekly visual inspection recommended'
        };
      }
      
      return this.parseJsonFromResponse(response);

    } catch (error) {
      console.error('❌ Issue detection failed:', error.message);
      // Return a default response instead of throwing
      return {
        healthStatus: 'Unknown',
        overallScore: 50,
        detectedIssues: [{
          type: 'Analysis Error',
          severity: 'Low',
          confidence: 30,
          affectedArea: 'Unknown',
          symptoms: ['Unable to complete analysis'],
          location: 'Unknown',
          urgency: 'Monitor'
        }],
        recommendations: [{
          action: 'Try analysis again later or conduct manual inspection',
          priority: 'Low',
          timing: 'When convenient',
          expectedCost: 'None',
          expectedBenefit: 'Field health assessment'
        }],
        preventiveMeasures: ['Regular monitoring'],
        yieldImpact: 'Unable to estimate',
        monitoringAdvice: 'Check crop health manually',
        error: error.message
      };
    }
  }

  /**
   * Predict yield based on NDVI trends and conditions
   */
  async predictYield({
    cropType,
    ndviHistory,
    weatherData,
    soilData,
    farmSize,
    cropStage
  }) {
    try {
      console.log('📊 Predicting crop yield...');

      const prompt = `
You are an agricultural data scientist predicting crop yield using vegetation indices and environmental data.

**Crop Details:**
- Crop Type: ${cropType}
- Farm Size: ${farmSize} hectares
- Growth Stage: ${cropStage}

**NDVI Performance History:**
${JSON.stringify(ndviHistory, null, 2)}

**Weather Conditions:**
${JSON.stringify(weatherData, null, 2)}

**Soil Quality:**
${JSON.stringify(soilData, null, 2)}

**Task:**
Predict the final yield based on:
1. NDVI trends (health trajectory)
2. Weather impact (stress periods)
3. Soil fertility
4. Current crop stage progress

**Output Format (JSON):**
{
  "predictedYield": {
    "amount": "X tons or quintals",
    "perHectare": "Yield per hectare",
    "confidenceInterval": "Min - Max range"
  },
  "confidenceLevel": 80,
  "factors": {
    "positive": ["Factor helping yield"],
    "negative": ["Factor reducing yield"]
  },
  "comparison": {
    "vsAverage": "+15% above average",
    "vsPotential": "85% of potential yield",
    "vsLastYear": "Similar/Better/Worse"
  },
  "harvestTiming": "Optimal harvest window",
  "qualityExpectation": "Expected produce quality",
  "improvements": ["How to boost yield further"]
}

Provide only valid JSON response.`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an agricultural data scientist. Predict crop yields based on NDVI and environmental data. Provide valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        console.warn('⚠️ No response from Groq AI, using default yield prediction');
        return {
          predictedYield: {
            amount: 'Unable to estimate',
            perHectare: 'N/A',
            confidenceInterval: 'Insufficient data'
          },
          confidenceLevel: 30,
          factors: {
            positive: ['Season is appropriate'],
            negative: ['Limited satellite data', 'Unable to assess crop health accurately']
          },
          comparison: {
            vsAverage: 'Unable to compare',
            vsPotential: 'Unknown',
            vsLastYear: 'No historical data'
          },
          harvestTiming: 'Consult local agricultural calendar',
          qualityExpectation: 'Unable to predict',
          improvements: ['Ensure proper field monitoring', 'Maintain good agricultural practices']
        };
      }
      
      return this.parseJsonFromResponse(response);

    } catch (error) {
      console.error('❌ Yield prediction failed:', error.message);
      return {
        predictedYield: {
          amount: 'Analysis Error',
          perHectare: 'N/A',
          confidenceInterval: 'N/A'
        },
        confidenceLevel: 0,
        factors: {
          positive: [],
          negative: ['Analysis failed: ' + error.message]
        },
        comparison: {
          vsAverage: 'Unable to compare',
          vsPotential: 'Unknown',
          vsLastYear: 'Unknown'
        },
        harvestTiming: 'Consult agricultural expert',
        qualityExpectation: 'Unable to predict',
        improvements: ['Retry analysis later'],
        error: error.message
      };
    }
  }

  /**
   * Build comprehensive analysis prompt
   */
  buildAnalysisPrompt({
    ndviData,
    location,
    weatherData,
    soilData,
    previousCrop,
    cropStage
  }) {
    return `
You are an expert agricultural AI analyzing crop health using satellite data, NDVI, and environmental factors.

**Location:**
- Coordinates: ${location.lat}, ${location.lng}
- Region: ${location.region || 'Unknown'}

**NDVI Vegetation Analysis:**
- Mean NDVI: ${ndviData.mean?.toFixed(3) || 'N/A'}
- Min NDVI: ${ndviData.min?.toFixed(3) || 'N/A'}
- Max NDVI: ${ndviData.max?.toFixed(3) || 'N/A'}
- Healthy Vegetation: ${ndviData.healthyPercentage?.toFixed(1) || 'N/A'}%
- Stressed Vegetation: ${ndviData.stressedPercentage?.toFixed(1) || 'N/A'}%
- Bare Soil/Water: ${ndviData.barePercentage?.toFixed(1) || 'N/A'}%

**Weather Conditions:**
${JSON.stringify(weatherData, null, 2)}

**Soil Information:**
${JSON.stringify(soilData, null, 2)}

**Crop Context:**
- Previous Crop: ${previousCrop || 'Unknown'}
- Current Stage: ${cropStage || 'Unknown'}

**Task:**
Provide comprehensive crop analysis including:
1. Likely crop type identification
2. Overall health assessment
3. Specific issues detected (pests, disease, stress)
4. Actionable recommendations
5. Next crop suggestions

**Output Format (JSON):**
{
  "cropIdentification": {
    "likelyCrop": "Crop name",
    "confidence": 85,
    "reasoning": "Why this crop"
  },
  "healthAssessment": {
    "overallHealth": "Excellent/Good/Fair/Poor/Critical",
    "healthScore": 75,
    "ndviInterpretation": "NDVI analysis summary"
  },
  "detectedIssues": [
    {
      "issue": "Problem type",
      "severity": "Low/Medium/High",
      "recommendation": "What to do"
    }
  ],
  "cropRecommendation": {
    "nextCrop": "Recommended crop for next season",
    "reasoning": "Why this crop is suitable"
  },
  "actionableInsights": ["Insight 1", "Insight 2", "Insight 3"]
}
`;
  }

  /**
   * Parse JSON from AI response (handles markdown code blocks)
   */
  parseJsonFromResponse(text) {
    try {
      // Remove markdown code blocks if present
      let jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Find JSON object in text
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }

      return JSON.parse(jsonText);
    } catch (error) {
      console.warn('⚠️ Failed to parse JSON, returning raw text');
      return { rawResponse: text };
    }
  }

  /**
   * Generate farming advice based on GeoAI insights
   */
  async generateFarmingAdvice({
    cropType,
    issues,
    season,
    location,
    farmerExperience
  }) {
    try {
      const prompt = `
You are an agricultural extension officer providing practical farming advice to a ${farmerExperience || 'regular'} farmer.

**Situation:**
- Crop: ${cropType}
- Location: ${location}
- Season: ${season}
- Detected Issues: ${JSON.stringify(issues)}

Provide clear, actionable advice in simple language:
1. Immediate actions needed (if any)
2. Weekly maintenance tasks
3. What to watch for
4. Cost-effective solutions
5. Expected outcomes

Keep language simple and practical. Focus on what the farmer can actually do.

**Output Format (JSON):**
{
  "urgentActions": ["Action 1 with timeline"],
  "weeklyTasks": ["Task 1", "Task 2"],
  "monitoring": ["What to check daily/weekly"],
  "costEffectiveSolutions": ["Budget-friendly tip 1"],
  "expectedResults": "What farmer should see",
  "nextSteps": "What to do after following advice"
}

Provide only valid JSON response.`;

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an agricultural extension officer. Provide practical farming advice in valid JSON format only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: this.model,
        temperature: 0.7,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content;
      
      return this.parseJsonFromResponse(response);

    } catch (error) {
      console.error('❌ Advice generation failed:', error.message);
      throw error;
    }
  }
}

module.exports = new GeoAIService();
