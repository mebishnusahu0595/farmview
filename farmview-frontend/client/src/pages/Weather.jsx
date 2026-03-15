import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudSun, FaTemperatureHigh, FaTint, FaWind, FaCompass, FaSun, FaBrain } from 'react-icons/fa';
import { WiHumidity, WiBarometer } from 'react-icons/wi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AIChatbot from '../components/AIChatbot';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Weather() {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [selected, setSelected] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => { fetchProperties(); }, []);

  async function fetchProperties() {
    try {
      const res = await api.get('/property');
      if (res.data?.success) setProperties(res.data.data || []);
    } catch (err) {
      console.error('Fetch props', err);
      toast.error(t('weather.propertiesLoadFailed'));
    }
  }

  async function fetchWeatherFor(prop) {
    if (!prop) return;
    setLoading(true);
    setWeather(null);
    setPrediction(null);
    try {
      const lat = prop.centerCoordinates.latitude;
      const lon = prop.centerCoordinates.longitude;
      const res = await api.get('/weather/current', { params: { latitude: lat, longitude: lon } });
      if (res.data?.success) {
        setWeather(res.data.data);
        setSelected(prop);
        toast.success(t('weather.weatherLoaded'));
      }
    } catch (err) {
      console.error('Weather fetch', err);
      toast.error(t('weather.weatherLoadFailed'));
    } finally { setLoading(false); }
  }

  async function runPrediction() {
    if (!selected || !weather) {
      toast.error(t('weather.selectPropertyFirst'));
      return;
    }
    setPredicting(true);
    try {
      const payload = {
        cropType: selected.currentCrop || 'Unknown',
        temperature: weather.current.temperature,
        rainfall: 0,
        humidity: weather.current.humidity,
        soilType: selected.soilType || 'Loamy',
        irrigationType: selected.irrigationType || 'Rainfed'
      };
      const res = await api.post('/alerts/predict', payload);
      if (res.data?.success) {
        setPrediction(res.data.data);
        toast.success(t('weather.predictionComplete'));
      }
    } catch (err) {
      console.error('Predict', err);
      toast.error(t('weather.predictionFailed'));
    } finally { setPredicting(false); }
  }

  const getWeatherIcon = (temp) => {
    if (temp >= 30) return <FaSun className="text-yellow-500 text-6xl" />;
    return <FaCloudSun className="text-blue-500 text-6xl" />;
  };

  return (
    <div className="min-h-screen bg-green-50/30 flex flex-col">
      <Header />
      <div className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
              <FaCloudSun className="mr-3 text-blue-600" />{t('weather.title')}
            </h1>
            <p className="text-gray-600">{t('weather.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="card bg-white sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center"><FaCompass className="mr-2 text-green-600" />{t('weather.yourProperties')}</h2>
                {properties.length === 0 ? (
                  <div className="text-center py-8"><p className="text-gray-600 mb-4">{t('weather.noProperties')}</p><p className="text-sm text-gray-500">{t('weather.addPropertyFirst')}</p></div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto">
                    {properties.map((p, index) => (
                      <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ scale: 1.02 }} className={`p-4 rounded-xl cursor-pointer transition-all ${selected?._id === p._id ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg' : 'bg-gray-50 hover:bg-gray-100'}`} onClick={() => fetchWeatherFor(p)}>
                        <div className="font-semibold text-lg mb-1">{p.propertyName}</div>
                        <div className={`text-sm ${selected?._id === p._id ? 'text-primary-100' : 'text-gray-600'}`}>{p.area?.value} {p.area?.unit}</div>
                        {p.currentCrop && <div className={`text-sm mt-1 ${selected?._id === p._id ? 'text-white' : 'text-green-600'}`}>🌾 {p.currentCrop}</div>}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-6">
                <div className="card bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                  {loading ? (
                    <div className="flex justify-center py-20"><div className="spinner w-12 h-12 border-white" /></div>
                  ) : weather ? (
                    <>
                      <div className="flex justify-between items-start mb-6">
                        <div><h2 className="text-3xl font-bold mb-2">{weather.location.name}, {weather.location.country}</h2><p className="text-blue-100 text-lg">{selected?.propertyName}</p></div>
                        {getWeatherIcon(weather.current.temperature)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"><FaTemperatureHigh className="text-4xl mx-auto mb-2" /><p className="text-5xl font-bold">{weather.current.temperature}°C</p><p className="text-blue-100 text-sm mt-1">{t('weather.temperature')}</p></div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"><WiHumidity className="text-5xl mx-auto mb-2" /><p className="text-4xl font-bold">{weather.current.humidity}%</p><p className="text-blue-100 text-sm mt-1">{t('weather.humidity')}</p></div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"><FaWind className="text-4xl mx-auto mb-2" /><p className="text-4xl font-bold">{weather.current.windSpeed}</p><p className="text-blue-100 text-sm mt-1">{t('weather.wind')} (m/s)</p></div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center"><WiBarometer className="text-5xl mx-auto mb-2" /><p className="text-4xl font-bold">{weather.current.pressure || 'N/A'}</p><p className="text-blue-100 text-sm mt-1">{t('weather.pressure')}</p></div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4"><p className="text-lg font-semibold mb-2">{weather.current.weather.description}</p></div>
                    </>
                  ) : (
                    <div className="text-center py-20"><FaCloudSun className="text-8xl mx-auto mb-4 opacity-50" /><p className="text-xl mb-2">{t('weather.selectProperty')}</p><p className="text-blue-100">{t('weather.chooseProperty')}</p></div>
                  )}
                </div>

                {weather && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card bg-white">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-800 flex items-center"><FaBrain className="mr-2 text-purple-600" />{t('weather.aiPrediction')}</h3>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={runPrediction} disabled={predicting} className="btn-primary px-6 py-3 disabled:opacity-50 flex items-center space-x-2">{predicting ? <><div className="spinner w-5 h-5" /><span>{t('weather.predicting')}</span></> : <><FaBrain /><span>{t('weather.runPrediction')}</span></>}</motion.button>
                    </div>
                    {prediction ? (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                        {/* Overall Risk Assessment */}
                        <div className={`rounded-xl p-6 ${
                          prediction.riskAssessment.riskLevel === 'Critical' ? 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300' :
                          prediction.riskAssessment.riskLevel === 'High' ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300' :
                          prediction.riskAssessment.riskLevel === 'Medium' ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300' :
                          'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300'
                        }`}>
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold text-gray-800">📊 Overall Risk Assessment</h4>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-gray-800">{prediction.riskAssessment.overallRiskScore}/10</div>
                              <div className={`text-sm font-semibold ${
                                prediction.riskAssessment.riskLevel === 'Critical' ? 'text-red-600' :
                                prediction.riskAssessment.riskLevel === 'High' ? 'text-orange-600' :
                                prediction.riskAssessment.riskLevel === 'Medium' ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>{prediction.riskAssessment.riskLevel} Risk</div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white rounded-lg p-3 text-center">
                              <div className="text-2xl mb-1">🌾</div>
                              <div className="text-sm text-gray-600">Crop</div>
                              <div className="font-bold text-gray-800">{prediction.cropType}</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 text-center">
                              <div className="text-2xl mb-1">🌱</div>
                              <div className="text-sm text-gray-600">Growth Stage</div>
                              <div className="font-bold text-gray-800 capitalize">{prediction.growthStage}</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 text-center">
                              <div className="text-2xl mb-1">🎯</div>
                              <div className="text-sm text-gray-600">Confidence</div>
                              <div className="font-bold text-gray-800">{(parseFloat(prediction.riskAssessment.confidenceScore) * 100).toFixed(0)}%</div>
                            </div>
                          </div>
                        </div>

                        {/* Alerts */}
                        {prediction.alerts && prediction.alerts.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-lg font-bold text-gray-800 flex items-center">
                              <span className="mr-2">⚠️</span>
                              Active Alerts
                            </h4>
                            {prediction.alerts.map((alert, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-4 rounded-xl border-l-4 ${
                                  alert.severity === 'Critical' ? 'bg-red-50 border-red-500' :
                                  alert.severity === 'High' ? 'bg-orange-50 border-orange-500' :
                                  alert.severity === 'Medium' ? 'bg-yellow-50 border-yellow-500' :
                                  'bg-blue-50 border-blue-500'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className={`text-sm font-bold uppercase mb-1 ${
                                      alert.severity === 'Critical' ? 'text-red-700' :
                                      alert.severity === 'High' ? 'text-orange-700' :
                                      alert.severity === 'Medium' ? 'text-yellow-700' :
                                      'text-blue-700'
                                    }`}>{alert.severity} - {alert.type}</div>
                                    <div className="text-gray-800">{alert.message}</div>
                                  </div>
                                  {alert.immediate && (
                                    <span className="ml-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                      IMMEDIATE
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}

                        {/* Individual Risk Factors */}
                        <div>
                          <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                            <span className="mr-2">🔍</span>
                            Detailed Risk Analysis
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(prediction.riskAssessment.individualRisks).map(([key, risk], idx) => (
                              <motion.div
                                key={key}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={`rounded-xl p-4 border-2 ${
                                  risk.level === 'Critical' ? 'bg-red-50 border-red-300' :
                                  risk.level === 'High' ? 'bg-orange-50 border-orange-300' :
                                  risk.level === 'Medium' ? 'bg-yellow-50 border-yellow-300' :
                                  risk.level === 'Low' ? 'bg-blue-50 border-blue-300' :
                                  'bg-green-50 border-green-300'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-bold text-gray-800 capitalize flex items-center">
                                    {key === 'waterlogging' && '💧'}
                                    {key === 'drought' && '🌵'}
                                    {key === 'heatStress' && '🔥'}
                                    {key === 'coldStress' && '❄️'}
                                    {key === 'diseaseRisk' && '🦠'}
                                    {key === 'windDamage' && '💨'}
                                    <span className="ml-2">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                  </h5>
                                  <div className="text-right">
                                    <div className="text-xl font-bold text-gray-800">{risk.score}</div>
                                    <div className={`text-xs font-semibold ${
                                      risk.level === 'Critical' ? 'text-red-600' :
                                      risk.level === 'High' ? 'text-orange-600' :
                                      risk.level === 'Medium' ? 'text-yellow-600' :
                                      risk.level === 'Low' ? 'text-blue-600' :
                                      'text-green-600'
                                    }`}>{risk.level}</div>
                                  </div>
                                </div>
                                <div className="space-y-1 text-xs text-gray-600">
                                  {Object.entries(risk.factors).map(([factorKey, factorValue]) => (
                                    <div key={factorKey} className="flex justify-between">
                                      <span className="capitalize">{factorKey.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                      <span className="font-semibold text-gray-800">{typeof factorValue === 'boolean' ? (factorValue ? 'Yes' : 'No') : factorValue}</span>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Recommendations */}
                        {prediction.recommendations && prediction.recommendations.length > 0 && (
                          <div>
                            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                              <span className="mr-2">💡</span>
                              Recommended Actions
                            </h4>
                            <div className="space-y-3">
                              {prediction.recommendations.map((rec, idx) => (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className={`p-4 rounded-xl border-l-4 ${
                                    rec.priority === 'High' ? 'bg-red-50 border-red-500' :
                                    rec.priority === 'Medium' ? 'bg-yellow-50 border-yellow-500' :
                                    'bg-blue-50 border-blue-500'
                                  }`}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <h5 className="font-bold text-gray-800">{rec.action}</h5>
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                      rec.priority === 'High' ? 'bg-red-500 text-white' :
                                      rec.priority === 'Medium' ? 'bg-yellow-500 text-white' :
                                      'bg-blue-500 text-white'
                                    }`}>{rec.priority}</span>
                                  </div>
                                  <p className="text-sm text-gray-700 mb-2">{rec.details}</p>
                                  <div className="text-xs text-gray-600">
                                    ⏱️ <span className="font-semibold">{rec.timeframe}</span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Current Conditions */}
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
                          <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            <span className="mr-2">🌤️</span>
                            Current Conditions
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-white rounded-lg p-3 text-center">
                              <div className="text-2xl mb-1">🌡️</div>
                              <div className="text-xs text-gray-600">Temperature</div>
                              <div className="font-bold text-gray-800">{prediction.currentConditions.temperature}°C</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 text-center">
                              <div className="text-2xl mb-1">💧</div>
                              <div className="text-xs text-gray-600">Humidity</div>
                              <div className="font-bold text-gray-800">{prediction.currentConditions.humidity}%</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 text-center">
                              <div className="text-2xl mb-1">🌧️</div>
                              <div className="text-xs text-gray-600">Rainfall</div>
                              <div className="font-bold text-gray-800">{prediction.currentConditions.rainfall}mm</div>
                            </div>
                            <div className="bg-white rounded-lg p-3 text-center">
                              <div className="text-2xl mb-1">💨</div>
                              <div className="text-xs text-gray-600">Wind Speed</div>
                              <div className="font-bold text-gray-800">{prediction.currentConditions.windSpeed} km/h</div>
                            </div>
                          </div>
                        </div>

                        {/* Predicted Damage */}
                        <div className={`rounded-xl p-4 text-center ${
                          prediction.predictedDamage.includes('Critical') || prediction.predictedDamage.includes('Severe') ? 'bg-red-100 border-2 border-red-300' :
                          prediction.predictedDamage.includes('Moderate') ? 'bg-orange-100 border-2 border-orange-300' :
                          prediction.predictedDamage.includes('Minor') ? 'bg-yellow-100 border-2 border-yellow-300' :
                          'bg-green-100 border-2 border-green-300'
                        }`}>
                          <div className="text-sm text-gray-600 mb-1">Predicted Impact</div>
                          <div className="text-xl font-bold text-gray-800">{prediction.predictedDamage}</div>
                        </div>

                        {/* Timestamp */}
                        <div className="text-center text-xs text-gray-500">
                          Analysis generated at: {new Date(prediction.timestamp).toLocaleString()}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center py-8 text-gray-600"><FaBrain className="text-5xl mx-auto mb-3 text-gray-300" /><p>{t('weather.clickToAnalyze')}</p><p className="text-sm text-gray-500 mt-2">{t('weather.mlInsights')}</p></div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Chatbot */}
      <AIChatbot />
      
      <Footer />
    </div>
  );
}
