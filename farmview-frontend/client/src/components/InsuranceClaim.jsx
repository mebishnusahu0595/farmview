import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { AlertCircle, CheckCircle, FileText, TrendingDown, Shield, Clock } from 'lucide-react';

const InsuranceClaim = ({ propertyId, onClose }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const [eligible, setEligible] = useState(false);
  const [policyDetails, setPolicyDetails] = useState(null);
  const [claimData, setClaimData] = useState({
    claimedDamagePercent: 50,
    reason: '',
    description: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const damageReasons = [
    'Heavy Rain',
    'Drought',
    'Flood',
    'Cold Wave',
    'Heat Wave',
    'Hailstorm',
    'Pest Attack',
    'Disease',
    'Other'
  ];

  useEffect(() => {
    checkEligibility();
  }, [propertyId]);

  const checkEligibility = async () => {
    try {
      setCheckingEligibility(true);
      const response = await api.get(`/api/claims/eligibility/${propertyId}`);
      
      if (response.data.success && response.data.eligible) {
        setEligible(true);
        setPolicyDetails(response.data.policyDetails);
      } else {
        setEligible(false);
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check eligibility');
    } finally {
      setCheckingEligibility(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!claimData.reason) {
      setError(t('insuranceClaim.selectReasonError'));
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      console.log('🔔 Filing claim...');
      const response = await api.post('/api/claims/file', {
        propertyId: propertyId,
        claimedDamagePercent: claimData.claimedDamagePercent,
        reason: claimData.reason,
        description: claimData.description
      });
      
      if (response.data.success) {
        setResult(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error filing claim:', err);
      setError(err.response?.data?.message || t('insuranceClaim.selectReasonError'));
    } finally {
      setLoading(false);
    }
  };

  if (checkingEligibility) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('insuranceClaim.checkingEligibility')}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!eligible) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">{t('insuranceClaim.notEligible')}</h3>
            <p className="mt-2 text-gray-600">{error}</p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              {t('insuranceClaim.close')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full m-4">
        {!result ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                🌾 {t('insuranceClaim.title')}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Policy Details */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <Shield className="h-6 w-6 text-green-600 mt-1 mr-3" />
                <div>
                  <h3 className="font-semibold text-green-900">{t('insuranceClaim.activePolicy')}</h3>
                  <div className="mt-2 text-sm text-green-800">
                    <p><strong>{t('insuranceClaim.policyNumber')}:</strong> {policyDetails?.policyNumber}</p>
                    <p><strong>{t('insuranceClaim.coverage')}:</strong> ₹{policyDetails?.coverageAmount?.toLocaleString()}</p>
                    <p><strong>{t('insuranceClaim.validUntil')}:</strong> {new Date(policyDetails?.validUntil).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Damage Percentage */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('insuranceClaim.damagePercentage')}: <span className="text-2xl font-bold text-red-600">{claimData.claimedDamagePercent}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={claimData.claimedDamagePercent}
                  onChange={(e) => setClaimData({...claimData, claimedDamagePercent: parseInt(e.target.value)})}
                  className="w-full h-3 bg-gradient-to-r from-yellow-200 via-orange-400 to-red-600 rounded-lg appearance-none cursor-pointer"
                  disabled={loading}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Damage Reason */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('insuranceClaim.damageReason')} <span className="text-red-500">*</span>
                </label>
                <select
                  value={claimData.reason}
                  onChange={(e) => setClaimData({...claimData, reason: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={loading}
                >
                  <option value="">{t('insuranceClaim.selectReason')}</option>
                  {damageReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('insuranceClaim.description')}
                </label>
                <textarea
                  value={claimData.description}
                  onChange={(e) => setClaimData({...claimData, description: e.target.value})}
                  placeholder={t('insuranceClaim.descriptionPlaceholder')}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold">🛰️ {t('insuranceClaim.geoaiVerification')}</p>
                    <p className="mt-1">{t('insuranceClaim.geoaiInfo')}</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      {t('insuranceClaim.processing')}
                    </>
                  ) : (
                    <>📋 {t('insuranceClaim.fileClaim')}</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
                >
                  {t('insuranceClaim.cancel')}
                </button>
              </div>
            </form>
          </>
        ) : (
          // Success Result
          <div className="text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {result.status === 'AUTO_APPROVED' ? `✅ ${t('insuranceClaim.claimApproved')}` : `📋 ${t('insuranceClaim.claimFiled')}`}
            </h2>
            <p className="text-gray-600 mb-6">{result.message}</p>

            {/* Claim Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t('insuranceClaim.claimId')}</p>
                  <p className="font-semibold text-gray-900">{result.claimId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('insuranceClaim.status')}</p>
                  <p className="font-semibold text-green-600">{result.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('insuranceClaim.damageScore')}</p>
                  <p className="font-semibold text-red-600">{result.damageScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('insuranceClaim.estimatedPayout')}</p>
                  <p className="font-semibold text-green-600">₹{result.estimatedPayout?.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">{t('insuranceClaim.processingTime')}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 text-blue-500 mr-2" />
                    <p className="font-semibold text-blue-600">{result.processingTime}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence Info */}
            {result.evidence && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-blue-900 mb-2">🛰️ {t('insuranceClaim.geoaiEvidence')}</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>{t('insuranceClaim.currentNDVI')}: {result.evidence.currentNDVI}</p>
                  <p>{t('insuranceClaim.historicalNDVI')}: {result.evidence.historicalNDVI}</p>
                  <p>{t('insuranceClaim.source')}: {t('insuranceClaim.sentinelSatellite')}</p>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700"
            >
              {t('insuranceClaim.close')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsuranceClaim;
