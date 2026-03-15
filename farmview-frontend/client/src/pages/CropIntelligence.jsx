import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import geoAIService from '../services/geoai.service';
import axios from 'axios';
import { 
  FaSeedling, 
  FaLeaf, 
  FaExclamationTriangle, 
  FaChartLine, 
  FaSatellite, 
  FaLightbulb, 
  FaArrowLeft, 
  FaSync, 
  FaInfoCircle,
  FaCheckCircle, 
  FaTimes, 
  FaChevronRight,
  FaRobot,
  FaBrain,
  FaCloudSun
} from 'react-icons/fa';

// ============================================================================
// CONSTANTS & CONFIGURATIONS
// ============================================================================

const API_BASE_URL = 'http://localhost:5000/api';

const getTabs = (t) => [
  { 
    id: 'analyze', 
    icon: FaSeedling, 
    label: t('cropIntel.tabs.analyze') || 'Crop Analysis', 
    color: 'green',
    description: t('cropIntel.analyze.title') || 'AI-powered health analysis using satellite data'
  },
  { 
    id: 'identify', 
    icon: FaLeaf, 
    label: t('cropIntel.tabs.identify') || 'Identify Crop', 
    color: 'blue',
    description: t('cropIntel.identify.title') || 'Automatically detect crop type from imagery'
  },
  { 
    id: 'recommend', 
    icon: FaLightbulb, 
    label: t('cropIntel.tabs.recommend') || 'Next Crop', 
    color: 'purple',
    description: t('cropIntel.recommend.title') || 'Get recommendations for next season'
  },
  { 
    id: 'issues', 
    icon: FaExclamationTriangle, 
    label: t('cropIntel.tabs.issues') || 'Health Check', 
    color: 'orange',
    description: t('cropIntel.issues.title') || 'Detect diseases and stress factors'
  },
  { 
    id: 'yield', 
    icon: FaChartLine, 
    label: t('cropIntel.tabs.yield') || 'Yield Prediction', 
    color: 'indigo',
    description: t('cropIntel.yield.title') || 'Forecast your harvest quantity'
  },
  { 
    id: 'ndvi', 
    icon: FaSatellite, 
    label: t('cropIntel.tabs.ndvi') || 'NDVI Stats', 
    color: 'teal',
    description: t('cropIntel.ndvi.title') || 'Vegetation health indices'
  }
];

const SEVERITY_COLORS = {
  Critical: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-700', badge: 'bg-red-500' },
  High: { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-700', badge: 'bg-orange-500' },
  Medium: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-700', badge: 'bg-yellow-500' },
  Low: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-700', badge: 'bg-blue-500' },
  Normal: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700', badge: 'bg-green-500' }
};

const HEALTH_STATUS_CONFIG = {
  Healthy: { emoji: '✅', color: 'green', gradient: 'from-green-50 to-emerald-50' },
  'At Risk': { emoji: '⚠️', color: 'yellow', gradient: 'from-yellow-50 to-amber-50' },
  Critical: { emoji: '🚨', color: 'red', gradient: 'from-red-50 to-rose-50' }
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatPropertyDisplay = (property) => {
  if (!property) return 'No property selected';
  const name = property.propertyName || property.surveyNumber || 'Unknown';
  const area = property.area ? `${property.area} hectares` : 'N/A';
  const crop = property.currentCrop || 'No crop';
  return `🏠 ${name} | 📏 ${area} | 🌱 ${crop}`;
};

const getConfidenceBadgeColor = (confidence) => {
  const conf = parseInt(confidence);
  if (conf >= 90) return 'bg-green-500';
  if (conf >= 75) return 'bg-blue-500';
  if (conf >= 60) return 'bg-yellow-500';
  return 'bg-orange-500';
};

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const useProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login', { replace: true });
        return;
      }
      
      const response = await axios.get(`${API_BASE_URL}/property`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const propertiesData = response.data.data || [];
      setProperties(propertiesData);
      
      if (propertiesData.length > 0) {
        toast.success(`Loaded ${propertiesData.length} properties`);
      } else {
        toast.info('No properties found. Please add a property first.');
      }
      
      return propertiesData;
    } catch (err) {
      console.error('Error fetching properties:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load properties';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return { properties, loading, error, fetchProperties };
};

// ============================================================================
// REUSABLE COMPONENTS
// ============================================================================

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-20"
  >
    <div className="relative">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-20 h-20 border-4 border-green-200 border-t-green-600 rounded-full mx-auto mb-6"
      />
      <FaSeedling className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-green-600" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-2">{message}</h2>
  </motion.div>
);

const EmptyState = ({ icon: Icon, title, description, primaryAction, secondaryAction }) => (
  <motion.div 
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="bg-white rounded-2xl shadow-2xl p-12 text-center"
  >
    <motion.div
      animate={{ 
        rotate: [0, 10, -10, 10, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      className="text-8xl mb-6"
    >
      {Icon ? <Icon className="mx-auto" /> : '🌾'}
    </motion.div>
    <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
    <p className="text-lg text-gray-600 mb-8">{description}</p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {primaryAction}
      {secondaryAction}
    </div>
  </motion.div>
);

const ActionButton = ({ onClick, loading, disabled, icon: Icon, children, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    danger: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-8 py-4 rounded-xl transition font-semibold shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {loading ? (
        <>
          <FaSync className="animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon />}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
};

const InfoCard = ({ title, value, icon, color = 'green' }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`bg-${color}-50 border-2 border-${color}-200 rounded-xl p-6 text-center`}
  >
    <div className="text-3xl mb-2">{icon}</div>
    <p className="text-sm text-gray-600 mb-1">{title}</p>
    <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
  </motion.div>
);

const SectionCard = ({ title, icon: Icon, children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white border border-gray-200 rounded-xl p-6 ${className}`}
  >
    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
      {Icon && <Icon className="text-green-600" />}
      {title}
    </h3>
    {children}
  </motion.div>
);

// ============================================================================
// TAB COMPONENTS
// ============================================================================

const AnalyzeTab = ({ selectedProperty, loading, onAnalyze, analysis }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      key="analyze"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaSeedling className="text-green-600" />
            {t('cropIntel.analyze.title') || 'Comprehensive Crop Analysis'}
          </h2>
          <p className="text-gray-600 mt-2">
            {t('cropIntel.subtitle') || 'AI-powered health assessment using satellite imagery and machine learning'}
          </p>
        </div>
        <ActionButton
          onClick={onAnalyze}
          loading={loading}
          disabled={!selectedProperty}
          icon={FaSeedling}
        >
          {t('cropIntel.analyze.button') || 'Analyze Crop'}
        </ActionButton>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Crop Identification */}
          {analysis.cropIdentification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🌾</span>
                Crop Identification
              </h3>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Identified Crop</p>
                  <p className="text-3xl font-bold text-green-700">
                    {analysis.cropIdentification.likelyCrop}
                  </p>
                </div>
                <div className={`px-6 py-3 ${getConfidenceBadgeColor(analysis.cropIdentification.confidence)} text-white rounded-full font-bold text-lg shadow-md`}>
                  {analysis.cropIdentification.confidence}% Confident
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 font-semibold mb-2">Analysis Reasoning:</p>
                <p className="text-gray-700">{analysis.cropIdentification.reasoning}</p>
              </div>
            </motion.div>
          )}

          {/* Health Assessment */}
          {analysis.healthAssessment && (
            <SectionCard title="Health Assessment" icon={FaLeaf}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <InfoCard
                  title="Overall Health"
                  value={analysis.healthAssessment.overallHealth}
                  icon="💚"
                  color="green"
                />
                <InfoCard
                  title="Health Score"
                  value={`${analysis.healthAssessment.healthScore}/100`}
                  icon="📊"
                  color="blue"
                />
                <InfoCard
                  title="Status"
                  value={analysis.healthAssessment.overallHealth}
                  icon="✨"
                  color="purple"
                />
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-gray-600 font-semibold mb-2">NDVI Interpretation:</p>
                <p className="text-gray-700">{analysis.healthAssessment.ndviInterpretation}</p>
              </div>
            </SectionCard>
          )}

          {/* Detected Issues */}
          {analysis.detectedIssues && analysis.detectedIssues.length > 0 && (
            <SectionCard title="Detected Issues" icon={FaExclamationTriangle}>
              <div className="space-y-4">
                {analysis.detectedIssues.map((issue, i) => {
                  const severity = SEVERITY_COLORS[issue.severity] || SEVERITY_COLORS.Medium;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`${severity.bg} border-l-4 ${severity.border} rounded-lg p-4`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-800 text-lg">{issue.issue}</h4>
                        <span className={`px-3 py-1 ${severity.badge} text-white rounded-full text-sm font-bold`}>
                          {issue.severity}
                        </span>
                      </div>
                      <div className="bg-white rounded-lg p-3 mt-2">
                        <p className="text-sm text-gray-600 font-semibold mb-1">Recommended Action:</p>
                        <p className="text-gray-700">{issue.recommendation}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {/* Crop Recommendation */}
          {analysis.cropRecommendation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaLightbulb className="text-purple-600" />
                Next Season Recommendation
              </h3>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-bold text-purple-600 text-2xl mb-2">
                  {analysis.cropRecommendation.nextCrop}
                </h4>
                <p className="text-gray-700">{analysis.cropRecommendation.reasoning}</p>
              </div>
            </motion.div>
          )}

          {/* Actionable Insights */}
          {analysis.actionableInsights && analysis.actionableInsights.length > 0 && (
            <SectionCard title="Actionable Insights" icon={FaBrain}>
              <ul className="space-y-3">
                {analysis.actionableInsights.map((insight, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg border border-blue-200"
                  >
                    <FaChevronRight className="text-blue-600 text-xl flex-shrink-0 mt-1" />
                    <span className="text-gray-700 font-medium">{insight}</span>
                  </motion.li>
                ))}
              </ul>
            </SectionCard>
          )}
        </div>
      )}

      {/* Empty State */}
      {!analysis && !loading && (
        <div className="text-center py-16 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border-2 border-green-200">
          <FaRobot className="text-7xl text-green-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Analyze</h3>
          <p className="text-gray-600 mb-4">Click the button above to start AI-powered crop analysis</p>
          <p className="text-sm text-gray-500">Analysis includes: Health Score, Issue Detection, Recommendations</p>
        </div>
      )}
    </motion.div>
  );
};

const IdentifyTab = ({ selectedProperty, loading, onIdentify, identification }) => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      key="identify"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaLeaf className="text-blue-600" />
            {t('cropIntel.identify.title') || 'Crop Type Identification'}
          </h2>
          <p className="text-gray-600 mt-2">
            {t('cropIntel.identify.title') || 'Automatically identify crop type from satellite imagery'}
          </p>
        </div>
        <ActionButton
          onClick={onIdentify}
          loading={loading}
          disabled={!selectedProperty}
          icon={FaLeaf}
        >
          {t('cropIntel.identify.button') || 'Identify Crop'}
        </ActionButton>
      </div>

      {/* Identification Results */}
      {identification && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-8 shadow-lg"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Identified Crop Type</p>
                <h3 className="text-4xl font-bold text-blue-700 flex items-center gap-2">
                  <span className="text-3xl">🌾</span>
                  {identification.cropType}
                </h3>
              </div>
              <div className={`px-6 py-3 ${getConfidenceBadgeColor(identification.confidence)} text-white rounded-full font-bold text-lg shadow-md`}>
                {identification.confidence}% Sure
              </div>
            </div>

            {/* Reasoning */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span>📝</span>
                Why This Crop?
              </h4>
              <p className="text-gray-700">{identification.reasoning}</p>
            </div>

            {/* Alternative Crops */}
            {identification.alternativeCrops && identification.alternativeCrops.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>🔄</span>
                  Could Also Be
                </h4>
                <div className="flex flex-wrap gap-2">
                  {identification.alternativeCrops.map((crop, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-blue-100 border border-blue-300 rounded-lg text-blue-700 font-medium"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Crop Characteristics */}
            {identification.cropCharacteristics && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard
                  title="Growth Pattern"
                  value={identification.cropCharacteristics.pattern}
                  icon="📐"
                  color="blue"
                />
                <InfoCard
                  title="NDVI Signature"
                  value={identification.cropCharacteristics.ndviSignature}
                  icon="🛰️"
                  color="green"
                />
                <InfoCard
                  title="Season Match"
                  value={identification.cropCharacteristics.seasonalMatch}
                  icon="📅"
                  color="purple"
                />
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {!identification && !loading && (
        <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
          <FaLeaf className="text-7xl text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready to Identify</h3>
          <p className="text-gray-600 mb-4">Click the button to detect crop type from satellite data</p>
          <p className="text-sm text-gray-500">Uses NDVI patterns and seasonal analysis</p>
        </div>
      )}
    </motion.div>
  );
};

const RecommendTab = ({ selectedProperty, loading, onRecommend, recommendation }) => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      key="recommend"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FaLightbulb className="text-purple-600" />
            {t('cropIntel.recommend.title') || 'Next Crop Recommendation'}
          </h2>
          <p className="text-gray-600 mt-2">
            {t('cropIntel.recommend.title') || 'AI-powered suggestions for optimal crop selection'}
          </p>
        </div>
        <ActionButton
          onClick={onRecommend}
          loading={loading}
          disabled={!selectedProperty}
          icon={FaLightbulb}
        >
          {t('cropIntel.recommend.button') || 'Get Recommendation'}
        </ActionButton>
      </div>

      {/* Recommendation Results */}
      {recommendation && recommendation.primaryRecommendation && (
        <div className="space-y-6">
          {/* Primary Recommendation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-xl p-8 shadow-lg"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Recommended Next Crop</p>
                <h3 className="text-4xl font-bold text-purple-700 flex items-center gap-2">
                  <span className="text-3xl">🌱</span>
                  {recommendation.primaryRecommendation.cropName}
                </h3>
              </div>
              <div className={`px-6 py-3 ${getConfidenceBadgeColor(recommendation.primaryRecommendation.confidence)} text-white rounded-full font-bold text-lg shadow-md`}>
                {recommendation.primaryRecommendation.confidence}% Match
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <InfoCard
                title="Expected Yield"
                value={recommendation.primaryRecommendation.expectedYield}
                icon="📊"
                color="purple"
              />
              <InfoCard
                title="Profitability"
                value={recommendation.primaryRecommendation.profitability}
                icon="💰"
                color="green"
              />
              <InfoCard
                title="ROI"
                value={recommendation.estimatedROI}
                icon="📈"
                color="blue"
              />
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span>📝</span>
                Why This Crop?
              </h4>
              <p className="text-gray-700">{recommendation.primaryRecommendation.reasoning}</p>
            </div>
          </motion.div>

          {/* Soil Preparation */}
          {recommendation.soilPreparation && recommendation.soilPreparation.length > 0 && (
            <SectionCard title="Soil Preparation Steps" icon={FaSeedling}>
              <ol className="space-y-3">
                {recommendation.soilPreparation.map((step, i) => (
                  <li key={i} className="flex gap-3 bg-green-50 p-4 rounded-lg border border-green-200">
                    <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </SectionCard>
          )}

          {/* Water & Timing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-6 shadow-lg"
            >
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-2xl">💧</span>
                Water Requirement
              </h4>
              <p className="text-2xl font-bold text-blue-600">{recommendation.waterRequirement}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-300 rounded-xl p-6 shadow-lg"
            >
              <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Best Planting Time
              </h4>
              <p className="text-lg font-medium text-orange-600">{recommendation.seasonalTiming}</p>
            </motion.div>
          </div>

          {/* Risk Factors */}
          {recommendation.riskFactors && recommendation.riskFactors.length > 0 && (
            <SectionCard title="Risk Factors to Consider" icon={FaExclamationTriangle}>
              <ul className="space-y-3">
                {recommendation.riskFactors.map((risk, i) => (
                  <li key={i} className="flex items-start gap-3 bg-red-50 p-4 rounded-lg border border-red-200">
                    <span className="text-red-600 text-xl">⚠️</span>
                    <span className="text-gray-700">{risk}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          )}
        </div>
      )}

      {/* Empty State */}
      {!recommendation && !loading && (
        <div className="text-center py-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
          <FaLightbulb className="text-7xl text-purple-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Ready for Recommendations</h3>
          <p className="text-gray-600 mb-4">Get AI-powered crop suggestions for next season</p>
          <p className="text-sm text-gray-500">Based on soil health, climate, and market trends</p>
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const CropIntelligence1 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { properties, loading: loadingProperties, fetchProperties } = useProperties();
  
  // Get translated tabs
  const TABS = useMemo(() => getTabs(t), [t]);
  
  // State Management
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [activeTab, setActiveTab] = useState('analyze');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Results State
  const [analysis, setAnalysis] = useState(null);
  const [identification, setIdentification] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [issues, setIssues] = useState(null);
  const [yieldPrediction, setYieldPrediction] = useState(null);
  const [ndviStats, setNdviStats] = useState(null);

  // Initialize
  useEffect(() => {
    const initializeData = async () => {
      const props = await fetchProperties();
      if (props && props.length > 0) {
        setSelectedProperty(props[0]);
      }
    };
    initializeData();
  }, [fetchProperties]);

  // Reset results when property changes
  const handlePropertyChange = useCallback((propertyId) => {
    const prop = properties.find(p => p._id === propertyId);
    setSelectedProperty(prop);
    
    // Clear all results
    setAnalysis(null);
    setIdentification(null);
    setRecommendation(null);
    setIssues(null);
    setYieldPrediction(null);
    setNdviStats(null);
    
    if (prop) {
      toast.success(`Selected: ${prop.propertyName || prop.surveyNumber}`);
    }
  }, [properties]);

  // API Handlers
  const handleAnalyzeCrop = async () => {
    if (!selectedProperty) {
      toast.error('Please select a property first');
      return;
    }
    
    setLoading(true);
    setError(null);
    const toastId = toast.loading('🔬 Analyzing crop health with AI...');

    try {
      const result = await geoAIService.analyzeCrop(selectedProperty._id, {
        cropStage: selectedProperty.cropStage || 'Vegetative'
      });
      setAnalysis(result.analysis);
      toast.success('✅ Analysis complete!', { id: toastId });
    } catch (err) {
      const errorMsg = err.message || 'Failed to analyze crop';
      setError(errorMsg);
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleIdentifyCrop = async () => {
    if (!selectedProperty) {
      toast.error('Please select a property first');
      return;
    }
    
    setLoading(true);
    setError(null);
    const toastId = toast.loading('🔍 Identifying crop type...');

    try {
      const result = await geoAIService.identifyCrop(
        selectedProperty._id,
        geoAIService.getCurrentSeason()
      );
      setIdentification(result.identification);
      toast.success('✅ Identification complete!', { id: toastId });
    } catch (err) {
      const errorMsg = err.message || 'Failed to identify crop';
      setError(errorMsg);
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendCrop = async () => {
    if (!selectedProperty) {
      toast.error('Please select a property first');
      return;
    }
    
    setLoading(true);
    setError(null);
    const toastId = toast.loading('💡 Generating recommendations...');

    try {
      const result = await geoAIService.recommendNextCrop(
        selectedProperty._id,
        selectedProperty.currentCrop || 'Unknown'
      );
      setRecommendation(result.recommendation);
      toast.success('✅ Recommendations ready!', { id: toastId });
    } catch (err) {
      const errorMsg = err.message || 'Failed to get recommendation';
      setError(errorMsg);
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDetectIssues = async () => {
    if (!selectedProperty) {
      toast.error('Please select a property first');
      return;
    }
    
    setLoading(true);
    setError(null);
    const toastId = toast.loading('🔬 Scanning for issues...');

    try {
      const result = await geoAIService.detectIssues(
        selectedProperty._id,
        selectedProperty.currentCrop || 'Unknown',
        selectedProperty.cropStage || 'Vegetative'
      );
      setIssues(result.issueDetection);
      toast.success('✅ Scan complete!', { id: toastId });
    } catch (err) {
      const errorMsg = err.message || 'Failed to detect issues';
      setError(errorMsg);
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handlePredictYield = async () => {
    if (!selectedProperty) {
      toast.error('Please select a property first');
      return;
    }
    
    setLoading(true);
    setError(null);
    const toastId = toast.loading('📊 Predicting yield...');

    try {
      const result = await geoAIService.predictYield(
        selectedProperty._id,
        selectedProperty.currentCrop || 'Unknown',
        selectedProperty.cropStage || 'Grain Filling'
      );
      setYieldPrediction(result.yieldPrediction);
      toast.success('✅ Prediction complete!', { id: toastId });
    } catch (err) {
      const errorMsg = err.message || 'Failed to predict yield';
      setError(errorMsg);
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleGetNDVI = async () => {
    if (!selectedProperty) {
      toast.error('Please select a property first');
      return;
    }
    
    setLoading(true);
    setError(null);
    const toastId = toast.loading('🌿 Fetching NDVI data...');

    try {
      const result = await geoAIService.getNDVIStats(selectedProperty._id);
      setNdviStats(result.data.statistics);
      toast.success('✅ NDVI data loaded!', { id: toastId });
    } catch (err) {
      const errorMsg = err.message || 'Failed to get NDVI data';
      setError(errorMsg);
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Memoized values
  const selectedPropertyDisplay = useMemo(
    () => formatPropertyDisplay(selectedProperty),
    [selectedProperty]
  );

  // Loading State
  if (loadingProperties) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner message={t('cropIntel.loadingProperties') || 'Loading Properties'} />
      </div>
    );
  }

  // No Properties State
  if (!loadingProperties && properties.length === 0) {
    return (
      <>
        <Header />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pt-20 px-4"
        >
          <div className="max-w-2xl mx-auto py-16">
            <EmptyState
              title={t('cropIntel.noProperties') || 'No Properties Found'}
              description={t('cropIntel.noPropertiesDesc') || 'Add your first property to start using AI-powered crop intelligence features'}
              primaryAction={
                <ActionButton
                  onClick={() => navigate('/property')}
                  icon={FaSeedling}
                  variant="primary"
                >
                  {t('cropIntel.addProperty') || 'Add Property'}
                </ActionButton>
              }
              secondaryAction={
                <ActionButton
                  onClick={() => navigate('/dashboard')}
                  icon={FaArrowLeft}
                  variant="secondary"
                >
                  {t('cropIntel.backToDashboard') || 'Back to Dashboard'}
                </ActionButton>
              }
            />
          </div>
        </motion.div>
        <Footer />
      </>
    );
  }

  // Main Render
  return (
    <>
      <Header />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pt-20 pb-10 px-4"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl shadow-lg">
                  <FaRobot className="text-4xl text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center gap-3">
                    {t('cropIntel.title') || 'AI Crop Intelligence'}
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Beta</span>
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {t('cropIntel.subtitle') || 'Advanced satellite-based crop monitoring and analysis'}
                  </p>
                </div>
              </div>
              <ActionButton
                onClick={() => navigate('/dashboard')}
                icon={FaArrowLeft}
                variant="secondary"
              >
                {t('cropIntel.backButton') || 'Back'}
              </ActionButton>
            </div>
          </motion.div>

          {/* Property Selector */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-3">
                <FaInfoCircle className="text-2xl text-blue-600" />
                <div>
                  <label className="block text-lg font-semibold text-gray-800">
                    {t('cropIntel.selectProperty') || 'Select Property for Analysis'}
                  </label>
                  <p className="text-sm text-gray-600">
                    {properties.length} {t('cropIntel.available') || 'properties available'}
                  </p>
                </div>
              </div>
              {selectedProperty && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full font-medium"
                >
                  <FaCheckCircle />
                  {t('cropIntel.propertySelected') || 'Property Selected'}
                </motion.div>
              )}
            </div>
            <select
              value={selectedProperty?._id || ''}
              onChange={(e) => handlePropertyChange(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-lg font-medium bg-gradient-to-r from-white to-gray-50"
            >
              {properties.map(prop => (
                <option key={prop._id} value={prop._id}>
                  {formatPropertyDisplay(prop)}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Tabs */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Tab Navigation */}
            <div className="flex border-b overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[140px] px-6 py-4 font-semibold transition-all duration-300 relative ${
                      isActive
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="text-xl" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </div>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-600"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {/* Error Display */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 flex items-start gap-3"
                  >
                    <FaTimes className="text-xl flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Error Occurred</p>
                      <p>{error}</p>
                    </div>
                    <button
                      onClick={() => setError(null)}
                      className="ml-auto text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tab Content Rendering */}
              <AnimatePresence mode="wait">
                {activeTab === 'analyze' && (
                  <AnalyzeTab
                    selectedProperty={selectedProperty}
                    loading={loading}
                    onAnalyze={handleAnalyzeCrop}
                    analysis={analysis}
                  />
                )}
                
                {activeTab === 'identify' && (
                  <IdentifyTab
                    selectedProperty={selectedProperty}
                    loading={loading}
                    onIdentify={handleIdentifyCrop}
                    identification={identification}
                  />
                )}

                {activeTab === 'recommend' && (
                  <RecommendTab
                    selectedProperty={selectedProperty}
                    loading={loading}
                    onRecommend={handleRecommendCrop}
                    recommendation={recommendation}
                  />
                )}

                {activeTab === 'issues' && (
                  <motion.div
                    key="issues"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                          <FaExclamationTriangle className="text-orange-600" />
                          {t('cropIntel.issues.title') || 'Crop Health Check'}
                        </h2>
                        <p className="text-gray-600 mt-2">
                          {t('cropIntel.issues.title') || 'Detect diseases, pests, and stress factors'}
                        </p>
                      </div>
                      <ActionButton
                        onClick={handleDetectIssues}
                        loading={loading}
                        disabled={!selectedProperty}
                        icon={FaExclamationTriangle}
                      >
                        {t('cropIntel.issues.button') || 'Scan for Issues'}
                      </ActionButton>
                    </div>

                    {issues ? (
                      <div className="text-center py-16">
                        <p className="text-gray-600">{t('cropIntel.issues.scanning') || 'Issues detection feature is being processed...'}</p>
                      </div>
                    ) : !loading && (
                      <div className="text-center py-16 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border-2 border-orange-200">
                        <FaExclamationTriangle className="text-7xl text-orange-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('cropIntel.issues.title') || 'Ready to Scan'}</h3>
                        <p className="text-gray-600 mb-4">{t('cropIntel.issues.title') || 'Check for crop health issues'}</p>
                        <p className="text-sm text-gray-500">{t('cropIntel.issues.title') || 'Detects pests, diseases, and stress'}</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'yield' && (
                  <motion.div
                    key="yield"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                          <FaChartLine className="text-indigo-600" />
                          {t('cropIntel.yield.title') || 'Yield Prediction'}
                        </h2>
                        <p className="text-gray-600 mt-2">
                          {t('cropIntel.yield.title') || 'Forecast harvest quantity using AI'}
                        </p>
                      </div>
                      <ActionButton
                        onClick={handlePredictYield}
                        loading={loading}
                        disabled={!selectedProperty}
                        icon={FaChartLine}
                      >
                        {t('cropIntel.yield.button') || 'Predict Yield'}
                      </ActionButton>
                    </div>

                    {yieldPrediction ? (
                      <div className="text-center py-16">
                        <p className="text-gray-600">{t('cropIntel.yield.predicting') || 'Yield prediction is being calculated...'}</p>
                      </div>
                    ) : !loading && (
                      <div className="text-center py-16 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border-2 border-indigo-200">
                        <FaChartLine className="text-7xl text-indigo-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('cropIntel.yield.title') || 'Ready to Predict'}</h3>
                        <p className="text-gray-600 mb-4">{t('cropIntel.yield.title') || 'Estimate your harvest quantity'}</p>
                        <p className="text-sm text-gray-500">{t('cropIntel.yield.title') || 'Based on crop health and conditions'}</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'ndvi' && (
                  <motion.div
                    key="ndvi"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                          <FaSatellite className="text-teal-600" />
                          {t('cropIntel.tabs.ndvi') || 'NDVI Statistics'}
                        </h2>
                        <p className="text-gray-600 mt-2">
                          {t('cropIntel.ndvi.title') || 'Vegetation health indices from satellite'}
                        </p>
                      </div>
                      <ActionButton
                        onClick={handleGetNDVI}
                        loading={loading}
                        disabled={!selectedProperty}
                        icon={FaSatellite}
                      >
                        {t('cropIntel.ndvi.button') || 'Get NDVI Data'}
                      </ActionButton>
                    </div>

                    {ndviStats ? (
                      <div className="text-center py-16">
                        <p className="text-gray-600">{t('cropIntel.ndvi.loading') || 'NDVI statistics are being loaded...'}</p>
                      </div>
                    ) : !loading && (
                      <div className="text-center py-16 bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl border-2 border-teal-200">
                        <FaSatellite className="text-7xl text-teal-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('cropIntel.ndvi.title') || 'Ready to Load'}</h3>
                        <p className="text-gray-600 mb-4">{t('cropIntel.ndvi.title') || 'Get vegetation health data'}</p>
                        <p className="text-sm text-gray-500">{t('cropIntel.ndvi.title') || 'Satellite-based NDVI analysis'}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default CropIntelligence1;
