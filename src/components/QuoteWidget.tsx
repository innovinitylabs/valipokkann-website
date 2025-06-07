import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable from 'react-draggable';
import tamilQuotes from '../data/quotes/tamil.json';
import thirukkuralData from '../data/quotes/thirukkural.json';

interface Quote {
  text: string;
  translation?: string;
  transliteration?: string;
  source: string;
  explanation?: string;
}

const QuoteWidget: React.FC = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  useEffect(() => {
    // Get 10 random Thirukkural couplets
    const randomThirukkural = [...thirukkuralData]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map(kural => ({
        text: kural.text,
        translation: kural.translation,
        transliteration: kural.transliteration,
        source: kural.source,
        explanation: kural.explanation
      }));

    // Combine with other Tamil quotes
    const allQuotes = [...randomThirukkural, ...tamilQuotes];
    
    // Shuffle the combined quotes
    const shuffledQuotes = allQuotes.sort(() => Math.random() - 0.5);
    setQuotes(shuffledQuotes);
  }, []);

  const nextQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  const prevQuote = () => {
    setCurrentIndex((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const handleDragStop = (_: any, data: { x: number; y: number }) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleClick = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      nextQuote();
    }
  };

  if (quotes.length === 0) return null;

  const currentQuote = quotes[currentIndex];

  return (
    <Draggable
      position={position}
      onStop={handleDragStop}
      bounds="parent"
      handle=".drag-handle"
      nodeRef={nodeRef}
    >
      <div ref={nodeRef} className={`fixed bottom-4 right-4 z-50 ${isMinimized ? 'cursor-pointer' : ''}`}>
        <AnimatePresence mode="wait">
          {isMinimized ? (
            <motion.div
              key="minimized"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-12 h-12 rounded-full bg-neutral-900 dark:bg-neutral-800 shadow-lg flex items-center justify-center relative group overflow-hidden"
              onClick={handleClick}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neutral-800/20 to-neutral-700/10 dark:from-neutral-700/20 dark:to-neutral-600/10 group-hover:from-neutral-800/30 group-hover:to-neutral-700/20 dark:group-hover:from-neutral-700/30 dark:group-hover:to-neutral-600/20 transition-all duration-200" />
              <div className="relative w-8 h-8 flex items-center justify-center">
                <img
                  src="/ayutham.webp"
                  alt="Ayutham"
                  className="absolute inset-0 w-8 h-8 object-contain mx-auto my-auto transition-opacity duration-200 group-hover:opacity-0"
                  style={{ pointerEvents: 'none' }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-base text-white font-serif opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none px-3 py-1 rounded-full bg-white/80">
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
              className="quote-widget relative cursor-move w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            >
              <div className="drag-handle absolute inset-0"></div>
              <div className="p-4 pb-12 pt-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-2"
                  >
                    <p className="text-lg font-tamil">{currentQuote.text}</p>
                    {currentQuote.transliteration && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {currentQuote.transliteration}
                      </p>
                    )}
                    {currentQuote.translation && (
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {currentQuote.translation}
                      </p>
                    )}
                    {currentQuote.explanation && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {currentQuote.explanation}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      - {currentQuote.source}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                onClick={prevQuote}
                className="absolute bottom-4 left-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                ←
              </button>
              <button
                onClick={nextQuote}
                className="absolute bottom-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
              >
                →
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Draggable>
  );
};

export default QuoteWidget; 