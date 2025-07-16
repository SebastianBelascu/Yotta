import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface SearchFormProps {
  className?: string;
}

export function SearchForm({ className = '' }: SearchFormProps) {
  return (
    <form 
      action="/services/search"
      method="GET"
      className={`bg-white rounded-lg shadow-md p-4 ${className}`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="query"
            placeholder="Search for services, tools, or solutions..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="md:w-48">
          <div className="relative w-full">
            <select 
              name="country"
              className="block appearance-none w-full bg-white border border-gray-300 py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Country</option>
              <option value="singapore">Singapore</option>
              <option value="malaysia">Malaysia</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
        <button 
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md flex items-center justify-center gap-2"
        >
          <Search className="h-5 w-5" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}
