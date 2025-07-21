'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';

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

const REGIONS = [
  'Global',
  'Malaysia',
  'Singapore',
  'Asia Pacific',
  'North America',
  'Europe'
];

const PRICE_RANGES = [
  { value: '0-500', label: '$0 - $500' },
  { value: '500-1000', label: '$500 - $1,000' },
  { value: '1000-2500', label: '$1,000 - $2,500' },
  { value: '2500-5000', label: '$2,500 - $5,000' },
  { value: '5000+', label: '$5,000+' }
];

export default function ServicesFiltersNew() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get('category');
  const currentRegion = searchParams.get('region');
  const currentPrice = searchParams.get('price');
  const currentConsultation = searchParams.get('consultation');

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset to page 1 when filters change
    params.delete('page');
    
    router.push(`/services?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('region');
    params.delete('price');
    params.delete('consultation');
    params.delete('page');
    
    router.push(`/services?${params.toString()}`);
  };

  const hasActiveFilters = currentCategory || currentRegion || currentPrice || currentConsultation;

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
            {SERVICE_CATEGORIES.map((category) => (
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

        {/* Free Consultation Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Consultation</h4>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name="consultation"
                checked={currentConsultation === 'true'}
                onChange={() => updateFilter('consultation', currentConsultation === 'true' ? null : 'true')}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Free Consultation</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
