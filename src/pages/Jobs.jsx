import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
 const seoProps = useMemo(() => ({
    jobCount: allJobs.length,
    searchQuery: searchQuery || '',
    jobType: jobType || '',
    companyCount: companies.length
  }), [allJobs.length, searchQuery, jobType, companies.length]);
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
            id: job.job_id || job._id, // ✅ Use job_id first
            job_id: job.job_id, // ✅ Store job_id separately
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
          
          // Extract unique data for filters
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
      // Companies
      const companyMap = new Map();
      const locationSet = new Set();
      const categorySet = new Set();
      
      jobs.forEach(job => {
        // Companies
        if (!companyMap.has(job.company)) {
          companyMap.set(job.company, {
            name: job.company,
            logo: job.logo,
            count: 0
          });
        }
        companyMap.get(job.company).count++;
        
        // Locations
        if (job.location) {
          const loc = job.location.split(',')[0].trim();
          locationSet.add(loc);
        }
        
        // Categories
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

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        (job.skills && job.skills.some(skill => skill.toLowerCase().includes(query))) ||
        (job.description && job.description.toLowerCase().includes(query))
      );
    }

    // Company filter
    if (selectedCompanies.length > 0) {
      filtered = filtered.filter(job =>
        selectedCompanies.includes(job.company)
      );
    }

    // Job type filter
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

    // Remote filter
    if (showRemoteOnly) {
      filtered = filtered.filter(job => job.is_remote);
    }

    // Verified filter
    if (showVerifiedOnly) {
      filtered = filtered.filter(job => job.is_verified);
    }

    // Experience filter
    if (experienceLevel) {
      filtered = filtered.filter(job => job.experience === experienceLevel);
    }

    // Salary filter
    if (salaryRange[1] < 100) {
      filtered = filtered.filter(job => {
        const salaryValue = job.salaryAmount || 0;
        return salaryValue >= salaryRange[0] && salaryValue <= salaryRange[1];
      });
    }

    // Sorting
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

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Handle company selection
  const handleCompanyToggle = useCallback((companyName) => {
    setSelectedCompanies(prev =>
      prev.includes(companyName)
        ? prev.filter(c => c !== companyName)
        : [...prev, companyName]
    );
    setCurrentPage(1);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  // Clear all filters
  const clearAllFilters = () => {
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

  // Load more jobs
  const loadMoreJobs = () => {
    if (currentPage < totalPages) {
      setLoadingMore(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setLoadingMore(false);
      }, 300);
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
      <div>
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
      </div>

      {/* Quick Filters */}
      <div>
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
      </div>

      {/* Job Type */}
      <div>
        <Label className="font-semibold mb-3 block">Job Type</Label>
        <RadioGroup value={jobType} onValueChange={(value) => {
          setJobType(value);
          setCurrentPage(1);
        }}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="all-types" />
              <Label htmlFor="all-types" className="cursor-pointer">All Types</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="government-jobs" id="government" />
              <Label htmlFor="government" className="cursor-pointer">Government Jobs</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private-jobs" id="private" />
              <Label htmlFor="private" className="cursor-pointer">Private Jobs</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="internships" id="internships" />
              <Label htmlFor="internships" className="cursor-pointer">Internships</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="remote" id="remote-type" />
              <Label htmlFor="remote-type" className="cursor-pointer">Remote</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Experience Level */}
      <div>
        <Label className="font-semibold mb-3 block">Experience Level</Label>
        <RadioGroup value={experienceLevel} onValueChange={(value) => {
          setExperienceLevel(value);
          setCurrentPage(1);
        }}>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="" id="all-exp" />
              <Label htmlFor="all-exp" className="cursor-pointer">All Levels</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Fresher" id="fresher" />
              <Label htmlFor="fresher" className="cursor-pointer">Fresher</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1-3 years" id="1-3" />
              <Label htmlFor="1-3" className="cursor-pointer">1-3 years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="3-5 years" id="3-5" />
              <Label htmlFor="3-5" className="cursor-pointer">3-5 years</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5+ years" id="5plus" />
              <Label htmlFor="5plus" className="cursor-pointer">5+ years</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Companies */}
      {companies.length > 0 && (
        <div>
          <Label className="font-semibold mb-3 block">Companies</Label>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {companies.slice(0, 15).map(company => (
              <div key={company.name} className="flex items-center space-x-2">
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Salary Range */}
      <div>
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
      </div>

      {/* Results Info */}
      <div className="pt-4 border-t">
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
      </div>

      {/* Clear Filters Button */}
      {(searchQuery || selectedCompanies.length > 0 || showRemoteOnly || showVerifiedOnly || jobType || experienceLevel || salaryRange[1] < 100) && (
        <Button
          variant="outline"
          onClick={clearAllFilters}
          className="w-full text-red-600 hover:text-red-700 hover:border-red-300"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      <JobsSeo {...seoProps} />
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {jobType ? jobType.replace('-', ' ').toUpperCase() : 'All'} Jobs in Jaipur
            </h1>
            <p className="text-gray-600">
              Discover {allJobs.length}+ opportunities from {companies.length}+ companies
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl">
            <div className="bg-white rounded-xl border-2 border-gray-200 focus-within:border-[#E91E63] p-2 flex items-center">
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
              >
                Search
              </Button>
            </div>
          </form>

          {/* Active Filters */}
          {(searchQuery || selectedCompanies.length > 0 || showRemoteOnly || showVerifiedOnly || jobType || experienceLevel) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="hover:bg-gray-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {selectedCompanies.map(company => (
                <Badge key={company} variant="secondary" className="flex items-center gap-1">
                  {company}
                  <button onClick={() => handleCompanyToggle(company)} className="hover:bg-gray-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              
              {jobType && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {jobType.replace('-', ' ')}
                  <button onClick={() => setJobType('')} className="hover:bg-gray-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {showRemoteOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Remote Only
                  <button onClick={() => setShowRemoteOnly(false)} className="hover:bg-gray-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {showVerifiedOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Verified Only
                  <button onClick={() => setShowVerifiedOnly(false)} className="hover:bg-gray-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {experienceLevel && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Exp: {experienceLevel}
                  <button onClick={() => setExperienceLevel('')} className="hover:bg-gray-200 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Mobile Filter Button */}
          <div className="mt-6 lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
              {showMobileFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <Card className="sticky top-8 shadow-lg">
              <CardContent className="p-6">
                <FilterSection />
              </CardContent>
            </Card>
          </aside>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto">
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
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Job Listings */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
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
            </div>

            {/* Job Cards */}
            {filteredJobs.length === 0 ? (
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
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid gap-4">
                  {currentJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#E91E63]">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Company Logo */}
                          <div className="flex-shrink-0">
                            <img 
                              src={job.logo} 
                              alt={job.company} 
                              className="w-20 h-20 object-contain rounded-lg border bg-white"
                              onError={(e) => {
                                e.target.src = '/default-company.png';
                              }}
                            />
                          </div>
                          
                          {/* Job Details */}
                          <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                              <div>
                                <Link to={`/jobs/${job.job_id}`}> {/* ✅ Use job.job_id */}
                                  <h3 className="font-bold text-xl text-gray-900 hover:text-[#E91E63] transition-colors mb-1">
                                    {job.title}
                                  </h3>
                                </Link>
                                <div className="flex items-center gap-2 mb-1">
                                  <Building2 className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-700 font-medium">{job.company}</span>
                                  {job.is_verified && (
                                    <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2">
                                {job.featured && (
                                  <Badge style={{ backgroundColor: '#E91E63' }} className="text-white">
                                    FEATURED
                                  </Badge>
                                )}
                                {job.is_remote && (
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    Remote
                                  </Badge>
                                )}
                                {job.visa_sponsorship && (
                                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                                    Visa Sponsorship
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Job Info */}
                            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {job.location || 'Location not specified'}
                              </div>
                              <div className="flex items-center">
                                <Briefcase className="w-4 h-4 mr-1" />
                                {job.salary}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {job.posted}
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                Exp: {job.experience}
                              </div>
                            </div>

                            {/* Skills */}
                            {job.skills && job.skills.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {job.skills.slice(0, 5).map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Description Preview */}
                            {job.description && job.description !== 'Failed to extract description' && (
                              <p className="text-gray-600 mb-4 line-clamp-2">
                                {job.description.substring(0, 200)}...
                              </p>
                            )}

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t">
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                {job.applicants > 0 && (
                                  <span>{job.applicants} applicants</span>
                                )}
                                {job.views > 0 && (
                                  <span>{job.views} views</span>
                                )}
                              </div>
                              
                              <div className="flex gap-3">
                                <Link to={`/jobs/${job.job_id}`}> {/* ✅ Use job.job_id */}
                                  <Button
                                    variant="outline"
                                    className="hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63]"
                                  >
                                    View Details
                                  </Button>
                                </Link>
                                <Button
                                  className="text-white"
                                  style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                                  onClick={() => window.open(`https://scraping-production-6a7a.up.railway.app/api/scrape?jobId=${job.job_id}`, '_blank')} 
                                >
                                  Apply Now
                                  <ExternalLink className="w-4 h-4 ml-2" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Load More Button */}
                {filteredJobs.length > jobsPerPage && currentPage < totalPages && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={loadMoreJobs}
                      disabled={loadingMore}
                      variant="outline"
                      className="w-full sm:w-auto px-8 py-6 hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63]"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        `Load More (${Math.min(filteredJobs.length - indexOfLastJob, jobsPerPage)} more jobs)`
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-[#E91E63]">{allJobs.length}</div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-[#E91E63]">
                {allJobs.filter(job => job.is_remote).length}
              </div>
              <div className="text-sm text-gray-600">Remote Jobs</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-[#E91E63]">
                {companies.length}
              </div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-[#E91E63]">
                {allJobs.filter(job => job.is_verified).length}
              </div>
              <div className="text-sm text-gray-600">Verified Jobs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Jobs;