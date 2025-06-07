import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface KuralData {
  Number: number;
  Line1: string;
  Line2: string;
  Translation: string;
  transliteration1: string;
  transliteration2: string;
  chapter: number;
  chapter_name: string;
  chapter_name_eng: string;
  couplet_number: number;
  explanation: string;
}

interface ThirukkuralApiResponse {
  Thirukkural: KuralData[];
}

interface Quote {
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

const THIRUKKURAL_API_URL = 'https://raw.githubusercontent.com/Katheesh/Thirukkural/master/thirukkural.json';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'data', 'quotes');
const OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'thirukkural.json');

export async function generateThirukkuralQuotes() {
  try {
    console.log('Fetching Thirukkural data...');
    const response = await fetch(THIRUKKURAL_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const apiData: ThirukkuralApiResponse = await response.json();

    const quotes: Quote[] = apiData.Thirukkural.map((kural: KuralData) => ({
      id: kural.Number,
      chapter: kural.chapter,
      chapter_name: kural.chapter_name,
      chapter_name_eng: kural.chapter_name_eng,
      couplet_number: kural.couplet_number,
      text: `${kural.Line1}\n${kural.Line2}`,
      translation: kural.Translation,
      transliteration: `${kural.transliteration1}\n${kural.transliteration2}`,
      explanation: kural.explanation,
      source: 'Thirukkural',
    }));

    // Ensure the output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Write the formatted quotes to a JSON file
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(quotes, null, 2));

    console.log(`Successfully generated ${quotes.length} Thirukkural quotes to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error generating Thirukkural quotes:', error);
    process.exit(1);
  }
}

generateThirukkuralQuotes(); 