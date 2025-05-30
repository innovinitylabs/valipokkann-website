import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="quote-widget">
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
    </div>
  );
};

export default QuoteWidget; 