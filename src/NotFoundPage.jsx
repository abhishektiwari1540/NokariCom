import React from 'react';
import { Link } from 'react-router-dom';
import SeoMeta from './components/SEO/SeoMeta';

const NotFoundPage = () => {
  return (
    <>
      <SeoMeta
        title="Page Not Found - KaamJaipur | Jobs in Jaipur"
        description="Sorry, the page you're looking for doesn't exist. Browse thousands of job opportunities in Jaipur on KaamJaipur."
        noindex={true}
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-pink-600 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved.
            Don't worry, you can find plenty of job opportunities on our homepage.
          </p>
          
          <div className="space-y-4">
            <Link 
              to="/" 
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition"
            >
              Go to Homepage
            </Link>
            
            <div className="pt-8">
              <h3 className="text-xl font-medium text-gray-800 mb-4">Popular Job Categories</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['Government Jobs', 'Private Jobs', 'Internships', 'Remote Work', 'IT Jobs', 'Marketing'].map((category) => (
                  <Link
                    key={category}
                    to={`/jobs?category=${category.toLowerCase().replace(' ', '-')}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
          <p className="mt-12 text-sm text-gray-500">
            If you believe this is an error, please{' '}
            <a href="mailto:support@kaamjaipur.in" className="text-pink-600 hover:underline">
              contact our support team
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;