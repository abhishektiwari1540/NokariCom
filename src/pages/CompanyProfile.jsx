import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Globe, Star, Building2, Users, TrendingUp, ArrowLeft, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { mockCompanies, mockJobs } from '../mock';

const CompanyProfile = () => {
  const { id } = useParams();
  const company = mockCompanies.find(c => c.id === id);
  const companyJobs = mockJobs.filter(j => j.companyId === id);

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Company not found</h2>
          <Link to="/companies">
            <Button>Browse All Companies</Button>
          </Link>
        </div>
      </div>
    );
  }

  const mockReviews = [
    {
      id: '1',
      title: 'Great place to start your career',
      pros: 'Good learning opportunities, supportive team, modern tech stack',
      cons: 'Work pressure during project deadlines',
      rating: 4,
      role: 'Software Engineer',
      experience: '2 years'
    },
    {
      id: '2',
      title: 'Excellent work culture',
      pros: 'Flexible working hours, good salary increments, diverse projects',
      cons: 'Sometimes requires overtime',
      rating: 5,
      role: 'Senior Developer',
      experience: '4 years'
    },
    {
      id: '3',
      title: 'Good for freshers',
      pros: 'Training programs, mentorship, career growth opportunities',
      cons: 'Initial salary could be better',
      rating: 4,
      role: 'Associate Engineer',
      experience: '1 year'
    }
  ];

  const salaryData = [
    { role: 'Software Engineer', salary: '₹4-6 LPA' },
    { role: 'Senior Developer', salary: '₹8-12 LPA' },
    { role: 'Team Lead', salary: '₹12-18 LPA' },
    { role: 'Project Manager', salary: '₹15-25 LPA' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/companies" className="flex items-center text-[#E91E63] hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Header */}
        <Card className="mb-6">
          <CardContent className="p-0">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-r from-[#E91E63] to-[#FF6F00] relative"></div>
            
            {/* Company Info */}
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-6 -mt-20">
                <div className="bg-white p-4 rounded-lg shadow-lg w-32 h-32 flex items-center justify-center">
                  <img src={company.logo} alt={company.name} className="max-w-full max-h-full object-contain" />
                </div>
                
                <div className="flex-1 mt-16 md:mt-0">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
                  <p className="text-gray-600 mb-4">{company.industry}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-2" />
                      <span className="font-medium">{company.rating}</span>
                      <span className="text-gray-600 text-sm ml-1">({company.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      {company.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Globe className="w-5 h-5 mr-2" />
                      <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#E91E63]">
                        {company.website}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="text-white"
                      style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                    >
                      Follow
                    </Button>
                    <Button variant="outline">
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-white">
            <TabsTrigger value="overview" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#E91E63]">
              Overview
            </TabsTrigger>
            <TabsTrigger value="jobs" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#E91E63]">
              Jobs ({companyJobs.length})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#E91E63]">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="salaries" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#E91E63]">
              Salaries
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-4">About {company.name}</h2>
                <p className="text-gray-700 leading-relaxed mb-6">{company.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Company Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-start">
                    <Building2 className="w-6 h-6 text-[#E91E63] mr-3 mt-1" />
                    <div>
                      <div className="text-sm text-gray-600">Founded</div>
                      <div className="font-semibold text-lg">{company.founded}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="w-6 h-6 text-[#E91E63] mr-3 mt-1" />
                    <div>
                      <div className="text-sm text-gray-600">Employees</div>
                      <div className="font-semibold text-lg">{company.employees} in Jaipur</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Globe className="w-6 h-6 text-[#E91E63] mr-3 mt-1" />
                    <div>
                      <div className="text-sm text-gray-600">Global Presence</div>
                      <div className="font-semibold text-lg">{company.globalPresence}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Briefcase className="w-6 h-6 text-[#E91E63] mr-3 mt-1" />
                    <div>
                      <div className="text-sm text-gray-600">Industry</div>
                      <div className="font-semibold text-lg">{company.industry}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <TrendingUp className="w-6 h-6 text-[#E91E63] mr-3 mt-1" />
                    <div>
                      <div className="text-sm text-gray-600">Revenue</div>
                      <div className="font-semibold text-lg">{company.revenue}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="mt-6">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Open Positions ({companyJobs.length})</h2>
                {companyJobs.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No open positions at the moment</p>
                ) : (
                  <div className="space-y-4">
                    {companyJobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-6 hover:border-[#E91E63] transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Link to={`/jobs/${job.id}`}>
                              <h3 className="font-bold text-lg hover:text-[#E91E63] transition-colors">
                                {job.title}
                              </h3>
                            </Link>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                              <span>{job.location}</span>
                              <span>•</span>
                              <span>{job.salary}</span>
                              <span>•</span>
                              <span>{job.experience}</span>
                            </div>
                          </div>
                          <Link to={`/jobs/${job.id}`}>
                            <Button
                              size="sm"
                              className="text-white"
                              style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                            >
                              Apply
                            </Button>
                          </Link>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 5).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="mt-6">
            <Card className="mb-6">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Employee Reviews ({company.reviews})</h2>
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="text-5xl font-bold mr-4">{company.rating}</div>
                    <div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${
                            i < Math.floor(company.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`} />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">Based on {company.reviews} reviews</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex mb-3">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <h3 className="font-bold text-lg mb-2">"{review.title}"</h3>
                      <div className="mb-3">
                        <p className="text-sm mb-1"><span className="font-medium text-green-600">Pros:</span> {review.pros}</p>
                        <p className="text-sm"><span className="font-medium text-red-600">Cons:</span> {review.cons}</p>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 mr-1" />
                        <span>{review.role} • {review.experience}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Salaries Tab */}
          <TabsContent value="salaries" className="mt-6">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Salary Insights</h2>
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">Average Salary</div>
                  <div className="text-3xl font-bold text-[#E91E63]">{company.avgSalary}</div>
                </div>

                <div className="space-y-4">
                  {salaryData.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 border rounded-lg">
                      <div className="font-medium">{item.role}</div>
                      <div className="text-lg font-bold text-gray-900">{item.salary}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Salary data is based on self-reported information from employees and may vary based on experience, skills, and location.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyProfile;
