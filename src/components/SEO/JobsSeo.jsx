import React, { useMemo } from 'react';
import SeoMeta from './SeoMeta';

const JobsSeo = ({
  jobCount = 0,
  searchQuery = '',
  jobType = '',
  companyCount = 0
}) => {
  const title = searchQuery 
    ? `${searchQuery} Jobs in Jaipur - ${jobCount} Openings | KaamJaipur`
    : jobType
    ? `${jobType.replace('-', ' ')} Jobs in Jaipur - ${jobCount} Openings | KaamJaipur`
    : `Browse All Jobs in Jaipur - ${jobCount}+ Openings | KaamJaipur`;

  const description = searchQuery
    ? `Find ${jobCount} ${searchQuery} job openings in Jaipur. Apply now for latest vacancies with competitive salaries. Filter by experience, company, location.`
    : `Browse ${jobCount}+ job openings in Jaipur. Filter by ${companyCount}+ companies, salary, experience, location. Government jobs, private sector, internships, remote work.`;

  const keywords = searchQuery
    ? `${searchQuery} jobs jaipur, ${searchQuery} vacancies jaipur, ${searchQuery} careers jaipur, ${searchQuery} employment jaipur`
    : `jaipur jobs list, all jobs jaipur, job openings jaipur, latest vacancies jaipur, job search jaipur`;

  const structuredData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": `https://kaamjaipur.in/jobs${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": jobCount,
      "itemListElement": Array.from({ length: Math.min(jobCount, 10) }).map((_, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "JobPosting",
          "name": "Multiple Job Openings in Jaipur",
          "description": "Various job opportunities available in Jaipur"
        }
      }))
    }
  }), [title, description, searchQuery, jobCount]);

  return (
    <SeoMeta
      title={title}
      description={description}
      keywords={keywords}
      ogTitle={title}
      ogDescription={description}
      ogUrl={`https://kaamjaipur.in/jobs${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`}
      twitterTitle={title}
      twitterDescription={description}
      canonicalUrl={`https://kaamjaipur.in/jobs${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ''}`}
      structuredData={structuredData}
    />
  );
};

export default JobsSeo;