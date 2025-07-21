'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ServicesFiltersProps {
  allCategories: string[];
  allLocations: string[];
  initialFilters: {
    category?: string;
    location?: string;
    price?: string;
    consultation?: boolean;
  };
}

export default function ServicesFilters({ 
  allCategories, 
  allLocations, 
  initialFilters 
}: ServicesFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateURL = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Reset to first page when filters change
    params.delete('page');
    
    router.push(`/services?${params.toString()}`);
  };

  const handleSelectChange = (key: string, value: string) => {
    updateURL({ [key]: value || undefined });
  };

  return (
    <div className="bg-white rounded-lg p-4 mb-8 flex items-center space-x-4">
      <div className="flex items-center">
        <span className="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </span>
        <span className="font-medium">Filters:</span>
      </div>
      
      {/* Category Filter */}
      <div className="relative">
        <select
          value={initialFilters.category || ''}
          onChange={(e) => updateURL({ category: e.target.value || undefined })}
          className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {allCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Location Filter */}
      <div className="relative">
        <select
          value={initialFilters.location || ''}
          onChange={(e) => updateURL({ location: e.target.value || undefined })}
          className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Locations</option>
          {allLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Price Range Filter */}
      <div className="relative">
        <select
          value={initialFilters.price || ''}
          onChange={(e) => updateURL({ price: e.target.value || undefined })}
          className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Prices</option>
          <option value="0-100">$0 - $100</option>
          <option value="101-500">$101 - $500</option>
          <option value="501-1000">$501 - $1,000</option>
          <option value="1001-5000">$1,001 - $5,000</option>
          <option value="5001">$5,001+</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Free Consultation Filter */}
      <div className="relative">
        <select
          value={initialFilters.consultation ? 'true' : ''}
          onChange={(e) => updateURL({ consultation: e.target.value || undefined })}
          className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Services</option>
          <option value="true">Free Consultation</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Clear All Button */}
      {(initialFilters.category || initialFilters.location || initialFilters.price || initialFilters.consultation) && (
        <button
          onClick={() => updateURL({ category: undefined, location: undefined, price: undefined, consultation: undefined })}
          className="text-sm text-gray-500 hover:text-gray-700 underline whitespace-nowrap"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
