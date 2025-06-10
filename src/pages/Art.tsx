import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, animate } from 'framer-motion';
import yaml from 'js-yaml';
import StructuredData from '../components/StructuredData';
import { Helmet } from 'react-helmet-async';

const FALLBACK_IMAGE = '/valipokkann_transparent_logo.png';

interface LinkItem {
  label: string;
  url: string;
}

interface PressMention {
  title: string;
  url: string;
}

interface Artwork {
  id: string;
  title?: string;
  description?: string;
  year: number;
  createdDate?: string;
  mintDate?: string;
  medium?: string;
  dimensions?: string;
  editionSize?: number;
  blockchain?: string;
  contractAddress?: string;
  tokenId?: string;
  exhibitedAt?: string;
  collectedBy?: string;
  traits?: string[];
  image: string;
  thumbnail: string;
  fullImage?: string;
  video?: string;
  audio?: string;
  processImages?: string[];
  artistNotes?: string;
  pressMentions?: PressMention[];
  license?: string;
  priceEth?: number;
  links?: LinkItem[];
  defaultBackgroundColor?: 'black' | 'white';
  blurDataUrl?: string;
}

const Art = () => {
  const [isBarrelRolling, setIsBarrelRolling] = useState(false);
  const [modalView, setModalView] = useState<'closed' | 'details' | 'fullscreen'>('closed');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [detailsRotation, setDetailsRotation] = useState(0);
  const [fullscreenRotation, setFullscreenRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);
  const [rotationSlider, setRotationSlider] = useState(0);
  const [artworksByYear, setArtworksByYear] = useState<{ year: number; artworks: Artwork[] }[]>([]);
  const [backgroundColor, setBackgroundColor] = useState<'black' | 'white'>('black');
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [initialZoom, setInitialZoom] = useState<number | null>(null);

  // --- Data Loading --- //
  useEffect(() => {
    async function loadArtworks() {
      const modules = import.meta.glob('/src/data/artwork/*.md', { 
        eager: true,
        as: 'raw'
      });
      console.log('Loaded artwork modules:', modules);
      const loadedArtworks: Artwork[] = [];

      for (const path in modules) {
        const content = modules[path] as string;
        console.log(`Processing content from ${path}:`, content);
        const parts = content.split('---');
        const frontmatterStr = parts[1];

        if (frontmatterStr && frontmatterStr.trim() !== '') {
          try {
            const frontmatter = yaml.load(frontmatterStr.trim()) as Artwork;
            console.log(`Parsed frontmatter for ${path}:`, frontmatter);

            // Validate required fields
            if (!frontmatter.year) {
              console.warn(`Skipping ${path}: Missing required field (year)`);
              continue;
            }

            const artwork: Artwork = {
              ...frontmatter,
              id: path.replace('/src/data/artwork/', '').replace('.md', ''),
              thumbnail: frontmatter.thumbnail || frontmatter.fullImage || FALLBACK_IMAGE,
              fullImage: frontmatter.fullImage || frontmatter.thumbnail || FALLBACK_IMAGE,
              defaultBackgroundColor: frontmatter.defaultBackgroundColor || 'black',
            };

            console.log('Processed artwork:', artwork);
            loadedArtworks.push(artwork);
          } catch (error) {
            console.error(`Error parsing frontmatter for ${path}:`, error);
          }
        }
      }

      console.log('All loaded artworks:', loadedArtworks);

      // Sort artworks by year
      loadedArtworks.sort((a, b) => b.year - a.year);

      // Group artworks by year
      const artworksByYear: { [year: number]: Artwork[] } = {};
      loadedArtworks.forEach(artwork => {
        if (!artworksByYear[artwork.year]) {
          artworksByYear[artwork.year] = [];
        }
        artworksByYear[artwork.year].push(artwork);
      });

      // Convert to array format and sort by year
      const groupedArtworksArray = Object.entries(artworksByYear)
        .map(([year, artworks]) => ({
          year: parseInt(year, 10),
          artworks: artworks || []
        }))
        .sort((a, b) => b.year - a.year);

      console.log('Grouped artworks by year:', groupedArtworksArray);
      setArtworksByYear(groupedArtworksArray);
    }

    loadArtworks();
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

  const handleBarrelRoll = () => {
    setIsBarrelRolling(prev => !prev);
  };

  const openDetailsModal = (artwork: Artwork) => {
    console.log('Artwork clicked:', artwork); // Debug log
    setSelectedArtwork(artwork);
    setDetailsRotation(0);
    setBackgroundColor(artwork.defaultBackgroundColor || 'black'); // Set initial background color
    setModalView('details');
  };

  const openFullscreenModal = () => {
    setModalView('fullscreen');
  };

  const closeModals = () => {
    setModalView('closed');
    setSelectedArtwork(null);
    setDetailsRotation(0);
    setFullscreenRotation(0);
    setZoom(1);
    setRotationSlider(0);
  };

  const handleDetailsRotate = (direction: 'left' | 'right') => {
    setDetailsRotation(prev => prev + (direction === 'left' ? -90 : 90));
  };

  const handleDetailsReset = () => {
    setDetailsRotation(0);
  };

  const handleDrag = () => {
    // Framer motion updates panX and panY directly
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sliderValue = parseInt(e.target.value, 10);
    setRotationSlider(sliderValue);
    setFullscreenRotation(sliderValue); // Slider directly controls rotation
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
      const currentDistance = getPinchDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialPinchDistance;
      setZoom(initialZoom * scale);
    }
  };

  const handleTouchEnd = () => {
    setInitialPinchDistance(null);
    setInitialZoom(null);
  };

  const artworkCollectionData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "VALIPOKKANN Art Gallery",
    "description": "Explore VALIPOKKANN's digital art collection - raw, figurative-abstract works that challenge conventional aesthetics and explore the intersection of traditional Tamil philosophy with contemporary expression.",
    "url": "https://valipokkann.com/art",
    "author": {
      "@type": "Person",
      "name": "VALIPOKKANN",
      "alternateName": "வழிப்போக்கன்"
    },
    "about": {
      "@type": "Thing",
      "name": "Contemporary Art",
      "description": "Digital and figurative-abstract art exploring Tamil philosophy and modern expression"
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Helmet>
        <title>Art Gallery | VALIPOKKANN</title>
        <meta name="description" content="Explore VALIPOKKANN's digital art collection - raw, figurative-abstract works that challenge conventional aesthetics and explore the intersection of traditional Tamil philosophy with contemporary expression." />
        <meta name="keywords" content="VALIPOKKANN, digital art, figurative-abstract art, Tamil art, contemporary art, art gallery, digital artist" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Art Gallery | VALIPOKKANN" />
        <meta property="og:description" content="Explore VALIPOKKANN's digital art collection - raw, figurative-abstract works that challenge conventional aesthetics and explore the intersection of traditional Tamil philosophy with contemporary expression." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://valipokkann.com/art" />
        <meta property="og:image" content="/valipokkann_transparent_logo.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Art Gallery | VALIPOKKANN" />
        <meta name="twitter:description" content="Explore VALIPOKKANN's digital art collection - raw, figurative-abstract works that challenge conventional aesthetics and explore the intersection of traditional Tamil philosophy with contemporary expression." />
        <meta name="twitter:image" content="/valipokkann_transparent_logo.png" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://valipokkann.com/art" />
      </Helmet>
      
      <StructuredData type="website" data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "VALIPOKKANN Art Gallery",
        "description": "Explore VALIPOKKANN's digital art collection - raw, figurative-abstract works that challenge conventional aesthetics and explore the intersection of traditional Tamil philosophy with contemporary expression.",
        "url": "https://valipokkann.com/art",
        "author": {
          "@type": "Person",
          "name": "VALIPOKKANN",
          "alternateName": "வழிப்போக்கன்"
        },
        "about": {
          "@type": "Thing",
          "name": "Contemporary Art",
          "description": "Digital and figurative-abstract art exploring Tamil philosophy and modern expression"
        }
      }} />
      {selectedArtwork && (
        <StructuredData
          type="artwork"
          data={selectedArtwork}
        />
      )}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif">Art Gallery</h1>
          <button
            onClick={handleBarrelRoll}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              isBarrelRolling
                ? 'bg-primary-dark text-white'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
            title={isBarrelRolling ? 'normie view' : 'enter the omnivalient era'}
          >
            {isBarrelRolling ? 'Nilai Pārvai' : 'Nōkkōṇam'}
          </button>
        </div>

        <div
          className={`transition-all duration-1000 ${
            isBarrelRolling
              ? 'rotate-180'
              : ''
          }`}
        >
          {/* Render artworks grouped by year */}
          {artworksByYear.map(({ year, artworks }) => (
            <div key={year} className="mb-0 relative">
              {/* Year "bookmark" on the far left */}
              <h2 className="text-xl font-serif absolute right-full top-0 mt-0 mr-2 text-gray-700 dark:text-gray-300 sticky top-12 z-10">
                {year}
              </h2>
              {/* Content area with the horizontal line */}
              <div className="ml-16">
                <div className="border-b border-gray-400 dark:border-gray-500 mb-2 pb-0 relative">
                  <div className="absolute left-0 top-0 h-full w-1 bg-gray-400 dark:bg-gray-500"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {Array.isArray(artworks) && artworks.length > 0 ? (
                    artworks.map((artwork) => (
                      <motion.div
                        key={artwork.id}
                        className="relative aspect-square overflow-hidden cursor-pointer group"
                        onClick={() => openDetailsModal(artwork)}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        {artwork.video ? (
                          <video
                            src={artwork.video}
                            loop
                            muted
                            autoPlay
                            playsInline
                            onError={(e) => {
                              const target = e.target as HTMLVideoElement;
                              target.src = FALLBACK_IMAGE;
                            }}
                            className="w-full h-full object-contain bg-black dark:bg-black"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <img
                            src={artwork.thumbnail}
                            alt={artwork.title || `Artwork ${artwork.id}`}
                            className="w-full h-full object-contain bg-black dark:bg-black"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = FALLBACK_IMAGE;
                            }}
                          />
                        )}
                      </motion.div>
                    ))
                  ) : null}
                </div>
              </div>
            </div>
          ))}
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
                className="relative w-full max-w-3xl md:max-w-4xl bg-neutral-950 dark:bg-neutral-900 p-6 rounded-lg mx-2"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
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
                    {selectedArtwork.video ? (
                      <video controls src={selectedArtwork.video} className="object-contain w-full h-full"></video>
                    ) : selectedArtwork.fullImage ? (
                      <img
                        src={selectedArtwork.fullImage}
                        alt={selectedArtwork.title || 'Untitled'}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = FALLBACK_IMAGE;
                        }}
                        className="object-contain w-full h-full"
                        style={{ 
                          transform: `rotate(${detailsRotation}deg)`,
                          userSelect: 'none',
                          touchAction: 'none',
                          backgroundColor: backgroundColor // Apply background color
                        }}
                      />
                    ) : (
                      <div className="text-gray-500 dark:text-gray-400">Image not available</div>
                    )}
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

                    {/* Rotation and Reset buttons for Details view */} 
                    <div className="flex gap-2 justify-center absolute bottom-2 left-1/2 transform -translate-x-1/2"
                         onClick={(e) => e.stopPropagation()} // Prevent closing when clicking controls
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDetailsRotate('left'); }}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-transform duration-300 hover:scale-110"
                      >
                        ↺
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDetailsReset(); }}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-transform duration-300 hover:scale-110"
                      >
                        ⟳
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDetailsRotate('right'); }}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-transform duration-300 hover:scale-110"
                      >
                        ↻
                      </button>
                    </div>
                  </div>

                  {/* Details Text Area */}
                  <div className="flex-grow w-full md:w-1/2 lg:w-1/3 overflow-y-auto max-h-[60vh] pr-2">
                    <h2 className="text-3xl font-serif mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">{selectedArtwork.title || 'Untitled'}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedArtwork.description}</p>

                    {/* Core Details */}
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      <p><strong>Year:</strong> {selectedArtwork.year}</p>
                      {selectedArtwork.medium && <p><strong>Medium:</strong> {selectedArtwork.medium}</p>}
                      {selectedArtwork.dimensions && <p><strong>Dimensions:</strong> {selectedArtwork.dimensions}</p>}
                      {selectedArtwork.editionSize !== undefined && <p><strong>Edition Size:</strong> {selectedArtwork.editionSize}</p>}
                      {selectedArtwork.createdDate && <p><strong>Created:</strong> {new Date(selectedArtwork.createdDate).toLocaleDateString()}</p>}
                      {selectedArtwork.mintDate && <p><strong>Minted:</strong> {new Date(selectedArtwork.mintDate).toLocaleDateString()}</p>}
                      {selectedArtwork.blockchain && <p><strong>Blockchain:</strong> {selectedArtwork.blockchain}</p>}
                      {selectedArtwork.contractAddress && <p><strong>Contract Address:</strong> {selectedArtwork.contractAddress}</p>}
                      {selectedArtwork.tokenId && <p><strong>Token ID:</strong> {selectedArtwork.tokenId}</p>}
                      {selectedArtwork.priceEth !== undefined && selectedArtwork.priceEth > 0 && <p><strong>Price:</strong> {selectedArtwork.priceEth} ETH</p>}
                      {selectedArtwork.license && <p><strong>License:</strong> {selectedArtwork.license}</p>}
                    </div>

                    {/* Optional Details Sections */}
                    {selectedArtwork.exhibitedAt && (
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        <p><strong>Exhibited At:</strong> {selectedArtwork.exhibitedAt}</p>
                      </div>
                    )}

                    {selectedArtwork.collectedBy && (
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        <p><strong>Collected By:</strong> {selectedArtwork.collectedBy}</p>
                      </div>
                    )}

                    {selectedArtwork.traits && selectedArtwork.traits.length > 0 && (
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        <p className="font-bold mb-1">Traits:</p>
                        <ul className="list-disc list-inside">
                          {selectedArtwork.traits.map((trait, index) => (
                            <li key={index}>{trait}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedArtwork.processImages && selectedArtwork.processImages.length > 0 && (
                       <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                         <p className="font-bold mb-1">Process Images:</p>
                         <div className="flex flex-wrap gap-2">
                           {selectedArtwork.processImages.map((image, index) => (
                             <img 
                               key={index} 
                               src={image} 
                               alt={`Process image ${index + 1}`} 
                               onError={(e) => {
                                 const target = e.target as HTMLImageElement;
                                 target.src = FALLBACK_IMAGE;
                               }}
                               className="w-16 h-16 object-cover rounded" 
                             />
                           ))}
                         </div>
                       </div>
                     )}

                    {selectedArtwork.audio && (
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        <p className="font-bold mb-1">Audio:</p>
                        <audio controls src={selectedArtwork.audio} className="w-full"></audio>
                      </div>
                    )}

                    {selectedArtwork.video && (
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        <p className="font-bold mb-1">Video:</p>
                        <video controls src={selectedArtwork.video} className="w-full"></video>
                      </div>
                    )}

                    {selectedArtwork.artistNotes && (
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        <p className="font-bold mb-1">Artist Notes:</p>
                        {/* You might want a markdown renderer here if notes are long */}
                        <p>{selectedArtwork.artistNotes}</p>
                      </div>
                    )}

                    {selectedArtwork.pressMentions && selectedArtwork.pressMentions.length > 0 && (
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        <p className="font-bold mb-1">Press Mentions:</p>
                        <ul className="list-disc list-inside">
                          {selectedArtwork.pressMentions.map((mention, index) => (
                            <li key={index}><a href={mention.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{mention.title}</a></li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedArtwork.links && selectedArtwork.links.length > 0 && (
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        <p className="font-bold mb-1">Links:</p>
                        <ul className="list-disc list-inside">
                          {selectedArtwork.links.map((link, index) => (
                            <li key={index}><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{link.label}</a></li>
                          ))}
                        </ul>
                      </div>
                    )}
                     
                    {(selectedArtwork.fullImage || selectedArtwork.video) && (
                       <div className="text-center mt-4 relative group">
                         <a 
                           href={selectedArtwork.fullImage || selectedArtwork.video}
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
                  userSelect: 'none'
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
                {selectedArtwork.video ? (
                   <motion.video
                     src={selectedArtwork.video}
                     loop
                     muted
                     autoPlay
                     playsInline
                     controls
                     onError={(e) => {
                       const target = e.target as HTMLVideoElement;
                       target.src = FALLBACK_IMAGE;
                     }}
                     className="object-contain w-full h-full"
                     drag={false} // Ensure the video itself is not draggable
                     style={{ 
                       touchAction: 'none',
                       userSelect: 'none',
                       pointerEvents: 'none'
                     }}
                   />
                ) : selectedArtwork.fullImage ? (
                  <motion.img 
                    src={selectedArtwork.fullImage}
                    alt={selectedArtwork.title || 'Untitled'}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = FALLBACK_IMAGE;
                    }}
                    className="object-contain w-full h-full"
                    drag={false} // Ensure the image itself is not draggable
                    style={{ 
                      touchAction: 'none',
                      userSelect: 'none',
                      pointerEvents: 'none'
                    }}
                  />
                ) : null}
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
                    // Animate motion values back to 0 for a quick reset
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

export default Art; 