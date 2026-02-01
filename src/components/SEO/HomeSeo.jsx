import React, { useMemo } from 'react';
import SeoMeta from './SeoMeta';

const HomeSeo = ({ totalJobs = 0 }) => {
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KaamJaipur",
    "alternateName": "Jaipur Jobs Portal",
    "url": "https://kaamjaipur.in",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://kaamjaipur.in/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "description": "Find latest job opportunities in Jaipur, Rajasthan",
    "publisher": {
      "@type": "Organization",
      "name": "KaamJaipur",
      "logo": {
        "@type": "ImageObject",
        "url": "https://kaamjaipur.in/logo.png"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": "Jaipur",
      "containedInPlace": {
        "@type": "State",
        "name": "Rajasthan",
        "containedInPlace": {
          "@type": "Country",
          "name": "India"
        }
      }
    }
  }), []);

  const jobCountText = totalJobs > 0 ? `${totalJobs}+` : '1000+';

  return (
    <>
      <SeoMeta
        title={`KaamJaipur - Latest Jobs in Jaipur | ${jobCountText} Government & Private Jobs`}
        description={`Find ${jobCountText} job opportunities in Jaipur. Browse government jobs, private sector careers, internships, and remote work options. Updated daily with new vacancies.`}
        keywords={`jobs Jaipur, careers Jaipur, employment opportunities, government jobs Jaipur, private jobs Jaipur, internships, remote work, ${jobCountText} jobs, hiring in Jaipur, Rajasthan jobs`}
        ogTitle={`KaamJaipur - ${jobCountText} Jobs in Jaipur`}
        ogDescription={`${jobCountText} jobs in Jaipur. Government, Private, Internships, Remote Work. Updated daily.`}
        twitterTitle={`KaamJaipur - ${jobCountText} Jobs in Jaipur`}
        twitterDescription={`Find your dream job in Jaipur. ${jobCountText} listings updated daily.`}
        structuredData={structuredData}
      />
      
      {/* Hidden H1 for SEO (visually hidden but accessible) */}
      <h1 className="sr-only">KaamJaipur - Find {jobCountText} Jobs in Jaipur, Rajasthan</h1>
      <h2 className="sr-only">Best Job Portal for Government and Private Jobs in Jaipur</h2>
    </>
  );
};

export default HomeSeo;