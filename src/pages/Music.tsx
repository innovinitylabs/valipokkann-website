import { motion } from 'framer-motion';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const Music = () => {
  const [activeTab, setActiveTab] = useState<'spotify' | 'apple' | 'soundcloud'>('apple');

  return (
    <div className="min-h-screen bg-black dark:bg-black">
      <Helmet>
        <title>Music Playlists & Streams | VALIPOKKANN</title>
        <meta name="description" content="Listen to curated playlists and music streams by VALIPOKKANN. Explore Apple Music, Spotify, and SoundCloud selections blending Tamil, ambient, and experimental sounds." />
        <meta name="keywords" content="VALIPOKKANN, music, playlists, Apple Music, Spotify, SoundCloud, Tamil music, ambient, experimental" />
        <meta property="og:title" content="Music Playlists & Streams | VALIPOKKANN" />
        <meta property="og:description" content="Listen to curated playlists and music streams by VALIPOKKANN. Explore Apple Music, Spotify, and SoundCloud selections blending Tamil, ambient, and experimental sounds." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://valipokkan.in/music" />
        <meta property="og:image" content="https://valipokkan.in/valipokkann_transparent_logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Music Playlists & Streams | VALIPOKKANN" />
        <meta name="twitter:description" content="Listen to curated playlists and music streams by VALIPOKKANN. Explore Apple Music, Spotify, and SoundCloud selections blending Tamil, ambient, and experimental sounds." />
        <meta name="twitter:image" content="https://valipokkan.in/valipokkann_transparent_logo.png" />
        <link rel="canonical" href="https://valipokkan.in/music" />
      </Helmet>
      <div className="container mx-auto px-4 py-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-white"
        >
          Music
        </motion.h1>

        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('apple')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'apple'
                ? 'bg-neutral-900 dark:bg-neutral-900 text-white'
                : 'bg-black dark:bg-black text-gray-300 hover:bg-neutral-900 dark:hover:bg-neutral-900'
            }`}
          >
            Apple Music
          </button>
          <button
            onClick={() => setActiveTab('spotify')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'spotify'
                ? 'bg-neutral-900 dark:bg-neutral-900 text-white'
                : 'bg-black dark:bg-black text-gray-300 hover:bg-neutral-900 dark:hover:bg-neutral-900'
            }`}
          >
            Spotify
          </button>
          <button
            onClick={() => setActiveTab('soundcloud')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'soundcloud'
                ? 'bg-neutral-900 dark:bg-neutral-900 text-white'
                : 'bg-black dark:bg-black text-gray-300 hover:bg-neutral-900 dark:hover:bg-neutral-900'
            }`}
          >
            SoundCloud
          </button>
        </div>

        <div className="space-y-8 max-w-3xl mx-auto">
          {activeTab === 'apple' && (
            <div className="bg-neutral-950 dark:bg-neutral-950 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white">Apple Music Playlists</h2>
              <div className="space-y-6">
                <div className="mx-auto">
                  <h3 className="text-xl font-medium mb-2 text-white">PokingSmot</h3>
                  <iframe allow="autoplay *; encrypted-media *;" frameBorder="0" height="450" style={{width:'100%',maxWidth:'660px',overflow:'hidden',background:'transparent'}} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/in/playlist/pokingsmot/pl.u-8aAVgb1FayzDEL"></iframe>
                </div>
                <div className="mx-auto">
                  <h3 className="text-xl font-medium mb-2 text-white">Kalabhairaw</h3>
                  <iframe allow="autoplay *; encrypted-media *;" frameBorder="0" height="450" style={{width:'100%',maxWidth:'660px',overflow:'hidden',background:'transparent'}} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/in/playlist/kalabhairaw/pl.u-xlyN9XkupW4lZD"></iframe>
                </div>
                <div className="mx-auto">
                  <h3 className="text-xl font-medium mb-2 text-white">Vali Chill</h3>
                  <iframe allow="autoplay *; encrypted-media *;" frameBorder="0" height="450" style={{width:'100%',maxWidth:'660px',overflow:'hidden',background:'transparent'}} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/in/playlist/vali-chill/pl.u-KVXB866FmbrXpR"></iframe>
                </div>
                <div className="mx-auto">
                  <h3 className="text-xl font-medium mb-2 text-white">Ambient Drone Doom</h3>
                  <iframe allow="autoplay *; encrypted-media *;" frameBorder="0" height="450" style={{width:'100%',maxWidth:'660px',overflow:'hidden',background:'transparent'}} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/in/playlist/ambient-drone-doom/pl.u-xlyN9WVFpW4lZD"></iframe>
                </div>
                <div className="mx-auto">
                  <h3 className="text-xl font-medium mb-2 text-white">1 Vibe</h3>
                  <iframe allow="autoplay *; encrypted-media *;" frameBorder="0" height="450" style={{width:'100%',maxWidth:'660px',overflow:'hidden',background:'transparent'}} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/in/playlist/1-vibe/pl.u-gxblL3GtMK9k20"></iframe>
                </div>
                <div className="mx-auto">
                  <h3 className="text-xl font-medium mb-2 text-white">Vantablack</h3>
                  <iframe allow="autoplay *; encrypted-media *;" frameBorder="0" height="450" style={{width:'100%',maxWidth:'660px',overflow:'hidden',background:'transparent'}} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/in/playlist/vantablack/pl.u-jV89LxpsqWxMP1"></iframe>
                </div>
                <div className="mx-auto">
                  <h3 className="text-xl font-medium mb-2 text-white">PokingSmot (Apple Music)</h3>
                  <iframe allow="autoplay *; encrypted-media *;" frameBorder="0" height="450" style={{width:'100%',maxWidth:'660px',overflow:'hidden',background:'transparent'}} sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation" src="https://embed.music.apple.com/in/playlist/pokingsmot/pl.u-NpXml4mCpGokJg"></iframe>
                </div>
                <div className="mt-4 mx-auto">
                  <h3 className="text-xl font-medium mb-2 text-white">My Apple Music Profile</h3>
                  <a 
                    href="https://music.apple.com/profile/valipokkann" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:underline"
                  >
                    Visit my Apple Music profile
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'spotify' && (
            <div className="bg-neutral-950 dark:bg-neutral-950 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white">Spotify Playlists</h2>
              <div className="space-y-6">
                <div className="mx-auto">
                  <h3 className="text-xl font-medium mb-2 text-white">PokingSmot</h3>
                  <iframe
                    src="https://open.spotify.com/embed/playlist/47yQqOpwATbGYVGEiTbVfP"
                    width="100%"
                    height="352"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-lg"
                  ></iframe>
                </div>
                <div className="mt-4 mx-auto">
                  <h3 className="text-xl font-medium mb-2 text-white">My Spotify Profile</h3>
                  <a 
                    href="https://open.spotify.com/user/4sbtjitlk3hh3tc9orttv3sst?si=IHfFcWNSQN2u6uRnEayAIw" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-400 hover:underline"
                  >
                    Visit my Spotify profile
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'soundcloud' && (
            <div className="bg-neutral-950 dark:bg-neutral-950 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-white">SoundCloud</h2>
              <div className="space-y-6">
                <div className="mx-auto">
                  <h3 className="text-xl font-medium mb-2 text-white">My SoundCloud Embed</h3>
                  <iframe 
                    width="100%" 
                    height="300" 
                    scrolling="no" 
                    frameBorder="no" 
                    allow="autoplay" 
                    src="https://w.soundcloud.com/player/?url=https%3A//soundcloud.com/valipokkann&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true">
                  </iframe>
                  <div style={{fontSize: '10px', color: '#cccccc', lineBreak: 'anywhere', wordBreak: 'normal', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,Tahoma,sans-serif', fontWeight: '100'}}>
                    <a href="https://soundcloud.com/valipokkann" title="valipokkann" target="_blank" rel="noopener noreferrer" style={{color: '#cccccc', textDecoration: 'none'}}>valipokkann</a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Music; 