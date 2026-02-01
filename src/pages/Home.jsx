import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, Briefcase, Building2, CheckCircle, Users, 
  ArrowRight, Star, Laptop, Megaphone, Palette, TrendingUp, 
  DollarSign, Headphones, PenTool, Sparkles, Rocket, Target, 
  Zap, ChevronRight, Award, Clock, Shield, Heart, UserPlus, 
  Send, Trophy, CheckCircle2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { mockCategories, mockTestimonials, mockStats } from '../mock';
import HomeSeo from '../components/SEO/HomeSeo';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [categoriesWithCount, setCategoriesWithCount] = useState([]);
  const [heroLoaded, setHeroLoaded] = useState(false);
  
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuredRef = useRef(null);
  const categoriesRef = useRef(null);
  const companiesRef = useRef(null);
  const ctaRef = useRef(null);
  const particlesRef = useRef(null);

  const seoProps = useMemo(() => ({
    jobCount: jobs.length
  }), [jobs.length]);

  // Format date to relative time
  const formatDate = useCallback((dateString) => {
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
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!loading) {
      // Hero animations
      gsap.fromTo('.hero-title', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.2 }
      );

      gsap.fromTo('.search-container',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'back.out(1.7)' }
      );

      // Stats counter animation
      const statElements = document.querySelectorAll('.stat-value');
      statElements.forEach((stat) => {
        const target = parseInt(stat.textContent);
        gsap.fromTo(stat,
          { innerText: 0 },
          {
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
            }
          }
        );
      });

      // Floating particles animation
      if (particlesRef.current) {
        const particles = particlesRef.current.querySelectorAll('.particle');
        particles.forEach((particle, i) => {
          gsap.to(particle, {
            y: () => gsap.utils.random(-20, 20),
            x: () => gsap.utils.random(-10, 10),
            duration: gsap.utils.random(2, 4),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: i * 0.1
          });
        });
      }

      // Card hover animations
      const cards = document.querySelectorAll('.animated-card');
      cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        });
      });

      // Parallax effect for hero
      gsap.to('.hero-bg-element', {
        y: (i) => i * 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loading]);

  // Fetch data from API with caching
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try to get cached data first
        const cachedData = localStorage.getItem('jobsData');
        const cacheTimestamp = localStorage.getItem('jobsDataTimestamp');
        const now = new Date().getTime();
        const cacheDuration = 5 * 60 * 1000;
        
        if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < cacheDuration) {
          const data = JSON.parse(cachedData);
          processData(data);
          setLoading(false);
          return;
        }
        
        const response = await fetch('https://scraping-production-6a7a.up.railway.app/api/scrape');
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        localStorage.setItem('jobsData', JSON.stringify(data));
        localStorage.setItem('jobsDataTimestamp', now.toString());
        
        processData(data);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        const cachedData = localStorage.getItem('jobsData');
        if (cachedData) {
          const data = JSON.parse(cachedData);
          processData(data);
        }
      } finally {
        setLoading(false);
      }
    };

    const processData = (data) => {
      if (data.success && data.data) {
        const transformedJobs = data.data.slice(0, 50).map(job => ({
          id: job.job_id || job._id,
          job_id: job.job_id,
          title: job.job_title,
          company: job.company_name,
          location: job.location,
          salary: job.salary_currency ? `${job.salary_currency} Competitive` : 'Competitive Salary',
          skills: Array.isArray(job.skills) ? job.skills : [],
          posted: formatDate(job.posted_date),
          featured: job.is_verified || Math.random() > 0.7,
          logo: job.company_logo || '/default-company.png',
          description: job.description,
          is_remote: job.is_remote,
          category: job.category || 'General',
          requirements: job.requirements,
          benefits: job.benefits
        }));
        
        setJobs(transformedJobs);
        
        const featured = transformedJobs
          .filter(job => job.featured || job.is_remote)
          .slice(0, 4);
        
        if (featured.length < 4) {
          setFeaturedJobs(transformedJobs.slice(0, 4));
        } else {
          setFeaturedJobs(featured);
        }
        
        const companyMap = new Map();
        transformedJobs.forEach(job => {
          if (!companyMap.has(job.company)) {
            companyMap.set(job.company, {
              id: job.company.toLowerCase().replace(/\s+/g, '-'),
              name: job.company,
              logo: job.logo,
              rating: (Math.random() * 2 + 3).toFixed(1),
              reviews: Math.floor(Math.random() * 1000) + 50,
              openPositions: 0
            });
          }
          const company = companyMap.get(job.company);
          company.openPositions++;
        });
        
        const uniqueCompanies = Array.from(companyMap.values());
        setCompanies(uniqueCompanies);
        
        const sortedCompanies = [...uniqueCompanies]
          .sort((a, b) => b.openPositions - a.openPositions)
          .slice(0, 6);
        setTopCompanies(sortedCompanies);
        
        const categoryCounts = {};
        transformedJobs.forEach(job => {
          const category = job.category || 'General';
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        
        const updatedCategories = mockCategories.map(cat => {
          const count = Object.entries(categoryCounts).reduce((total, [catName, catCount]) => {
            if (cat.name.toLowerCase().includes(catName.toLowerCase()) || 
                catName.toLowerCase().includes(cat.name.toLowerCase())) {
              return total + catCount;
            }
            return total;
          }, 0);
          
          return {
            ...cat,
            dynamicCount: count || cat.count
          };
        });
        
        setCategoriesWithCount(updatedCategories);
      }
    };

    fetchData();
  }, [formatDate]);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % mockTestimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const getIcon = useCallback((iconName) => {
    const icons = {
      Briefcase, Building2, CheckCircle, Users, Sparkles, Rocket, Target, Zap
    };
    return icons[iconName] || Briefcase;
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(searchQuery)}`;
    }
  }, [searchQuery]);

  const dynamicStats = useMemo(() => [
    { icon: 'Sparkles', label: 'Live Jobs', value: jobs.length || 0 },
    { icon: 'Rocket', label: 'Companies', value: companies.length || 0 },
    { icon: 'Target', label: 'Verified Jobs', value: jobs.filter(job => job.featured).length || 0 },
    { icon: 'Zap', label: 'Job Seekers', value: '50,000+' }
  ], [jobs, companies]);

  // Framer Motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <>
        <HomeSeo {...seoProps} />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          {/* Animated loading skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative overflow-hidden"
          >
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
              <motion.div
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="h-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg max-w-2xl mx-auto mb-4 bg-[length:200%_200%]"
              />
              <div className="h-4 bg-gray-200 rounded-lg max-w-md mx-auto mb-8" />
              <div className="max-w-3xl mx-auto mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 h-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
                  <div className="h-12 w-32 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <HomeSeo {...seoProps} />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
        {/* Hero Section with advanced animations */}
        <section ref={heroRef} className="relative overflow-hidden">
          {/* Animated background particles */}
          <div ref={particlesRef} className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="particle absolute rounded-full"
                style={{
                  background: `radial-gradient(circle, ${i % 3 === 0 ? '#E91E63' : i % 3 === 1 ? '#FF6F00' : '#FFC107'}20 0%, transparent 70%)`,
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 1 }}
              />
            ))}
          </div>

          {/* Floating elements */}
          <motion.div
            className="hero-bg-element absolute top-20 left-10 w-72 h-72 rounded-full"
            style={{ background: 'radial-gradient(circle, #E91E63 0%, transparent 70%)' }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          
          <motion.div
            className="hero-bg-element absolute bottom-20 right-10 w-96 h-96 rounded-full"
            style={{ background: 'radial-gradient(circle, #FF6F00 0%, transparent 70%)' }}
            animate={{
              y: [0, 20, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <motion.div
                className="inline-block mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <Badge className="px-4 py-2 bg-gradient-to-r from-[#E91E63] to-[#FF6F00] text-white border-0">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Jaipur's #1 Job Portal
                </Badge>
              </motion.div>

              <motion.h1 
                className="hero-title text-4xl md:text-6xl font-bold mb-6"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-[#E91E63] via-[#FF6F00] to-[#FFC107] bg-clip-text text-transparent">
                  Find Your Dream Job
                </span>
                <br />
                <span className="text-gray-900">in The Pink City</span>
              </motion.h1>

              <motion.p 
                className="text-lg md:text-xl text-gray-600 mb-8"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <span className="font-semibold text-[#E91E63]">{jobs.length}+ Jobs</span> • Daily Updates • Trusted by 50,000+
              </motion.p>

              {/* Search Bar with enhanced animation */}
              <motion.div 
                className="search-container max-w-3xl mx-auto mb-8"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <form onSubmit={handleSearch} className="relative">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-4 border border-white/20">
                    <div className="flex-1 flex items-center">
                      <Search className="w-5 h-5 text-gray-400 mr-3 ml-3" />
                      <Input
                        type="text"
                        placeholder="Search jobs, companies, skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-lg bg-transparent"
                      />
                    </div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        size="lg"
                        className="text-white font-semibold px-8"
                        style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                      >
                        <Zap className="w-5 h-5 mr-2" />
                        Search Jobs
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </motion.div>

              {/* Quick Filters with staggered animation */}
              <motion.div 
                className="flex flex-wrap justify-center gap-3 mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {['Government Jobs', 'Private Jobs', 'Internships', 'Remote', 'Startups'].map((filter, index) => (
                  <motion.div key={filter} variants={itemVariants}>
                    <Link to={`/jobs?type=${filter.toLowerCase().replace(' ', '-')}`}>
                      <Badge
                        variant="outline"
                        className="px-4 py-2 cursor-pointer backdrop-blur-sm bg-white/50 hover:bg-gradient-to-r hover:from-[#E91E63] hover:to-[#FF6F00] hover:text-white hover:border-transparent transition-all duration-300 group"
                      >
                        <span className="group-hover:scale-110 transition-transform duration-300">
                          {filter}
                        </span>
                      </Badge>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              {/* Animated tags */}
              <motion.div 
                className="text-sm text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <span className="font-medium">Trending Searches: </span>
                {['Software Developer', 'Digital Marketing', 'BPO', 'Sales'].map((term, idx) => (
                  <React.Fragment key={term}>
                    <Link to={`/jobs?search=${encodeURIComponent(term)}`}>
                      <motion.span 
                        className="text-[#E91E63] hover:underline cursor-pointer mx-1"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {term}
                      </motion.span>
                    </Link>
                    {idx < 3 && ' • '}
                  </React.Fragment>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section with counting animation */}
        <section ref={statsRef} className="py-12 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {dynamicStats.map((stat) => {
                const Icon = getIcon(stat.icon);
                return (
                  <motion.div
                    key={stat.label}
                    whileHover={{ y: -10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Card className="animated-card border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50">
                      <CardContent className="p-6 text-center">
                        <motion.div 
                          className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg"
                          style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="w-7 h-7 text-white" />
                        </motion.div>
                        <div className="text-3xl font-bold text-gray-900 mb-1 stat-value">
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Featured Jobs with card animations */}
        <section ref={featuredRef} className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="flex justify-between items-center mb-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900">Featured <span className="text-[#E91E63]">Jobs</span></h2>
              <Link to="/jobs">
                <Button variant="ghost" className="group">
                  View All 
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredJobs.map((job, index) => (
                <motion.div key={job.id} variants={itemVariants}>
                  <Card className="animated-card group hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#E91E63]/30 bg-gradient-to-br from-white to-gray-50/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <motion.div 
                            className="relative"
                            whileHover={{ scale: 1.1 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63] to-[#FF6F00] rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <img 
                              src={job.logo} 
                              alt={job.company} 
                              className="relative w-14 h-14 object-contain rounded-lg border bg-white z-10"
                              onError={(e) => {
                                e.target.src = '/default-company.png';
                              }}
                            />
                          </motion.div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-[#E91E63] transition-colors">{job.title}</h3>
                            <p className="text-gray-600">{job.company}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {job.featured && (
                            <Badge style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }} className="text-white animate-pulse">
                              FEATURED
                            </Badge>
                          )}
                          {job.is_remote && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Remote
                            </Badge>
                          )}
                        </div>
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
                          <motion.div
                            key={skill}
                            whileHover={{ scale: 1.1 }}
                          >
                            <Badge variant="secondary" className="text-xs bg-gray-100">
                              {skill}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Posted {job.posted}
                        </span>
                        <Link to={`/jobs/${job.job_id}`}>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="bg-gradient-to-r from-[#E91E63] to-[#FF6F00] text-white group">
                              Apply Now
                              <motion.span
                                className="ml-2"
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ArrowRight className="w-4 h-4" />
                              </motion.span>
                            </Button>
                          </motion.div>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Browse by Category with 3D effect */}
        <section ref={categoriesRef} className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Browse by <span className="text-[#E91E63]">Category</span>
            </motion.h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {(categoriesWithCount.length > 0 ? categoriesWithCount : mockCategories).map((category, index) => {
                const iconMap = {
                  'Laptop': Laptop, 'Megaphone': Megaphone, 'Palette': Palette,
                  'TrendingUp': TrendingUp, 'Users': Users, 'DollarSign': DollarSign,
                  'Headphones': Headphones, 'PenTool': PenTool
                };
                const IconComponent = iconMap[category.icon] || Briefcase;
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/jobs?category=${encodeURIComponent(category.name)}`}>
                      <Card className="animated-card h-full hover:shadow-2xl transition-all duration-300 group hover:border-[#E91E63]/30 bg-gradient-to-b from-white to-gray-50/50">
                        <CardContent className="p-6 text-center">
                          <motion.div 
                            className="relative w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                            style={{ 
                              background: 'linear-gradient(135deg, rgba(233,30,99,0.1) 0%, rgba(255,111,0,0.1) 100%)'
                            }}
                            whileHover={{ rotateY: 180 }}
                            transition={{ duration: 0.6 }}
                          >
                            <IconComponent className="w-10 h-10" style={{ color: '#E91E63' }} />
                          </motion.div>
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#E91E63] transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {(category.dynamicCount || category.count)}+ jobs
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Top Companies with shimmer effect */}
        <section ref={companiesRef} className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="flex justify-between items-center mb-8"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900">
                Top <span className="text-[#E91E63]">Companies</span> Hiring
              </h2>
              <Link to="/companies">
                <Button variant="ghost" className="group">
                  View All Companies
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ rotate: [0, 90, 180] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.span>
                </Button>
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topCompanies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="animated-card group hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#E91E63]/30 relative overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <CardContent className="p-6 relative z-10">
                      <motion.div
                        className="relative mx-auto mb-4"
                        whileHover={{ scale: 1.1 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63] to-[#FF6F00] rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <img 
                          src={company.logo} 
                          alt={company.name} 
                          className="relative w-24 h-24 object-contain mx-auto rounded-lg border bg-white z-10"
                          onError={(e) => {
                            e.target.src = '/default-company.png';
                          }}
                        />
                      </motion.div>
                      
                      <h3 className="font-bold text-lg text-center mb-2 group-hover:text-[#E91E63] transition-colors">
                        {company.name}
                      </h3>
                      
                      <div className="flex items-center justify-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <Star className={`w-4 h-4 ${i < Math.floor(company.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          </motion.div>
                        ))}
                        <span className="font-medium ml-2">{company.rating}</span>
                      </div>
                      
                      <p className="text-center text-sm text-gray-600 mb-4">
                        {company.openPositions} Open Position{company.openPositions !== 1 ? 's' : ''}
                      </p>
                      
                      <Link to={`/companies/${company.id}`}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="outline" 
                            className="w-full group"
                          >
                            <span className="group-hover:scale-110 transition-transform duration-300">
                              View Jobs
                            </span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </motion.div>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works with interactive steps */}
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 mb-12 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              How <span className="text-[#E91E63]">KaamJaipur</span> Works
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-1 bg-gradient-to-r from-[#E91E63]/30 via-[#FF6F00]/30 to-[#FFC107]/30">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#E91E63] via-[#FF6F00] to-[#FFC107]"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 2 }}
                />
              </div>
              
              {[
                { step: '1', title: 'Create Profile', desc: 'Sign up free in 30 seconds', icon: UserPlus },
                { step: '2', title: 'Search Jobs', desc: `Browse ${jobs.length}+ verified jobs`, icon: Search },
                { step: '3', title: 'Apply Online', desc: 'One-click applications', icon: Send },
                { step: '4', title: 'Get Hired', desc: 'Track status & interviews', icon: Trophy }
              ].map((item, idx) => (
                <motion.div 
                  key={idx} 
                  className="text-center relative z-10"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  whileHover={{ y: -10 }}
                >
                  <motion.div 
                    className="relative w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-xl"
                    style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.step}
                  </motion.div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials with smooth transitions */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2 
              className="text-3xl font-bold text-gray-900 mb-12 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Success <span className="text-[#E91E63]">Stories</span>
            </motion.h2>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 shadow-2xl hover:shadow-3xl transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex mb-6">
                      {[...Array(mockTestimonials[currentTestimonial].rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Star className="w-6 h-6 fill-yellow-400 text-yellow-400 mx-1" />
                        </motion.div>
                      ))}
                    </div>
                    
                    <motion.p 
                      className="text-xl text-gray-700 mb-6 italic relative"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <span className="absolute -left-4 -top-4 text-6xl text-[#E91E63]/20">"</span>
                      {mockTestimonials[currentTestimonial].text}
                    </motion.p>
                    
                    <motion.div 
                      className="flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#E91E63] to-[#FF6F00] rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img
                          src={mockTestimonials[currentTestimonial].image}
                          alt={mockTestimonials[currentTestimonial].name}
                          className="relative w-14 h-14 rounded-full mr-4 border-2 border-white shadow-lg z-10"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{mockTestimonials[currentTestimonial].name}</div>
                        <div className="text-sm text-gray-600">{mockTestimonials[currentTestimonial].role}</div>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
            
            <div className="flex justify-center mt-8 space-x-3">
              {mockTestimonials.map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`relative rounded-full transition-all duration-300 ${
                    idx === currentTestimonial ? 'w-12' : 'w-3'
                  } h-3`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div
                    className={`absolute inset-0 rounded-full transition-colors ${
                      idx === currentTestimonial 
                        ? 'bg-gradient-to-r from-[#E91E63] to-[#FF6F00]' 
                        : 'bg-gray-300'
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section with pulse animation */}
        <section ref={ctaRef} className="relative overflow-hidden py-20">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <motion.div
              className="absolute top-0 left-0 w-full h-full"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(233,30,99,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 20%, rgba(255,111,0,0.3) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 50%, rgba(233,30,99,0.3) 0%, transparent 50%)',
                ],
              }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block mb-6"
            >
              <Award className="w-16 h-16 text-white/80" />
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-5xl font-bold mb-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Ready to Find Your{' '}
              <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                Dream Job?
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl mb-8 opacity-90"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Join <span className="font-bold">50,000+</span> job seekers in Jaipur today
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="group bg-white hover:bg-gray-100 font-semibold text-lg px-8 py-6 rounded-xl shadow-2xl"
                style={{ color: '#E91E63' }}
              >
                <Rocket className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Create Free Account
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
            
            <motion.p 
              className="mt-6 text-lg opacity-75"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Already have an account?{' '}
              <a href="#" className="underline font-medium hover:text-yellow-200 transition-colors">
                Login
              </a>
            </motion.p>
            
            {/* Trust badges */}
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-6 mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[
                { icon: Shield, text: 'Verified Jobs' },
                { icon: Clock, text: 'Daily Updates' },
                { icon: Heart, text: 'Trusted by 50K+' }
              ].map((badge, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <badge.icon className="w-4 h-4" />
                  <span className="text-sm">{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Floating Action Button */}
        <motion.div
          className="fixed bottom-8 right-8 z-50"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            size="icon"
            className="rounded-full w-14 h-14 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}
          >
            <Briefcase className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>
    </>
  );
};

export default Home;