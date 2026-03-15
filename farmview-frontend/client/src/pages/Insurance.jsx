import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShieldAlt, FaCheckCircle, FaClock, FaTimesCircle, FaPlus,
  FaCalendarAlt, FaMoneyBillWave, FaFileContract, FaExclamationCircle, FaSatellite
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ClaimModal from '../components/ClaimModal';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Insurance() {
  const { t } = useTranslation();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedPolicyForClaim, setSelectedPolicyForClaim] = useState(null);
  const [form, setForm] = useState({ 
    policyNumber: '', 
    policyType: 'Crop Insurance', 
    providerName: '', 
    providerContact: '',
    providerEmail: '',
    coverageAmount: '', 
    premiumAmount: '', 
    premiumFrequency: 'Annual',
    startDate: '', 
    endDate: '', 
    propertyId: '' 
  });

  useEffect(() => { fetchPolicies(); }, []);

  async function fetchPolicies() {
    setLoading(true);
    try {
      const res = await api.get('/insurance');
      if (res.data?.success) setPolicies(res.data.data || []);
    } catch (err) {
      console.error('Fetch policies', err);
      toast.error(t('insurance.loadFailed'));
    } finally { setLoading(false); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!form.policyNumber || !form.providerName || !form.coverageAmount || !form.premiumAmount) {
      toast.error(t('insurance.fillRequired'));
      return;
    }
    setCreating(true);
    try {
      // Format data according to Insurance model schema
      const payload = {
        policyNumber: form.policyNumber,
        policyType: form.policyType,
        provider: {
          name: form.providerName,
          contactNumber: form.providerContact,
          email: form.providerEmail
        },
        coverageAmount: parseFloat(form.coverageAmount),
        premium: {
          amount: parseFloat(form.premiumAmount),
          frequency: form.premiumFrequency
        },
        startDate: form.startDate,
        endDate: form.endDate,
        property: form.propertyId || undefined
      };

      const res = await api.post('/insurance', payload);
      if (res.data?.success) {
        toast.success(t('insurance.createSuccess'));
        setForm({ 
          policyNumber: '', 
          policyType: 'Crop Insurance', 
          providerName: '', 
          providerContact: '',
          providerEmail: '',
          coverageAmount: '', 
          premiumAmount: '', 
          premiumFrequency: 'Annual',
          startDate: '', 
          endDate: '', 
          propertyId: '' 
        });
        setShowForm(false);
        fetchPolicies();
      }
    } catch (err) {
      console.error('Create policy', err);
      toast.error(err.response?.data?.message || t('insurance.createFailed'));
    } finally { setCreating(false); }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return <FaCheckCircle />;
      case 'pending': return <FaClock />;
      case 'expired': return <FaTimesCircle />;
      default: return <FaClock />;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return t('insurance.active');
      case 'pending': return t('insurance.pending');
      case 'expired': return t('insurance.expired');
      default: return t('insurance.active');
    }
  };

  const handleFileClaimClick = (policy) => {
    console.log('📋 Filing claim for policy:', policy._id);
    toast.loading('Opening claim form...', { id: 'claim-loading' });
    setSelectedPolicyForClaim(policy);
    setClaimModalOpen(true);
    setTimeout(() => {
      toast.dismiss('claim-loading');
    }, 500);
  };

  const handleViewDetails = async (policy) => {
    try {
      toast.loading('Loading policy details...', { id: 'view-details' });
      const res = await api.get(`/insurance/${policy._id}`);
      
      if (res.data?.success) {
        toast.success('Policy details loaded', { id: 'view-details' });
        // You can show the details in a modal or navigate to details page
        console.log('Policy Details:', res.data.data);
        
        // For now, show key info in toast
        const data = res.data.data;
        toast.success(
          <div className="text-left">
            <p className="font-bold">{data.policyNumber}</p>
            <p className="text-sm">Coverage: ₹{Number(data.coverageAmount).toLocaleString('en-IN')}</p>
            <p className="text-sm">Status: {data.status}</p>
            <p className="text-sm">Claims: {data.claims?.length || 0}</p>
          </div>,
          { duration: 5000 }
        );
      }
    } catch (err) {
      console.error('View details error:', err);
      toast.error(err.response?.data?.message || 'Failed to load policy details', { id: 'view-details' });
    }
  };

  const handleClaimModalClose = () => {
    setClaimModalOpen(false);
    setSelectedPolicyForClaim(null);
  };

  return (
    <div className="min-h-screen bg-green-50/30 flex flex-col">
      <Header />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
                  <FaShieldAlt className="mr-3 text-purple-600" />{t('insurance.title')}
                </h1>
                <p className="text-gray-600">{t('insurance.subtitle')}</p>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowForm(!showForm)} className="mt-4 md:mt-0 btn-primary flex items-center space-x-2 px-6 py-3">
                <FaPlus /><span>{t('insurance.addNewPolicy')}</span>
              </motion.button>
            </div>
          </motion.div>

          <AnimatePresence>
            {showForm && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="mb-8 overflow-hidden">
                <div className="card bg-white p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaFileContract className="mr-2 text-purple-600" />{t('insurance.createNewPolicy')}</h2>
                  <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('insurance.policyNumber')} {t('insurance.required')}</label><input placeholder={t('insurance.policyNumberPlaceholder')} value={form.policyNumber} onChange={e => setForm({...form, policyNumber: e.target.value})} className="input-field" required /></div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('insurance.policyType')} {t('insurance.required')}</label>
                      <select value={form.policyType} onChange={e => setForm({...form, policyType: e.target.value})} className="input-field" required>
                        <option value="Crop Insurance">{t('insurance.cropInsurance')}</option>
                        <option value="Weather-Based Insurance">{t('insurance.weatherBased')}</option>
                        <option value="Livestock Insurance">{t('insurance.livestock')}</option>
                        <option value="Farm Equipment Insurance">{t('insurance.farmEquipment')}</option>
                        <option value="Multi-Peril Crop Insurance">{t('insurance.multiPeril')}</option>
                        <option value="Other">{t('insurance.other')}</option>
                      </select>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('insurance.providerName')} {t('insurance.required')}</label><input placeholder={t('insurance.providerNamePlaceholder')} value={form.providerName} onChange={e => setForm({...form, providerName: e.target.value})} className="input-field" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('insurance.providerContact')}</label><input placeholder={t('insurance.providerContactPlaceholder')} value={form.providerContact} onChange={e => setForm({...form, providerContact: e.target.value})} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('insurance.providerEmail')}</label><input type="email" placeholder={t('insurance.providerEmailPlaceholder')} value={form.providerEmail} onChange={e => setForm({...form, providerEmail: e.target.value})} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('insurance.coverageAmount')} {t('insurance.required')}</label><input type="number" placeholder={t('insurance.coverageAmountPlaceholder')} value={form.coverageAmount} onChange={e => setForm({...form, coverageAmount: e.target.value})} className="input-field" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('insurance.premiumAmount')} {t('insurance.required')}</label><input type="number" placeholder={t('insurance.premiumAmountPlaceholder')} value={form.premiumAmount} onChange={e => setForm({...form, premiumAmount: e.target.value})} className="input-field" required /></div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('insurance.premiumFrequency')} {t('insurance.required')}</label>
                      <select value={form.premiumFrequency} onChange={e => setForm({...form, premiumFrequency: e.target.value})} className="input-field" required>
                        <option value="Annual">{t('insurance.annual')}</option>
                        <option value="Semi-Annual">{t('insurance.semiAnnual')}</option>
                        <option value="Quarterly">{t('insurance.quarterly')}</option>
                        <option value="One-Time">{t('insurance.oneTime')}</option>
                      </select>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('insurance.propertyId')}</label><input placeholder={t('insurance.propertyIdPlaceholder')} value={form.propertyId} onChange={e => setForm({...form, propertyId: e.target.value})} className="input-field" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('insurance.startDate')} {t('insurance.required')}</label><input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="input-field" required /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-2">{t('insurance.endDate')} {t('insurance.required')}</label><input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="input-field" required /></div>
                    <div className="md:col-span-2 flex gap-4">
                      <button type="submit" disabled={creating} className="btn-primary px-6 py-3 disabled:opacity-50 flex items-center space-x-2">{creating ? <><div className="spinner w-5 h-5" /><span>{t('insurance.creating')}</span></> : <><FaPlus /><span>{t('insurance.createPolicy')}</span></>}</button>
                      <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-6 py-3">{t('insurance.cancel')}</button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('insurance.yourPolicies')} ({policies.length})</h2>
            {loading ? (
              <div className="flex justify-center py-12"><div className="spinner w-10 h-10" /></div>
            ) : policies.length === 0 ? (
              <div className="text-center py-12">
                <FaShieldAlt className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">{t('insurance.noPolicies')}</p>
                <p className="text-gray-500 text-sm mb-6">{t('insurance.noPoliciesDesc')}</p>
                <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center space-x-2 px-6 py-3"><FaPlus /><span>{t('insurance.addFirstPolicy')}</span></button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {policies.map((policy, index) => (
                  <motion.div key={policy._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5, scale: 1.02 }} className="p-6 bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-purple-100 relative">
                    {/* GeoAI Badge */}
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center space-x-1 shadow-md">
                      <FaSatellite className="text-xs" />
                      <span>GeoAI Enabled</span>
                    </div>
                    
                    <div className="flex justify-between items-start mb-4 mt-2">
                      <div><h3 className="text-xl font-bold text-gray-800 mb-1">{policy.policyNumber}</h3><p className="text-gray-600">{policy.provider?.name || policy.provider || 'N/A'}</p></div>
                      <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(policy.status)}`}>{getStatusIcon(policy.status)}<span>{getStatusText(policy.status)}</span></span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-700"><FaFileContract className="text-purple-600" /><span className="text-sm"><span className="font-medium">{t('insurance.type')}:</span> {policy.policyType}</span></div>
                      <div className="flex items-center space-x-2 text-gray-700"><FaMoneyBillWave className="text-green-600" /><span className="text-sm"><span className="font-medium">{t('insurance.coverage')}:</span> ₹{Number(policy.coverageAmount).toLocaleString('en-IN')}</span></div>
                      <div className="flex items-center space-x-2 text-gray-700"><FaMoneyBillWave className="text-blue-600" /><span className="text-sm"><span className="font-medium">{t('insurance.premium')}:</span> ₹{Number(policy.premium?.amount || policy.premium || 0).toLocaleString('en-IN')}/{policy.premium?.frequency || t('insurance.year')}</span></div>
                      <div className="flex items-center space-x-2 text-gray-700"><FaCalendarAlt className="text-orange-600" /><span className="text-sm"><span className="font-medium">{t('insurance.valid')}:</span> {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}</span></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-purple-200 flex gap-2">
                      <button 
                        onClick={() => handleViewDetails(policy)}
                        className="btn-primary flex-1 py-2 text-sm"
                      >
                        {t('insurance.viewDetails')}
                      </button>
                      <motion.button 
                        onClick={() => handleFileClaimClick(policy)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-outline flex-1 py-2 text-sm bg-gradient-to-r from-red-50 to-orange-50 border-red-500 text-red-600 hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:text-white transition-all flex items-center justify-center space-x-1 font-semibold"
                      >
                        <FaExclamationCircle className="animate-pulse" />
                        <span>{t('insurance.fileClaim')}</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Claim Modal */}
      <ClaimModal
        isOpen={claimModalOpen}
        onClose={handleClaimModalClose}
        policyId={selectedPolicyForClaim?._id}
        propertyId={selectedPolicyForClaim?.property}
      />

      <Footer />
    </div>
  );
}
