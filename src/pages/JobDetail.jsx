import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, GraduationCap, Clock, Share2, Heart, ArrowLeft, Building2, ExternalLink, Users, Calendar, CheckCircle, AlertCircle, Star, Loader2, DollarSign, Award } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';
import { Separator } from '../components/ui/separator';

const JobDetail = () => {
  const { id } = useParams(); // This will be the job_id from URL
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Fetch job details using job_id
  const fetchJobDetails = useCallback(async () => {
    if (!id) {
      setError('No job ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Use the job_id parameter directly
      const response = await fetch(`https://scraping-production-6a7a.up.railway.app/api/scrape?jobId=${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch job details: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setJob(data.data);
      } else {
        throw new Error(data.message || 'Job not found');
      }
    } catch (err) {
      console.error('Error fetching job:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch similar jobs
  const fetchSimilarJobs = useCallback(async (currentJob) => {
    if (!currentJob) return;

    try {
      setLoadingSimilar(true);
      const response = await fetch(`https://scraping-production-6a7a.up.railway.app/api/scrape`);
      const data = await response.json();
      
      if (data.success && data.data) {
        // Filter similar jobs based on company, location, or category
        const similar = data.data
          .filter(j => 
            j.job_id !== currentJob.job_id && // Not the same job (compare by job_id)
            (
              j.company_name === currentJob.company_name ||
              j.location?.includes('Jaipur') ||
              j.category === currentJob.category
            )
          )
          .slice(0, 3)
          .map(job => ({
            id: job.job_id, // ✅ Use job_id for link
            job_id: job.job_id,
            title: job.job_title,
            company: job.company_name,
            location: job.location,
            salary: job.salary_currency ? `${job.salary_currency} Competitive` : 'Competitive Salary',
            logo: job.company_logo || '/default-company.png',
            posted: formatDate(job.posted_date)
          }));
        
        setSimilarJobs(similar);
      }
    } catch (error) {
      console.error('Error fetching similar jobs:', error);
    } finally {
      setLoadingSimilar(false);
    }
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

  // Format skills array
  const formatSkills = (skills) => {
    if (!skills || skills.length === 0) return ['Not specified'];
    if (typeof skills === 'string') {
      try {
        return JSON.parse(skills);
      } catch {
        return [skills];
      }
    }
    return skills;
  };

  // Format requirements
  const formatRequirements = (requirements) => {
    if (!requirements) return [];
    if (typeof requirements === 'string') {
      if (requirements.includes('\n')) {
        return requirements.split('\n').filter(r => r.trim());
      }
      return [requirements];
    }
    return requirements;
  };

  // Initialize data fetching
  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  // Fetch similar jobs when job data is loaded
  useEffect(() => {
    if (job) {
      fetchSimilarJobs(job);
    }
  }, [job, fetchSimilarJobs]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="w-24 h-24 rounded-lg" />
                <div className="flex-1 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map(i => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-10 w-full mb-4" />
            {[1, 2, 3].map(i => (
              <Card key={i} className="mb-4">
                <CardContent className="p-8">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-6">
              {error || "The job you're looking for doesn't exist or has been removed."}
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
              <Link to="/jobs" className="block">
                <Button className="w-full text-white" style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}>
                  Browse All Jobs
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-[#E91E63]">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/jobs" className="text-gray-600 hover:text-[#E91E63]">
              Jobs
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">{job.job_title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Header */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img 
                  src={job.company_logo || '/default-company.png'} 
                  alt={job.company_name} 
                  className="w-24 h-24 object-contain rounded-lg border bg-white p-2"
                  onError={(e) => {
                    e.target.src = '/default-company.png';
                  }}
                />
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.job_title}</h1>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-gray-500" />
                      <p className="text-xl text-gray-700">{job.company_name}</p>
                      {job.is_verified && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.is_remote && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        Remote Available
                      </Badge>
                    )}
                    {job.visa_sponsorship && (
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                        Visa Sponsorship
                      </Badge>
                    )}
                    {job.relocation_assistance && (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                        Relocation Help
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Job Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 mr-3 text-[#E91E63]" />
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-medium">{job.location || 'Not specified'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="w-5 h-5 mr-3 text-[#E91E63]" />
                    <div>
                      <div className="text-sm text-gray-500">Salary</div>
                      <div className="font-medium">{job.salary_currency ? `${job.salary_currency} Competitive` : 'Competitive'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 mr-3 text-[#E91E63]" />
                    <div>
                      <div className="text-sm text-gray-500">Posted</div>
                      <div className="font-medium">{formatDate(job.posted_date)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Award className="w-5 h-5 mr-3 text-[#E91E63]" />
                    <div>
                      <div className="text-sm text-gray-500">Category</div>
                      <div className="font-medium">{job.category || 'General'}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="text-white px-8"
                    style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                    onClick={() => window.open(job.url || '#', '_blank')}
                  >
                    Apply Now
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <Button variant="outline" size="lg">
                    <Heart className="w-4 h-4 mr-2" />
                    Save Job
                  </Button>
                  
                  <Button variant="outline" size="lg">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  
                  <div className="flex-1" />
                  
                  <div className="text-sm text-gray-500 flex items-center gap-4">
                    {job.views_count > 0 && (
                      <span>{job.views_count.toLocaleString()} views</span>
                    )}
                    {job.saves_count > 0 && (
                      <span>{job.saves_count.toLocaleString()} saved</span>
                    )}
                    {job.application_count > 0 && (
                      <span>{job.application_count.toLocaleString()} applicants</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="description" className="mb-6">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          {/* Description Tab */}
          <TabsContent value="description">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Briefcase className="w-6 h-6 mr-2 text-[#E91E63]" />
                  Job Description
                </h2>
                
                {job.description && job.description !== 'Failed to extract description' ? (
                  <div className="prose max-w-none">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {job.description}
                    </div>
                    
                    {/* Benefits */}
                    {job.benefits && job.benefits.length > 0 && (
                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Benefits</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {job.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg">
                              <CheckCircle className="w-5 h-5 mr-3 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg mb-4">
                      Description not available for this job
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => window.open(job.url || '#', '_blank')}
                    >
                      View Original Posting
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Requirements Tab */}
          <TabsContent value="requirements">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <GraduationCap className="w-6 h-6 mr-2 text-[#E91E63]" />
                  Requirements & Skills
                </h2>
                
                {job.requirements || (job.skills && job.skills.length > 0) ? (
                  <div className="space-y-6">
                    {/* Requirements */}
                    {job.requirements && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Requirements</h3>
                        <div className="space-y-3">
                          {formatRequirements(job.requirements).map((req, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-[#E91E63] rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="text-gray-700">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Separator />
                    
                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                      <div>
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Skills Required</h3>
                        <div className="flex flex-wrap gap-2">
                          {formatSkills(job.skills).map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-sm px-4 py-2 bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* No Skills Message */}
                    {(!job.skills || job.skills.length === 0) && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No specific skills listed</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      Requirements and skills information is not available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Company Tab */}
          <TabsContent value="company">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start gap-6 mb-8">
                  <img 
                    src={job.company_logo || '/default-company.png'} 
                    alt={job.company_name} 
                    className="w-20 h-20 object-contain rounded-lg border bg-white p-2"
                    onError={(e) => {
                      e.target.src = '/default-company.png';
                    }}
                  />
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{job.company_name}</h2>
                    <p className="text-gray-600">Company Information</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Job Metadata */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Job Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Job ID:</span>
                        <span className="font-medium">{job.job_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Posted Date:</span>
                        <span className="font-medium">{new Date(job.posted_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={job.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {job.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{job.category || 'General'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Job Features</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        {job.is_remote ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-400 mr-3" />
                        )}
                        <span>Remote Work</span>
                      </div>
                      <div className="flex items-center">
                        {job.visa_sponsorship ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-400 mr-3" />
                        )}
                        <span>Visa Sponsorship</span>
                      </div>
                      <div className="flex items-center">
                        {job.relocation_assistance ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-400 mr-3" />
                        )}
                        <span>Relocation Assistance</span>
                      </div>
                      <div className="flex items-center">
                        {job.is_verified ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-gray-400 mr-3" />
                        )}
                        <span>Verified Listing</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Statistics */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Views:</span>
                        <span className="font-medium">{job.views_count?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saves:</span>
                        <span className="font-medium">{job.saves_count?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Applicants:</span>
                        <span className="font-medium">{job.application_count?.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Updated:</span>
                        <span className="font-medium">{formatDate(job.last_updated)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Source Link */}
                {job.url && (
                  <div className="mt-8 pt-6 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(job.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Original Posting on LinkedIn
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Additional Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Metadata</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Source:</span>
                        <span className="font-medium">{job.source || 'LinkedIn'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Scraped At:</span>
                        <span className="font-medium">{formatDate(job.scraped_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">{formatDate(job.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Application Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Application Method:</span>
                        <span className="font-medium">External Link</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Apply Via:</span>
                        <span className="font-medium">LinkedIn</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Application Status:</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          Accepting Applications
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <Card className="mt-6">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Similar Jobs You May Like</h2>
                {loadingSimilar && (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {similarJobs.map((simJob) => (
                  <div key={simJob.id} className="border rounded-lg p-4 hover:border-[#E91E63] transition-colors">
                    <div className="flex items-start gap-3 mb-3">
                      <img 
                        src={simJob.logo} 
                        alt={simJob.company} 
                        className="w-12 h-12 object-contain rounded border bg-white"
                        onError={(e) => {
                          e.target.src = '/default-company.png';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={`/jobs/${simJob.job_id}`}> {/* ✅ Use simJob.job_id */}
                          <h3 className="font-bold text-gray-900 hover:text-[#E91E63] truncate">
                            {simJob.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm truncate">{simJob.company}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="text-sm text-gray-600 truncate">
                        <MapPin className="w-3 h-3 inline mr-1" />
                        {simJob.location}
                      </div>
                      <div className="text-sm text-gray-600">{simJob.salary}</div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{simJob.posted}</span>
                      <Link to={`/jobs/${simJob.job_id}`}> {/* ✅ Use simJob.job_id */}
                        <Button size="sm" variant="ghost" className="text-[#E91E63]">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sticky Apply Button (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden shadow-lg">
        <div className="max-w-5xl mx-auto">
          <Button
            size="lg"
            className="w-full text-white"
            style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
            onClick={() => window.open(job.url || '#', '_blank')}
          >
            Apply Now
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;