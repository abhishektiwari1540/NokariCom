import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Briefcase, GraduationCap, Clock, Share2, Heart, ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockJobs, mockCompanies } from '../mock';

const JobDetail = () => {
  const { id } = useParams();
  const job = mockJobs.find(j => j.id === id);
  const company = mockCompanies.find(c => c.id === job?.companyId);
  const similarJobs = mockJobs.filter(j => j.id !== id && j.category === job?.category).slice(0, 3);

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Job not found</h2>
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
              <img src={job.logo} alt={job.company} className="w-24 h-24 object-contain" />
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <p className="text-xl text-gray-700 mb-4">{job.company}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2 text-[#E91E63]" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-5 h-5 mr-2 text-[#E91E63]" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="w-5 h-5 mr-2 text-[#E91E63]" />
                    {job.education}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-2 text-[#E91E63]" />
                    Posted {job.posted}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="text-white"
                    style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                  >
                    Apply Now
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

                <p className="text-sm text-gray-500 mt-4">{job.applicants} applicants</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </CardContent>
        </Card>

        {/* Key Responsibilities */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Key Responsibilities</h2>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-[#E91E63] mr-3 mt-1">•</span>
                  <span className="text-gray-700">{resp}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Requirements</h2>
            <ul className="space-y-2">
              {job.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-[#4CAF50] mr-3 mt-1">✓</span>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Skills Required */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-4">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-sm px-4 py-2"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* About Company */}
        {company && (
          <Card className="mb-6">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">About {company.name}</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">{company.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Employees</div>
                  <div className="font-semibold">{company.employees}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Global Presence</div>
                  <div className="font-semibold">{company.globalPresence}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Rating</div>
                  <div className="font-semibold">{company.rating}/5 ({company.reviews} reviews)</div>
                </div>
              </div>

              <Link to={`/companies/${company.id}`}>
                <Button variant="outline" className="hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63]">
                  <Building2 className="w-4 h-4 mr-2" />
                  View All Jobs at {company.name}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Similar Jobs You May Like</h2>
              <div className="space-y-4">
                {similarJobs.map((simJob) => (
                  <div key={simJob.id} className="flex gap-4 p-4 border rounded-lg hover:border-[#E91E63] transition-colors">
                    <img src={simJob.logo} alt={simJob.company} className="w-16 h-16 object-contain" />
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
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default JobDetail;
