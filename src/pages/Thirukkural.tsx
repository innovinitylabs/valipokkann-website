import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import thirukkuralData from '../data/quotes/thirukkural.json';

interface Thirukkural {
  id: number;
  chapter: number;
  chapter_name: string;
  chapter_name_eng: string;
  couplet_number: number;
  text: string;
  translation: string;
  transliteration: string;
  explanation: string;
  source: string;
}

// Full list of 133 chapter names in Tamil and English
const chapterList = [
  { id: 1, name: 'கடவுள் வாழ்த்து', nameEng: 'Praise of God' },
  { id: 2, name: 'வான்சிறப்பு', nameEng: 'The Greatness of Rain' },
  { id: 3, name: 'நீத்தார் பெருமை', nameEng: 'The Greatness of Ascetics' },
  { id: 4, name: 'அறன் வலியுறுத்தல்', nameEng: 'Assertion of the Strength of Virtue' },
  { id: 5, name: 'இல்வாழ்க்கை', nameEng: 'Domestic Life' },
  { id: 6, name: 'வாழ்க்கைத் துணைநலம்', nameEng: 'The Worth of a Wife' },
  { id: 7, name: 'மக்கட்பேறு', nameEng: 'The Possession of Children' },
  { id: 8, name: 'அன்புடைமை', nameEng: 'The Possession of Love' },
  { id: 9, name: 'விருந்தோம்பல்', nameEng: 'Hospitality' },
  { id: 10, name: 'இனியவை கூறல்', nameEng: 'The Utterance of Pleasant Words' },
  { id: 11, name: 'செய்ந்நன்றி அறிதல்', nameEng: 'Gratitude' },
  { id: 12, name: 'நடுவு நிலைமை', nameEng: 'Impartiality' },
  { id: 13, name: 'அடக்கமுடைமை', nameEng: 'Self-Control' },
  { id: 14, name: 'ஒழுக்கம் உடைமை', nameEng: 'Good Conduct' },
  { id: 15, name: 'பிறனில் விழையாமை', nameEng: 'Not Coveting Another\'s Wife' },
  { id: 16, name: 'பொறையுடைமை', nameEng: 'Forbearance' },
  { id: 17, name: 'அழுக்காறாமை', nameEng: 'Not Envying' },
  { id: 18, name: 'வெஃகாமை', nameEng: 'Not Coveting' },
  { id: 19, name: 'புறங்கூறாமை', nameEng: 'Not Backbiting' },
  { id: 20, name: 'பயனில சொல்லாமை', nameEng: 'Avoidance of Useless Words' },
  { id: 21, name: 'தீவினை அஞ்சல்', nameEng: 'Dread of Evil Deeds' },
  { id: 22, name: 'ஒப்புரவறிதல்', nameEng: 'Knowing the Fitting Time' },
  { id: 23, name: 'ஊக்கமுடைமை', nameEng: 'Energy' },
  { id: 24, name: 'மடியின்மை', nameEng: 'Not Being Lazy' },
  { id: 25, name: 'அருளுடைமை', nameEng: 'Compassion' },
  { id: 26, name: 'புலான்மறுத்தல்', nameEng: 'Abstaining from Flesh' },
  { id: 27, name: 'தவம்', nameEng: 'Penance' },
  { id: 28, name: 'கூடாவொழுக்கம்', nameEng: 'Improper Conduct' },
  { id: 29, name: 'கள்ளாமை', nameEng: 'Not Stealing' },
  { id: 30, name: 'வாய்மை', nameEng: 'Truthfulness' },
  { id: 31, name: 'வெகுளாமை', nameEng: 'Not Being Angry' },
  { id: 32, name: 'இன்னாசெய்யாமை', nameEng: 'Not Doing Evil' },
  { id: 33, name: 'கொல்லாமை', nameEng: 'Not Killing' },
  { id: 34, name: 'நிலையாமை', nameEng: 'Impermanence' },
  { id: 35, name: 'துறவு', nameEng: 'Renunciation' },
  { id: 36, name: 'மெய்யுணர்தல்', nameEng: 'Knowledge of Truth' },
  { id: 37, name: 'அவாவறுத்தல்', nameEng: 'Extirpation of Desire' },
  { id: 38, name: 'ஊழ்', nameEng: 'Fate' },
  { id: 39, name: 'இறைமாட்சி', nameEng: 'The Greatness of a King' },
  { id: 40, name: 'கல்வி', nameEng: 'Learning' },
  { id: 41, name: 'கல்லாமை', nameEng: 'Ignorance' },
  { id: 42, name: 'கேள்வி', nameEng: 'Listening' },
  { id: 43, name: 'அறிவுடைமை', nameEng: 'Possession of Knowledge' },
  { id: 44, name: 'குற்றங்கடிதல்', nameEng: 'The Correction of Faults' },
  { id: 45, name: 'பெரியாரைத் துணைக்கோடல்', nameEng: 'Seeking the Aid of Great Men' },
  { id: 46, name: 'சிற்றினஞ்சேராமை', nameEng: 'Avoiding Mean Associations' },
  { id: 47, name: 'தெரிந்து செயல்வகை', nameEng: 'Acting after Due Consideration' },
  { id: 48, name: 'வலியறிதல்', nameEng: 'The Knowledge of Power' },
  { id: 49, name: 'காலமறிதல்', nameEng: 'Knowing the Fitting Time' },
  { id: 50, name: 'இடனறிதல்', nameEng: 'Knowing the Place' },
  { id: 51, name: 'தெரிந்து தெளிதல்', nameEng: 'Selection and Confidence' },
  { id: 52, name: 'தெரிந்து வினையாடல்', nameEng: 'Selection and Employment' },
  { id: 53, name: 'சுற்றந்தழால்', nameEng: 'Cherishing Relations' },
  { id: 54, name: 'பொச்சாவாமை', nameEng: 'Unforgetfulness' },
  { id: 55, name: 'செங்கோன்மை', nameEng: 'The Right Sceptre' },
  { id: 56, name: 'கொடுங்கோன்மை', nameEng: 'The Cruel Sceptre' },
  { id: 57, name: 'வெருவந்த செய்யாமை', nameEng: 'Not Being Terrible' },
  { id: 58, name: 'கண்ணோட்டம்', nameEng: 'Benignity' },
  { id: 59, name: 'ஒற்றாடல்', nameEng: 'Spies' },
  { id: 60, name: 'ஊக்கமுடைமை', nameEng: 'Energy' },
  { id: 61, name: 'மடியின்மை', nameEng: 'Not Being Lazy' },
  { id: 62, name: 'ஆள்வினையுடைமை', nameEng: 'Manly Effort' },
  { id: 63, name: 'இடுக்கணழியாமை', nameEng: 'Not Desponding' },
  { id: 64, name: 'அமைச்சு', nameEng: 'The Office of Minister of State' },
  { id: 65, name: 'சொல்வன்மை', nameEng: 'Power of Speech' },
  { id: 66, name: 'வினைத்தூய்மை', nameEng: 'Purity of Action' },
  { id: 67, name: 'வினைத்திட்பம்', nameEng: 'Power in Action' },
  { id: 68, name: 'வினைசெயல்வகை', nameEng: 'The Method of Action' },
  { id: 69, name: 'தூது', nameEng: 'The Envoy' },
  { id: 70, name: 'மன்னரைச் சேர்ந்தொழுகல்', nameEng: 'Conduct in the Presence of the King' },
  { id: 71, name: 'குறிப்பறிதல்', nameEng: 'The Knowledge of Signs' },
  { id: 72, name: 'அவையறிதல்', nameEng: 'The Knowledge of the Council Chamber' },
  { id: 73, name: 'அவையஞ்சாமை', nameEng: 'Not Being Afraid of the Assembly' },
  { id: 74, name: 'நாடு', nameEng: 'The Land' },
  { id: 75, name: 'அரண்', nameEng: 'The Fort' },
  { id: 76, name: 'பொருள்செயல்வகை', nameEng: 'The Way of Making Wealth' },
  { id: 77, name: 'படைமாட்சி', nameEng: 'The Excellence of an Army' },
  { id: 78, name: 'படைச்செருக்கு', nameEng: 'Military Spirit' },
  { id: 79, name: 'நட்பு', nameEng: 'Friendship' },
  { id: 80, name: 'நட்பாராய்தல்', nameEng: 'Investigation in Forming Friendships' },
  { id: 81, name: 'பழைமை', nameEng: 'Familiarity' },
  { id: 82, name: 'தீநட்பு', nameEng: 'Evil Friendship' },
  { id: 83, name: 'கூடாநட்பு', nameEng: 'Unreal Friendship' },
  { id: 84, name: 'பேதைமை', nameEng: 'Folly' },
  { id: 85, name: 'புல்லறிவாண்மை', nameEng: 'Ignorance' },
  { id: 86, name: 'இகல்', nameEng: 'Hostility' },
  { id: 87, name: 'பகைமாட்சி', nameEng: 'The Excellence of Hatred' },
  { id: 88, name: 'பகைத்திறந்தெரிதல்', nameEng: 'The Knowledge of the Fitting Time' },
  { id: 89, name: 'உட்பகை', nameEng: 'Enmity Within' },
  { id: 90, name: 'பெரியாரைப் பிழையாமை', nameEng: 'Not Offending the Great' },
  { id: 91, name: 'பெண்வழிச்சேறல்', nameEng: 'Being Led by Women' },
  { id: 92, name: 'வரைவின்மகளிர்', nameEng: 'Wanton Women' },
  { id: 93, name: 'கள்ளுண்ணாமை', nameEng: 'Not Drinking Palm-Wine' },
  { id: 94, name: 'சூது', nameEng: 'Gambling' },
  { id: 95, name: 'மருந்து', nameEng: 'Medicine' },
  { id: 96, name: 'குடிமை', nameEng: 'Nobility' },
  { id: 97, name: 'மானம்', nameEng: 'Honour' },
  { id: 98, name: 'பெருமை', nameEng: 'Greatness' },
  { id: 99, name: 'சான்றாண்மை', nameEng: 'Perfectness' },
  { id: 100, name: 'பண்புடைமை', nameEng: 'Courtesy' },
  { id: 101, name: 'நன்றியில்செல்வம்', nameEng: 'Wealth Without Beneficence' },
  { id: 102, name: 'நாணுடைமை', nameEng: 'Shame' },
  { id: 103, name: 'குடிசெயல்வகை', nameEng: 'The Way of Maintaining the Family' },
  { id: 104, name: 'உழவு', nameEng: 'Farming' },
  { id: 105, name: 'நல்குரவு', nameEng: 'Poverty' },
  { id: 106, name: 'இரவு', nameEng: 'Mendicancy' },
  { id: 107, name: 'இரவச்சம்', nameEng: 'The Dread of Mendicancy' },
  { id: 108, name: 'கயமை', nameEng: 'Baseness' },
  { id: 109, name: 'தகைசான்ற சொற்காத்தல்', nameEng: 'The Preservation of Dignity' },
  { id: 110, name: 'தகைசான்ற சொல்லாமை', nameEng: 'Not Speaking Mean Words' },
  { id: 111, name: 'வலியறிதல்', nameEng: 'Knowing the Strength' },
  { id: 112, name: 'களவின்கண் காத்தல்', nameEng: 'Guarding Against Theft' },
  { id: 113, name: 'காமத்துப்பால்', nameEng: 'The Book of Love' },
  { id: 114, name: 'களவியல்', nameEng: 'The Chapter on Secret Love' },
  { id: 115, name: 'கற்பியல்', nameEng: 'The Chapter on Wedded Life' },
  { id: 116, name: 'பொருட்பால்', nameEng: 'The Book of Wealth' },
  { id: 117, name: 'அரசியல்', nameEng: 'The Chapter on Royalty' },
  { id: 118, name: 'அமைச்சியல்', nameEng: 'The Chapter on Ministers' },
  { id: 119, name: 'அரணியல்', nameEng: 'The Chapter on Fortification' },
  { id: 120, name: 'படையியல்', nameEng: 'The Chapter on Army' },
  { id: 121, name: 'நட்பியல்', nameEng: 'The Chapter on Friendship' },
  { id: 122, name: 'குடியியல்', nameEng: 'The Chapter on Family' },
  { id: 123, name: 'கல்வியியல்', nameEng: 'The Chapter on Learning' },
  { id: 124, name: 'குடிசெயல்வகை', nameEng: 'The Way of Maintaining the Family' },
  { id: 125, name: 'உழவு', nameEng: 'Farming' },
  { id: 126, name: 'நல்குரவு', nameEng: 'Poverty' },
  { id: 127, name: 'இரவு', nameEng: 'Mendicancy' },
  { id: 128, name: 'இரவச்சம்', nameEng: 'The Dread of Mendicancy' },
  { id: 129, name: 'கயமை', nameEng: 'Baseness' },
  { id: 130, name: 'தகைசான்ற சொற்காத்தல்', nameEng: 'The Preservation of Dignity' },
  { id: 131, name: 'தகைசான்ற சொல்லாமை', nameEng: 'Not Speaking Mean Words' },
  { id: 132, name: 'வலியறிதல்', nameEng: 'Knowing the Strength' },
  { id: 133, name: 'களவின்கண் காத்தல்', nameEng: 'Guarding Against Theft' }
];

const Thirukkural: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [filteredKurals, setFilteredKurals] = useState<Thirukkural[]>([]);
  const [chapters, setChapters] = useState<{ id: number; name: string; nameEng: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Structured data for Thirukkural
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": "Thirukkural",
    "author": {
      "@type": "Person",
      "name": "Thiruvalluvar"
    },
    "description": "Thirukkural is a classic Tamil text consisting of 1,330 couplets dealing with the everyday virtues of an individual. It is one of the most important works in Tamil literature.",
    "datePublished": "-300",
    "inLanguage": "ta",
    "isbn": "978-81-206-0020-5"
  };

  useEffect(() => {
    setChapters(chapterList);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    } else {
      document.removeEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  useEffect(() => {
    let filtered: Thirukkural[] = thirukkuralData as Thirukkural[];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (kural) =>
          kural.text.toLowerCase().includes(searchLower) ||
          kural.translation.toLowerCase().includes(searchLower) ||
          kural.transliteration.toLowerCase().includes(searchLower) ||
          kural.explanation.toLowerCase().includes(searchLower)
      );
    }

    if (selectedChapter !== 'all') {
      filtered = filtered.filter((kural) => kural.chapter.toString() === selectedChapter);
    }

    setFilteredKurals(filtered);
  }, [searchTerm, selectedChapter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Thirukkural - Ancient Tamil Literature | Valipokkann</title>
        <meta name="description" content="Explore Thirukkural, the ancient Tamil masterpiece by Thiruvalluvar. Discover 1,330 couplets on ethics, politics, and love that remain relevant today." />
        <meta name="keywords" content="Thirukkural, Thiruvalluvar, Tamil literature, ancient wisdom, ethics, philosophy, Tamil poetry" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Thirukkural - Ancient Tamil Literature | Valipokkann" />
        <meta property="og:description" content="Explore Thirukkural, the ancient Tamil masterpiece by Thiruvalluvar. Discover 1,330 couplets on ethics, politics, and love that remain relevant today." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://valipokkann.com/thirukkural" />
        <meta property="og:image" content="https://valipokkann.com/Thiruvalluvar.jpg" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Thirukkural - Ancient Tamil Literature | Valipokkann" />
        <meta name="twitter:description" content="Explore Thirukkural, the ancient Tamil masterpiece by Thiruvalluvar. Discover 1,330 couplets on ethics, politics, and love that remain relevant today." />
        <meta name="twitter:image" content="https://valipokkann.com/Thiruvalluvar.jpg" />
        
        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-4">Thirukkural</h1>
        <p className="text-lg text-neutral-400 mb-6">
          Ancient Tamil literature that transcends time
        </p>
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by keyword..."
            className="w-full px-4 py-2 bg-neutral-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKurals.map((kural) => (
          <motion.article
            key={kural.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-neutral-800 rounded-lg p-6 hover:bg-neutral-700 transition-colors"
          >
            <h2 className="text-xl font-semibold mb-2">Chapter {kural.chapter}: {kural.chapter_name_eng}</h2>
            <p className="text-lg mb-2">{kural.text}</p>
            <p className="text-neutral-400 mb-2">{kural.translation}</p>
            <p className="text-sm text-neutral-500 italic">{kural.transliteration}</p>
            <p className="mt-4 text-neutral-300">{kural.explanation}</p>
          </motion.article>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <img
          src="/Thiruvalluvar.jpg"
          alt="Thiruvalluvar"
          className="w-32 h-32 rounded-full object-cover object-top shadow-lg cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative bg-neutral-900 rounded-lg shadow-2xl w-full max-w-4xl mx-auto my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-neutral-300 transition-colors focus:outline-none z-10"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <div className="p-6 md:p-8">
              <img
                src="/Thiruvalluvar.jpg"
                alt="Thiruvalluvar"
                className="w-full h-auto max-h-[50vh] object-contain mx-auto mb-8 rounded-lg"
              />
              <div className="max-w-[600px] mx-auto text-neutral-300">
                <p className="text-[1.1rem] leading-[1.7] mb-6">
                  Thiruvalluvar, the legendary Tamil poet-philosopher, authored the Thirukkural over 2,000 years ago — around 300 BCE or earlier. It predates most so-called "ancient" texts, including the Bible, and yet, its truths remain unchanged and undiluted.
                </p>
                <p className="text-[1.1rem] leading-[1.7] mb-6">
                  Comprising 1,330 couplets on ethics (aram), political and economic life (porul), and love (inbam), the Thirukkural offers timeless wisdom with no allegiance to any religion, caste, or region. It's a universal scripture written for all humanity — not to command obedience, but to elevate understanding.
                </p>
                <p className="text-[1.1rem] leading-[1.7] mb-6">
                  What makes it remarkable? It remains "relevant till date without any rephrasing", even after millennia. Its secular tone, moral precision, and poetic conciseness are unparalleled.
                </p>
                <p className="text-[1.1rem] leading-[1.7]">
                  Many Western thinkers — from Tolstoy to Gandhi — praised ideas from the Kural, often unknowingly echoing its verses. Yet the source has rarely been credited in global discourse.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Thirukkural; 