import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'For Job Seekers',
      links: [
        { label: 'Browse Jobs', path: '/jobs' },
        { label: 'Create Profile', path: '#' },
        { label: 'Saved Jobs', path: '#' },
        { label: 'Job Alerts', path: '#' },
      ],
    },
    {
      title: 'For Employers',
      links: [
        { label: 'Post a Job', path: '#' },
        { label: 'Pricing', path: '#' },
        { label: 'Solutions', path: '#' },
        { label: 'Hire Now', path: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', path: '#' },
        { label: 'Contact', path: '#' },
        { label: 'Blog', path: '#' },
        { label: 'Careers', path: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #E91E63 0%, #FF6F00 100%)' }}>
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-white">KaamJaipur</div>
              </div>
            </Link>
            <p className="text-sm mb-4">Jaipur Ka Apna Job Portal</p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#E91E63] transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm hover:text-[#E91E63] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} KaamJaipur. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="#" className="text-sm hover:text-[#E91E63] transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-sm hover:text-[#E91E63] transition-colors">
                Terms of Service
              </Link>
              <Link to="#" className="text-sm hover:text-[#E91E63] transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
