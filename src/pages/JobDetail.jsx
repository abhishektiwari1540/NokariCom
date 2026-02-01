import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, GraduationCap, Clock, Share2, Heart, ArrowLeft, Building2, ExternalLink, Mail, Phone, Globe, Users, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Skeleton } from '../components/ui/skeleton';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://scraping-production-6a7a.up.railway.app/api/scrape?jobId=${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setJob(data.data);
          
          // Fetch similar jobs based on category
          if (data.data.category) {
            fetchSimilarJobs(data.data.category, data.data._id);
          }
        } else {
          setError('Job not found');
        }
      } catch (err) {
        console.error('Error fetching job:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSimilarJobs = async (category, currentJobId) => {
      try {
        const response = await fetch(`https://scraping-production-6a7a.up.railway.app/api/scrape`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const similar = data.data
            .filter(j => 
              j._id !== currentJobId && 
              (j.category === category || 
               j.company_name === job?.company_name ||
               j.location?.includes('Jaipur'))
            )
            .slice(0, 3)
            .map(job => ({
              id: job._id,
              title: job.job_title,
              company: job.company_name,
              location: job.location,
              salary: job.salary_currency ? `${job.salary_currency} Competitive` : 'Competitive Salary',
              logo: job.company_logo,
              posted: formatDate(job.posted_date)
            }));
          
          setSimilarJobs(similar);
        }
      } catch (error) {
        console.error('Error fetching similar jobs:', error);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

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

  // Format skills array
  const formatSkills = (skills) => {
    if (!skills || skills.length === 0) return ['Not specified'];
    if (typeof skills === 'string') return [skills];
    return skills;
  };

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
          {/* Job Header Skeleton */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="w-24 h-24 rounded-lg" />
                
                <div className="flex-1">
                  <Skeleton className="h-8 w-3/4 mb-4" />
                  <Skeleton className="h-6 w-1/2 mb-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
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
          
          {/* Content Skeletons */}
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="mb-6">
              <CardContent className="p-8">
                <Skeleton className="h-6 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Job not found</h2>
          <p className="text-gray-600 mb-4">{error || "The job you're looking for doesn't exist"}</p>
          <Link to="/jobs">
            <Button>Browse All Jobs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/jobs" className="flex items-center text-[#E91E63] hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Header */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <img 
                src={job.company_logo || '/default-company.png'} 
                alt={job.company_name} 
                className="w-24 h-24 object-contain rounded-lg border bg-white"
                onError={(e) => {
                  e.target.src = '/default-company.png';
                }}
              />
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.job_title}</h1>
                <p className="text-xl text-gray-700 mb-4">{job.company_name}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2 text-[#E91E63]" />
                    {job.location || 'Location not specified'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-5 h-5 mr-2 text-[#E91E63]" />
                    {job.salary_currency ? `${job.salary_currency} Competitive` : 'Competitive Salary'}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2 text-[#E91E63]" />
                    Posted {formatDate(job.posted_date)}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2 text-[#E91E63]" />
                    {job.visa_sponsorship ? 'Visa Sponsorship Available' : 'No Visa Sponsorship'}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {job.is_remote && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Remote Available
                    </Badge>
                  )}
                  {job.is_verified && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {job.category && (
                    <Badge variant="outline" className="text-gray-600">
                      {job.category}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="text-white"
                    style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                    onClick={() => window.open(job.url || '#', '_blank')}
                  >
                    Apply on LinkedIn <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="w-4 h-4 mr-2" />
                    Save Job
                  </Button>
                  <Button variant="outline" size="lg">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                  {job.application_count > 0 && (
                    <span>{job.application_count} applicants</span>
                  )}
                  {job.views_count > 0 && (
                    <span>{job.views_count} views</span>
                  )}
                  {job.saves_count > 0 && (
                    <span>{job.saves_count} saves</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Job Details */}
        <Tabs defaultValue="description" className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="company">Company Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Job Description</h2>
                {job.description && job.description !== 'Failed to extract description' ? (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </div>
                ) : (
                  <div className="text-gray-500 italic">
                    No description available. Please visit the original posting for details.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="requirements">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Requirements</h2>
                {job.requirements ? (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {job.requirements}
                  </div>
                ) : (
                  <div className="text-gray-500 italic">
                    Requirements not specified
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="skills">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {formatSkills(job.skills).map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm px-4 py-2"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="company">
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <img 
                    src={job.company_logo || '/default-company.png'} 
                    alt={job.company_name} 
                    className="w-16 h-16 object-contain mr-4 rounded-lg border"
                    onError={(e) => {
                      e.target.src = '/default-company.png';
                    }}
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{job.company_name}</h2>
                    <p className="text-gray-600">Company Profile</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Job Details</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{job.location || 'Location not specified'}</span>
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" />
                          <span>Category: {job.category || 'General'}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Posted: {formatDate(job.posted_date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          <span>Status: {job.status || 'Active'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Job Features</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          {job.is_remote ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                          )}
                          <span className={job.is_remote ? 'text-green-600' : 'text-gray-600'}>
                            Remote Work Available
                          </span>
                        </div>
                        <div className="flex items-center">
                          {job.visa_sponsorship ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                          )}
                          <span className={job.visa_sponsorship ? 'text-green-600' : 'text-gray-600'}>
                            Visa Sponsorship
                          </span>
                        </div>
                        <div className="flex items-center">
                          {job.relocation_assistance ? (
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-gray-400 mr-2" />
                          )}
                          <span className={job.relocation_assistance ? 'text-green-600' : 'text-gray-600'}>
                            Relocation Assistance
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {job.url && (
                  <div className="mt-6">
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
        </Tabs>

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Similar Jobs You May Like</h2>
              <div className="space-y-4">
                {similarJobs.map((simJob) => (
                  <div key={simJob.id} className="flex gap-4 p-4 border rounded-lg hover:border-[#E91E63] transition-colors">
                    <img 
                      src={simJob.logo || '/default-company.png'} 
                      alt={simJob.company} 
                      className="w-16 h-16 object-contain rounded-lg border bg-white"
                      onError={(e) => {
                        e.target.src = '/default-company.png';
                      }}
                    />
                    <div className="flex-1">
                      <Link to={`/jobs/${simJob.id}`}>
                        <h3 className="font-bold text-gray-900 hover:text-[#E91E63] mb-1">
                          {simJob.title}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-2">{simJob.company}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <span>{simJob.location}</span>
                        <span>•</span>
                        <span>{simJob.salary}</span>
                        <span>•</span>
                        <span>{simJob.posted}</span>
                      </div>
                    </div>
                    <Link to={`/jobs/${simJob.id}`}>
                      <Button
                        size="sm"
                        className="text-white"
                        style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sticky Apply Button (Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden shadow-lg">
        <Button
          size="lg"
          className="w-full text-white"
          style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
          onClick={() => window.open(job.url || '#', '_blank')}
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default JobDetail;