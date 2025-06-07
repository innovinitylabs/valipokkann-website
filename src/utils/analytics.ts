// Google Analytics Measurement ID
export const GA_MEASUREMENT_ID = 'G-JGDQ4FE21R';

// Initialize Google Analytics
export const initGA = () => {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
};

// Track page views
export const trackPageView = (path: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};

// Track events
export const trackEvent = (action: string, category: string, label: string, value?: number) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track Core Web Vitals
export const trackWebVitals = (metric: any) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value),
      non_interaction: true,
    });
  }
};

// Track search queries
export const trackSearch = (query: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'search', {
      search_term: query,
    });
  }
};

// Track outbound links
export const trackOutboundLink = (url: string) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'click', {
      event_category: 'outbound',
      event_label: url,
      transport_type: 'beacon',
    });
  }
}; 