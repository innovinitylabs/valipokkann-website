import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import * as SunCalc from 'suncalc';

interface Location {
  latitude: number;
  longitude: number;
}

interface Timing {
  sunrise: Date;
  brahmaMuhurtham: Date;
  adjustedTime: Date;
}

const Brahmamuhurtham = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [timing, setTiming] = useState<Timing | null>(null);
  const [offset, setOffset] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Get user's location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setError(null);
        },
        (error) => {
          setError("Unable to get your location. Please enable location services.");
          console.error("Geolocation error:", error);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Calculate timings when location is available
  useEffect(() => {
    if (location) {
      const today = new Date();
      const times = SunCalc.getTimes(today, location.latitude, location.longitude);
      
      // Brahma Muhurtham is approximately 1 hour and 36 minutes before sunrise
      const brahmaMuhurtham = new Date(times.sunrise.getTime() - (96 * 60 * 1000));
      
      // Apply offset
      const adjustedTime = new Date(brahmaMuhurtham.getTime() - (offset * 60 * 1000));
      
      setTiming({
        sunrise: times.sunrise,
        brahmaMuhurtham,
        adjustedTime
      });
      setLoading(false);
    }
  }, [location, offset]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const offsetOptions = [0, 5, 10, 15, 20];

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Brahma Muhurtham Alarm | VALIPOKKANN</title>
        <meta name="description" content="Calculate your local Brahma Muhurtham timing and set an alarm to wake up during this auspicious period before sunrise." />
        <meta name="keywords" content="Brahma Muhurtham, sunrise, spiritual alarm, meditation, yoga, VALIPOKKANN" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://valipokkann.in/fusion/brahmamuhurtham" />
        <meta property="og:title" content="Brahma Muhurtham Alarm | VALIPOKKANN" />
        <meta property="og:description" content="Calculate your local Brahma Muhurtham timing and set an alarm to wake up during this auspicious period before sunrise." />
        <meta property="og:image" content="https://valipokkann.in/valipokkann_transparent_logo.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://valipokkann.in/fusion/brahmamuhurtham" />
        <meta property="twitter:title" content="Brahma Muhurtham Alarm | VALIPOKKANN" />
        <meta property="twitter:description" content="Calculate your local Brahma Muhurtham timing and set an alarm to wake up during this auspicious period before sunrise." />
        <meta property="twitter:image" content="https://valipokkann.in/valipokkann_transparent_logo.png" />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Brahma Muhurtham Alarm
          </h1>
          <p className="text-gray-400 mb-8">
            Calculate your local Brahma Muhurtham timing and set an alarm to wake up during this auspicious period before sunrise.
          </p>

          {error ? (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-8">
              <p className="text-red-400">{error}</p>
            </div>
          ) : loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Calculating timings...</p>
            </div>
          ) : timing && (
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-purple-500/10 to-indigo-600/10 rounded-lg p-6 border border-purple-500/20">
                <h2 className="text-2xl font-semibold mb-4">Today's Timings</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400">Sunrise</p>
                    <p className="text-2xl font-mono">{formatTime(timing.sunrise)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Brahma Muhurtham</p>
                    <p className="text-2xl font-mono">{formatTime(timing.brahmaMuhurtham)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Adjusted Wake-up Time</p>
                    <p className="text-2xl font-mono text-purple-400">{formatTime(timing.adjustedTime)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-indigo-600/10 rounded-lg p-6 border border-purple-500/20">
                <h2 className="text-xl font-semibold mb-4">Wake-up Offset</h2>
                <p className="text-gray-400 mb-4">Choose how many minutes before Brahma Muhurtham you want to wake up:</p>
                <div className="flex flex-wrap gap-2">
                  {offsetOptions.map((value) => (
                    <button
                      key={value}
                      onClick={() => setOffset(value)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        offset === value
                          ? 'bg-purple-500 text-white'
                          : 'bg-purple-500/10 text-gray-400 hover:bg-purple-500/20'
                      }`}
                    >
                      {value === 0 ? 'No offset' : `${value} minutes earlier`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-indigo-600/10 rounded-lg p-6 border border-purple-500/20">
                <h2 className="text-xl font-semibold mb-4">About Brahma Muhurtham</h2>
                <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                  Brahma Muhurtham is the sacred time period that begins approximately 1 hour and 36 minutes before sunrise. Rooted in ancient Indian tradition, it is considered the most auspicious window for spiritual practices, meditation, yoga, and inner reflection. During this time, the mind is naturally calm, the atmosphere is rich with prana (life energy), and the body's rhythms are aligned with the cosmic cycle.
                </p>
                <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                  Modern scientific research quietly echoes what ancient seers already knew. In the pre-dawn hours:
                  <ul className="list-disc list-inside mt-2 mb-2">
                    <li>Melatonin levels (the hormone governing sleep cycles) begin to decline, leaving the mind rested yet alert.</li>
                    <li>Cortisol levels rise gently, preparing the brain for heightened focus and clarity.</li>
                    <li>Air quality is often at its peak due to lower human activity, offering higher oxygen levels.</li>
                    <li>The prefrontal cortex operates optimally for creative problem-solving, memory consolidation, and emotional regulation.</li>
                    <li>Practices like meditation and breathwork at this hour can measurably lower stress hormones and boost neuroplasticity.</li>
                  </ul>
                  Far from superstition, Brahma Muhurtham reflects a profound synchronization between nature's cycles and human physiology — wisdom modern chronobiology and neuroscience are only beginning to validate.
                </p>
                <p className="mb-4 text-lg text-gray-700 dark:text-gray-300">
                  For centuries, sages and seekers have regarded this hour as a gateway to elevated consciousness, mental clarity, and lasting well-being.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Brahmamuhurtham; 