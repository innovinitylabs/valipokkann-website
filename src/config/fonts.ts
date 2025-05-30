export interface FontConfig {
  name: string;
  url: string;
  weights: number[];
  display: 'swap' | 'block' | 'auto' | 'fallback' | 'optional';
}

export const fonts: FontConfig[] = [
  {
    name: 'Inter',
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    weights: [400, 500, 600, 700],
    display: 'swap'
  },
  {
    name: 'Noto Serif Tamil',
    url: 'https://fonts.googleapis.com/css2?family=Noto+Serif+Tamil:wght@400;500;600;700&display=swap',
    weights: [400, 500, 600, 700],
    display: 'swap'
  }
];

// Add more fonts here as needed
export const fontFamilies = {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  serif: ['Noto Serif Tamil', 'Georgia', 'serif']
}; 