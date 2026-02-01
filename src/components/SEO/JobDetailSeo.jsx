import React, { useMemo } from 'react';
import SeoMeta from './SeoMeta';

const JobDetailSeo = ({ job }) => {
  // Define these helper functions at the top level
  const formatSalaryForTitle = () => {
    if (!job) return 'Competitive Salary';
    if (job.salary_currency === 'INR') {
      return 'Competitive Salary';
    } else if (job.salary_currency) {
      return `${job.salary_currency} Competitive`;
    }
    return 'Competitive Salary';
  };

  const getJobLocation = () => {
    if (!job) return 'Jaipur';
    if (job.location) {
      const parts = job.location.split(',');
      return parts[0] || 'Jaipur';
    }
    return 'Jaipur';
  };

  const getExperienceText = () => {
    if (!job || !job.experience) return '';
    return ` | ${job.experience} experience`;
  };

  const getSkillsText = () => {
    if (!job || !job.skills || job.skills.length === 0) {
      return 'various skills';
    }
    return job.skills.slice(0, 3).join(', ');
  };

  const getExperienceMonths = (exp) => {
    if (exp === 'Fresher') return 0;
    if (exp === '1-3 years') return 24;
    if (exp === '3-5 years') return 48;
    if (exp === '5+ years') return 60;
    return 0;
  };

  // Move the early return logic to after hooks
  const location = useMemo(() => getJobLocation(), [job]);
  const formattedSalary = useMemo(() => formatSalaryForTitle(), [job]);
  const experienceText = useMemo(() => getExperienceText(), [job]);
  const skillsText = useMemo(() => getSkillsText(), [job]);

  // Generate SEO content
  const title = useMemo(() => {
    if (!job) return 'Job Details | KaamJaipur';
    return `${job.job_title} at ${job.company_name} ${location} - ${formattedSalary}${experienceText} | KaamJaipur`;
  }, [job, location, formattedSalary, experienceText]);

  const description = useMemo(() => {
    if (!job) return 'Find the best job opportunities in Jaipur on KaamJaipur.';
    return `Apply for ${job.job_title} position at ${job.company_name} in ${location}. ${job.description ? job.description.substring(0, 150) : ''} Required skills: ${skillsText}. Apply now on KaamJaipur.`;
  }, [job, location, skillsText]);

  const keywords = useMemo(() => {
    if (!job) return 'jobs jaipur, careers, employment opportunities';
    return `${job.job_title.toLowerCase()} jobs jaipur, ${job.company_name.toLowerCase()} careers, ${job.category ? job.category.toLowerCase() : 'general'} jobs jaipur, ${location.toLowerCase()} jobs`;
  }, [job, location]);

  // Structured data
  const structuredData = useMemo(() => {
    if (!job) {
      return {
        "@context": "https://schema.org/",
        "@type": "WebPage",
        "name": "Job Details | KaamJaipur",
        "description": "Find job opportunities in Jaipur"
      };
    }

    const jobPosting = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.job_title,
      "description": job.description || `${job.job_title} position at ${job.company_name} in ${location}`,
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
          "addressLocality": location,
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

    if (job.experience) {
      jobPosting.experienceRequirements = {
        "@type": "OccupationalExperienceRequirements",
        "monthsOfExperience": getExperienceMonths(job.experience)
      };
    }

    return jobPosting;
  }, [job, location]);

  // Early return at the end, after all hooks
  if (!job) {
    return (
      <SeoMeta
        title="Job Details | KaamJaipur"
        description="Find the best job opportunities in Jaipur on KaamJaipur."
        keywords="jobs jaipur, careers, employment opportunities"
        ogTitle="Job Details | KaamJaipur"
        ogDescription="Find the best job opportunities in Jaipur on KaamJaipur."
        ogImage="https://kaamjaipur.in/og-image.jpg"
        ogUrl="https://kaamjaipur.in/jobs"
        ogType="website"
        twitterTitle="Job Details | KaamJaipur"
        twitterDescription="Find the best job opportunities in Jaipur on KaamJaipur."
        twitterImage="https://kaamjaipur.in/twitter-card.jpg"
        canonicalUrl="https://kaamjaipur.in/jobs"
        structuredData={structuredData}
      />
    );
  }

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