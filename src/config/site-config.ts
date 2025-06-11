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

export const siteConfig: SiteConfig = {
  title: 'VALIPOKKANN',
  description: 'VALIPOKKANN - Artist • Revolutionary • Visionary',
  author: 'VALIPOKKANN',
  domain: 'valipokkann.in',
  navigation: [
    { path: '/', label: 'Home' },
    { path: '/art', label: 'Art' },
    { path: '/photography', label: 'Photography' },
    { path: '/thirukkural', label: 'Thirukkural' },
    { path: '/fusion', label: 'Fusion' },
    { path: '/articles', label: 'Articles' },
    { path: '/music', label: 'Music' },
    { path: '/about', label: 'About' },
    { path: '/links', label: 'Links' }
  ],
  social: {
    instagram: 'https://instagram.com/valipokkann',
    twitter: 'https://twitter.com/valipokkann',
    email: 'valipokkann@proton.me'
  }
};

export default siteConfig; 