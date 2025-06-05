import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuoteWidget from './components/QuoteWidget';
import Home from './pages/Home';
import Art from './pages/Art';
import Articles from './pages/Articles';
import Music from './pages/Music';
import About from './pages/About';
import Links from './pages/Links';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { useKonamiCode } from './utils/konami';

function App() {
  // App component main function
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSiteBarrelRolling, setIsSiteBarrelRolling] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === null ? true : localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
    
    if (!newMode) {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    }
  };

  useEffect(() => {
    console.log('App mounted');
    const konami = useKonamiCode(() => {
      setIsSiteBarrelRolling(prev => !prev);
      // Optional: Add a visual cue or log here when Konami code is entered
      console.log('Konami code entered! Barrel roll toggled.');
    });

    konami.start();

    return () => {
      konami.stop();
    };
  }, []);

  return (
    <Router basename="/">
      <div className={`min-h-screen flex flex-col transition-transform duration-1000 ${isSiteBarrelRolling ? 'rotate-180' : ''}`}>
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/art" element={<Art />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/music" element={<Music />} />
              <Route path="/about" element={<About />} />
              <Route path="/links" element={<Links />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
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
    </Router>
  );
}

export default App; 