import { motion } from 'framer-motion';
import { FaSeedling, FaCloudSun, FaFileAlt, FaShieldAlt, FaMapMarkedAlt, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SplitText from '../components/SplitText';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

export default function LandingPage() {
  const { t } = useTranslation();
  const [counters, setCounters] = useState({
    farmers: 0,
    hectares: 0,
    claims: 0,
    uptime: 0
  });

  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    const targets = {
      farmers: 10000,
      hectares: 50000,
      claims: 100,
      uptime: 99.9
    };

    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;

      setCounters({
        farmers: Math.floor(targets.farmers * progress),
        hectares: Math.floor(targets.hectares * progress),
        claims: Math.floor(targets.claims * progress),
        uptime: parseFloat((targets.uptime * progress).toFixed(1))
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, interval);
  };

  const formatNumber = (num, type) => {
    if (type === 'farmers') {
      return num >= 1000 ? `${Math.floor(num / 1000)}K+` : `${num}+`;
    }
    if (type === 'hectares') {
      return num >= 1000 ? `${Math.floor(num / 1000)}K+` : `${num}+`;
    }
    if (type === 'claims') {
      return `₹${num}Cr+`;
    }
    if (type === 'uptime') {
      return `${num}%`;
    }
    return num;
  };
  const features = [
    {
      icon: <FaMapMarkedAlt className="text-5xl text-primary-600" />,
      title: t('landing.features.property.title'),
      description: t('landing.features.property.desc')
    },
    {
      icon: <FaFileAlt className="text-5xl text-primary-600" />,
      title: t('landing.features.documents.title'),
      description: t('landing.features.documents.desc')
    },
    {
      icon: <FaShieldAlt className="text-5xl text-primary-600" />,
      title: t('landing.features.insurance.title'),
      description: t('landing.features.insurance.desc')
    },
    {
      icon: <FaCloudSun className="text-5xl text-primary-600" />,
      title: t('landing.features.weather.title'),
      description: t('landing.features.weather.desc')
    },
    {
      icon: <FaChartLine className="text-5xl text-primary-600" />,
      title: t('landing.features.monitoring.title'),
      description: t('landing.features.monitoring.desc')
    },
    {
      icon: <FaSeedling className="text-5xl text-primary-600" />,
      title: t('landing.features.smart.title'),
      description: t('landing.features.smart.desc')
    }
  ];

  const benefits = [
    t('landing.benefits.satellite'),
    t('landing.benefits.claims'),
    t('landing.benefits.weather'),
    t('landing.benefits.documents'),
    t('landing.benefits.multilang'),
    t('landing.benefits.ai')
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full py-[4.25rem] md:py-[6.25rem] overflow-hidden mb-10">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/src/components/assests/video.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay for text visibility */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        
        {/* Wave SVG at bottom */}
        <svg className="absolute bottom-0 left-0 w-full z-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 140">
          <path fill="#ffffff" fillOpacity="1" d="M0,80L48,85.3C96,91,192,101,288,96C384,91,480,69,576,58.7C672,48,768,48,864,64C960,80,1056,112,1152,112C1248,112,1344,80,1392,64L1440,48L1440,140L1392,140C1344,140,1248,140,1152,140C1056,140,960,140,864,140C768,140,672,140,576,140C480,140,384,140,288,140C192,140,96,140,48,140L0,140Z">
            <animate attributeName="d" dur="3s" repeatCount="indefinite" values="
              M0,80L48,85.3C96,91,192,101,288,96C384,91,480,69,576,58.7C672,48,768,48,864,64C960,80,1056,112,1152,112C1248,112,1344,80,1392,64L1440,48L1440,140L1392,140C1344,140,1248,140,1152,140C1056,140,960,140,864,140C768,140,672,140,576,140C480,140,384,140,288,140C192,140,96,140,48,140L0,140Z;
              M0,48L48,58.7C96,69,192,91,288,101.3C384,112,480,112,576,101.3C672,91,768,69,864,69.3C960,69,1056,91,1152,96C1248,101,1344,91,1392,85.3L1440,80L1440,140L1392,140C1344,140,1248,140,1152,140C1056,140,960,140,864,140C768,140,672,140,576,140C480,140,384,140,288,140C192,140,96,140,48,140L0,140Z;
              M0,80L48,85.3C96,91,192,101,288,96C384,91,480,69,576,58.7C672,48,768,48,864,64C960,80,1056,112,1152,112C1248,112,1344,80,1392,64L1440,48L1440,140L1392,140C1344,140,1248,140,1152,140C1056,140,960,140,864,140C768,140,672,140,576,140C480,140,384,140,288,140C192,140,96,140,48,140L0,140Z"
            />
          </path>
        </svg>
        
        <div className="container mx-auto px-4 relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold border border-white/30">
              {t('landing.geoaiBadge')}
            </span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {t('landing.heroTitle')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
              {t('landing.heroTitleHighlight')}
            </span>
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {t('landing.heroSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              to="/signup" 
              className="w-full sm:w-auto relative overflow-hidden text-lg px-12 py-3 border-2 border-[#10b981] rounded-full font-semibold text-white bg-[#10b981] transition-all duration-300 shadow-[0_5px_15px_rgba(16,185,129,0.25)] inline-block text-center cursor-pointer z-10 before:content-[''] before:absolute before:top-0 before:right-1/2 before:left-1/2 before:h-full before:bg-[#f0fff4] before:-z-10 before:transition-all before:duration-300 before:rounded-full hover:before:left-0 hover:before:right-0 hover:text-[#1e293b]"
            >
              {t('landing.getStartedFree')}
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto relative overflow-hidden text-lg px-12 py-3 border-2 border-white rounded-full font-semibold text-white bg-transparent transition-all duration-300 shadow-[0_5px_15px_rgba(255,255,255,0.3)] inline-block text-center cursor-pointer z-10 before:content-[''] before:absolute before:top-0 before:right-1/2 before:left-1/2 before:h-full before:bg-white before:-z-10 before:transition-all before:duration-300 before:rounded-full hover:before:left-0 hover:before:right-0 hover:text-[#10b981]"
            >
              {t('landing.loginToDashboard')}
            </Link>
          </div>
        </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Side - Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <img 
                src="/src/components/assests/farmer.jpg" 
                alt="Farmer in field" 
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </motion.div>

            {/* Right Side - Benefits List */}
            <div className="order-1 lg:order-2">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-8"
              >
                {t('landing.features.title')}
              </motion.h2>
              <div className="grid grid-cols-1 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    <FaCheckCircle className="text-green-500 flex-shrink-0 text-xl" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="bg-black py-12 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="text-center"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                {formatNumber(counters.farmers, 'farmers')}
              </h3>
              <p className="text-gray-300 text-sm md:text-base">{t('landing.stats.farmers')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                {formatNumber(counters.hectares, 'hectares')}
              </h3>
              <p className="text-gray-300 text-sm md:text-base">{t('landing.stats.hectares')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                {formatNumber(counters.claims, 'claims')}
              </h3>
              <p className="text-gray-300 text-sm md:text-base">{t('landing.stats.claims')}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-green-400 mb-2">
                {formatNumber(counters.uptime, 'uptime')}
              </h3>
              <p className="text-gray-300 text-sm md:text-base">{t('landing.stats.uptime')}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <SplitText
            text={t('landing.features.title')}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
            delay={50}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('landing.features.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="card text-center p-8 hover:shadow-2xl transition-all duration-300 bg-white"
            >
              <div className="flex justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-secondary-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('landing.cta.title')}
            </h2>
            <p className="text-xl md:text-2xl text-primary-100 mb-10 max-w-2xl mx-auto">
              {t('landing.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/signup" 
                className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-4 px-10 rounded-lg text-lg transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                {t('landing.cta.createAccount')}
              </Link>
              <a 
                href="#features"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 font-bold py-4 px-10 rounded-lg text-lg transition-all"
              >
                {t('landing.cta.learnMore')}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}