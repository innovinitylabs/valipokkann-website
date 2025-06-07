import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import siteConfig from '../config/site-config';

interface ArtworkData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image: string;
  creator: {
    '@type': string;
    name: string;
  };
  dateCreated: string;
  url: string;
}

const generateStructuredData = async (): Promise<void> => {
  const baseUrl = `https://${siteConfig.domain}`;
  const structuredData: { [key: string]: ArtworkData[] } = {
    artwork: [],
    photography: []
  };

  // Process artwork
  const artworkFiles = await glob.sync('src/data/artwork/*.md');
  artworkFiles.forEach((file: string) => {
    const content = fs.readFileSync(file, 'utf-8');
    const slug = path.basename(file, '.md');
    const frontMatter = content.split('---')[1];
    const title = frontMatter.match(/title:\s*(.*)/)?.[1] || '';
    const description = frontMatter.match(/description:\s*(.*)/)?.[1] || '';
    const date = frontMatter.match(/date:\s*(.*)/)?.[1] || new Date().toISOString();
    const image = frontMatter.match(/image:\s*(.*)/)?.[1] || '';

    structuredData.artwork.push({
      '@context': 'https://schema.org',
      '@type': 'VisualArtwork',
      name: title,
      description: description,
      image: `${baseUrl}${image}`,
      creator: {
        '@type': 'Person',
        name: siteConfig.author
      },
      dateCreated: date,
      url: `${baseUrl}/art/${slug}`
    });
  });

  // Process photography
  const photoFiles = await glob.sync('src/data/photography/*.md');
  photoFiles.forEach((file: string) => {
    const content = fs.readFileSync(file, 'utf-8');
    const slug = path.basename(file, '.md');
    const frontMatter = content.split('---')[1];
    const title = frontMatter.match(/title:\s*(.*)/)?.[1] || '';
    const description = frontMatter.match(/description:\s*(.*)/)?.[1] || '';
    const date = frontMatter.match(/date:\s*(.*)/)?.[1] || new Date().toISOString();
    const image = frontMatter.match(/image:\s*(.*)/)?.[1] || '';

    structuredData.photography.push({
      '@context': 'https://schema.org',
      '@type': 'Photograph',
      name: title,
      description: description,
      image: `${baseUrl}${image}`,
      creator: {
        '@type': 'Person',
        name: siteConfig.author
      },
      dateCreated: date,
      url: `${baseUrl}/photography/${slug}`
    });
  });

  // Write structured data to JSON files
  fs.writeFileSync('public/structured-data-artwork.json', JSON.stringify(structuredData.artwork, null, 2));
  fs.writeFileSync('public/structured-data-photography.json', JSON.stringify(structuredData.photography, null, 2));
};

export default generateStructuredData; 