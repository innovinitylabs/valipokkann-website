import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const getBreadcrumbLabel = (path: string): string => {
    const labels: { [key: string]: string } = {
      art: 'Art',
      photography: 'Photography',
      thirukkural: 'Thirukkural',
      articles: 'Articles',
      music: 'Music',
      about: 'About',
      links: 'Links'
    };
    return labels[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', path: '/' },
    ...pathnames.map((value, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      return {
        label: getBreadcrumbLabel(value),
        path
      };
    })
  ];

  // Generate structured data for breadcrumbs
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://valipokkann.in${item.path}`
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      </Helmet>
      <nav className="text-sm breadcrumbs mb-4" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center space-x-2">
          {breadcrumbs.map((item, index) => (
            <li key={item.path} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-500 dark:text-gray-400">/</span>
              )}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs; 