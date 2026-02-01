import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, Building2, Filter, X, Star, Clock, ExternalLink, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Slider } from '../components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [showRemoteOnly, setShowRemoteOnly] = useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [salaryRange, setSalaryRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(20);
  const [showFilters, setShowFilters] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);

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
            id: job._id || job.job_id,
            title: job.job_title,
            company: job.company_name,
            location: job.location,
            salary: job.salary_currency ? `${job.salary_currency} Competitive` : 'Competitive Salary',
            salaryCurrency: job.salary_currency,
            salaryAmount: job.salary_amount || 0,
            skills: job.skills || [],
            posted: formatDate(job.posted_date),
            featured: job.is_verified || Math.random() > 0.7,
            logo: job.company_logo || '/default-company.png',
            description: job.description,
            is_remote: job.is_remote,
            is_verified: job.is_verified,
            category: job.category || 'General',
            requirements: job.requirements,
            benefits: job.benefits,
            posted_date: job.posted_date
          }));
          
          setAllJobs(transformedJobs);
          setJobs(transformedJobs);
          
          // Extract unique companies
          const uniqueCompanies = Array.from(
            new Map(
              transformedJobs.map(job => [job.company, {
                name: job.company,
                count: transformedJobs.filter(j => j.company === job.company).length,
                logo: job.logo
              }])
            ).values()
          ).sort((a, b) => b.count - a.count);
          
          setCompanies(uniqueCompanies);
          
          // Extract unique categories
          const uniqueCategories = Array.from(
            new Map(
              transformedJobs
                .filter(job => job.category && job.category !== 'General')
                .map(job => [job.category, {
                  name: job.category,
                  count: transformedJobs.filter(j => j.category === job.category).length
                }])
            ).values()
          ).sort((a, b) => b.count - a.count);
          
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // You could add a retry mechanism here
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
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
        job.skills.some(skill => skill.toLowerCase().includes(query)) ||
        job.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(job =>
        job.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Company filter
    if (selectedCompanies.length > 0) {
      filtered = filtered.filter(job =>
        selectedCompanies.includes(job.company)
      );
    }

    // Remote filter
    if (showRemoteOnly) {
      filtered = filtered.filter(job => job.is_remote);
    }

    // Verified filter
    if (showVerifiedOnly) {
      filtered = filtered.filter(job => job.is_verified);
    }

    // Salary filter (simplified)
    if (salaryRange[1] < 100) {
      filtered = filtered.filter(job => {
        const salaryValue = job.salaryAmount || 0;
        return salaryValue >= salaryRange[0] && salaryValue <= salaryRange[1];
      });
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.posted_date) - new Date(b.posted_date));
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
    }

    return filtered;
  }, [allJobs, searchQuery, selectedCategory, selectedCompanies, showRemoteOnly, showVerifiedOnly, salaryRange, sortBy]);

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
    setSelectedCategory('');
    setSelectedCompanies([]);
    setShowRemoteOnly(false);
    setShowVerifiedOnly(false);
    setSalaryRange([0, 100]);
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Load more jobs (infinite scroll alternative)
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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Search Skeleton */}
              <div className="flex-1">
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
              <div className="flex gap-3">
                <Skeleton className="h-12 w-32 rounded-lg" />
                <Skeleton className="h-12 w-32 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Skeleton */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            </div>

            {/* Jobs Skeleton */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search jobs, companies, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-gray-300 focus:border-[#E91E63]"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 text-white px-6"
                  style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                >
                  Search
                </Button>
              </form>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              
              {(searchQuery || selectedCategory || selectedCompanies.length > 0 || showRemoteOnly || showVerifiedOnly) && (
                <Button
                  variant="ghost"
                  onClick={clearAllFilters}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory || selectedCompanies.length > 0 || showRemoteOnly || showVerifiedOnly) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {selectedCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {selectedCompanies.map(company => (
                <Badge key={company} variant="secondary" className="flex items-center gap-1">
                  {company}
                  <button onClick={() => handleCompanyToggle(company)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              
              {showRemoteOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Remote Only
                  <button onClick={() => setShowRemoteOnly(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              
              {showVerifiedOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Verified Only
                  <button onClick={() => setShowVerifiedOnly(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
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
                        onCheckedChange={(checked) => setShowRemoteOnly(checked)}
                      />
                      <Label htmlFor="remote" className="cursor-pointer">Remote Jobs Only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="verified" 
                        checked={showVerifiedOnly}
                        onCheckedChange={(checked) => setShowVerifiedOnly(checked)}
                      />
                      <Label htmlFor="verified" className="cursor-pointer">Verified Jobs Only</Label>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <Label className="font-semibold mb-3 block">Categories</Label>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {categories.map(category => (
                        <div key={category.name} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`cat-${category.name}`}
                            checked={selectedCategory === category.name}
                            onCheckedChange={(checked) => {
                              setSelectedCategory(checked ? category.name : '');
                              setCurrentPage(1);
                            }}
                          />
                          <Label htmlFor={`cat-${category.name}`} className="cursor-pointer flex-1">
                            {category.name}
                          </Label>
                          <Badge variant="outline" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Companies */}
                {companies.length > 0 && (
                  <div>
                    <Label className="font-semibold mb-3 block">Companies</Label>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {companies.slice(0, 20).map(company => (
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
                      onValueChange={setSalaryRange}
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
              </CardContent>
            </Card>
          </div>

          {/* Jobs List */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
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
              
              <div className="hidden lg:block">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="salary_high">Salary: High to Low</SelectItem>
                    <SelectItem value="salary_low">Salary: Low to High</SelectItem>
                    <SelectItem value="company">Company Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Jobs Grid */}
            {currentJobs.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-4">
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
              <div className="space-y-4">
                {currentJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-all border-2 hover:border-[#E91E63]">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        {/* Company Logo */}
                        <img 
                          src={job.logo} 
                          alt={job.company} 
                          className="w-16 h-16 object-contain rounded-lg border bg-white flex-shrink-0"
                          onError={(e) => {
                            e.target.src = '/default-company.png';
                          }}
                        />
                        
                        {/* Job Details */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                            <div>
                              <Link to={`/jobs/${job.id}`}>
                                <h3 className="font-bold text-lg text-gray-900 hover:text-[#E91E63] mb-1">
                                  {job.title}
                                </h3>
                              </Link>
                              <p className="text-gray-700">{job.company}</p>
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
                              {job.is_verified && (
                                <Badge variant="outline" className="text-blue-600 border-blue-600">
                                  Verified
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Job Info */}
                          <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              {job.salary}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {job.posted}
                            </div>
                          </div>

                          {/* Skills */}
                          {job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {job.skills.slice(0, 5).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Description Preview */}
                          {job.description && job.description !== 'Failed to extract description' && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {job.description.substring(0, 150)}...
                            </p>
                          )}

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t">
                            <div className="flex items-center space-x-3">
                              {job.is_verified && (
                                <div className="flex items-center text-sm text-green-600">
                                  <Star className="w-4 h-4 mr-1 fill-green-600" />
                                  Verified Company
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-3">
                              <Link to={`/jobs/${job.id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63]"
                                >
                                  View Details
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                className="text-white"
                                style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                                onClick={() => window.open(`https://scraping-production-6a7a.up.railway.app/api/scrape?jobId=${job.id}`, '_blank')}
                              >
                                Apply Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination / Load More */}
            {filteredJobs.length > jobsPerPage && currentPage < totalPages && (
              <div className="mt-8 text-center">
                <Button
                  onClick={loadMoreJobs}
                  disabled={loadingMore}
                  variant="outline"
                  className="w-full sm:w-auto px-8 hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63]"
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
                
                <div className="mt-2 text-sm text-gray-600">
                  Page {currentPage} of {totalPages} • Showing {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E91E63]">{allJobs.length}</div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E91E63]">
                {allJobs.filter(job => job.is_remote).length}
              </div>
              <div className="text-sm text-gray-600">Remote Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E91E63]">
                {companies.length}
              </div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E91E63]">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;