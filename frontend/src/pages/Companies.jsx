import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { mockCompanies } from '../mock';

const Companies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const industries = ['All', 'IT Services', 'BPO & IT Services', 'Banking & Finance'];

  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = searchQuery === '' || 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = selectedIndustry === 'All' || company.industry === selectedIndustry;
    
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Top Companies Hiring in Jaipur</h1>
          <p className="text-gray-600">{filteredCompanies.length} companies • 5,000+ open positions</p>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-sm border p-4 flex items-center">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <Input
                type="text"
                placeholder="Search companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>
          </div>

          {/* Industry Filter */}
          <div className="mt-4 flex flex-wrap gap-2">
            {industries.map((industry) => (
              <Badge
                key={industry}
                variant={selectedIndustry === industry ? 'default' : 'outline'}
                className={`px-4 py-2 cursor-pointer transition-colors ${
                  selectedIndustry === industry
                    ? 'bg-[#E91E63] hover:bg-[#E91E63] text-white border-[#E91E63]'
                    : 'hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63]'
                }`}
                onClick={() => setSelectedIndustry(industry)}
              >
                {industry}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredCompanies.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <p className="text-gray-600 text-lg">No companies found matching your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition-all border-2 hover:border-[#E91E63]">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Company Logo */}
                    <img src={company.logo} alt={company.name} className="w-20 h-20 object-contain" />

                    {/* Company Details */}
                    <div className="flex-1">
                      <Link to={`/companies/${company.id}`}>
                        <h3 className="font-bold text-xl text-gray-900 hover:text-[#E91E63] transition-colors mb-1">
                          {company.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-3">{company.industry}</p>

                      <div className="flex items-center mb-3">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="font-medium text-sm">{company.rating}</span>
                        <span className="text-gray-600 text-sm ml-1">({company.reviews} reviews)</span>
                        <span className="mx-2 text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{company.employees} employees</span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        <Building2 className="w-4 h-4 inline mr-1" />
                        {company.location}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <Badge
                            style={{ backgroundColor: '#E91E63' }}
                            className="text-white"
                          >
                            {company.openPositions} Open Positions
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">Avg Salary: {company.avgSalary}</p>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/companies/${company.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="hover:bg-[#E91E63] hover:text-white hover:border-[#E91E63]"
                            >
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {company.topSkills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
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
  );
};

export default Companies;
