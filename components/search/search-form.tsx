'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, Briefcase, Wrench } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchFormProps {
  className?: string;
}

const SERVICE_CATEGORIES = [
  'Web Development',
  'Mobile Development', 
  'Digital Marketing',
  'SEO',
  'Graphic Design',
  'Content Writing',
  'Social Media Management',
  'E-commerce',
  'Consulting',
  'Data Analytics',
  'Cloud Services',
  'IT Support',
  'Cybersecurity',
  'UI/UX Design',
  'Video Production',
  'Photography',
  'Translation',
  'Legal Services',
  'Accounting',
  'HR Services'
];

const TOOL_CATEGORIES = [
  'Productivity',
  'Design',
  'Development',
  'Marketing',
  'Analytics',
  'Communication',
  'Finance',
  'Project Management',
  'E-commerce',
  'CRM',
  'HR & Recruitment',
  'Education',
  'Security',
  'AI & Machine Learning',
  'Social Media',
  'SEO',
  'Email Marketing',
  'Automation',
  'Content Creation',
  'Video & Audio'
];

const COUNTRIES = [
  { value: 'Singapore', label: 'Singapore' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Global', label: 'Global' }
];

export function SearchForm({ className = '' }: SearchFormProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'tools'>('services');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const router = useRouter();

  const currentCategories = activeTab === 'services' ? SERVICE_CATEGORIES : TOOL_CATEGORIES;
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
  };

  const handleSearch = () => {
    const basePath = activeTab === 'services' ? '/services' : '/tools';
    const params = new URLSearchParams();
    
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    if (selectedCountry) {
      params.set('region', selectedCountry);
    }
    
    const queryString = params.toString();
    const finalPath = queryString ? `${basePath}?${queryString}` : basePath;
    
    router.push(finalPath);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Tab Selector */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('services')}
          className={`flex-1 py-3 px-6 rounded-l-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'services'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Briefcase className="h-5 w-5" />
          Services
        </button>
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex-1 py-3 px-6 rounded-r-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 ${
            activeTab === 'tools'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Wrench className="h-5 w-5" />
          SaaS & AI Tools
        </button>
      </div>

      {/* Category and Country Selectors */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Category Dropdown */}
        <div className="flex-1 relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 flex items-center justify-between"
          >
            <span className={selectedCategory ? 'text-gray-900' : 'text-gray-500'}>
              {selectedCategory || `Select ${activeTab === 'services' ? 'Service' : 'Tool'} Category`}
            </span>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              showCategoryDropdown ? 'rotate-180' : ''
            }`} />
          </button>
          
          {showCategoryDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
              <div className="py-1">
                <button
                  onClick={() => handleCategorySelect('')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  All Categories
                </button>
                {currentCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Country Dropdown */}
        <div className="md:w-48 relative">
          <button
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 text-left focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 flex items-center justify-between"
          >
            <span className={selectedCountry ? 'text-gray-900' : 'text-gray-500'}>
              {selectedCountry || 'Select Country'}
            </span>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              showCountryDropdown ? 'rotate-180' : ''
            }`} />
          </button>
          
          {showCountryDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              <div className="py-1">
                <button
                  onClick={() => handleCountrySelect('')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  All Countries
                </button>
                {COUNTRIES.map((country) => (
                  <button
                    key={country.value}
                    onClick={() => handleCountrySelect(country.value)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {country.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button 
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-colors duration-200 md:w-auto w-full"
        >
          <Search className="h-5 w-5" />
          <span>Search</span>
        </button>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showCategoryDropdown || showCountryDropdown) && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => {
            setShowCategoryDropdown(false);
            setShowCountryDropdown(false);
          }}
        />
      )}
    </div>
  );
}
