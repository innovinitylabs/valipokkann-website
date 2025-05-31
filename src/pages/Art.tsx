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
    }
  ];

  const handleBarrelRoll = () => {
    setIsBarrelRolling(true);
    setTimeout(() => {
      setIsBarrelRolling(false);
    }, 1000);
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

  // Fullscreen modal drag for pan and rotate
  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Update pan based on drag delta
    setPan({ x: pan.x + info.delta.x, y: pan.y + info.delta.y });

    // Update rotation based on horizontal drag delta (simplified)
    const rotationSensitivity = 0.5; // Adjust sensitivity
    const newRotation = fullscreenRotation + info.delta.x * rotationSensitivity;
    setFullscreenRotation(newRotation);
    // Keep slider value within 0-360, handling negative results correctly
    setRotationSlider(((newRotation % 360) + 360) % 360); 
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
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
            title="அழகு ஒரு புரட்சி"
          >
            Special View
          </button>
        </div>

        <div 
          className={`transition-transform duration-1000 ${
            isBarrelRolling 
              ? 'animate-barrel-roll'
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
                {/* Ensured object-contain and proper container sizing */}
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
            // Click background does NOT close modal in fullscreen
          >
            {/* Fullscreen Image Container - occupies full modal space, allows drag and pan/rotate via framer-motion */}
            {/* Using onDrag to update both pan and rotation states */}
            <motion.div
               className="relative w-full h-full flex items-center justify-center cursor-grab"
               onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking image container
               drag
               dragConstraints={{ left: -Infinity, right: Infinity, top: -Infinity, bottom: Infinity }} // Allow dragging anywhere
               style={{ x: pan.x, y: pan.y, rotate: fullscreenRotation }} // Apply pan and rotation
               onDrag={(event, info) => handleDrag(event, info)} // Use custom handler for combined pan and rotate
            >
              {selectedArtwork.image && (
                 <motion.img 
                   src={selectedArtwork.image}
                   alt={selectedArtwork.title}
                   className="object-contain w-full h-full"
                   style={{ scale: zoom }} // Apply zoom
                 />
              )}
            </motion.div>

            {/* Fullscreen Controls (positioned on top) */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-50 bg-gray-800 bg-opacity-75 p-3 rounded-lg"
                 onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking controls
            >
               {/* Zoom Controls */}
               <button onClick={(e) => { e.stopPropagation(); handleZoom(1.1); }} className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">➕</button>
               <button onClick={(e) => { e.stopPropagation(); handleZoom(0.9); }} className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">➖</button>

               {/* Rotation Slider */}
               {/* Using rotationSlider state for slider value, updating fullscreenRotation */}              
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

             {/* Close Fullscreen Button (Top Right) */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-50"
              onClick={(e) => { e.stopPropagation(); closeModals(); }} // Ensure stopPropagation here too
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