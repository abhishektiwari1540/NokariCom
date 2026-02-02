import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, X, Clock, Star, Building2, ExternalLink, Loader2, ChevronDown, ChevronUp, DollarSign, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import JobsSeo from '../components/SEO/JobsSeo';

// GSAP imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Framer Motion imports
import { motion, AnimatePresence } from 'framer-motion';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [showRemoteOnly, setShowRemoteOnly] = useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [jobType, setJobType] = useState(searchParams.get('type') || '');
  const [salaryRange, setSalaryRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('newest');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(20);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  
  // Refs for animations
  const headerRef = useRef(null);
  const jobCardsRef = useRef([]);
  const statsRef = useRef(null);
  const searchRef = useRef(null);
  const containerRef = useRef(null);

  const seoProps = useMemo(() => ({
    jobCount: allJobs.length,
    searchQuery: searchQuery || '',
    jobType: jobType || '',
    companyCount: companies.length
  }), [allJobs.length, searchQuery, jobType, companies.length]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
      
      if (diffInDays === 0) return 'Today';
      if (diffInDays === 1) return 'Yesterday';
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
      return `${Math.floor(diffInDays / 30)} months ago`;
    } catch {
      return 'Recently';
    }
  };

  // Filter and sort jobs with useMemo for performance
  const filteredJobs = useMemo(() => {
    let filtered = [...allJobs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        (job.skills && job.skills.some(skill => skill.toLowerCase().includes(query))) ||
        (job.description && job.description.toLowerCase().includes(query))
      );
    }

    if (selectedCompanies.length > 0) {
      filtered = filtered.filter(job =>
        selectedCompanies.includes(job.company)
      );
    }

    if (jobType) {
      if (jobType === 'government-jobs') {
        filtered = filtered.filter(job => 
          job.company.toLowerCase().includes('government') ||
          job.title.toLowerCase().includes('government') ||
          job.company.toLowerCase().includes('ministry') ||
          job.company.toLowerCase().includes('department')
        );
      } else if (jobType === 'private-jobs') {
        filtered = filtered.filter(job => 
          !job.company.toLowerCase().includes('government') &&
          !job.title.toLowerCase().includes('government')
        );
      } else if (jobType === 'internships') {
        filtered = filtered.filter(job => 
          job.title.toLowerCase().includes('intern') ||
          job.type.toLowerCase().includes('internship')
        );
      } else if (jobType === 'remote') {
        filtered = filtered.filter(job => job.is_remote);
      }
    }

    if (showRemoteOnly) {
      filtered = filtered.filter(job => job.is_remote);
    }

    if (showVerifiedOnly) {
      filtered = filtered.filter(job => job.is_verified);
    }

    if (experienceLevel) {
      filtered = filtered.filter(job => job.experience === experienceLevel);
    }

    if (salaryRange[1] < 100) {
      filtered = filtered.filter(job => {
        const salaryValue = job.salaryAmount || 0;
        return salaryValue >= salaryRange[0] && salaryValue <= salaryRange[1];
      });
    }

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.posted_date || 0) - new Date(a.posted_date || 0));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.posted_date || 0) - new Date(b.posted_date || 0));
        break;
      case 'salary_high':
        filtered.sort((a, b) => (b.salaryAmount || 0) - (a.salaryAmount || 0));
        break;
      case 'salary_low':
        filtered.sort((a, b) => (a.salaryAmount || 0) - (b.salaryAmount || 0));
        break;
      case 'company':
        filtered.sort((a, b) => a.company.localeCompare(b.company));
        break;
      case 'applicants':
        filtered.sort((a, b) => b.applicants - a.applicants);
        break;
    }

    return filtered;
  }, [allJobs, searchQuery, selectedCompanies, jobType, showRemoteOnly, showVerifiedOnly, experienceLevel, salaryRange, sortBy]);

  // Pagination - use useMemo to prevent re-calculations
  const { currentJobs, totalPages, indexOfFirstJob, indexOfLastJob } = useMemo(() => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
    
    return {
      currentJobs,
      totalPages,
      indexOfFirstJob,
      indexOfLastJob
    };
  }, [filteredJobs, currentPage, jobsPerPage]);

  // Initialize GSAP smooth scroll
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create smooth scroll effect
      gsap.to("html", {
        scrollBehavior: "smooth",
        ease: "power2.inOut",
        duration: 0.5
      });

      // Initialize ScrollTrigger
      ScrollTrigger.refresh();
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  // Animate header on load
  useEffect(() => {
    if (!loading && headerRef.current) {
      gsap.fromTo(headerRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
    }
  }, [loading]);

  // Animate search bar
  useEffect(() => {
    if (searchRef.current) {
      gsap.fromTo(searchRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, delay: 0.2, ease: "back.out(1.7)" }
      );
    }
  }, []);

  // Animate stats on scroll
  useEffect(() => {
    if (statsRef.current) {
      gsap.fromTo(statsRef.current.querySelectorAll('.stat-item'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, [allJobs]);

  // Animate job cards with staggered effect
  useEffect(() => {
    if (jobCardsRef.current.length > 0 && !loading) {
      const cards = jobCardsRef.current.filter(card => card);
      
      gsap.fromTo(cards,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, [currentJobs, loading]);

  // Initial data fetch
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://scraping-production-6a7a.up.railway.app/api/scrape');
        
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          const transformedJobs = data.data.map(job => ({
            id: job.job_id || job._id,
            job_id: job.job_id,
            title: job.job_title,
            company: job.company_name,
            location: job.location,
            salary: job.salary_currency ? `${job.salary_currency} Competitive` : 'Competitive Salary',
            salaryCurrency: job.salary_currency,
            salaryAmount: job.salary_amount || Math.floor(Math.random() * 100),
            skills: Array.isArray(job.skills) ? job.skills : (job.skills ? [job.skills] : []),
            posted: formatDate(job.posted_date),
            featured: job.is_verified || Math.random() > 0.7,
            logo: job.company_logo || '/default-company.png',
            description: job.description,
            is_remote: job.is_remote,
            is_verified: job.is_verified,
            category: job.category || 'General',
            type: job.type || 'Full-time',
            experience: getExperienceLevel(),
            requirements: job.requirements,
            benefits: job.benefits,
            posted_date: job.posted_date,
            visa_sponsorship: job.visa_sponsorship,
            relocation_assistance: job.relocation_assistance,
            applicants: job.application_count || 0,
            views: job.views_count || 0
          }));
          
          setAllJobs(transformedJobs);
          extractFilterData(transformedJobs);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    const getExperienceLevel = () => {
      const levels = ['Fresher', '1-3 years', '3-5 years', '5+ years'];
      return levels[Math.floor(Math.random() * levels.length)];
    };

    const extractFilterData = (jobs) => {
      const companyMap = new Map();
      const locationSet = new Set();
      const categorySet = new Set();
      
      jobs.forEach(job => {
        if (!companyMap.has(job.company)) {
          companyMap.set(job.company, {
            name: job.company,
            logo: job.logo,
            count: 0
          });
        }
        companyMap.get(job.company).count++;
        
        if (job.location) {
          const loc = job.location.split(',')[0].trim();
          locationSet.add(loc);
        }
        
        if (job.category && job.category !== 'General') {
          categorySet.add(job.category);
        }
      });
      
      setCompanies(Array.from(companyMap.values()).sort((a, b) => b.count - a.count));
      setLocations(Array.from(locationSet).sort());
      setCategories(Array.from(categorySet).sort());
    };

    fetchJobs();
  }, []);

  // Handle company selection
  const handleCompanyToggle = useCallback((companyName) => {
    setSelectedCompanies(prev =>
      prev.includes(companyName)
        ? prev.filter(c => c !== companyName)
        : [...prev, companyName]
    );
    setCurrentPage(1);
  }, []);

  // Handle search with animation
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    
    // Animate search action
    if (searchRef.current) {
      gsap.to(searchRef.current.querySelector('button'), {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    }
    
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  // Clear all filters with animation
  const clearAllFilters = () => {
    // Animate clear button
    gsap.to('.clear-filters-btn', {
      scale: 0.9,
      duration: 0.2,
      yoyo: true,
      repeat: 1
    });
    
    setSearchQuery('');
    setSelectedCompanies([]);
    setShowRemoteOnly(false);
    setShowVerifiedOnly(false);
    setJobType('');
    setSalaryRange([0, 100]);
    setSortBy('newest');
    setExperienceLevel('');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Load more jobs with animation
  const loadMoreJobs = () => {
    if (currentPage < totalPages) {
      setLoadingMore(true);
      
      // Animate load more button
      gsap.to('.load-more-btn', {
        scale: 0.95,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      });
      
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setLoadingMore(false);
        
        // Scroll to new jobs smoothly
        gsap.to(window, {
          scrollTo: {
            y: `+=${jobCardsRef.current[0]?.offsetHeight || 300}`,
            autoKill: true
          },
          duration: 0.8,
          ease: "power2.out"
        });
      }, 300);
    }
  };

  // Card hover animation
  const handleCardHover = (index, isHovering) => {
    if (jobCardsRef.current[index]) {
      gsap.to(jobCardsRef.current[index], {
        scale: isHovering ? 1.02 : 1,
        y: isHovering ? -5 : 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  // Loading skeleton
  if (loading && allJobs.length === 0) {
    return (
      <>
        <JobsSeo {...seoProps} />
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Skeleton className="h-12 w-full max-w-2xl mx-auto rounded-lg" />
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Filters Skeleton */}
              <div className="lg:col-span-1 space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-32 mb-4" />
                      <div className="space-y-2">
                        {[1, 2, 3].map(j => (
                          <Skeleton key={j} className="h-4 w-full" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Jobs Skeleton */}
              <div className="lg:col-span-3 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Skeleton className="w-16 h-16 rounded-lg" />
                        <div className="flex-1 space-y-3">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <div className="flex gap-4">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="flex gap-2">
                            {[1, 2, 3].map(j => (
                              <Skeleton key={j} className="h-6 w-16 rounded-full" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const FilterSection = () => (
    <div className="space-y-6">
      {/* Sort By */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Label className="font-semibold mb-2 block">Sort By</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="salary_high">Salary: High to Low</SelectItem>
            <SelectItem value="salary_low">Salary: Low to High</SelectItem>
            <SelectItem value="company">Company Name</SelectItem>
            <SelectItem value="applicants">Most Applicants</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Quick Filters */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Label className="font-semibold mb-3 block">Quick Filters</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remote" 
              checked={showRemoteOnly}
              onCheckedChange={(checked) => {
                setShowRemoteOnly(checked);
                setCurrentPage(1);
              }}
            />
            <Label htmlFor="remote" className="cursor-pointer">Remote Jobs Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="verified" 
              checked={showVerifiedOnly}
              onCheckedChange={(checked) => {
                setShowVerifiedOnly(checked);
                setCurrentPage(1);
              }}
            />
            <Label htmlFor="verified" className="cursor-pointer">Verified Jobs Only</Label>
          </div>
        </div>
      </motion.div>

      {/* Job Type */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Label className="font-semibold mb-3 block">Job Type</Label>
        <RadioGroup value={jobType} onValueChange={(value) => {
          setJobType(value);
          setCurrentPage(1);
        }}>
          <div className="space-y-2">
            {['All Types', 'Government Jobs', 'Private Jobs', 'Internships', 'Remote'].map((type, index) => (
              <motion.div
                key={type}
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <RadioGroupItem 
                  value={type === 'All Types' ? '' : type.toLowerCase().replace(' ', '-')} 
                  id={type.toLowerCase().replace(' ', '-')} 
                />
                <Label htmlFor={type.toLowerCase().replace(' ', '-')} className="cursor-pointer">
                  {type}
                </Label>
              </motion.div>
            ))}
          </div>
        </RadioGroup>
      </motion.div>

      {/* Experience Level */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Label className="font-semibold mb-3 block">Experience Level</Label>
        <RadioGroup value={experienceLevel} onValueChange={(value) => {
          setExperienceLevel(value);
          setCurrentPage(1);
        }}>
          <div className="space-y-2">
            {['All Levels', 'Fresher', '1-3 years', '3-5 years', '5+ years'].map((level, index) => (
              <motion.div
                key={level}
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <RadioGroupItem 
                  value={level === 'All Levels' ? '' : level} 
                  id={level.toLowerCase().replace(' ', '-').replace('+', 'plus')} 
                />
                <Label htmlFor={level.toLowerCase().replace(' ', '-').replace('+', 'plus')} className="cursor-pointer">
                  {level}
                </Label>
              </motion.div>
            ))}
          </div>
        </RadioGroup>
      </motion.div>

      {/* Companies */}
      {companies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Label className="font-semibold mb-3 block">Companies</Label>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {companies.slice(0, 15).map((company, index) => (
              <motion.div
                key={company.name}
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                whileHover={{ x: 5 }}
              >
                <Checkbox 
                  id={`comp-${company.name}`}
                  checked={selectedCompanies.includes(company.name)}
                  onCheckedChange={() => handleCompanyToggle(company.name)}
                />
                <Label htmlFor={`comp-${company.name}`} className="cursor-pointer flex-1 truncate">
                  {company.name}
                </Label>
                <Badge variant="outline" className="text-xs">
                  {company.count}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Salary Range */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Label className="font-semibold mb-3 block">Salary Range</Label>
        <div className="space-y-4">
          <Slider
            value={salaryRange}
            onValueChange={(value) => {
              setSalaryRange(value);
              setCurrentPage(1);
            }}
            max={100}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>${salaryRange[0]}K</span>
            <span>${salaryRange[1]}K</span>
          </div>
        </div>
      </motion.div>

      {/* Results Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        className="pt-4 border-t"
      >
        <div className="text-sm text-gray-600">
          <div className="flex justify-between mb-1">
            <span>Total Jobs:</span>
            <span className="font-semibold">{filteredJobs.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Showing:</span>
            <span className="font-semibold">
              {Math.min(indexOfFirstJob + 1, filteredJobs.length)}-
              {Math.min(indexOfLastJob, filteredJobs.length)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Clear Filters Button */}
      {(searchQuery || selectedCompanies.length > 0 || showRemoteOnly || showVerifiedOnly || jobType || experienceLevel || salaryRange[1] < 100) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="w-full text-red-600 hover:text-red-700 hover:border-red-300 clear-filters-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4 mr-2" />
            Clear All Filters
          </Button>
        </motion.div>
      )}
    </div>
  );

  return (
    <>
      <JobsSeo {...seoProps} />
      <div className="min-h-screen bg-gray-50" ref={containerRef}>
        {/* Header */}
        <div className="bg-white border-b shadow-sm" ref={headerRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {jobType ? jobType.replace('-', ' ').toUpperCase() : 'All'} Jobs in Jaipur
              </h1>
              <p className="text-gray-600">
                Discover {allJobs.length}+ opportunities from {companies.length}+ companies
              </p>
            </motion.div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl" ref={searchRef}>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="bg-white rounded-xl border-2 border-gray-200 focus-within:border-[#E91E63] p-2 flex items-center"
              >
                <Search className="w-5 h-5 text-gray-400 ml-3 mr-3" />
                <Input
                  type="text"
                  placeholder="Search jobs, companies, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg"
                />
                <Button
                  type="submit"
                  className="ml-2 text-white"
                  style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Search
                </Button>
              </motion.div>
            </form>

            {/* Active Filters */}
            <AnimatePresence>
              {(searchQuery || selectedCompanies.length > 0 || showRemoteOnly || showVerifiedOnly || jobType || experienceLevel) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 flex flex-wrap gap-2"
                >
                  {searchQuery && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Search: {searchQuery}
                        <button onClick={() => setSearchQuery('')} className="hover:bg-gray-200 rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  )}
                  
                  {selectedCompanies.map((company, index) => (
                    <motion.div
                      key={company}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {company}
                        <button onClick={() => handleCompanyToggle(company)} className="hover:bg-gray-200 rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                  
                  {jobType && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {jobType.replace('-', ' ')}
                        <button onClick={() => setJobType('')} className="hover:bg-gray-200 rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  )}
                  
                  {showRemoteOnly && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Remote Only
                        <button onClick={() => setShowRemoteOnly(false)} className="hover:bg-gray-200 rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  )}
                  
                  {showVerifiedOnly && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Verified Only
                        <button onClick={() => setShowVerifiedOnly(false)} className="hover:bg-gray-200 rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  )}
                  
                  {experienceLevel && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                    >
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Exp: {experienceLevel}
                        <button onClick={() => setExperienceLevel('')} className="hover:bg-gray-200 rounded-full p-0.5">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Filter Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="mt-6 lg:hidden"
            >
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="w-4 h-4 mr-2" />
                {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                {showMobileFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="sticky top-8 shadow-lg">
                  <CardContent className="p-6">
                    <FilterSection />
                  </CardContent>
                </Card>
              </motion.div>
            </aside>

            {/* Mobile Filters Overlay */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "spring", damping: 25 }}
                    className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Filters</h3>
                        <button 
                          onClick={() => setShowMobileFilters(false)}
                          className="p-2 hover:bg-gray-100 rounded-full"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      <FilterSection />
                      <Button
                        className="w-full mt-6 text-white"
                        style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                        onClick={() => setShowMobileFilters(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Job Listings */}
            <div className="flex-1">
              {/* Results Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredJobs.length} Job{filteredJobs.length !== 1 ? 's' : ''} Found
                  </h2>
                  {searchQuery && (
                    <p className="text-gray-600 mt-1">
                      Results for: <span className="font-semibold">{searchQuery}</span>
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="hidden lg:block">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="salary_high">Salary: High to Low</SelectItem>
                        <SelectItem value="salary_low">Salary: Low to High</SelectItem>
                        <SelectItem value="company">Company Name</SelectItem>
                        <SelectItem value="applicants">Most Applicants</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              </motion.div>

              {/* Job Cards */}
              {filteredJobs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                      <p className="text-gray-600 mb-6">
                        Try adjusting your search or filter criteria
                      </p>
                      <Button
                        variant="outline"
                        onClick={clearAllFilters}
                        className="hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63]"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Clear All Filters
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <>
                  <div className="grid gap-4">
                    {currentJobs.map((job, index) => (
                      <div
                        key={job.id}
                        ref={el => jobCardsRef.current[index] = el}
                        onMouseEnter={() => handleCardHover(index, true)}
                        onMouseLeave={() => handleCardHover(index, false)}
                      >
                        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#E91E63] relative overflow-hidden group">
                          {/* Animated background effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63]/0 via-[#E91E63]/5 to-[#FF6F00]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-0" />
                          
                          <CardContent className="p-6 relative z-10">
                            <div className="flex flex-col md:flex-row gap-4">
                              {/* Company Logo with animation */}
                              <motion.div
                                whileHover={{ rotate: [0, -5, 5, 0] }}
                                transition={{ duration: 0.5 }}
                                className="flex-shrink-0"
                              >
                                <img 
                                  src={job.logo} 
                                  alt={job.company} 
                                  className="w-20 h-20 object-contain rounded-lg border bg-white group-hover:shadow-lg transition-shadow duration-300"
                                  onError={(e) => {
                                    e.target.src = '/default-company.png';
                                  }}
                                />
                              </motion.div>
                              
                              {/* Job Details */}
                              <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                                  <div>
                                    <Link to={`/jobs/${job.job_id}`}>
                                      <motion.h3
                                        className="font-bold text-xl text-gray-900 hover:text-[#E91E63] transition-colors mb-1"
                                        whileHover={{ x: 5 }}
                                      >
                                        {job.title}
                                      </motion.h3>
                                    </Link>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Building2 className="w-4 h-4 text-gray-400" />
                                      <span className="text-gray-700 font-medium">{job.company}</span>
                                      {job.is_verified && (
                                        <motion.div
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Verified
                                          </Badge>
                                        </motion.div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-2">
                                    {job.featured && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                      >
                                        <Badge 
                                          style={{ backgroundColor: '#E91E63' }} 
                                          className="text-white animate-pulse"
                                        >
                                          FEATURED
                                        </Badge>
                                      </motion.div>
                                    )}
                                    {job.is_remote && (
                                      <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                      >
                                        <Badge variant="outline" className="text-green-600 border-green-600">
                                          Remote
                                        </Badge>
                                      </motion.div>
                                    )}
                                    {job.visa_sponsorship && (
                                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                                        Visa Sponsorship
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                {/* Job Info with staggered animation */}
                                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                                  {[
                                    { icon: <MapPin className="w-4 h-4 mr-1" />, text: job.location || 'Location not specified' },
                                    { icon: <Briefcase className="w-4 h-4 mr-1" />, text: job.salary },
                                    { icon: <Clock className="w-4 h-4 mr-1" />, text: job.posted },
                                    { icon: <DollarSign className="w-4 h-4 mr-1" />, text: `Exp: ${job.experience}` }
                                  ].map((item, idx) => (
                                    <motion.div
                                      key={idx}
                                      className="flex items-center"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.1 + idx * 0.05 }}
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      {item.icon}
                                      {item.text}
                                    </motion.div>
                                  ))}
                                </div>

                                {/* Skills with animation */}
                                {job.skills && job.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {job.skills.slice(0, 5).map((skill, skillIndex) => (
                                      <motion.div
                                        key={skillIndex}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: index * 0.1 + skillIndex * 0.1 }}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                      >
                                        <Badge variant="secondary" className="text-sm px-3 py-1">
                                          {skill}
                                        </Badge>
                                      </motion.div>
                                    ))}
                                  </div>
                                )}

                                {/* Description Preview */}
                                {job.description && job.description !== 'Failed to extract description' && (
                                  <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-gray-600 mb-4 line-clamp-2"
                                  >
                                    {job.description.substring(0, 200)}...
                                  </motion.p>
                                )}

                                {/* Actions */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t">
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    {job.applicants > 0 && (
                                      <motion.span
                                        whileHover={{ scale: 1.05 }}
                                      >
                                        {job.applicants} applicants
                                      </motion.span>
                                    )}
                                    {job.views > 0 && (
                                      <motion.span
                                        whileHover={{ scale: 1.05 }}
                                      >
                                        {job.views} views
                                      </motion.span>
                                    )}
                                  </div>
                                  
                                  <div className="flex gap-3">
                                    <Link to={`/jobs/${job.job_id}`}>
                                      <Button
                                        variant="outline"
                                        className="hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63]"
                                        whileHover={{ scale: 1.05, x: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        View Details
                                      </Button>
                                    </Link>
                                    <motion.div
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Button
                                        className="text-white"
                                        style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                                        onClick={() => window.open(`https://scraping-production-6a7a.up.railway.app/api/scrape?jobId=${job.job_id}`, '_blank')}
                                      >
                                        Apply Now
                                        <ExternalLink className="w-4 h-4 ml-2" />
                                      </Button>
                                    </motion.div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {filteredJobs.length > jobsPerPage && currentPage < totalPages && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-8 text-center"
                    >
                      <Button
                        onClick={loadMoreJobs}
                        disabled={loadingMore}
                        variant="outline"
                        className="w-full sm:w-auto px-8 py-6 hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63] load-more-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {loadingMore ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="w-4 h-4 mr-2 inline" />
                            Loading...
                          </motion.div>
                        ) : (
                          `Load More (${Math.min(filteredJobs.length - indexOfLastJob, jobsPerPage)} more jobs)`
                        )}
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Footer */}
        <div className="bg-white border-t" ref={statsRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: allJobs.length, label: 'Total Jobs' },
                { value: allJobs.filter(job => job.is_remote).length, label: 'Remote Jobs' },
                { value: companies.length, label: 'Companies' },
                { value: allJobs.filter(job => job.is_verified).length, label: 'Verified Jobs' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 bg-gray-50 rounded-lg stat-item"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(233, 30, 99, 0.1), 0 10px 10px -5px rgba(233, 30, 99, 0.04)"
                  }}
                >
                  <div className="text-3xl font-bold text-[#E91E63]">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Jobs;