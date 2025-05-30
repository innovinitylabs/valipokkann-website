export interface NavItem {
  path: string;
  label: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  author: string;
  domain: string;
  navigation: NavItem[];
  social: {
    instagram: string;
    twitter: string;
    email: string;
  };
}

const siteConfig: SiteConfig = {
  title: 'Valipokkann',
  description: 'Artist • Revolutionary • Visionary',
  author: 'Valipokkann',
  domain: 'valipokkann.in',
  navigation: [
    { path: '/', label: 'Home' },
    { path: '/art', label: 'Art' },
    { path: '/articles', label: 'Articles' },
    { path: '/music', label: 'Music' },
    { path: '/about', label: 'About' },
  ],
  social: {
    instagram: 'https://instagram.com/valipokkann',
    twitter: 'https://twitter.com/valipokkann',
    email: 'contact@valipokkann.in',
  },
};

export default siteConfig; 