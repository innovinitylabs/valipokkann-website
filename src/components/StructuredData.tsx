import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'artwork' | 'photography';
  data: any;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  useEffect(() => {
    // Load the appropriate structured data file
    fetch(`/structured-data-${type}.json`)
      .then(response => response.json())
      .then(structuredData => {
        // Find the matching item
        const item = structuredData.find((item: any) => item.url === window.location.href);
        if (item) {
          // Add the structured data to the page
          const script = document.createElement('script');
          script.type = 'application/ld+json';
          script.text = JSON.stringify(item);
          document.head.appendChild(script);
        }
      })
      .catch(error => console.error('Error loading structured data:', error));

    return () => {
      // Clean up the script when the component unmounts
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => script.remove());
    };
  }, [type, data]);

  return null;
};

export default StructuredData; 