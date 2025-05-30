import { motion } from 'framer-motion';

const Music = () => {
  const playlists = [
    {
      id: 'spotify',
      title: 'Spotify Playlist',
      embedUrl: 'https://open.spotify.com/embed/playlist/YOUR_PLAYLIST_ID',
      platform: 'Spotify'
    },
    {
      id: 'apple',
      title: 'Apple Music Playlist',
      embedUrl: 'https://embed.music.apple.com/us/playlist/YOUR_PLAYLIST_ID',
      platform: 'Apple Music'
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-serif mb-6 text-center">Music</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 text-center">
            A collection of soundscapes and musical compositions
          </p>
          
          <div className="space-y-8">
            {playlists.map(playlist => (
              <div key={playlist.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-serif mb-4">{playlist.title}</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={playlist.embedUrl}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Follow me on{' '}
              <a
                href="https://open.spotify.com/user/valipokkann"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark"
              >
                Spotify
              </a>
              {' '}and{' '}
              <a
                href="https://music.apple.com/profile/valipokkann"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark"
              >
                Apple Music
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Music; 