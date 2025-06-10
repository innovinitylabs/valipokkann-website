interface DataLayerEvent {
  event: string;
  [key: string]: any;
}

interface Window {
  dataLayer: DataLayerEvent[];
  gtag: (...args: any[]) => void;
}

declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
    gtag: (...args: any[]) => void;
  }
}

export {}; 