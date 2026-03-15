import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, FaClock, FaTimesCircle, FaSpinner, 
  FaSatellite, FaChartLine, FaMapMarkedAlt, FaCalendarAlt,
  FaMoneyBillWave, FaExclamationTriangle, FaRobot, FaFileAlt,
  FaSeedling, FaTint, FaFlask, FaCalculator, FaTimes
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ClaimsDashboard() {
  const { t } = useTranslation();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [showCalculators, setShowCalculators] = useState(false);
  const [calculatorType, setCalculatorType] = useState(null);
  
  // Calculator states
  const [yieldCalc, setYieldCalc] = useState({
    plants: '',
    avgWeight: '',
    area: '',
    result: null
  });
  
  const [fertilizerCalc, setFertilizerCalc] = useState({
    area: '',
    cropType: 'wheat',
    soilType: 'loamy',
    result: null
  });
  
  const [irrigationCalc, setIrrigationCalc] = useState({
    area: '',
    cropType: 'wheat',
    season: 'kharif',
    result: null
  });
  
  const [profitCalc, setProfitCalc] = useState({
    area: '',
    yield: '',
    pricePerKg: '',
    seedCost: '',
    fertilizerCost: '',
    laborCost: '',
    result: null
  });

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const res = await api.get('/claims');
      if (res.data?.success) {
        // Filter to show only real claims with actual GeoAI/NDVI data
        const realClaims = (res.data.data || []).filter(claim => 
          claim.damageScore !== undefined && 
          claim.damageScore !== null &&
          (claim.evidence?.currentNDVI || claim.evidence?.historicalNDVI)
        );
        setClaims(realClaims);
        
        if (realClaims.length === 0) {
          toast.info('No claims with GeoAI verification found');
        }
      }
    } catch (err) {
      console.error('Fetch claims error:', err);
      toast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  // Yield Calculator
  const calculateYield = () => {
    const { plants, avgWeight, area } = yieldCalc;
    if (!plants || !avgWeight || !area) {
      toast.error('Please fill all fields');
      return;
    }
    
    const yieldPerHa = (parseFloat(plants) * parseFloat(avgWeight) / parseFloat(area)) * 10;
    setYieldCalc({ ...yieldCalc, result: yieldPerHa.toFixed(2) });
    toast.success('Yield calculated successfully!');
  };

  // Fertilizer Calculator
  const calculateFertilizer = () => {
    const { area, cropType, soilType } = fertilizerCalc;
    if (!area) {
      toast.error('Please enter area');
      return;
    }
    
    // Fertilizer recommendations (kg/ha) - NPK ratio
    const recommendations = {
      wheat: { loamy: { n: 120, p: 60, k: 40 }, clay: { n: 100, p: 50, k: 30 }, sandy: { n: 140, p: 70, k: 50 } },
      rice: { loamy: { n: 100, p: 50, k: 50 }, clay: { n: 90, p: 45, k: 45 }, sandy: { n: 120, p: 60, k: 60 } },
      maize: { loamy: { n: 150, p: 75, k: 75 }, clay: { n: 130, p: 65, k: 65 }, sandy: { n: 170, p: 85, k: 85 } },
      cotton: { loamy: { n: 120, p: 60, k: 60 }, clay: { n: 110, p: 55, k: 55 }, sandy: { n: 140, p: 70, k: 70 } }
    };
    
    const rec = recommendations[cropType]?.[soilType] || recommendations.wheat.loamy;
    const areaValue = parseFloat(area);
    
    setFertilizerCalc({ 
      ...fertilizerCalc, 
      result: {
        nitrogen: (rec.n * areaValue).toFixed(1),
        phosphorus: (rec.p * areaValue).toFixed(1),
        potassium: (rec.k * areaValue).toFixed(1)
      }
    });
    toast.success('Fertilizer requirements calculated!');
  };

  // Irrigation Calculator
  const calculateIrrigation = () => {
    const { area, cropType, season } = irrigationCalc;
    if (!area) {
      toast.error('Please enter area');
      return;
    }
    
    // Water requirements (mm/season)
    const waterRequirements = {
      wheat: { kharif: 450, rabi: 400, summer: 500 },
      rice: { kharif: 1200, rabi: 1100, summer: 1300 },
      maize: { kharif: 500, rabi: 450, summer: 550 },
      cotton: { kharif: 700, rabi: 650, summer: 750 }
    };
    
    const req = waterRequirements[cropType]?.[season] || 450;
    const areaValue = parseFloat(area);
    
    // Convert mm to liters: 1mm over 1 hectare = 10,000 liters
    const totalWater = req * areaValue * 10000;
    const irrigations = Math.ceil(req / 50); // Assuming 50mm per irrigation
    
    setIrrigationCalc({ 
      ...irrigationCalc, 
      result: {
        totalWater: totalWater.toFixed(0),
        perIrrigation: (totalWater / irrigations).toFixed(0),
        numberOfIrrigations: irrigations
      }
    });
    toast.success('Irrigation requirements calculated!');
  };

  // Profit Calculator
  const calculateProfit = () => {
    const { area, yield: yld, pricePerKg, seedCost, fertilizerCost, laborCost } = profitCalc;
    if (!area || !yld || !pricePerKg) {
      toast.error('Please fill required fields');
      return;
    }
    
    const totalYield = parseFloat(area) * parseFloat(yld);
    const revenue = totalYield * parseFloat(pricePerKg);
    const costs = parseFloat(seedCost || 0) + parseFloat(fertilizerCost || 0) + parseFloat(laborCost || 0);
    const profit = revenue - costs;
    const roi = costs > 0 ? ((profit / costs) * 100).toFixed(2) : 0;
    
    setProfitCalc({ 
      ...profitCalc, 
      result: {
        totalYield: totalYield.toFixed(2),
        revenue: revenue.toFixed(2),
        costs: costs.toFixed(2),
        profit: profit.toFixed(2),
        roi: roi
      }
    });
    toast.success('Profit analysis completed!');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { color: 'green', icon: <FaCheckCircle />, label: t('claims.approved') },
      processing: { color: 'blue', icon: <FaSpinner className="animate-spin" />, label: t('claims.processing') },
      under_review: { color: 'yellow', icon: <FaClock />, label: t('claims.underReview') },
      rejected: { color: 'red', icon: <FaTimesCircle />, label: t('claims.rejected') },
      paid: { color: 'emerald', icon: <FaCheckCircle />, label: t('claims.paid') }
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.processing;

    return (
      <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold bg-${config.color}-100 text-${config.color}-700 border border-${config.color}-200`}>
        {config.icon}
        <span>{config.label}</span>
      </span>
    );
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      CRITICAL: 'red',
      HIGH: 'orange',
      MEDIUM: 'yellow',
      LOW: 'green'
    };
    const color = colors[severity] || 'gray';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-${color}-100 text-${color}-700`}>
        {severity}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-green-50/30 flex flex-col">
      <Header />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
                  <FaFileAlt className="mr-3 text-primary-600" />
                  {t('claims.title')}
                </h1>
                <p className="text-gray-600">{t('claims.subtitle')}</p>
              </div>
              
              {/* Calculators Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCalculators(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg font-semibold flex items-center gap-2"
              >
                <FaCalculator />
                Crop Calculators
              </motion.button>
            </div>
            
            {/* Statistics */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      {claims.filter(c => c.status === 'approved' || c.status === 'paid').length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{t('claims.approved')}</div>
                  </div>
                  <FaCheckCircle className="text-4xl text-green-500 opacity-20" />
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      {claims.filter(c => c.status === 'processing' || c.status === 'under_review').length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{t('claims.processing')}</div>
                  </div>
                  <FaClock className="text-4xl text-blue-500 opacity-20" />
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-red-600">
                      {claims.filter(c => c.status === 'rejected').length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{t('claims.rejected')}</div>
                  </div>
                  <FaTimesCircle className="text-4xl text-red-500 opacity-20" />
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-purple-600">
                      {claims.length}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total Claims</div>
                  </div>
                  <FaSatellite className="text-4xl text-purple-500 opacity-20" />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Claims List */}
          <div>
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="spinner w-12 h-12" />
              </div>
            ) : claims.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card bg-white text-center py-20"
              >
                <FaSatellite className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No GeoAI Verified Claims</h3>
                <p className="text-gray-500 mb-6">
                  All claims must be verified using satellite imagery and NDVI analysis
                </p>
                <a href="/insurance" className="btn-primary inline-flex items-center space-x-2">
                  <FaExclamationTriangle />
                  <span>{t('claims.fileFirstClaim')}</span>
                </a>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {claims.map((claim, index) => (
                  <motion.div
                    key={claim._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="card bg-white hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Claim Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{claim.claimId}</h3>
                          {getStatusBadge(claim.status)}
                        </div>
                        <p className="text-gray-600 text-sm">
                          {t('claims.filedOn')} {new Date(claim.createdAt || Date.now()).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{(claim.estimatedPayout || 0).toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs text-gray-500">{t('claims.estimatedPayout')}</div>
                      </div>
                    </div>

                    {/* Claim Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {/* Property Info */}
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="flex items-center space-x-2 text-blue-700 mb-2">
                          <FaMapMarkedAlt />
                          <span className="font-semibold text-sm">{t('claims.property')}</span>
                        </div>
                        <div className="text-gray-800 font-medium">
                          {claim.property?.propertyName || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {claim.property?.currentCrop} • {claim.property?.area} ha
                        </div>
                      </div>

                      {/* Damage Assessment */}
                      <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <div className="flex items-center space-x-2 text-orange-700 mb-2">
                          <FaChartLine />
                          <span className="font-semibold text-sm">{t('claims.geoaiAssessment')}</span>
                        </div>
                        <div className="text-2xl font-bold text-orange-900">
                          {claim.damageScore || claim.claimedDamagePercent || 0}%
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {getSeverityBadge(claim.severity || 'MEDIUM')}
                        </div>
                      </div>

                      {/* Processing Time */}
                      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                        <div className="flex items-center space-x-2 text-purple-700 mb-2">
                          <FaClock />
                          <span className="font-semibold text-sm">{t('claims.processingLabel')}</span>
                        </div>
                        <div className="text-gray-800 font-medium">
                          {claim.processingTime || '45 seconds'}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {t('claims.geoaiVerified')} ✓
                        </div>
                      </div>
                    </div>

                    {/* NDVI Evidence - Only show if real data exists */}
                    {claim.evidence && (claim.evidence.historicalNDVI || claim.evidence.currentNDVI) && (
                      <div className="p-6 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-xl border-2 border-blue-300 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2 text-gray-800">
                            <FaSatellite className="text-2xl text-primary-600" />
                            <span className="font-bold text-lg">{t('claims.satelliteEvidence')}</span>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                            <FaRobot />
                            GeoAI Verified
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-xs text-gray-600 mb-2 font-semibold">📊 {t('claims.historical')}</div>
                            <div className="text-3xl font-bold text-green-600">
                              {claim.evidence.historicalNDVI || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Healthy vegetation</div>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-xs text-gray-600 mb-2 font-semibold">📉 {t('claims.current')}</div>
                            <div className="text-3xl font-bold text-red-600">
                              {claim.evidence.currentNDVI || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Crop stress detected</div>
                          </div>
                          
                          <div className="bg-white p-4 rounded-lg shadow">
                            <div className="text-xs text-gray-600 mb-2 font-semibold">📐 NDVI Drop</div>
                            <div className="text-3xl font-bold text-orange-600">
                              {claim.evidence.historicalNDVI && claim.evidence.currentNDVI
                                ? `${((parseFloat(claim.evidence.historicalNDVI) - parseFloat(claim.evidence.currentNDVI)) / parseFloat(claim.evidence.historicalNDVI) * 100).toFixed(1)}%`
                                : 'N/A'
                              }
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Vegetation loss</div>
                          </div>
                        </div>
                        
                        {claim.evidence.satelliteImages && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-xs text-blue-800 font-semibold mb-1">
                              🛰️ Sentinel-2 Imagery Available
                            </div>
                            <div className="text-xs text-gray-600">
                              Resolution: 10m | Source: ESA Copernicus
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Damage Reason */}
                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 mb-4">
                      <div className="flex items-start space-x-2">
                        <FaExclamationTriangle className="text-yellow-600 mt-1 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-yellow-900 mb-1">{t('claims.damageReason')}</div>
                          <div className="text-sm text-gray-700">{claim.reason || t('claims.notSpecified')}</div>
                          {claim.description && (
                            <div className="text-xs text-gray-600 mt-2">{claim.description}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-green-600">
                          <FaCheckCircle />
                          <span>{t('claims.geoaiVerified')}</span>
                        </div>
                        {claim.status === 'approved' || claim.status === 'paid' ? (
                          <div className="flex items-center space-x-2 text-blue-600">
                            <FaClock />
                            <span>{t('claims.payoutIn')}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-gray-600">
                            <FaClock />
                            <span>{t('claims.underReviewText')}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="flex-1 btn-primary py-2 text-sm"
                      >
                        {t('claims.viewFullReport')}
                      </button>
                      <button className="flex-1 btn-outline py-2 text-sm">
                        {t('claims.downloadPDF')}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* GeoAI Info Banner */}
          <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl border-2 border-primary-200">
            <div className="flex items-start space-x-4">
              <FaRobot className="text-4xl text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {t('claims.aboutGeoai')}
                </h3>
                <p className="text-gray-700 text-sm">
                  {t('claims.geoaiDescription')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Crop Calculators Modal */}
      <AnimatePresence>
        {showCalculators && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => {
              setShowCalculators(false);
              setCalculatorType(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Calculator Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                      <FaCalculator />
                      Crop Calculators
                    </h2>
                    <p className="text-blue-100 mt-2">Advanced agricultural calculation tools</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowCalculators(false);
                      setCalculatorType(null);
                    }}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition"
                  >
                    <FaTimes className="text-2xl" />
                  </button>
                </div>
              </div>

              {/* Calculator Selection or Content */}
              <div className="p-6">
                {!calculatorType ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Yield Calculator */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCalculatorType('yield')}
                      className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl text-left hover:shadow-xl transition"
                    >
                      <FaSeedling className="text-4xl text-green-600 mb-3" />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Yield Calculator</h3>
                      <p className="text-gray-600 text-sm">
                        Calculate expected harvest yield based on plant count, spacing, and weight
                      </p>
                    </motion.button>

                    {/* Fertilizer Calculator */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCalculatorType('fertilizer')}
                      className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl text-left hover:shadow-xl transition"
                    >
                      <FaFlask className="text-4xl text-orange-600 mb-3" />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Fertilizer Calculator</h3>
                      <p className="text-gray-600 text-sm">
                        Determine NPK requirements based on crop type and soil conditions
                      </p>
                    </motion.button>

                    {/* Irrigation Calculator */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCalculatorType('irrigation')}
                      className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl text-left hover:shadow-xl transition"
                    >
                      <FaTint className="text-4xl text-blue-600 mb-3" />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Irrigation Calculator</h3>
                      <p className="text-gray-600 text-sm">
                        Calculate water requirements and irrigation schedule for optimal growth
                      </p>
                    </motion.button>

                    {/* Profit Calculator */}
                    <motion.button
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCalculatorType('profit')}
                      className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl text-left hover:shadow-xl transition"
                    >
                      <FaMoneyBillWave className="text-4xl text-purple-600 mb-3" />
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Profit Calculator</h3>
                      <p className="text-gray-600 text-sm">
                        Analyze costs, revenue, and profit margins for your farming operations
                      </p>
                    </motion.button>
                  </div>
                ) : (
                  <div>
                    {/* Back Button */}
                    <button
                      onClick={() => setCalculatorType(null)}
                      className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-2"
                    >
                      ← Back to Calculators
                    </button>

                    {/* Yield Calculator Form */}
                    {calculatorType === 'yield' && (
                      <div className="space-y-6">
                        <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaSeedling className="text-green-600" />
                            Yield Calculator
                          </h3>
                          <p className="text-gray-600 mb-6">Formula: Yield (tons/ha) = (Plants × Avg Weight) / Area × 10</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Number of Plants
                              </label>
                              <input
                                type="number"
                                value={yieldCalc.plants}
                                onChange={(e) => setYieldCalc({ ...yieldCalc, plants: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="e.g., 50000"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Avg Weight per Plant (kg)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={yieldCalc.avgWeight}
                                onChange={(e) => setYieldCalc({ ...yieldCalc, avgWeight: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="e.g., 0.25"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Area (hectares)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={yieldCalc.area}
                                onChange={(e) => setYieldCalc({ ...yieldCalc, area: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="e.g., 2.5"
                              />
                            </div>
                          </div>
                          
                          <button
                            onClick={calculateYield}
                            className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition"
                          >
                            Calculate Yield
                          </button>
                          
                          {yieldCalc.result && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-6 p-6 bg-white rounded-xl border-2 border-green-300"
                            >
                              <div className="text-center">
                                <div className="text-sm text-gray-600 mb-2">Expected Yield</div>
                                <div className="text-5xl font-bold text-green-600 mb-2">
                                  {yieldCalc.result}
                                </div>
                                <div className="text-lg text-gray-700">tons per hectare</div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Fertilizer Calculator Form */}
                    {calculatorType === 'fertilizer' && (
                      <div className="space-y-6">
                        <div className="bg-orange-50 p-6 rounded-xl border border-orange-200">
                          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaFlask className="text-orange-600" />
                            Fertilizer Calculator
                          </h3>
                          <p className="text-gray-600 mb-6">Calculate NPK requirements for optimal crop growth</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Area (hectares)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={fertilizerCalc.area}
                                onChange={(e) => setFertilizerCalc({ ...fertilizerCalc, area: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="e.g., 2.5"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Crop Type
                              </label>
                              <select
                                value={fertilizerCalc.cropType}
                                onChange={(e) => setFertilizerCalc({ ...fertilizerCalc, cropType: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              >
                                <option value="wheat">Wheat</option>
                                <option value="rice">Rice</option>
                                <option value="maize">Maize</option>
                                <option value="cotton">Cotton</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Soil Type
                              </label>
                              <select
                                value={fertilizerCalc.soilType}
                                onChange={(e) => setFertilizerCalc({ ...fertilizerCalc, soilType: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              >
                                <option value="loamy">Loamy</option>
                                <option value="clay">Clay</option>
                                <option value="sandy">Sandy</option>
                              </select>
                            </div>
                          </div>
                          
                          <button
                            onClick={calculateFertilizer}
                            className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition"
                          >
                            Calculate Fertilizer
                          </button>
                          
                          {fertilizerCalc.result && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-6 grid grid-cols-3 gap-4"
                            >
                              <div className="p-4 bg-white rounded-xl border-2 border-blue-300 text-center">
                                <div className="text-sm text-gray-600 mb-1">Nitrogen (N)</div>
                                <div className="text-3xl font-bold text-blue-600">{fertilizerCalc.result.nitrogen}</div>
                                <div className="text-xs text-gray-500 mt-1">kg</div>
                              </div>
                              <div className="p-4 bg-white rounded-xl border-2 border-green-300 text-center">
                                <div className="text-sm text-gray-600 mb-1">Phosphorus (P)</div>
                                <div className="text-3xl font-bold text-green-600">{fertilizerCalc.result.phosphorus}</div>
                                <div className="text-xs text-gray-500 mt-1">kg</div>
                              </div>
                              <div className="p-4 bg-white rounded-xl border-2 border-purple-300 text-center">
                                <div className="text-sm text-gray-600 mb-1">Potassium (K)</div>
                                <div className="text-3xl font-bold text-purple-600">{fertilizerCalc.result.potassium}</div>
                                <div className="text-xs text-gray-500 mt-1">kg</div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Irrigation Calculator Form */}
                    {calculatorType === 'irrigation' && (
                      <div className="space-y-6">
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaTint className="text-blue-600" />
                            Irrigation Calculator
                          </h3>
                          <p className="text-gray-600 mb-6">Calculate water requirements for your crops</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Area (hectares)
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={irrigationCalc.area}
                                onChange={(e) => setIrrigationCalc({ ...irrigationCalc, area: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., 2.5"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Crop Type
                              </label>
                              <select
                                value={irrigationCalc.cropType}
                                onChange={(e) => setIrrigationCalc({ ...irrigationCalc, cropType: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="wheat">Wheat</option>
                                <option value="rice">Rice</option>
                                <option value="maize">Maize</option>
                                <option value="cotton">Cotton</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Season
                              </label>
                              <select
                                value={irrigationCalc.season}
                                onChange={(e) => setIrrigationCalc({ ...irrigationCalc, season: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="kharif">Kharif (Monsoon)</option>
                                <option value="rabi">Rabi (Winter)</option>
                                <option value="summer">Summer</option>
                              </select>
                            </div>
                          </div>
                          
                          <button
                            onClick={calculateIrrigation}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition"
                          >
                            Calculate Irrigation
                          </button>
                          
                          {irrigationCalc.result && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
                            >
                              <div className="p-4 bg-white rounded-xl border-2 border-blue-300 text-center">
                                <div className="text-sm text-gray-600 mb-1">Total Water</div>
                                <div className="text-3xl font-bold text-blue-600">
                                  {(irrigationCalc.result.totalWater / 1000).toFixed(0)}K
                                </div>
                                <div className="text-xs text-gray-500 mt-1">liters/season</div>
                              </div>
                              <div className="p-4 bg-white rounded-xl border-2 border-green-300 text-center">
                                <div className="text-sm text-gray-600 mb-1">Per Irrigation</div>
                                <div className="text-3xl font-bold text-green-600">
                                  {(irrigationCalc.result.perIrrigation / 1000).toFixed(0)}K
                                </div>
                                <div className="text-xs text-gray-500 mt-1">liters</div>
                              </div>
                              <div className="p-4 bg-white rounded-xl border-2 border-purple-300 text-center">
                                <div className="text-sm text-gray-600 mb-1">Irrigations</div>
                                <div className="text-3xl font-bold text-purple-600">
                                  {irrigationCalc.result.numberOfIrrigations}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">times/season</div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Profit Calculator Form */}
                    {calculatorType === 'profit' && (
                      <div className="space-y-6">
                        <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaMoneyBillWave className="text-purple-600" />
                            Profit Calculator
                          </h3>
                          <p className="text-gray-600 mb-6">Analyze your farming profitability and ROI</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Area (hectares) *
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={profitCalc.area}
                                onChange={(e) => setProfitCalc({ ...profitCalc, area: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 2.5"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Yield (tons/ha) *
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={profitCalc.yield}
                                onChange={(e) => setProfitCalc({ ...profitCalc, yield: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 5.2"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Price per kg (₹) *
                              </label>
                              <input
                                type="number"
                                step="0.1"
                                value={profitCalc.pricePerKg}
                                onChange={(e) => setProfitCalc({ ...profitCalc, pricePerKg: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 25"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Seed Cost (₹)
                              </label>
                              <input
                                type="number"
                                value={profitCalc.seedCost}
                                onChange={(e) => setProfitCalc({ ...profitCalc, seedCost: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 5000"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fertilizer Cost (₹)
                              </label>
                              <input
                                type="number"
                                value={profitCalc.fertilizerCost}
                                onChange={(e) => setProfitCalc({ ...profitCalc, fertilizerCost: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 15000"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Labor Cost (₹)
                              </label>
                              <input
                                type="number"
                                value={profitCalc.laborCost}
                                onChange={(e) => setProfitCalc({ ...profitCalc, laborCost: e.target.value })}
                                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 10000"
                              />
                            </div>
                          </div>
                          
                          <button
                            onClick={calculateProfit}
                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition"
                          >
                            Calculate Profit
                          </button>
                          
                          {profitCalc.result && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-6 space-y-4"
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-xl border-2 border-blue-300">
                                  <div className="text-sm text-gray-600 mb-1">Total Yield</div>
                                  <div className="text-2xl font-bold text-blue-600">{profitCalc.result.totalYield} tons</div>
                                </div>
                                <div className="p-4 bg-white rounded-xl border-2 border-green-300">
                                  <div className="text-sm text-gray-600 mb-1">Revenue</div>
                                  <div className="text-2xl font-bold text-green-600">₹{parseFloat(profitCalc.result.revenue).toLocaleString('en-IN')}</div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white rounded-xl border-2 border-red-300">
                                  <div className="text-sm text-gray-600 mb-1">Total Costs</div>
                                  <div className="text-2xl font-bold text-red-600">₹{parseFloat(profitCalc.result.costs).toLocaleString('en-IN')}</div>
                                </div>
                                <div className="p-4 bg-white rounded-xl border-2 border-purple-300">
                                  <div className="text-sm text-gray-600 mb-1">Net Profit</div>
                                  <div className="text-2xl font-bold text-purple-600">₹{parseFloat(profitCalc.result.profit).toLocaleString('en-IN')}</div>
                                </div>
                              </div>
                              
                              <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-300 text-center">
                                <div className="text-sm text-gray-700 mb-2">Return on Investment (ROI)</div>
                                <div className="text-5xl font-bold text-purple-600">{profitCalc.result.roi}%</div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Claim Detail Modal (if needed) */}
      {selectedClaim && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedClaim(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t('claims.claimDetails')}</h2>
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimesCircle className="text-2xl" />
                </button>
              </div>
              
              {/* Full claim details can be added here */}
              <div className="space-y-4">
                <p className="text-gray-600">{t('claims.fullReportComing')}</p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      <Footer />
    </div>
  );
}
