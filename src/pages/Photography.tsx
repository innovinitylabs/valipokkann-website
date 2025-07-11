import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import yaml from 'js-yaml';
import StructuredData from '../components/StructuredData';
import { Helmet } from 'react-helmet-async';

const FALLBACK_IMAGE = '/valipokkann_transparent_logo.png';

interface Photograph {
  id: string;
  title?: string;
  description?: string;
  year: number;
  dateTaken?: string; // Assuming datetime widget outputs string
  image: string; // path to the image file
  make?: string;
  model?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  lens?: string;
  tags?: string[];
  mintDate?: string;
  blockchain?: string;
  contractAddress?: string;
  tokenId?: string;
  priceEth?: number;
  links?: LinkItem[];
  defaultBackgroundColor?: 'black' | 'white';
  thumbnail: string;
  blurDataUrl?: string;
}

interface LinkItem {
  label: string;
  url: string;
}

const Photography = () => {
  const [modalView, setModalView] = useState<'closed' | 'details' | 'fullscreen'>('closed');
  const [selectedPhotograph, setSelectedPhotograph] = useState<Photograph | null>(null);
  const [fullscreenRotation, setFullscreenRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const [rotationSlider, setRotationSlider] = useState(0);
  const [photographsByYear, setPhotographsByYear] = useState<{ year: number; photographs: Photograph[] }[]>([]);
  const [backgroundColor, setBackgroundColor] = useState<'black' | 'white'>('black');
  const [isLoading, setIsLoading] = useState(true);
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState<number | null>(null);

  // --- Data Loading --- //
  useEffect(() => {
    async function loadPhotographs() {
      setIsLoading(true);
      try {
        const modules = import.meta.glob('/src/data/photography/*.md', {
          eager: true,
          as: 'raw'
        });
        console.log('Loaded photography modules:', modules);
        const loadedPhotographs: Photograph[] = [];

        for (const path in modules) {
          const content = modules[path] as string;
          const parts = content.split('---');
          const frontmatterStr = parts[1];

          if (frontmatterStr && frontmatterStr.trim() !== '') {
            try {
              const frontmatter = yaml.load(frontmatterStr.trim()) as Photograph;
              console.log(`Processing photograph from ${path}:`, frontmatter);
              
              // Validate required fields
              if (!frontmatter.year || !frontmatter.image) {
                console.warn(`Skipping ${path}: Missing required fields (year or image)`);
                continue;
              }

              // Ensure year is a number
              const year = typeof frontmatter.year === 'string' ? parseInt(frontmatter.year, 10) : frontmatter.year;
              if (isNaN(year)) {
                console.warn(`Skipping ${path}: Invalid year value`);
                continue;
              }

              const photograph: Photograph = {
                ...frontmatter,
                id: path.replace('/src/data/photography/', '').replace('.md', ''),
                year,
                image: frontmatter.image || FALLBACK_IMAGE,
                thumbnail: frontmatter.thumbnail || frontmatter.image || FALLBACK_IMAGE,
                mintDate: frontmatter.mintDate,
                blockchain: frontmatter.blockchain,
                contractAddress: frontmatter.contractAddress,
                tokenId: frontmatter.tokenId,
                priceEth: frontmatter.priceEth,
                links: frontmatter.links,
                defaultBackgroundColor: frontmatter.defaultBackgroundColor || 'black',
              };

              console.log('Processed photograph:', photograph);
              loadedPhotographs.push(photograph);
            } catch (error) {
              console.error(`Error parsing frontmatter for ${path}:`, error);
            }
          }
        }

        console.log('All loaded photographs:', loadedPhotographs);

        // Sort by year (newest first)
        loadedPhotographs.sort((a, b) => b.year - a.year);

        // Group by year
        const photographsByYear: { [year: number]: Photograph[] } = {};
        loadedPhotographs.forEach(photograph => {
          if (!photographsByYear[photograph.year]) {
            photographsByYear[photograph.year] = [];
          }
          photographsByYear[photograph.year].push(photograph);
        });

        // Convert to array format and sort by year
        const groupedPhotographsArray = Object.entries(photographsByYear)
          .map(([year, photographs]) => ({
            year: parseInt(year, 10),
            photographs: photographs || []
          }))
          .sort((a, b) => b.year - a.year);

        console.log('Grouped photographs by year:', groupedPhotographsArray);
        setPhotographsByYear(groupedPhotographsArray);
      } catch (error) {
        console.error('Error loading photographs:', error);
        setPhotographsByYear([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadPhotographs();
  }, []);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModals();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  const openDetailsModal = (photograph: Photograph) => {
    setSelectedPhotograph(photograph);
    setBackgroundColor(photograph.defaultBackgroundColor || 'black');
    setModalView('details');
  };

  const openFullscreenModal = () => {
    setModalView('fullscreen');
  };

  const closeModals = () => {
    setModalView('closed');
    setSelectedPhotograph(null);
    setFullscreenRotation(0);
    setZoom(1);
    setRotationSlider(0);
  };

  const handleDrag = () => {
    // Framer motion updates panX and panY directly
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = parseInt(e.target.value, 10);
    setRotationSlider(sliderValue);
    setFullscreenRotation(sliderValue);
  };

  const handleZoom = (factor: number) => {
    setZoom(prev => {
      const newZoom = prev * factor;
      return Math.max(0.1, Math.min(10, newZoom));
    });
  };

  // Function to calculate distance between two touch points
  const getPinchDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Handle touch events for pinch zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = getPinchDistance(e.touches[0], e.touches[1]);
      setInitialPinchDistance(distance);
      setInitialZoom(zoom);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialPinchDistance !== null && initialZoom !== null) {
      e.preventDefault();
      const currentDistance = getPinchDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialPinchDistance;
      const newZoom = initialZoom * scale;
      setZoom(Math.max(0.1, Math.min(10, newZoom)));
    }
  };

  const handleTouchEnd = () => {
    setInitialPinchDistance(null);
    setInitialZoom(null);
  };

  const photographyCollectionData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "VALIPOKKANN Photography Gallery",
    "description": "Explore VALIPOKKANN's photography collection - capturing moments that blend traditional Tamil aesthetics with contemporary vision. Each photograph tells a story of cultural heritage and modern expression.",
    "url": "https://valipokkann.com/photography",
    "author": {
      "@type": "Person",
      "name": "VALIPOKKANN",
      "alternateName": "வழிப்போக்கன்"
    },
    "about": {
      "@type": "Thing",
      "name": "Photography",
      "description": "Contemporary photography exploring Tamil culture and modern expression"
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Helmet>
        <title>Photography Gallery | VALIPOKKANN</title>
        <meta name="description" content="Explore VALIPOKKANN's photography collection - capturing moments that blend traditional Tamil aesthetics with contemporary vision. Each photograph tells a story of cultural heritage and modern expression." />
        <meta name="keywords" content="VALIPOKKANN, photography, Tamil photography, contemporary photography, art photography, digital photography, photo gallery" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Photography Gallery | VALIPOKKANN" />
        <meta property="og:description" content="Explore VALIPOKKANN's photography collection - capturing moments that blend traditional Tamil aesthetics with contemporary vision. Each photograph tells a story of cultural heritage and modern expression." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://valipokkann.com/photography" />
        <meta property="og:image" content="/valipokkann_transparent_logo.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Photography Gallery | VALIPOKKANN" />
        <meta name="twitter:description" content="Explore VALIPOKKANN's photography collection - capturing moments that blend traditional Tamil aesthetics with contemporary vision. Each photograph tells a story of cultural heritage and modern expression." />
        <meta name="twitter:image" content="/valipokkann_transparent_logo.png" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://valipokkann.com/photography" />
      </Helmet>
      
      <StructuredData type="website" data={photographyCollectionData} />
      {selectedPhotograph && (
        <StructuredData
          type="photography"
          data={selectedPhotograph}
        />
      )}
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-serif mb-8">Photography</h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
            </div>
          ) : photographsByYear.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-400 py-12">
              No photographs found.
            </div>
          ) : (
            photographsByYear.map(({ year, photographs }) => (
              <div key={year} className="mb-0 relative">
                <h2 className="text-xl font-serif absolute right-full top-0 mt-0 mr-2 text-gray-700 dark:text-gray-300 sticky top-12 z-10">
                  {year}
                </h2>
                <div className="ml-16">
                  <div className="border-b border-gray-400 dark:border-gray-500 mb-2 pb-0 relative">
                    <div className="absolute left-0 top-0 h-full w-1 bg-gray-400 dark:bg-gray-500"></div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {Array.isArray(photographs) && photographs.length > 0 ? (
                      photographs.map((photo) => (
                        <motion.div
                          key={photo.id}
                          className="relative aspect-square overflow-hidden cursor-pointer group"
                          onClick={() => openDetailsModal(photo)}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <img
                            src={photo.image}
                            alt={photo.title || `Photo ${photo.id}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = FALLBACK_IMAGE;
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                        </motion.div>
                      ))
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {modalView === 'details' && selectedPhotograph && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
              onClick={closeModals}
            >
              <div
                className="relative w-full max-w-3xl md:max-w-4xl bg-neutral-950 dark:bg-neutral-900 p-6 rounded-lg mx-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={(e) => { e.stopPropagation(); closeModals(); }}
                >
                  ✕
                </button>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image Area (Clickable) */}
                  <div
                    className="flex-shrink-0 w-full md:w-1/2 lg:w-2/3 max-h-[60vh] overflow-hidden bg-black dark:bg-black rounded-lg flex items-center justify-center cursor-pointer relative"
                    onClick={(e) => { e.stopPropagation(); openFullscreenModal(); }}
                  >
                    <img
                      src={selectedPhotograph.image}
                      alt={selectedPhotograph.title || 'Untitled'}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = FALLBACK_IMAGE;
                      }}
                      className="object-contain w-full h-full"
                      style={{ 
                        backgroundColor: backgroundColor
                      }}
                    />
                    {/* Toggle Background Color Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setBackgroundColor(backgroundColor === 'black' ? 'white' : 'black'); }}
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-transform duration-300 hover:scale-110"
                    >
                      {backgroundColor === 'black' ? '☀️' : '🌙'}
                    </button>
                    {/* Fullscreen Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); openFullscreenModal(); }}
                      className="absolute bottom-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-transform duration-300 hover:scale-110"
                    >
                      ⛶
                    </button>
                  </div>

                  {/* Details Text Area */}
                  <div className="flex-grow w-full md:w-1/2 lg:w-1/3 overflow-y-auto max-h-[60vh] pr-2">
                    <h2 className="text-3xl font-serif mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">{selectedPhotograph.title || 'Untitled'}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedPhotograph.description}</p>

                    {/* Core Details */}
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      <p><strong>Year:</strong> {selectedPhotograph.year}</p>
                      {selectedPhotograph.dateTaken && <p><strong>Date Taken:</strong> {new Date(selectedPhotograph.dateTaken).toLocaleDateString()}</p>}
                      {selectedPhotograph.make && <p><strong>Make:</strong> {selectedPhotograph.make}</p>}
                      {selectedPhotograph.model && <p><strong>Model:</strong> {selectedPhotograph.model}</p>}
                      {selectedPhotograph.focalLength && <p><strong>Focal Length:</strong> {selectedPhotograph.focalLength}</p>}
                      {selectedPhotograph.aperture && <p><strong>Aperture:</strong> {selectedPhotograph.aperture}</p>}
                      {selectedPhotograph.shutterSpeed && <p><strong>Shutter Speed:</strong> {selectedPhotograph.shutterSpeed}</p>}
                      {selectedPhotograph.iso !== undefined && <p><strong>ISO:</strong> {selectedPhotograph.iso}</p>}
                      {selectedPhotograph.lens && <p><strong>Lens:</strong> {selectedPhotograph.lens}</p>}
                      {selectedPhotograph.mintDate && <p><strong>Mint Date:</strong> {new Date(selectedPhotograph.mintDate).toLocaleDateString()}</p>}
                      {selectedPhotograph.blockchain && <p><strong>Blockchain:</strong> {selectedPhotograph.blockchain}</p>}
                      {selectedPhotograph.contractAddress && <p><strong>Contract Address:</strong> {selectedPhotograph.contractAddress}</p>}
                      {selectedPhotograph.tokenId && <p><strong>Token ID:</strong> {selectedPhotograph.tokenId}</p>}
                      {selectedPhotograph.priceEth !== undefined && selectedPhotograph.priceEth > 0 && <p><strong>Price:</strong> {selectedPhotograph.priceEth} ETH</p>}
                    </div>

                    {selectedPhotograph.tags && selectedPhotograph.tags.length > 0 && (
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        <p className="font-bold mb-1">Tags:</p>
                        <ul className="list-disc list-inside">
                          {selectedPhotograph.tags.map((tag, index) => (
                            <li key={index}>{tag}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedPhotograph.links && selectedPhotograph.links.length > 0 && (
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        <p className="font-bold mb-1">Links:</p>
                        <ul className="list-disc list-inside">
                          {selectedPhotograph.links.map((link, index) => (
                            <li key={index}><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{link.label}</a></li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Right click save button - only if there's an image */}
                    {selectedPhotograph.image && (
                       <div className="text-center mt-4 relative group">
                         <a 
                           href={selectedPhotograph.image}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="px-3 py-1 bg-neutral-900 text-white rounded-full text-sm hover:bg-neutral-800 transition-colors duration-200 inline-block"
                         >
                           💾 Save
                         </a>
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-2 bg-neutral-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                           right click save for the culture
                         </div>
                       </div>
                     )}

                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fullscreen Modal */}
        <AnimatePresence>
          {modalView === 'fullscreen' && selectedPhotograph && (
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
                  left: -1000,
                  right: 1000,
                  top: -1000,
                  bottom: 1000
                }}
                onDrag={handleDrag}
                whileDrag={{ cursor: 'grabbing' }}
                animate={{
                  rotate: fullscreenRotation,
                  scale: zoom,
                }}
                style={{
                  x: panX,
                  y: panY,
                  touchAction: 'none',
                  userSelect: 'none',
                  backgroundColor: backgroundColor
                }}
                onWheel={(e) => {
                  e.preventDefault();
                  const zoomFactor = e.deltaY > 0 ? 0.95 : 1.05;
                  handleZoom(zoomFactor);
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <motion.img
                  src={selectedPhotograph.image}
                  alt={selectedPhotograph.title || 'Untitled'}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = FALLBACK_IMAGE;
                  }}
                  className="object-contain w-full h-full"
                  drag={false}
                  style={{
                    touchAction: 'none',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}
                />
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
                    setRotationSlider(0);
                    animate(panX, 0, { duration: 0.3 });
                    animate(panY, 0, { duration: 0.3 });
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
    </div>
  );
};

export default Photography; 