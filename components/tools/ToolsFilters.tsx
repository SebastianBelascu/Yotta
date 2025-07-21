'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';

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

const REGIONS = [
  'Global',
  'Malaysia',
  'Singapore',
  'Asia Pacific',
  'North America',
  'Europe'
];

const PLATFORMS = [
  'Web',
  'iOS',
  'Android',
  'Windows',
  'macOS',
  'Linux',
  'Chrome Extension',
  'API'
];

const PRICE_RANGES = [
  { value: 'free', label: 'Free' },
  { value: '0-50', label: '$0 - $50' },
  { value: '50-100', label: '$50 - $100' },
  { value: '100-500', label: '$100 - $500' },
  { value: '500+', label: '$500+' }
];

export default function ToolsFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category');
  const currentRegion = searchParams.get('region');
  const currentPlatform = searchParams.get('platform');
  const currentPrice = searchParams.get('price');

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 when filters change
    params.delete('page');
    
    router.push(`/tools?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('region');
    params.delete('platform');
    params.delete('price');
    params.delete('page');
    
    router.push(`/tools?${params.toString()}`);
  };

  const hasActiveFilters = currentCategory || currentRegion || currentPlatform || currentPrice;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {TOOL_CATEGORIES.map((category) => (
              <label key={category} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="radio"
                  name="category"
                  checked={currentCategory === category}
                  onChange={() => updateFilter('category', currentCategory === category ? null : category)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Region Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Region</h4>
          <div className="space-y-2">
            {REGIONS.map((region) => (
              <label key={region} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="radio"
                  name="region"
                  checked={currentRegion === region}
                  onChange={() => updateFilter('region', currentRegion === region ? null : region)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{region}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Platform Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Platform</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {PLATFORMS.map((platform) => (
              <label key={platform} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="radio"
                  name="platform"
                  checked={currentPlatform === platform}
                  onChange={() => updateFilter('platform', currentPlatform === platform ? null : platform)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{platform}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
          <div className="space-y-2">
            {PRICE_RANGES.map((priceRange) => (
              <label key={priceRange.value} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="radio"
                  name="price"
                  checked={currentPrice === priceRange.value}
                  onChange={() => updateFilter('price', currentPrice === priceRange.value ? null : priceRange.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{priceRange.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
