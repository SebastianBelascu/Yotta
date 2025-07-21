'use client';

import Link from 'next/link';
import { ArrowLeft, Home, Search, Wrench, Briefcase } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
            404
          </h1>
          <div className="h-2 w-16 bg-gradient-to-r from-blue-600 to-orange-500 mx-auto my-6 rounded-full"></div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500">
            Don't worry, let's get you back on track!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
          
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-orange-300 text-base font-medium rounded-lg text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Popular Pages
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/services" 
              className="flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-600 bg-white rounded-lg border border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Services
            </Link>
            <Link 
              href="/tools" 
              className="flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-600 bg-white rounded-lg border border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
            >
              <Wrench className="mr-2 h-4 w-4" />
              Tools
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-center text-gray-500 mb-2">
            <Search className="h-5 w-5 mr-2" />
            <span className="text-sm">Can't find what you're looking for?</span>
          </div>
          <Link 
            href="/" 
            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
          >
            Try searching from our homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
