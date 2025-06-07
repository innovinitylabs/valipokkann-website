import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chapter names in Tamil and English
const chapters = [
  { name: 'கடவுள் வாழ்த்து', nameEng: 'Praise of God' },
  { name: 'வான்சிறப்பு', nameEng: 'The Greatness of Rain' },
  { name: 'நீத்தார் பெருமை', nameEng: 'The Greatness of Ascetics' },
  { name: 'அறன் வலியுறுத்தல்', nameEng: 'Assertion of the Strength of Virtue' },
  { name: 'இல்வாழ்க்கை', nameEng: 'Domestic Life' },
  { name: 'வாழ்க்கைத் துணைநலம்', nameEng: 'The Worth of a Wife' },
  { name: 'மக்கட்பேறு', nameEng: 'The Possession of Children' },
  { name: 'அன்புடைமை', nameEng: 'The Possession of Love' },
  { name: 'விருந்தோம்பல்', nameEng: 'Hospitality' },
  { name: 'இனியவை கூறல்', nameEng: 'The Utterance of Pleasant Words' },
  // ... Add all 133 chapters
];

// Function to generate a single couplet
function generateCouplet(id, chapter, chapterName, chapterNameEng, coupletNumber) {
  return {
    id,
    chapter,
    chapter_name: chapterName,
    chapter_name_eng: chapterNameEng,
    couplet_number: coupletNumber,
    text: `திருக்குறள் ${id}`, // Placeholder for actual text
    translation: `Translation of Thirukkural ${id}`, // Placeholder for actual translation
    transliteration: `Transliteration of Thirukkural ${id}`, // Placeholder for actual transliteration
    explanation: `Explanation of Thirukkural ${id}`, // Placeholder for actual explanation
    source: 'Thirukkural'
  };
}

// Generate all 1330 couplets
const thirukkural = [];
let id = 1;

for (let chapter = 1; chapter <= 133; chapter++) {
  const chapterInfo = chapters[chapter - 1] || {
    name: `அதிகாரம் ${chapter}`,
    nameEng: `Chapter ${chapter}`
  };

  for (let coupletNumber = 1; coupletNumber <= 10; coupletNumber++) {
    thirukkural.push(
      generateCouplet(
        id,
        chapter,
        chapterInfo.name,
        chapterInfo.nameEng,
        coupletNumber
      )
    );
    id++;
  }
}

// Write to file
const outputPath = path.join(__dirname, '../src/data/quotes/thirukkural.json');
fs.writeFileSync(outputPath, JSON.stringify(thirukkural, null, 2));

console.log('Generated Thirukkural dataset with 1330 couplets'); 