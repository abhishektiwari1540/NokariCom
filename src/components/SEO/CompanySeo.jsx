import React, { useMemo } from 'react';
import SeoMeta from './SeoMeta';

const CompanySeo = ({ company, jobCount = 0 }) => {
  if (!company) return null;

  const title = `${company.name} Jobs in Jaipur - ${jobCount} Open Positions | KaamJaipur`;
  
  const description = `Apply for ${jobCount} job openings at ${company.name} in Jaipur. Latest vacancies with competitive salaries. ${company.name} careers and employment opportunities.`;

  const keywords = `${company.name.toLowerCase()} jobs jaipur, ${company.name.toLowerCase()} careers, ${company.name.toLowerCase()} vacancies, ${company.name.toLowerCase()} recruitment jaipur`;

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": company.name,
    "url": `https://kaamjaipur.in/companies/${company.id}`,
    "logo": company.logo || "https://kaamjaipur.in/logo.png",
    "description": `${company.name} job openings in Jaipur - ${jobCount} positions available`,
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": "1000+"
    },
    "location": {
      "@type": "Place",
      "name": "Jaipur, Rajasthan"
    }
  }), [company, jobCount]);

  return (
    <SeoMeta
      title={title}
      description={description}
      keywords={keywords}
      ogTitle={title}
      ogDescription={description}
      ogImage={company.logo || 'https://kaamjaipur.in/og-image.jpg'}
      ogUrl={`https://kaamjaipur.in/companies/${company.id}`}
      twitterTitle={title}
      twitterDescription={description}
      twitterImage={company.logo || 'https://kaamjaipur.in/twitter-card.jpg'}
      canonicalUrl={`https://kaamjaipur.in/companies/${company.id}`}
      structuredData={structuredData}
    />
  );
};

export default CompanySeo;