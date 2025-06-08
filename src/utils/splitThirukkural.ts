import fs from 'fs';
import path from 'path';
import thirukkuralData from '../data/quotes/thirukkural.json';

interface Thirukkural {
  id: number;
  text: string;
  translation: string;
  transliteration: string;
  explanation: string;
}

// Create the output directory if it doesn't exist
const outputDir = path.join(process.cwd(), 'public', 'data', 'thirukkural');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Group kurals by chapter
const chapters: { [key: string]: Thirukkural[] } = {};
thirukkuralData.forEach((kural: Thirukkural) => {
  const chapterNum = Math.ceil(kural.id / 10);
  if (!chapters[chapterNum]) {
    chapters[chapterNum] = [];
  }
  chapters[chapterNum].push(kural);
});

// Write each chapter to a separate file
Object.entries(chapters).forEach(([chapterNum, kurals]) => {
  const fileName = `chapter${chapterNum}.json`;
  const filePath = path.join(outputDir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(kurals, null, 2));
  console.log(`Created ${fileName}`);
});

console.log('Thirukkural data split complete!'); 