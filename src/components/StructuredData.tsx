import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'artwork' | 'photography' | 'article' | 'person' | 'website';
  data: any;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  useEffect(() => {
    const generateStructuredData = () => {
      let structuredData: any = {
        "@context": "https://schema.org",
      };

      switch (type) {
        case 'artwork':
          structuredData = {
            ...structuredData,
            "@type": "VisualArtwork",
            "name": data.title || "Untitled Artwork",
            "image": data.thumbnail || data.fullImage,
            "description": data.description,
            "dateCreated": data.year,
            "creator": {
              "@type": "Person",
              "name": "VALIPOKKANN"
            },
            "url": window.location.href
          };
          break;

        case 'photography':
          structuredData = {
            ...structuredData,
            "@type": "Photograph",
            "name": data.title || "Untitled Photograph",
            "image": data.image,
            "description": data.description,
            "dateCreated": data.dateTaken,
            "creator": {
              "@type": "Person",
              "name": "VALIPOKKANN"
            },
            "url": window.location.href
          };
          break;

        case 'article':
          structuredData = {
            ...structuredData,
            "@type": "Article",
            "headline": data.title,
            "image": data.thumbnail,
            "description": data.description,
            "datePublished": data.date,
            "author": {
              "@type": "Person",
              "name": "VALIPOKKANN"
            },
            "url": window.location.href
          };
          break;

        case 'person':
          structuredData = {
            ...structuredData,
            "@type": "Person",
            "name": "VALIPOKKANN",
            "url": "https://valipokkann.in",
            "image": "https://valipokkann.in/valipokkann_transparent_logo.png",
            "sameAs": [
              "https://github.com/valipokkann",
              "https://instagram.com/valipokkann"
            ],
            "jobTitle": "Artist",
            "description": "A contemporary artist, revolutionary, and visionary exploring the intersection of art, technology, and social change.",
            "worksFor": {
              "@type": "Organization",
              "name": "VALIPOKKANN"
            }
          };
          break;

        case 'website':
          structuredData = {
            ...structuredData,
            "@type": "WebSite",
            "name": "VALIPOKKANN",
            "url": "https://valipokkann.in",
            "description": "VALIPOKKANN - Artist • Revolutionary • Visionary",
            "publisher": {
              "@type": "Person",
              "name": "VALIPOKKANN"
            }
          };
          break;
      }

      return structuredData;
    };

    try {
      const structuredData = generateStructuredData();
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        script.remove();
      };
    } catch (error) {
      console.error('Error generating structured data:', error);
    }
  }, [type, data]);

  return null;
};

export default StructuredData; 