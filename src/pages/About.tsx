import { motion } from 'framer-motion';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import StructuredData from '../components/StructuredData';

const About = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [logoRotation, setLogoRotation] = useState(0);

  const handleLogoClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const imageRect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX;
    const imageCenterX = imageRect.left + imageRect.width / 2;

    if (clickX > imageCenterX) {
      // Clicked on the right half
      setLogoRotation(prev => prev + 360);
    } else {
      // Clicked on the left half
      setLogoRotation(prev => prev - 360);
    }
  };

  const artistData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "VALIPOKKANN",
    "alternateName": "வழிப்போக்கன்",
    "description": "VALIPOKKANN is an artist whose work is raw, figurative-abstract, and fiercely original, unpolished, uncategorized, and unafraid. Since 2021, they have been an active participant in the crypto and NFT art space, pioneering digital art that bridges traditional Tamil philosophy with blockchain technology.",
    "image": "/valipokkann_transparent_logo.png",
    "email": "valipokkann@proton.me",
    "sameAs": [
      "https://instagram.com/valipokkann",
      "https://twitter.com/valipokkann"
    ],
    "knowsAbout": ["Art", "Photography", "Music", "Writing", "Tamil Philosophy", "Thirukkural"],
    "jobTitle": "Artist"
  };

  return (
    <>
      <Helmet>
        <title>About VALIPOKKANN | Artist Bio & Contact</title>
        <meta name="description" content="VALIPOKKANN is an artist whose work is raw, figurative-abstract, and fiercely original. Since 2021, they have been active in crypto and NFT art, bridging Tamil philosophy with blockchain technology." />
        <meta name="keywords" content="VALIPOKKANN, வழிப்போக்கன், artist, Tamil art, contemporary art, Thirukkural, figurative-abstract art, crypto art, NFT artist, Web3" />
        <meta property="og:title" content="About VALIPOKKANN | Artist Bio & Contact" />
        <meta property="og:description" content="VALIPOKKANN is an artist whose work is raw, figurative-abstract, and fiercely original. Since 2021, they have been active in crypto and NFT art, bridging Tamil philosophy with blockchain technology." />
        <meta property="og:image" content="/valipokkann_transparent_logo.png" />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About VALIPOKKANN | Artist Bio & Contact" />
        <meta name="twitter:description" content="VALIPOKKANN is an artist whose work is raw, figurative-abstract, and fiercely original. Since 2021, they have been active in crypto and NFT art, bridging Tamil philosophy with blockchain technology." />
        <meta name="twitter:image" content="/valipokkann_transparent_logo.png" />
        <link rel="canonical" href="https://valipokkann.com/about" />
      </Helmet>
      <StructuredData type="person" data={artistData} />
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl font-sans mb-8 cursor-pointer"
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
              animate={{ 
                // fontFamily: isHovered ? "'Noto Serif Tamil', serif" : "'Inter', sans-serif"
              }}
              transition={{ duration: 0.3 }}
            >
              About {isHovered ? 'வழிப்போக்கன்' : 'VALIPOKKANN'}
            </motion.h1>
            
            <div className="grid grid-cols-1 gap-12">
              <section>
                <motion.div 
                  className="w-64 h-64 mx-auto bg-black dark:bg-black rounded-lg mb-6 overflow-hidden flex justify-center items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.img 
                    src="/valipokkann_transparent_logo.png" 
                    alt="VALIPOKKANN Logo - Contemporary Tamil Artist" 
                    className="w-full h-full object-contain cursor-pointer"
                    onClick={handleLogoClick}
                    animate={{ rotate: logoRotation }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </motion.div>
                <h2 className="text-2xl font-sans mb-4">Artist Bio</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Valipokkann creates as the ancients did, not by copying what is seen, but by invoking what is known. Each canvas is a confrontation, not a decoration.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  VALIPOKKANN is an artist whose work is raw, figurative-abstract, and fiercely original, unpolished, uncategorized, and unafraid. They create without reference, imitation, or borrowed aesthetics; each piece emerges from an inner well of form and force, drawn not from outside inspiration but ancestral memory and lived intensity.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Their art defies gravity itself, omnivalient and multidimensional, revealing hidden layers and meanings when flipped, rotated, or reinterpreted.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Rooted deeply in Tamil philosophy and the fire of Thirukkural, VALIPOKKANN channels traditional knowledge into a new visual language. Across mediums, painting, photography, music, and writing, their work challenges trends, confronts shallow modernity, and refuses to be diluted.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Since 2021, VALIPOKKANN has been an active participant in the crypto and NFT art space, pioneering digital art that bridges traditional Tamil philosophy with blockchain technology. Their crypto legacy spans multiple collections and collaborations, establishing them as a voice for authentic, culturally-rooted digital art in the Web3 ecosystem.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Made not to impress, but to reveal.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-sans mt-8 mb-4">Connect</h2>
                <div className="space-y-4">
                  <a
                    href="mailto:valipokkann@proton.me"
                    className="block text-gray-600 dark:text-gray-400 hover:text-primary"
                    aria-label="Email VALIPOKKANN"
                  >
                    valipokkann@proton.me
                  </a>
                  <div className="flex space-x-4">
                    <a
                      href="https://instagram.com/valipokkann"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-primary"
                      aria-label="Follow VALIPOKKANN on Instagram"
                    >
                      Instagram
                    </a>
                    <a
                      href="https://twitter.com/valipokkann"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-primary"
                      aria-label="Follow VALIPOKKANN on Twitter"
                    >
                      Twitter
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default About; 