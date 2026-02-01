import React, { useMemo } from 'react';
import SeoMeta from './SeoMeta';

const JobDetailSeo = ({ job }) => {
  const seoData = useMemo(() => {
    if (!job) {
      return {
        title: 'Job Details - KaamJaipur | Latest Jobs in Jaipur',
        description: 'View detailed job information on KaamJaipur. Find your perfect job opportunity in Jaipur with competitive salaries and benefits.',
        keywords: 'job details, job description, apply jobs Jaipur, career opportunities',
        structuredData: {
          "@context": "https://schema.org/",
          "@type": "WebPage",
          "name": "Job Details | KaamJaipur",
          "description": "Find job opportunities in Jaipur"
        }
      };
    }

    // Helper functions
    const getJobLocation = () => {
      if (job.location) {
        const parts = job.location.split(',');
        return parts[0] || 'Jaipur';
      }
      return 'Jaipur';
    };

    const getExperienceText = () => {
      if (job.experience) {
        return `${job.experience} experience`;
      }
      return 'Entry level';
    };

    const getSkillsText = () => {
      if (job.skills && job.skills.length > 0) {
        return job.skills.slice(0, 5).join(', ');
      }
      return 'various skills';
    };

    const getSalaryText = () => {
      if (job.salary_currency && job.salary_amount) {
        if (job.salary_currency === 'INR') {
          return `₹${job.salary_amount.toLocaleString()}`;
        }
        return `${job.salary_currency} ${job.salary_amount.toLocaleString()}`;
      }
      return 'competitive salary';
    };

    const location = getJobLocation();
    const experienceText = getExperienceText();
    const skillsText = getSkillsText();
    const salaryText = getSalaryText();

    // Create title (keep under 60 chars)
    const title = `${job.job_title} in ${location} | ${job.company_name} Hiring`;
    if (title.length > 60) {
      title = `${job.job_title} Job in ${location} | KaamJaipur`;
    }

    // Create description (150-220 chars)
    const description = `Apply for ${job.job_title} at ${job.company_name} in ${location}. ${experienceText}. Required skills: ${skillsText}. ${salaryText}. Apply now on KaamJaipur job portal.`;

    // Keywords including job-specific terms
    const keywords = [
      `${job.job_title.toLowerCase()} jobs Jaipur`,
      `${job.company_name.toLowerCase()} careers`,
      `${location.toLowerCase()} jobs`,
      `${job.category ? job.category.toLowerCase() + ' jobs' : 'general jobs'}`,
      `${experienceText.toLowerCase()} jobs`,
      'hire in Jaipur',
      'career opportunities Rajasthan',
      job.job_title.toLowerCase(),
      job.company_name.toLowerCase(),
      'KaamJaipur'
    ].filter(Boolean).join(', ');

    // Structured data for job posting
    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": job.job_title,
      "description": job.description || description,
      "datePosted": job.posted_date || new Date().toISOString(),
      "validThrough": job.valid_through || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      "employmentType": job.type || "FULL_TIME",
      "hiringOrganization": {
        "@type": "Organization",
        "name": job.company_name,
        "sameAs": job.company_website || `https://kaamjaipur.in/companies/${job.company_id}`,
        "logo": job.company_logo || "https://kaamjaipur.in/logo.png"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": job.address || "",
          "addressLocality": location,
          "addressRegion": "Rajasthan",
          "postalCode": job.pincode || "302001",
          "addressCountry": "IN"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": job.salary_currency || "INR",
        "value": {
          "@type": "QuantitativeValue",
          "value": job.salary_amount || "",
          "unitText": "MONTH"
        }
      },
      "experienceRequirements": {
        "@type": "OccupationalExperienceRequirements",
        "monthsOfExperience": job.experience_months || 0
      },
      "educationRequirements": job.education || "Any Graduate",
      "skills": skillsText,
      "responsibilities": job.responsibilities || "",
      "qualifications": job.qualifications || "",
      "incentiveCompensation": job.incentives || "",
      "jobBenefits": job.benefits || ""
    };

    return {
      title,
      description,
      keywords,
      structuredData,
      ogImage: job.company_logo || 'https://kaamjaipur.in/og-image.jpg',
      ogUrl: `https://kaamjaipur.in/jobs/${job.job_id}`,
      canonicalUrl: `https://kaamjaipur.in/jobs/${job.job_id}`,
      ogType: 'article'
    };
  }, [job]);

  return (
    <>
      <SeoMeta
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        ogTitle={seoData.title}
        ogDescription={seoData.description}
        ogImage={seoData.ogImage}
        ogUrl={seoData.ogUrl}
        ogType={seoData.ogType}
        twitterTitle={seoData.title}
        twitterDescription={seoData.description}
        twitterImage={seoData.ogImage}
        canonicalUrl={seoData.canonicalUrl}
        structuredData={seoData.structuredData}
      />
      
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">{seoData.title.replace('|', '-')}</h1>
    </>
  );
};

export default JobDetailSeo;