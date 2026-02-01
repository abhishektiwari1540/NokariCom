import React, { useMemo } from 'react';
import SeoMeta from './SeoMeta';

const HomeSeo = ({ jobCount = 0 }) => {
  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KaamJaipur",
    "url": "https://kaamjaipur.in",
    "description": `Job portal for Jaipur - ${jobCount}+ Government and Private jobs`,
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://kaamjaipur.in/jobs?search={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }), [jobCount]);

  return (
    <SeoMeta
      title={`KaamJaipur - Latest Jobs in Jaipur | ${jobCount}+ Government & Private Jobs`}
      description={`Find latest government and private jobs in Jaipur. ${jobCount}+ job listings, daily updates, internships, remote work. Your trusted job portal for Jaipur youth.`}
      keywords="jobs in jaipur, jaipur jobs, government jobs jaipur, private jobs jaipur, internship jaipur, fresher jobs jaipur, part time jobs jaipur"
      ogTitle={`KaamJaipur - ${jobCount}+ Jobs in Jaipur`}
      ogDescription={`${jobCount}+ jobs in Jaipur. Government, Private, Internships, Remote Work. Updated daily.`}
      ogUrl="https://kaamjaipur.in"
      twitterTitle={`KaamJaipur - ${jobCount}+ Jobs in Jaipur`}
      twitterDescription={`Find your dream job in Jaipur. ${jobCount}+ listings updated daily.`}
      canonicalUrl="https://kaamjaipur.in"
      structuredData={structuredData}
    />
  );
};

export default HomeSeo;