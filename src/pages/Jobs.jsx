import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { mockJobs } from '../mock';

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    jobType: [],
    experience: [],
    location: [],
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const experienceLevels = ['Fresher', '1-3 years', '3-5 years', '5+ years'];
  const locations = ['Jaipur', 'Remote'];

  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const currentValues = prev[category];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const clearFilters = () => {
    setFilters({ jobType: [], experience: [], location: [] });
  };

  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          job.title.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query) ||
          job.skills.some(skill => skill.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Job type filter
      if (filters.jobType.length > 0) {
        if (!filters.jobType.includes(job.type)) return false;
      }

      // Experience filter
      if (filters.experience.length > 0) {
        const hasMatch = filters.experience.some(exp => {
          if (exp === 'Fresher') return job.experience === 'Fresher';
          if (exp === '1-3 years') return job.experience.includes('1') || job.experience.includes('2') || job.experience.includes('3');
          if (exp === '3-5 years') return job.experience.includes('3') || job.experience.includes('4') || job.experience.includes('5');
          if (exp === '5+ years') return parseInt(job.experience) >= 5;
          return false;
        });
        if (!hasMatch) return false;
      }

      // Location filter
      if (filters.location.length > 0) {
        const hasMatch = filters.location.some(loc => 
          job.location.toLowerCase().includes(loc.toLowerCase())
        );
        if (!hasMatch) return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  const FilterSection = ({ className = '' }) => (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg">Filters</h3>
        {(filters.jobType.length > 0 || filters.experience.length > 0 || filters.location.length > 0) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-[#E91E63]">
            Clear All
          </Button>
        )}
      </div>

      {/* Job Type */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Job Type</h4>
        <div className="space-y-2">
          {jobTypes.map((type) => (
            <div key={type} className="flex items-center">
              <Checkbox
                id={`type-${type}`}
                checked={filters.jobType.includes(type)}
                onCheckedChange={() => handleFilterChange('jobType', type)}
              />
              <Label htmlFor={`type-${type}`} className="ml-2 cursor-pointer">
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Experience</h4>
        <div className="space-y-2">
          {experienceLevels.map((exp) => (
            <div key={exp} className="flex items-center">
              <Checkbox
                id={`exp-${exp}`}
                checked={filters.experience.includes(exp)}
                onCheckedChange={() => handleFilterChange('experience', exp)}
              />
              <Label htmlFor={`exp-${exp}`} className="ml-2 cursor-pointer">
                {exp}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Location</h4>
        <div className="space-y-2">
          {locations.map((loc) => (
            <div key={loc} className="flex items-center">
              <Checkbox
                id={`loc-${loc}`}
                checked={filters.location.includes(loc)}
                onCheckedChange={() => handleFilterChange('location', loc)}
              />
              <Label htmlFor={`loc-${loc}`} className="ml-2 cursor-pointer">
                {loc}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Jobs in Jaipur</h1>
          <p className="text-gray-600">{filteredJobs.length} jobs found</p>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-sm border p-4 flex items-center">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <Input
                type="text"
                placeholder="Search jobs, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="mt-4 lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <FilterSection />
            </div>
          </aside>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg">Filters</h3>
                    <button onClick={() => setShowMobileFilters(false)}>
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
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">No jobs found matching your criteria</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-all border-2 hover:border-[#E91E63]">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Company Logo */}
                        <img src={job.logo} alt={job.company} className="w-16 h-16 object-contain" />

                        {/* Job Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Link to={`/jobs/${job.id}`}>
                                <h3 className="font-bold text-lg text-gray-900 hover:text-[#E91E63] transition-colors">
                                  {job.title}
                                </h3>
                              </Link>
                              <p className="text-gray-600">{job.company}</p>
                            </div>
                            {job.featured && (
                              <Badge style={{ backgroundColor: '#E91E63' }} className="text-white">
                                FEATURED
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              {job.salary}
                            </div>
                            <div>{job.experience}</div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.skills.slice(0, 4).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t">
                            <span className="text-sm text-gray-500">Posted {job.posted}</span>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Save
                              </Button>
                              <Link to={`/jobs/${job.id}`}>
                                <Button
                                  size="sm"
                                  className="text-white"
                                  style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                                >
                                  Apply Now
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
