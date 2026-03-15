import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTimes, FaRobot, FaCheckCircle, FaTimesCircle, FaSpinner,
  FaExclamationTriangle, FaFileAlt, FaMapMarkedAlt, FaUser
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function DocumentVerificationModal({ isOpen, onClose, onVerificationComplete, properties = [] }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1); // 1: Form, 2: Processing, 3: Results
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    ownerName: '',
    surveyNumber: '',
    area: '',
    village: '',
    district: '',
    documentType: 'Land Documents',
    propertyId: ''
  });
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [processingStage, setProcessingStage] = useState('');

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error(t('docVerification.invalidFileType'));
        return;
      }
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error(t('docVerification.fileTooLarge'));
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error(t('docVerification.selectFile'));
      return;
    }

    if (!formData.ownerName || !formData.surveyNumber || !formData.area) {
      toast.error(t('docVerification.fillFields'));
      return;
    }

    setVerifying(true);
    setStep(2);

    // Simulate processing stages
    const stages = [
      t('docVerification.uploading'),
      t('docVerification.extracting'),
      t('docVerification.processing'),
      t('docVerification.validating'),
      t('docVerification.comparing'),
      t('docVerification.checkingDuplicates'),
      t('docVerification.generatingReport')
    ];

    let stageIndex = 0;
    const stageInterval = setInterval(() => {
      if (stageIndex < stages.length) {
        setProcessingStage(stages[stageIndex]);
        stageIndex++;
      }
    }, 1000);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);
      formDataToSend.append('ownerName', formData.ownerName);
      formDataToSend.append('surveyNumber', formData.surveyNumber);
      formDataToSend.append('area', formData.area);
      formDataToSend.append('village', formData.village);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('documentType', formData.documentType);
      if (formData.propertyId) {
        formDataToSend.append('propertyId', formData.propertyId);
      }

      const res = await api.post('/documents/verify', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      clearInterval(stageInterval);

      if (res.data?.success) {
        setVerificationResult(res.data);
        setStep(3);
        
        if (res.data.status === 'verified') {
          toast.success(t('docVerification.verified'));
        } else if (res.data.status === 'review') {
          toast(t('docVerification.needsReview'), { icon: '⚠️' });
        } else {
          toast.error(t('docVerification.failed'));
        }
      }

    } catch (err) {
      clearInterval(stageInterval);
      console.error('Verification error:', err);
      toast.error(err.response?.data?.message || t('docVerification.verificationFailed'));
      setStep(1);
    } finally {
      setVerifying(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFile(null);
    setFormData({
      ownerName: '',
      surveyNumber: '',
      area: '',
      village: '',
      district: '',
      documentType: 'Land Documents',
      propertyId: ''
    });
    setVerificationResult(null);
    setProcessingStage('');
    onClose();
  };

  const handleComplete = () => {
    if (onVerificationComplete && verificationResult) {
      onVerificationComplete(verificationResult);
    }
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <FaRobot className="mr-3" />
                {t('docVerification.title')}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {t('docVerification.subtitle')}
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
            {/* Step 1: Upload & Form */}
            {step === 1 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    <FaFileAlt className="inline mr-2 text-blue-600" />
                    {t('docVerification.uploadTitle')}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="document-upload"
                    />
                    <label htmlFor="document-upload" className="cursor-pointer">
                      {file ? (
                        <div className="text-green-600">
                          <FaCheckCircle className="text-4xl mx-auto mb-2" />
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      ) : (
                        <div className="text-gray-500">
                          <FaFileAlt className="text-4xl mx-auto mb-2" />
                          <p className="font-medium">{t('docVerification.clickUpload')}</p>
                          <p className="text-sm">{t('docVerification.fileTypes')}</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaUser className="inline mr-2 text-blue-600" />
                      {t('docVerification.ownerName')}
                    </label>
                    <input
                      type="text"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      placeholder={t('docVerification.ownerPlaceholder')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('docVerification.surveyNumber')}
                    </label>
                    <input
                      type="text"
                      value={formData.surveyNumber}
                      onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
                      placeholder={t('docVerification.surveyPlaceholder')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('docVerification.area')}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      placeholder={t('docVerification.areaPlaceholder')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaMapMarkedAlt className="inline mr-2 text-blue-600" />
                      {t('docVerification.village')}
                    </label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      placeholder={t('docVerification.villagePlaceholder')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('docVerification.district')}
                    </label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      placeholder={t('docVerification.districtPlaceholder')}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Property Selection Dropdown */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaMapMarkedAlt className="inline mr-2 text-green-600" />
                      📍 Link to Property (Optional)
                    </label>
                    <select
                      value={formData.propertyId}
                      onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                    >
                      <option value="">Select Property (Optional)</option>
                      {properties.map(prop => (
                        <option key={prop._id} value={prop._id}>
                          {prop.propertyName} - {prop.area?.value || prop.area} {prop.area?.unit || 'hectares'} ({prop.currentCrop || 'No crop'})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Link this document to a specific property for auto-fill and better organization
                    </p>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl">
                  <div className="flex items-start">
                    <FaRobot className="text-blue-600 text-xl mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">{t('docVerification.howItWorks')}</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• {t('docVerification.info1')}</li>
                        <li>• {t('docVerification.info2')}</li>
                        <li>• {t('docVerification.info3')}</li>
                        <li>• {t('docVerification.info4')}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={verifying}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <FaRobot />
                    <span>{t('docVerification.startVerification')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    {t('docVerification.cancel')}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Processing */}
            {step === 2 && (
              <div className="py-12">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-block mb-6"
                  >
                    <FaRobot className="text-6xl text-blue-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {t('docVerification.processingTitle')}
                  </h3>
                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden mb-4">
                      <motion.div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-full"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 7, ease: "easeInOut" }}
                      />
                    </div>
                    <p className="text-gray-600 mb-8">
                      <FaSpinner className="inline animate-spin mr-2" />
                      {processingStage || t('docVerification.processing')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Results */}
            {step === 3 && verificationResult && (
              <div className="space-y-6">
                {/* Status Header */}
                <div className={`text-center py-6 rounded-xl border-2 ${
                  verificationResult.status === 'verified'
                    ? 'bg-green-50 border-green-200'
                    : verificationResult.status === 'review'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}>
                  {verificationResult.status === 'verified' ? (
                    <>
                      <FaCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-green-900 mb-2">
                        {t('docVerification.verified')}
                      </h3>
                    </>
                  ) : verificationResult.status === 'review' ? (
                    <>
                      <FaExclamationTriangle className="text-5xl text-yellow-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-yellow-900 mb-2">
                        {t('docVerification.needsReview')}
                      </h3>
                    </>
                  ) : (
                    <>
                      <FaTimesCircle className="text-5xl text-red-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-red-900 mb-2">
                        {t('docVerification.failed')}
                      </h3>
                    </>
                  )}
                  <p className="text-gray-700">{verificationResult.message}</p>
                </div>

                {/* Match Score */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
                  <h4 className="font-bold text-gray-800 mb-4 text-center">{t('docVerification.matchScore')}</h4>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {t('docVerification.aiConfidence')}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-600">
                          {verificationResult.matchScore}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-200">
                      <div
                        style={{ width: `${verificationResult.matchScore}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          verificationResult.matchScore >= 85
                            ? 'bg-green-500'
                            : verificationResult.matchScore >= 70
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Extracted Fields */}
                {verificationResult.extractedFields && Object.keys(verificationResult.extractedFields).length > 0 && (
                  <div className="p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4">{t('docVerification.extractedFields')}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(verificationResult.extractedFields).map(([key, value]) => (
                        <div key={key} className="bg-white p-3 rounded-lg">
                          <div className="text-xs text-gray-500 capitalize">{key}</div>
                          <div className="font-semibold text-gray-800">{value || 'N/A'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Field Comparison */}
                {verificationResult.comparison && (
                  <div className="p-6 bg-white rounded-xl border-2 border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-4">{t('docVerification.fieldAnalysis')}</h4>
                    <div className="space-y-3">
                      {Object.entries(verificationResult.comparison).map(([field, data]) => {
                        if (field === 'overall') return null;
                        return (
                          <div key={field} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <div className="font-semibold text-gray-800 capitalize">{field}</div>
                              <div className="text-sm text-gray-600">{data.reason}</div>
                            </div>
                            <div className={`text-xl font-bold ${
                              data.match >= 85 ? 'text-green-600' : data.match >= 70 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {data.match}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  {verificationResult.status === 'verified' ? (
                    <button
                      onClick={handleComplete}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all"
                    >
                      {t('docVerification.continueVerified')}
                    </button>
                  ) : verificationResult.status === 'review' ? (
                    <>
                      <button
                        onClick={handleComplete}
                        className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all"
                      >
                        {t('docVerification.submitReview')}
                      </button>
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 bg-blue-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all"
                      >
                        {t('docVerification.tryAgain')}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 bg-blue-600 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all"
                    >
                      {t('docVerification.uploadDifferent')}
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    {t('docVerification.close')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
