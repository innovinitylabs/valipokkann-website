import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface Artwork {
  id: number;
  title: string;
  image: string;
  description: string;
  year: number;
}

const Art = () => {
  const [isBarrelRolling, setIsBarrelRolling] = useState(false);
  const [modalView, setModalView] = useState<'closed' | 'details' | 'fullscreen'>('closed');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [detailsRotation, setDetailsRotation] = useState(0);
  const [fullscreenRotation, setFullscreenRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotationSlider, setRotationSlider] = useState(0);

  // Sample artwork data with logo as placeholder
  const artworks: Artwork[] = [
    {
      id: 1,
      title: 'Revolution in Color',
      image: 'valipokkann_transparent_logo.png',
      description: 'A vibrant exploration of cultural identity and resistance.',
      year: 2024
    },
    {
      id: 2,
      title: 'Echoes of Tradition',
      image: 'valipokkann_transparent_logo.png',
      description: 'Blending the old and new in a single frame.',
      year: 2023
    },
    {
      id: 3,
      title: 'Urban Pulse',
      image: 'valipokkann_transparent_logo.png',
      description: 'Capturing the rhythm of the city.',
      year: 2022
    },
    {
      id: 4,
      title: 'Dreams in Monsoon',
      image: 'valipokkann_transparent_logo.png',
      description: 'A journey through rain-soaked memories.',
      year: 2021
    },
    {
      id: 5,
      title: 'Roots and Wings',
      image: 'valipokkann_transparent_logo.png',
      description: 'Balancing heritage and aspiration.',
      year: 2020
    },
    {
      id: 6,
      title: 'Vertical Test',
      image: 'artworks/vertical_test.jpg',
      description: 'Testing vertical image display and aspect ratio handling.',
      year: 2024
    }
  ];

  const handleBarrelRoll = () => {
    setIsBarrelRolling(prev => !prev);
  };

  const openDetailsModal = (artwork: Artwork) => {
    console.log('Artwork clicked:', artwork); // Debug log
    setSelectedArtwork(artwork);
    setDetailsRotation(0);
    setModalView('details');
  };

  const openFullscreenModal = () => {
    setModalView('fullscreen');
    // Optionally reset fullscreen states here or keep previous values
    // setFullscreenRotation(0); 
    // setZoom(1); 
    // setPan({ x: 0, y: 0 }); 
    // setRotationSlider(0);
  };

  const closeModals = () => {
    setModalView('closed');
    setSelectedArtwork(null);
    // Reset states when closing entirely
    setDetailsRotation(0);
    setFullscreenRotation(0);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setRotationSlider(0);
  };

  // Details modal rotation
  const handleDetailsRotate = (direction: 'left' | 'right') => {
    setDetailsRotation(prev => prev + (direction === 'left' ? -90 : 90));
  };

  const handleDetailsReset = () => {
    setDetailsRotation(0);
  };

  // Fullscreen modal drag for pan
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Use velocity for smoother movement
    const velocity = info.velocity;
    const delta = info.delta;
    
    // Calculate new position with constraints
    const newX = Math.max(-300, Math.min(300, pan.x + delta.x));
    const newY = Math.max(-300, Math.min(300, pan.y + delta.y));
    
    setPan({ x: newX, y: newY });
  };

  // Fullscreen modal slider rotation
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = parseInt(e.target.value, 10);
    setRotationSlider(sliderValue);
    setFullscreenRotation(sliderValue); // Slider directly controls rotation
  };

  // Fullscreen modal zoom
  const handleZoom = (factor: number) => {
    setZoom(prev => {
      const newZoom = prev * factor;
      // Prevent zooming out too much, allow zooming in significantly
      return Math.max(0.1, Math.min(10, newZoom)); 
    });
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif">Art Gallery</h1>
          <button
            onClick={handleBarrelRoll}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              isBarrelRolling 
                ? 'bg-primary-dark text-white' 
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
            title="அழகு ஒரு புரட்சி"
          >
            {isBarrelRolling ? 'Normal View' : 'Special View'}
          </button>
        </div>

        <div 
          className={`transition-all duration-1000 ${
            isBarrelRolling 
              ? 'rotate-180'
              : ''
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((artwork) => (
              <motion.div
                key={artwork.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
                onClick={() => openDetailsModal(artwork)}
              >
                {/* Image container in gallery view */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <img 
                    src={artwork.image} 
                    alt={artwork.title} 
                    className="object-contain w-full h-full"
                  />
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

      {/* Details Modal */}
      <AnimatePresence>
        {modalView === 'details' && selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={closeModals} // Close modal on background click
          >
            <div
              className="relative w-full max-w-3xl md:max-w-4xl bg-white dark:bg-gray-800 p-6 rounded-lg mx-2"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
            >
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={(e) => { e.stopPropagation(); closeModals(); }}
              >
                ✕
              </button>
              
              <div className="flex flex-col items-center">
                {/* Image Display Area - Clickable to go fullscreen */}
                {/* Adjusted container and image classes for better fitting */}
                <div
                  className="relative w-full max-h-[60vh] mb-4 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); openFullscreenModal(); }}
                >
                  {selectedArtwork.image && (
                    <img 
                      src={selectedArtwork.image} 
                      alt={selectedArtwork.title} 
                      className="object-contain w-full h-full"
                      style={{ 
                        transform: `rotate(${detailsRotation}deg)`,
                        userSelect: 'none',
                        touchAction: 'none'
                      }}
                    />
                  )}
                </div>

                {/* Rotation and Reset buttons for Details view */}
                <div className="flex gap-2 justify-center mb-4"
                     onClick={(e) => e.stopPropagation()} // Prevent closing when clicking controls
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDetailsRotate('left'); }}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    ↶
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDetailsReset(); }}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    ⟳
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDetailsRotate('right'); }}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    ↷
                  </button>
                </div>

                {/* Artwork details */}
                <div className="w-full text-center"
                     onClick={(e) => e.stopPropagation()} // Prevent closing when clicking details
                >
                  <h2 className="text-2xl font-serif mb-2">{selectedArtwork.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">{selectedArtwork.description}</p>
                  <p className="text-sm text-gray-500">{selectedArtwork.year}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {modalView === 'fullscreen' && selectedArtwork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            {/* Fullscreen Image Container */}
            <motion.div
              className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
              onClick={(e) => e.stopPropagation()}
              drag
              dragMomentum={true}
              dragElastic={0.1}
              dragConstraints={{
                left: -300,
                right: 300,
                top: -300,
                bottom: 300
              }}
              onDrag={handleDrag}
              whileDrag={{ cursor: 'grabbing' }}
              style={{
                x: pan.x,
                y: pan.y,
                rotate: fullscreenRotation,
                scale: zoom,
                touchAction: 'none',
                userSelect: 'none'
              }}
            >
              {selectedArtwork.image && (
                <motion.img 
                  src={selectedArtwork.image}
                  alt={selectedArtwork.title}
                  className="object-contain w-full h-full"
                  drag={false}
                  style={{ 
                    touchAction: 'none',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}
                />
              )}
            </motion.div>

            {/* Fullscreen Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-50 bg-gray-800 bg-opacity-75 p-3 rounded-lg"
                 onClick={(e) => e.stopPropagation()}
            >
               {/* Zoom Controls */}
               <button onClick={(e) => { e.stopPropagation(); handleZoom(1.1); }} className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">➕</button>
               <button onClick={(e) => { e.stopPropagation(); handleZoom(0.9); }} className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">➖</button>

               {/* Rotation Slider */}
               <input 
                 type="range"
                 min="-360"
                 max="360"
                 value={rotationSlider}
                 onChange={(e) => { 
                   e.stopPropagation();
                   handleSliderChange(e);
                 }}
                 className="w-32"
               />

               {/* Reset Rotation/Zoom/Pan */}
               <button onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenRotation(0);
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                  setRotationSlider(0);
               }} className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">⟳</button>
            </div>

            {/* Close Fullscreen Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-50"
              onClick={(e) => { e.stopPropagation(); closeModals(); }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Art; 