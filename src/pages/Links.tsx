import { motion } from 'framer-motion';
import { useState } from 'react';

interface LinkItem {
  id: string;
  title: string;
  url: string;
  category: 'nft' | 'social' | 'music' | 'other';
  icon?: string;
}

const Links = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const links: LinkItem[] = [
    // NFT Links
    {
      id: 'nft-1',
      title: 'OpenSea Collection',
      url: 'https://opensea.io/profile/valipokkann',
      category: 'nft',
      icon: '🖼️'
    },
    {
      id: 'nft-2',
      title: 'Foundation Profile',
      url: 'https://foundation.app/valipokkann',
      category: 'nft',
      icon: '🎨'
    },
    // Social Links
    {
      id: 'social-1',
      title: 'Instagram',
      url: 'https://instagram.com/valipokkann',
      category: 'social',
      icon: '📸'
    },
    {
      id: 'social-2',
      title: 'Twitter',
      url: 'https://twitter.com/valipokkann',
      category: 'social',
      icon: '🐦'
    },
    {
      id: 'social-3',
      title: 'LinkedIn',
      url: 'https://www.linkedin.com/in/valipokkann/',
      category: 'social',
      icon: '👔'
    },
    // Music Links
    {
      id: 'music-1',
      title: 'Spotify',
      url: 'https://open.spotify.com/user/valipokkann',
      category: 'music',
      icon: '🎵'
    },
    {
      id: 'music-2',
      title: 'Apple Music',
      url: 'https://music.apple.com/profile/valipokkann',
      category: 'music',
      icon: '🎧'
    },
    {
      id: 'music-3',
      title: 'SoundCloud',
      url: 'https://soundcloud.com/valipokkann',
      category: 'music',
      icon: '🎶'
    }
  ];

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'nft', label: 'NFT' },
    { id: 'social', label: 'Social' },
    { id: 'music', label: 'Music' },
    { id: 'other', label: 'Other' }
  ];

  const filteredLinks = activeCategory === 'all'
    ? links
    : links.filter(link => link.category === activeCategory);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-serif mb-8 text-center text-white">Links</h1>

          {/* Category Filter */}
          <div className="flex justify-center space-x-4 mb-8">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                  activeCategory === category.id
                    ? 'bg-primary-dark text-white'
                    : 'bg-neutral-950 dark:bg-neutral-900 text-gray-300 hover:bg-neutral-900 dark:hover:bg-neutral-800'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLinks.map(link => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                className="block p-6 bg-neutral-950 dark:bg-neutral-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-center space-x-4">
                  {link.icon && (
                    <span className="text-2xl">{link.icon}</span>
                  )}
                  <span className="text-lg font-medium text-white">{link.title}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Links; 