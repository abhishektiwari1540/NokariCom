import React, { useMemo } from 'react';
import SeoMeta from './SeoMeta';

const JobDetailSeo = ({ job }) => {
  if (!job) return null;

  // Format salary for display
  const formatSalaryForTitle = () => {
    if (job.salary_currency === 'INR') {
      return 'Competitive Salary';
    } else if (job.salary_currency) {
      return `${job.salary_currency} Competitive`;
    }
    return 'Competitive Salary';
  };

  // Generate job location
  const getJobLocation = () => {
    if (job.location) {
      const parts = job.location.split(',');
      return parts[0] || 'Jaipur';
    }
    return 'Jaipur';
  };

  // Generate experience text
  const getExperienceText = () => {
    if (job.experience) {
      return ` | ${job.experience} experience`;
    }
    return '';
  };

  // Generate skills text
  const getSkillsText = () => {
    if (job.skills && job.skills.length > 0) {
      return job.skills.slice(0, 3).join(', ');
    }
    return 'various skills';
  };

  const title = `${job.job_title} at ${job.company_name} ${getJobLocation()} - ${formatSalaryForTitle()}${getExperienceText()} | KaamJaipur`;
  
  const description = `Apply for ${job.job_title} position at ${job.company_name} in ${getJobLocation()}. ${job.description ? job.description.substring(0, 150) : ''} Required skills: ${getSkillsText()}. Apply now on KaamJaipur.`;

  const keywords = `${job.job_title.toLowerCase()} jobs jaipur, ${job.company_name.toLowerCase()} careers, ${job.category ? job.category.toLowerCase() : 'general'} jobs jaipur, ${getJobLocation().toLowerCase()} jobs`;

  const structuredData = useMemo(() => {
    const jobPosting = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.job_title,
      "description": job.description || `${job.job_title} position at ${job.company_name} in ${getJobLocation()}`,
      "datePosted": job.posted_date ? new Date(job.posted_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      "validThrough": job.posted_date ? new Date(new Date(job.posted_date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "employmentType": job.type || "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.company_name,
        "sameAs": job.url || `https://kaamjaipur.in/companies/${job.company_name.toLowerCase().replace(/\s+/g, '-')}`,
        "logo": job.company_logo || "https://kaamjaipur.in/logo.png"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": getJobLocation(),
          "addressRegion": "Rajasthan",
          "addressCountry": "IN"
        }
      },
      "applicantLocationRequirements": {
        "@type": "Country",
        "name": "IN"
      },
      "jobLocationType": job.is_remote ? "TELECOMMUTE" : "OnSite"
    };

    // Add salary if available
    if (job.salary_currency && job.salary_amount) {
      jobPosting.baseSalary = {
        "@type": "MonetaryAmount",
        "currency": job.salary_currency,
        "value": {
          "@type": "QuantitativeValue",
          "value": job.salary_amount,
          "unitText": "YEAR"
        }
      };
    }

    // Add experience if available
    if (job.experience) {
      jobPosting.experienceRequirements = {
        "@type": "OccupationalExperienceRequirements",
        "monthsOfExperience": getExperienceMonths(job.experience)
      };
    }

    return jobPosting;
  }, [job]);

  // Helper function to convert experience to months
  const getExperienceMonths = (exp) => {
    if (exp === 'Fresher') return 0;
    if (exp === '1-3 years') return 24;
    if (exp === '3-5 years') return 48;
    if (exp === '5+ years') return 60;
    return 0;
  };

  return (
    <SeoMeta
      title={title}
      description={description}
      keywords={keywords}
      ogTitle={title}
      ogDescription={description}
      ogImage={job.company_logo || 'https://kaamjaipur.in/og-image.jpg'}
      ogUrl={`https://kaamjaipur.in/jobs/${job.job_id}`}
      ogType="article"
      twitterTitle={title}
      twitterDescription={description}
      twitterImage={job.company_logo || 'https://kaamjaipur.in/twitter-card.jpg'}
      canonicalUrl={`https://kaamjaipur.in/jobs/${job.job_id}`}
      structuredData={structuredData}
    />
  );
};

export default JobDetailSeo;