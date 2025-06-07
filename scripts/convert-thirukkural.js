import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the raw dataset
const rawPath = path.join(__dirname, 'thirukkural_raw.json');
const rawData = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
const kurals = rawData.kural;

// Chapter names (first 10 for demo, should be extended to all 133)
const chapters = [
  'கடவுள் வாழ்த்து', 'வான்சிறப்பு', 'நீத்தார் பெருமை', 'அறன் வலியுறுத்தல்', 'இல்வாழ்க்கை',
  'வாழ்க்கைத் துணைநலம்', 'மக்கட்பேறு', 'அன்புடைமை', 'விருந்தோம்பல்', 'இனியவை கூறல்',
  // ... add all 133 chapter names
];
const chaptersEng = [
  'Praise of God', 'The Greatness of Rain', 'The Greatness of Ascetics', 'Assertion of the Strength of Virtue', 'Domestic Life',
  'The Worth of a Wife', 'The Possession of Children', 'The Possession of Love', 'Hospitality', 'The Utterance of Pleasant Words',
  // ... add all 133 chapter names in English
];

const result = kurals.map((kural, idx) => {
  const chapter = Math.floor(idx / 10) + 1;
  const couplet_number = (idx % 10) + 1;
  return {
    id: kural.Number,
    chapter,
    chapter_name: chapters[chapter - 1] || `அதிகாரம் ${chapter}`,
    chapter_name_eng: chaptersEng[chapter - 1] || `Chapter ${chapter}`,
    couplet_number,
    text: `${kural.Line1}\n${kural.Line2}`,
    translation: kural.Translation,
    transliteration: kural.transliteration1 || '',
    explanation: kural.explanation || '',
    source: 'Thirukkural'
  };
});

const outputPath = path.join(__dirname, '../src/data/quotes/thirukkural.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

console.log('Converted Thirukkural dataset to app format.'); 