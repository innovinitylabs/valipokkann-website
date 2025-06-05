import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable from 'react-draggable';

interface Quote {
  text: string;
  translation: string;
  transliteration: string;
  source: string;
}

const quotes: Quote[] = [
  {
    text: 'அழகு ஒரு புரட்சி',
    translation: 'Beauty is a revolution',
    transliteration: 'Azhagu oru puraṭci',
    source: 'Valipokkann'
  },
  {
    text: 'கற்றது கை மண் அளவு, கல்லாதது உலகளவு',
    translation: 'What we know is a handful of sand, what we don\'t know is the size of the world',
    transliteration: 'Kaṟṟatu kai maṇ aḷavu, kallātu ulakaḷavu',
    source: 'Thirukkural'
  },
  // Add more quotes here
];

const QuoteWidget = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isMinimized) {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [isMinimized]);

  const handleDragStop = (e: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleClick = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }
  };

  return (
    <Draggable
      position={position}
      onStop={handleDragStop}
      bounds="parent"
      handle=".drag-handle"
    >
      <div className={`fixed bottom-4 right-4 z-50 ${isMinimized ? 'cursor-pointer' : ''}`}>
        <AnimatePresence mode="wait">
          {isMinimized ? (
            <motion.div
              key="minimized"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-12 h-12 rounded-full bg-primary dark:bg-primary-dark shadow-lg flex items-center justify-center relative group overflow-hidden"
              onClick={handleClick}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary-dark/20 dark:to-primary-dark/10 group-hover:from-primary/30 group-hover:to-primary/20 dark:group-hover:from-primary-dark/30 dark:group-hover:to-primary-dark/20 transition-all duration-200" />
              <div className="relative w-8 h-8 flex items-center justify-center">
                <img
                  src="/ayutham.webp"
                  alt="Ayutham"
                  className="absolute inset-0 w-8 h-8 object-contain mx-auto my-auto transition-opacity duration-200 group-hover:opacity-0"
                  style={{ pointerEvents: 'none' }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-base text-black font-serif opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none px-3 py-1 rounded-full bg-white/80">
                  தமிழ்
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="quote-widget cursor-move"
              onClick={handleClick}
            >
              <div className="drag-handle">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuote}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-2"
                  >
                    <p className="text-lg font-serif">{quotes[currentQuote].text}</p>
                    <p className="text-sm italic">{quotes[currentQuote].transliteration}</p>
                    <p className="text-sm">{quotes[currentQuote].translation}</p>
                    <p className="text-xs text-gray-500">— {quotes[currentQuote].source}</p>
                  </motion.div>
                </AnimatePresence>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(true);
                  }}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Draggable>
  );
};

export default QuoteWidget; 