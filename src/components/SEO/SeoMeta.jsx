import React from 'react';
import { Helmet } from 'react-helmet';

const SeoMeta = ({
  title = 'KaamJaipur - Latest Jobs in Jaipur | Government & Private Jobs',
  description = 'Find your dream job in Jaipur. Browse 1000+ government, private, remote, and internship jobs updated daily. Apply now!',
  keywords = 'jobs Jaipur, careers Jaipur, employment Jaipur, government jobs, private jobs, internships, remote work, hiring Jaipur',
  ogTitle,
  ogDescription,
  ogImage = 'https://kaamjaipur.in/og-image.jpg',
  ogUrl = 'https://kaamjaipur.in',
  ogType = 'website',
  twitterTitle,
  twitterDescription,
  twitterImage = 'https://kaamjaipur.in/twitter-card.jpg',
  twitterSite = '@kaamjaipur',
  canonicalUrl = 'https://kaamjaipur.in',
  structuredData,
  children,
  noindex = false,
  robots = 'index, follow',
}) => {
  // Ensure proper title length (20-60 chars)
  const seoTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  
  // Ensure proper description length (150-220 chars)
  const seoDescription = description.length > 220 
    ? description.substring(0, 217) + '...' 
    : description.length < 150
    ? description + ' Find latest job opportunities in Jaipur with competitive salaries.'
    : description;

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={keywords} />
        
        {/* Robots */}
        <meta name="robots" content={robots} />
        {noindex && <meta name="robots" content="noindex, nofollow" />}
        
        {/* Canonical URL */}
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={ogTitle || seoTitle} />
        <meta property="og:description" content={ogDescription || seoDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:type" content={ogType} />
        <meta property="og:site_name" content="KaamJaipur" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={twitterTitle || seoTitle} />
        <meta name="twitter:description" content={twitterDescription || seoDescription} />
        <meta name="twitter:image" content={twitterImage} />
        <meta name="twitter:site" content={twitterSite} />
        <meta name="twitter:creator" content={twitterSite} />
        
        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="language" content="English" />
        <meta name="geo.region" content="IN-RJ" />
        <meta name="geo.placename" content="Jaipur, Rajasthan" />
        <meta name="geo.position" content="26.9124;75.7873" />
        <meta name="ICBM" content="26.9124, 75.7873" />
        
        {/* Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#e91e63" />
        
        {/* Additional for SEO */}
        <meta name="author" content="KaamJaipur" />
        <meta name="publisher" content="KaamJaipur" />
        <meta name="copyright" content="KaamJaipur" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="1 days" />
      </Helmet>
      
      {/* Render H1 heading for SEO */}
      {children}
    </>
  );
};

export default SeoMeta;