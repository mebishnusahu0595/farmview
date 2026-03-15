import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, FaCloudRain, FaSun, FaBug, FaFire, FaWind, 
  FaExclamationTriangle, FaCheckCircle, FaSatellite, FaRobot,
  FaSpinner, FaChartLine, FaMapMarkedAlt, FaCalendarAlt
} from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ClaimModal({ isOpen, onClose, policyId, propertyId }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1); // 1: Form, 2: Processing, 3: Results
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(propertyId || '');
  
  const [formData, setFormData] = useState({
    damageType: '',
    damagePercent: 50,
    incidentDate: new Date().toISOString().split('T')[0],
    description: ''
  });

  const [claimResult, setClaimResult] = useState(null);
  const [processingStage, setProcessingStage] = useState('');

  const damageTypes = [
    { id: 'flood', label: t('claimModal.flood') || 'Flood', icon: <FaCloudRain />, color: 'blue' },
    { id: 'drought', label: t('claimModal.drought') || 'Drought', icon: <FaSun />, color: 'orange' },
    { id: 'pest', label: t('claimModal.pest') || 'Pest Attack', icon: <FaBug />, color: 'red' },
    { id: 'fire', label: t('claimModal.fire') || 'Fire', icon: <FaFire />, color: 'red' },
    { id: 'storm', label: t('claimModal.storm') || 'Storm', icon: <FaWind />, color: 'purple' },
    { id: 'other', label: t('claimModal.otherDamage') || 'Other', icon: <FaExclamationTriangle />, color: 'yellow' }
  ];

  useEffect(() => {
    if (isOpen && !propertyId) {
      fetchProperties();
    }
    if (isOpen && propertyId) {
      setSelectedProperty(propertyId);
    }
  }, [isOpen, propertyId]);

  const fetchProperties = async () => {
    try {
      const res = await api.get('/property');
      if (res.data?.success) {
        setProperties(res.data.data || []);
      }
    } catch (err) {
      console.error('Fetch properties error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProperty) {
      toast.error(t('claimModal.selectPropertyError'));
      return;
    }

    if (!formData.damageType) {
      toast.error(t('claimModal.selectDamageError'));
      return;
    }

    setLoading(true);
    setStep(2);

    // Simulate processing stages
    const stages = [
      t('claimModal.verifyingPolicy'),
      t('claimModal.fetchingSatellite'),
      t('claimModal.analyzingNDVI'),
      t('claimModal.comparingBaseline'),
      t('claimModal.fraudDetection'),
      t('claimModal.calculatingDamage'),
      t('claimModal.generatingReport')
    ];

    let stageIndex = 0;
    const stageInterval = setInterval(() => {
      if (stageIndex < stages.length) {
        setProcessingStage(stages[stageIndex]);
        stageIndex++;
      } else {
        clearInterval(stageInterval);
      }
    }, 800);

    try {
      const payload = {
        policyId: policyId,
        propertyId: selectedProperty,
        claimedDamagePercent: formData.damagePercent,
        reason: formData.damageType,
        description: formData.description,
        incidentDate: formData.incidentDate
      };

      const res = await api.post('/claims/file', payload);
      
      clearInterval(stageInterval);
      
      if (res.data?.success) {
        setClaimResult(res.data.data);
        setStep(3);
        toast.success(t('claimModal.claimSuccess'));
      } else {
        throw new Error(res.data?.message || t('claimModal.claimFailed'));
      }
    } catch (err) {
      clearInterval(stageInterval);
      console.error('Claim error:', err);
      toast.error(err.response?.data?.message || t('claimModal.claimFailed'));
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      damageType: '',
      damagePercent: 50,
      incidentDate: new Date().toISOString().split('T')[0],
      description: ''
    });
    setClaimResult(null);
    setProcessingStage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  console.log('🚀 ClaimModal rendering:', { isOpen, step, policyId, propertyId, selectedProperty });

  try {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <FaSatellite className="mr-3" />
                {t('claimModal.title')}
              </h2>
              <p className="text-primary-100 text-sm mt-1">
                {t('claimModal.subtitle')}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Claim Form */}
            {step === 1 && (
              <motion.form
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Property Selection */}
                {!propertyId && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      <FaMapMarkedAlt className="inline mr-2 text-primary-600" />
                      {t('claimModal.selectProperty')} *
                    </label>
                    <select
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      required
                    >
                      <option value="">{t('claimModal.chooseProperty')}</option>
                      {properties.map((prop) => (
                        <option key={prop._id} value={prop._id}>
                          {prop.propertyName} - {prop.currentCrop} ({prop.area} hectares)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Damage Type Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FaExclamationTriangle className="inline mr-2 text-primary-600" />
                    {t('claimModal.damageType')} *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {damageTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, damageType: type.id })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.damageType === type.id
                            ? `border-${type.color}-500 bg-${type.color}-50 shadow-md`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`text-3xl mb-2 text-${type.color}-600`}>
                          {type.icon}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          {type.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Damage Percentage Slider */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FaChartLine className="inline mr-2 text-primary-600" />
                    {t('claimModal.estimatedDamage')} {formData.damagePercent}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.damagePercent}
                    onChange={(e) => setFormData({ ...formData, damagePercent: parseInt(e.target.value) })}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Incident Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FaCalendarAlt className="inline mr-2 text-primary-600" />
                    {t('claimModal.incidentDate')} *
                  </label>
                  <input
                    type="date"
                    value={formData.incidentDate}
                    onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('claimModal.description')}
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t('claimModal.descriptionPlaceholder')}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all resize-none"
                  />
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                  <div className="flex items-start">
                    <FaRobot className="text-blue-600 text-xl mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">{t('claimModal.geoaiTitle')}</h4>
                      <p className="text-sm text-blue-800">
                        {t('claimModal.geoaiDescription')} <strong>{t('claimModal.processingTime')}</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <FaSatellite />
                    <span>{t('claimModal.submitClaim')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    {t('claimModal.cancel')}
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 2: Processing */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-12"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-6"
                  >
                    <FaSatellite className="text-6xl text-primary-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {t('claimModal.processingTitle')}
                  </h3>
                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-4">
                      <motion.div
                        className="bg-gradient-to-r from-primary-600 to-secondary-600 h-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 5, ease: "easeInOut" }}
                      />
                    </div>
                    <p className="text-gray-600 mb-8">
                      <FaRobot className="inline mr-2" />
                      {processingStage || t('claimModal.initializing')}
                    </p>
                  </div>

                  {/* Processing Steps Animation */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-8">
                    {[
                      { icon: <FaSatellite />, label: t('claimModal.satelliteData'), color: 'blue' },
                      { icon: <FaRobot />, label: t('claimModal.aiAnalysis'), color: 'purple' },
                      { icon: <FaCheckCircle />, label: t('claimModal.verification'), color: 'green' }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className={`p-4 bg-${item.color}-50 rounded-xl border-2 border-${item.color}-200`}
                      >
                        <div className={`text-3xl text-${item.color}-600 mb-2`}>
                          {item.icon}
                        </div>
                        <div className="text-sm font-medium text-gray-700">
                          {item.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Results */}
            {step === 3 && claimResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Success Header */}
                <div className="text-center py-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <FaCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-900 mb-2">
                    {t('claimModal.claimApproved')} 🎉
                  </h3>
                  <p className="text-green-700">
                    {claimResult.message}
                  </p>
                </div>

                {/* Claim Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-700 mb-1">{t('claimModal.claimId')}</div>
                    <div className="text-lg font-bold text-blue-900">{claimResult.claimId}</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="text-sm text-purple-700 mb-1">{t('claimModal.processingTimeLabel')}</div>
                    <div className="text-lg font-bold text-purple-900">{claimResult.processingTime || '45 seconds'}</div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <div className="text-sm text-orange-700 mb-1">{t('claimModal.geoaiDamageScore')}</div>
                    <div className="text-lg font-bold text-orange-900">{claimResult.damageScore}%</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-sm text-green-700 mb-1">{t('claimModal.estimatedPayout')}</div>
                    <div className="text-lg font-bold text-green-900">₹{claimResult.estimatedPayout?.toLocaleString('en-IN') || '0'}</div>
                  </div>
                </div>

                {/* NDVI Evidence */}
                {claimResult.evidence && (
                  <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                      <FaSatellite className="mr-2 text-primary-600" />
                      {t('claimModal.satelliteEvidence')}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">{t('claimModal.historicalNDVI')}</div>
                        <div className="text-2xl font-bold text-green-600">
                          {claimResult.evidence.historicalNDVI}
                        </div>
                        <div className="text-xs text-gray-500">{t('claimModal.daysAgo', { days: 90 })}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">{t('claimModal.currentNDVI')}</div>
                        <div className="text-2xl font-bold text-red-600">
                          {claimResult.evidence.currentNDVI}
                        </div>
                        <div className="text-xs text-gray-500">{t('claimModal.latestScan')}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Status Timeline */}
                <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border-2 border-primary-200">
                  <h4 className="font-bold text-gray-800 mb-4">{t('claimModal.nextSteps')}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">✓</div>
                      <div>
                        <div className="font-semibold text-gray-800">{t('claimModal.step1Title')}</div>
                        <div className="text-sm text-gray-600">{t('claimModal.step1Desc')}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <div>
                        <div className="font-semibold text-gray-800">{t('claimModal.step2Title')}</div>
                        <div className="text-sm text-gray-600">{t('claimModal.step2Desc')}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">3</div>
                      <div>
                        <div className="font-semibold text-gray-800">{t('claimModal.step3Title')}</div>
                        <div className="text-sm text-gray-600">{t('claimModal.step3Desc')}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleClose}
                    className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all"
                  >
                    {t('claimModal.close')}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-4 border-2 border-primary-600 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 transition-all"
                  >
                    {t('claimModal.printReceipt')}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ClaimModal render error:', error);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md">
          <h3 className="text-xl font-bold text-red-600 mb-4">Error Loading Claim Form</h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button onClick={handleClose} className="btn-primary">Close</button>
        </div>
      </div>
    );
  }
}
