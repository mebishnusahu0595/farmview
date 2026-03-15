import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';
import { 
  FaSeedling, 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaHome,
  FaFileAlt,
  FaMapMarkedAlt,
  FaShieldAlt,
  FaCloudSun,
  FaRobot,
  FaExclamationCircle,
  FaGlobe
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { t, i18n } = useTranslation();
  const { farmer, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' }
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('preferredLanguage', langCode);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = isAuthenticated ? [
    { path: '/dashboard', icon: <FaHome />, label: t('nav.dashboard') || 'Dashboard' },
    { path: '/property', icon: <FaMapMarkedAlt />, label: t('nav.property') || 'Property' },
    { path: '/documents', icon: <FaFileAlt />, label: t('nav.documents') || 'Documents' },
    { path: '/insurance', icon: <FaShieldAlt />, label: t('nav.insurance') || 'Insurance' },
    { path: '/claims', icon: <FaExclamationCircle />, label: t('header.claims') || 'Claims' },
    { path: '/weather', icon: <FaCloudSun />, label: t('nav.weather') || 'Weather' },
    { path: '/field-advisor', icon: <FaRobot />, label: t('header.aiAdvisor') || 'AI Advisor' }
  ] : [];

  const isActive = (path) => location.pathname === path;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-[1000]">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to={isAuthenticated ? '/dashboard' : '/'} 
            className="flex items-center space-x-2 group"
            onClick={closeMobileMenu}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center"
            >
              <FaSeedling className="text-white text-xl" />
            </motion.div>
            <span className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
              FarmView AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 px-2 py-2 rounded-lg transition-all duration-200 text-sm ${
                    isActive(link.path)
                      ? 'bg-primary-600 text-white'
                      : link.highlight
                      ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 shadow-md'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                  {link.highlight && !isActive(link.path) && (
                    <span className="ml-1 px-1.5 py-0.5 bg-yellow-400 text-xs font-bold rounded text-gray-800">NEW</span>
                  )}
                </Link>
              ))}

              {/* User Menu */}
              <div className="flex items-center space-x-2 border-l pl-2 ml-2">
                {/* Language Selector */}
                <div className="relative group">
                  <button className="flex items-center space-x-1 px-2 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all">
                    <FaGlobe className="text-base" />
                    <span className="text-sm font-medium">{currentLanguage.flag}</span>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1001]">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full flex items-center space-x-2 px-3 py-2 hover:bg-primary-50 transition-colors first:rounded-t-lg last:rounded-b-lg text-sm ${
                          i18n.language === lang.code ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                        {i18n.language === lang.code && (
                          <span className="ml-auto text-primary-600 text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <Link 
                  to="/profile" 
                  className="flex items-center space-x-1 px-2 py-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <FaUser className="text-base" />
                  <span className="text-sm font-medium hidden xl:inline">{farmer?.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <FaSignOutAlt className="text-sm" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              {/* Language Selector for Non-Authenticated Users */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-2 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-all">
                  <FaGlobe className="text-base" />
                  <span className="text-sm font-medium">{currentLanguage.flag}</span>
                </button>
                
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`w-full flex items-center space-x-2 px-3 py-2 hover:bg-primary-50 transition-colors first:rounded-t-lg last:rounded-b-lg text-sm ${
                        i18n.language === lang.code ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                      {i18n.language === lang.code && (
                        <span className="ml-auto text-primary-600 text-xs">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Link 
                to="/login" 
                className="px-4 py-2 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
              >
                {t('header.login')}
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg text-sm font-medium transition-colors shadow-md hover:shadow-lg"
              >
                {t('header.signUp')}
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-2xl text-gray-700 hover:text-primary-600 transition-colors"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {isAuthenticated ? (
                  <>
                    {/* User Info */}
                    <div className="px-4 py-3 bg-primary-50 rounded-lg mb-2">
                      <div className="flex items-center space-x-3">
                        <FaUser className="text-primary-600 text-xl" />
                        <div>
                          <p className="font-semibold text-gray-800">{farmer?.name}</p>
                          <p className="text-sm text-gray-600">{farmer?.farmerId}</p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={closeMobileMenu}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive(link.path)
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-700 hover:bg-primary-50'
                        }`}
                      >
                        <span className="text-xl">{link.icon}</span>
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    ))}

                    {/* Language Selector Mobile */}
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaGlobe className="text-primary-600" />
                        <span className="font-medium text-gray-700">Language</span>
                      </div>
                      <div className="space-y-1">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              changeLanguage(lang.code);
                              closeMobileMenu();
                            }}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                              i18n.language === lang.code 
                                ? 'bg-primary-600 text-white' 
                                : 'bg-white text-gray-700 hover:bg-primary-50'
                            }`}
                          >
                            <span className="text-xl">{lang.flag}</span>
                            <span className="font-medium">{lang.name}</span>
                            {i18n.language === lang.code && (
                              <span className="ml-auto">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <FaSignOutAlt className="text-xl" />
                      <span className="font-medium">{t('nav.logout') || 'Logout'}</span>
                    </button>
                  </>
                ) : (
                  <>
                    {/* Language Selector Mobile for Non-Authenticated */}
                    <div className="px-4 py-3 bg-gray-50 rounded-lg mb-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <FaGlobe className="text-primary-600" />
                        <span className="font-medium text-gray-700">Language</span>
                      </div>
                      <div className="space-y-1">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => {
                              changeLanguage(lang.code);
                            }}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                              i18n.language === lang.code 
                                ? 'bg-primary-600 text-white' 
                                : 'bg-white text-gray-700 hover:bg-primary-50'
                            }`}
                          >
                            <span className="text-xl">{lang.flag}</span>
                            <span className="font-medium">{lang.name}</span>
                            {i18n.language === lang.code && (
                              <span className="ml-auto">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 text-center bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-lg font-medium transition-colors"
                    >
                      {t('header.login')}
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 text-center bg-primary-600 text-white hover:bg-primary-700 rounded-lg font-medium transition-colors"
                    >
                      {t('header.signUp')}
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
