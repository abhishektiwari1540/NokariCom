import React from 'react';
import { Helmet } from 'react-helmet-async';

const SeoMeta = ({
  title = 'KaamJaipur - Latest Jobs in Jaipur | Government & Private Jobs',
  description = 'Find latest government and private jobs in Jaipur. 10,000+ job listings, daily updates, internships, remote work. Your trusted job portal for Jaipur youth.',
  keywords = 'jobs in jaipur, jaipur jobs, government jobs jaipur, private jobs jaipur, internship jaipur, fresher jobs jaipur',
  ogTitle = 'KaamJaipur - Jaipur Ka Apna Job Portal',
  ogDescription = '10,000+ jobs in Jaipur. Government, Private, Internships, Remote Work.',
  ogImage = 'https://kaamjaipur.in/og-image.jpg',
  ogUrl = 'https://kaamjaipur.in',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle = 'KaamJaipur - Latest Jobs in Jaipur',
  twitterDescription = 'Find your dream job in Jaipur. 10,000+ listings updated daily.',
  twitterImage = 'https://kaamjaipur.in/twitter-card.jpg',
  canonicalUrl = 'https://kaamjaipur.in',
  structuredData = null
}) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="KaamJaipur" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={twitterImage} />
      <meta name="twitter:site" content="@kaamjaipur" />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="KaamJaipur" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SeoMeta;