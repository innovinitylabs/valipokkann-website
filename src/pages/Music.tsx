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
          <h1 className="text-4xl font-serif mb-8">Music</h1>
          
          <div className="mb-12">
            <iframe
              width="100%"
              height="450"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/valipokkann&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-serif mb-4">About the Music</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                VALIPOKKANN's music explores the intersection of traditional sounds and contemporary electronic elements.
                Each track is a journey through cultural landscapes, blending ancient rhythms with modern beats.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Follow on SoundCloud to stay updated with new releases and musical experiments.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-serif mb-4">Connect</h2>
              <div className="space-y-4">
                <a
                  href="https://soundcloud.com/valipokkann"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-600 dark:text-gray-400 hover:text-primary-dark"
                >
                  SoundCloud Profile
                </a>
                <a
                  href="https://www.linkedin.com/in/valipokkann/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-gray-600 dark:text-gray-400 hover:text-primary-dark"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-8 mt-12">
            {playlists.map(playlist => (
              <div key={playlist.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
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
                className="text-primary-dark hover:text-primary"
              >
                Spotify
              </a>
              {' '}and{' '}
              <a
                href="https://music.apple.com/profile/valipokkann"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-dark hover:text-primary"
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