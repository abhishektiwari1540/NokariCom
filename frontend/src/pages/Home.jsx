import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Building2, CheckCircle, Users, ArrowRight, Star, Laptop, Megaphone, Palette, TrendingUp, DollarSign, Headphones, PenTool } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockJobs, mockCompanies, mockCategories, mockTestimonials, mockStats } from '../mock';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const featuredJobs = mockJobs.filter(job => job.featured).slice(0, 4);
  const topCompanies = mockCompanies.slice(0, 6);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % mockTestimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getIcon = (iconName) => {
    const icons = {
      Briefcase,
      Building2,
      CheckCircle,
      Users
    };
    return icons[iconName] || Briefcase;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/jobs?search=${searchQuery}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, #E91E63 0%, transparent 70%)' }}></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, #FF6F00 0%, transparent 70%)' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span style={{ color: '#E91E63' }}>Jaipur Ka Apna</span>
              <br />
              <span className="text-gray-900">Job Portal</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              10,000+ Jobs | Daily Updates | Trusted by 50,000+
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <Input
                    type="text"
                    placeholder="Search jobs, companies, skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="text-white font-semibold"
                  style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {['Government Jobs', 'Private Jobs', 'Internships', 'Remote'].map((filter) => (
                <Link key={filter} to={`/jobs?type=${filter.toLowerCase().replace(' ', '-')}`}>
                  <Badge
                    variant="outline"
                    className="px-4 py-2 cursor-pointer hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63] transition-colors"
                  >
                    {filter}
                  </Badge>
                </Link>
              ))}
            </div>

            {/* Popular Searches */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">Popular Searches: </span>
              {['Software Developer', 'Digital Marketing', 'BPO', 'Sales'].map((term, idx) => (
                <React.Fragment key={term}>
                  <Link to={`/jobs?search=${term}`} className="text-[#E91E63] hover:underline">
                    {term}
                  </Link>
                  {idx < 3 && ' • '}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {mockStats.map((stat) => {
              const Icon = getIcon(stat.icon);
              return (
                <Card key={stat.label} className="border-2 hover:border-[#E91E63] transition-all hover:shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
            <Link to="/jobs">
              <Button variant="ghost" className="text-[#E91E63] hover:text-[#FF6F00]">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-all border-2 hover:border-[#E91E63]">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <img src={job.logo} alt={job.company} className="w-14 h-14 object-contain" />
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                    </div>
                    {job.featured && (
                      <Badge style={{ backgroundColor: '#E91E63' }} className="text-white">FEATURED</Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1" />
                      {job.salary}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-sm text-gray-500">Posted {job.posted}</span>
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockCategories.map((category) => (
              <Link key={category.id} to={`/jobs?category=${category.name}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer hover:border-[#E91E63] border-2">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">
                      {category.icon === 'Laptop' && '💻'}
                      {category.icon === 'Megaphone' && '📱'}
                      {category.icon === 'Palette' && '🎨'}
                      {category.icon === 'TrendingUp' && '📊'}
                      {category.icon === 'Users' && '👥'}
                      {category.icon === 'DollarSign' && '💰'}
                      {category.icon === 'Headphones' && '🎧'}
                      {category.icon === 'PenTool' && '✍️'}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count}+ jobs</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Top Companies Hiring</h2>
            <Link to="/companies">
              <Button variant="ghost" className="text-[#E91E63] hover:text-[#FF6F00]">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topCompanies.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-all border-2 hover:border-[#E91E63]">
                <CardContent className="p-6">
                  <img src={company.logo} alt={company.name} className="w-24 h-24 object-contain mx-auto mb-4" />
                  <h3 className="font-bold text-lg text-center mb-2">{company.name}</h3>
                  <div className="flex items-center justify-center mb-3">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{company.rating}</span>
                    <span className="text-gray-600 text-sm ml-1">({company.reviews} reviews)</span>
                  </div>
                  <p className="text-center text-sm text-gray-600 mb-4">{company.openPositions} Open Positions</p>
                  <Link to={`/companies/${company.id}`}>
                    <Button variant="outline" className="w-full hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63]">
                      View Jobs
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">How KaamJaipur Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Create Profile', desc: 'Sign up free in 30 seconds' },
              { step: '2', title: 'Search Jobs', desc: 'Browse 10k+ verified jobs' },
              { step: '3', title: 'Apply Online', desc: 'One-click applications' },
              { step: '4', title: 'Get Hired', desc: 'Track status' }
            ].map((item, idx) => (
              <div key={idx} className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}>
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-[#E91E63] to-[#FF6F00] opacity-30" style={{ width: 'calc(100% - 4rem)' }}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Success Stories</h2>
          <Card className="border-2 shadow-lg">
            <CardContent className="p-8">
              <div className="flex mb-6">
                {[...Array(mockTestimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-lg text-gray-700 mb-6 italic">
                "{mockTestimonials[currentTestimonial].text}"
              </p>
              <div className="flex items-center">
                <img
                  src={mockTestimonials[currentTestimonial].image}
                  alt={mockTestimonials[currentTestimonial].name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-bold">{mockTestimonials[currentTestimonial].name}</div>
                  <div className="text-sm text-gray-600">{mockTestimonials[currentTestimonial].role}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center mt-6 space-x-2">
            {mockTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentTestimonial ? 'w-8 bg-[#E91E63]' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Dream Job?</h2>
          <p className="text-lg mb-8 opacity-90">Join 50,000+ job seekers in Jaipur today</p>
          <Button
            size="lg"
            className="bg-white hover:bg-gray-100 font-semibold"
            style={{ color: '#E91E63' }}
          >
            Create Free Account <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="mt-4 text-sm opacity-75">
            Already have an account? <a href="#" className="underline font-medium">Login</a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
