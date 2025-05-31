import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Artwork {
  id: number;
  title: string;
  image: string;
  description: string;
  year: number;
}

const Art = () => {
  const [isBarrelRolling, setIsBarrelRolling] = useState(false);
  const [isUpsideDown, setIsUpsideDown] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [rotation, setRotation] = useState(0);
  const [dragStart, setDragStart] = useState<{x: number, y: number} | null>(null);
  const [dragRotation, setDragRotation] = useState(0);

  // Sample artwork data with logo as placeholder
  const artworks: Artwork[] = [
    {
      id: 1,
      title: 'Revolution in Color',
      image: '/valipokkann_transparent_logo.png',
      description: 'A vibrant exploration of cultural identity and resistance.',
      year: 2024
    },
    {
      id: 2,
      title: 'Echoes of Tradition',
      image: '/valipokkann_transparent_logo.png',
      description: 'Blending the old and new in a single frame.',
      year: 2023
    },
    {
      id: 3,
      title: 'Urban Pulse',
      image: '/valipokkann_transparent_logo.png',
      description: 'Capturing the rhythm of the city.',
      year: 2022
    },
    {
      id: 4,
      title: 'Dreams in Monsoon',
      image: '/valipokkann_transparent_logo.png',
      description: 'A journey through rain-soaked memories.',
      year: 2021
    },
    {
      id: 5,
      title: 'Roots and Wings',
      image: '/valipokkann_transparent_logo.png',
      description: 'Balancing heritage and aspiration.',
      year: 2020
    }
  ];

  const handleBarrelRoll = () => {
    setIsBarrelRolling(true);
    setTimeout(() => {
      setIsBarrelRolling(false);
      setIsUpsideDown(!isUpsideDown);
    }, 1000);
  };

  const handleArtworkClick = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setRotation(0);
    setDragRotation(0);
  };

  const handleRotate = (direction: 'left' | 'right') => {
    setRotation(prev => prev + (direction === 'left' ? -90 : 90));
    setDragRotation(0);
  };

  const handleReset = () => {
    setRotation(0);
    setDragRotation(0);
  };

  // Improved drag-to-rotate logic
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragStart) {
      const dx = e.clientX - dragStart.x;
      setDragRotation(dx / 2); // 2px = 1deg for smoother rotation
    }
  };

  const handleDragEnd = () => {
    setRotation(prev => prev + dragRotation);
    setDragStart(null);
    setDragRotation(0);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif">Art Gallery</h1>
          <button
            onClick={handleBarrelRoll}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
            title="அழகு ஒரு புரட்சி"
          >
            {isUpsideDown ? 'Normal View' : 'Special View'}
          </button>
        </div>

        <div 
          className={`transition-transform duration-1000 ${
            isBarrelRolling 
              ? (isUpsideDown ? 'animate-barrel-roll-reverse' : 'animate-barrel-roll')
              : ''
          } ${isUpsideDown ? 'rotate-180' : ''}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((artwork) => (
              <motion.div
                key={artwork.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
                onClick={() => handleArtworkClick(artwork)}
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <img src={artwork.image} alt={artwork.title} className="object-contain max-w-[60%] max-h-[60%] mx-auto my-auto" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{artwork.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{artwork.year}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="artwork-modal fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={() => setSelectedArtwork(null)}
          >
            <div
              className="relative w-full max-w-3xl md:max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-lg mx-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setSelectedArtwork(null)}
              >
                ✕
              </button>
              <div
                className="relative aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 cursor-grab flex items-center justify-center mb-4"
                style={{ userSelect: 'none', touchAction: 'none', transform: `rotate(${rotation + dragRotation}deg)` }}
                onMouseDown={handleDragStart}
                onMouseMove={dragStart ? handleDrag : undefined}
                onMouseUp={handleDragEnd}
                onMouseLeave={dragStart ? handleDragEnd : undefined}
              >
                <img src={selectedArtwork.image} alt={selectedArtwork.title} className="object-contain max-w-[70%] max-h-[70%] mx-auto my-auto" />
              </div>
              <div className="flex gap-2 justify-center mb-4">
                <button
                  onClick={() => handleRotate('left')}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  ↶
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  ⟳
                </button>
                <button
                  onClick={() => handleRotate('right')}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  ↷
                </button>
              </div>
              <div className="mt-4">
                <h2 className="text-2xl font-serif mb-2">{selectedArtwork.title}</h2>
                <p className="text-gray-600 dark:text-gray-400">{selectedArtwork.description}</p>
                <p className="text-sm text-gray-500 mt-2">{selectedArtwork.year}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Art; 