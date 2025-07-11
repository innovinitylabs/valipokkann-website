import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import About from './pages/About';
import Articles from './pages/Articles';
import ArticleView from './pages/ArticleView';
import Photography from './pages/Photography';
import Art from './pages/Art';
import Music from './pages/Music';
import Links from './pages/Links';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import Thirukkural from './pages/Thirukkural';
import Fusion from './pages/Fusion';
import Brahmamuhurtham from './pages/Fusion/Brahmamuhurtham';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuoteWidget from './components/QuoteWidget';
import Breadcrumbs from './components/Breadcrumbs';
import { useKonamiCode } from './utils/konami';

// Analytics wrapper component
const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Use gtag for page views
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-JGDQ4FE21R', {
        page_path: location.pathname + location.search
      });
    }
  }, [location]);

  return <>{children}</>;
};

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSiteBarrelRolling, setIsSiteBarrelRolling] = useState(false);

  // Move useKonamiCode to the top level
  const konami = useKonamiCode(() => {
    setIsSiteBarrelRolling(prev => !prev);
    console.log('Konami code entered! Barrel roll toggled.');
  });

  // Set dark mode as default and handle theme persistence
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    // Default to dark mode unless explicitly set to light
    const isDark = storedDarkMode === null || storedDarkMode === 'true';
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    // Only store if switching to light mode
    if (!newMode) {
      localStorage.setItem('darkMode', 'false');
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    } else {
      localStorage.removeItem('darkMode');
    }
    document.documentElement.classList.toggle('dark', newMode);
  };

  useEffect(() => {
    console.log('App mounted');
    konami.start();

    return () => {
      konami.stop();
    };
  }, []);

  return (
    <HelmetProvider>
      <Router basename="/" future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AnalyticsWrapper>
          <div className={`min-h-screen flex flex-col transition-transform duration-1000 ${isSiteBarrelRolling ? 'rotate-180' : ''}`}>
            <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/photography" element={<Photography />} />
                  <Route path="/art" element={<Art />} />
                  <Route path="/music" element={<Music />} />
                  <Route path="/articles" element={<Articles />} />
                  <Route path="/articles/:slug" element={<ArticleView />} />
                  <Route path="/links" element={<Links />} />
                  <Route path="/thirukkural" element={<Thirukkural />} />
                  <Route path="/fusion" element={<Fusion />} />
                  <Route path="/fusion/brahmamuhurtham" element={<Brahmamuhurtham />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AnimatePresence>
              <div className="container mx-auto px-4">
                <Breadcrumbs />
              </div>
            </main>
            <QuoteWidget />
            <Footer />
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed top-20 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50"
                >
                  <p className="text-sm">Light mode? I'm judging you... 👀</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AnalyticsWrapper>
      </Router>
    </HelmetProvider>
  );
}

export default App; 