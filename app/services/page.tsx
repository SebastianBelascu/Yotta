import React from 'react';
import { Layout } from '@/components/layout/layout';
import Link from 'next/link';
import { Search, ChevronDown } from 'lucide-react';
import { SearchForm } from '@/components/search/search-form';

export default function ServicesPage() {
  // Categories for services
  const categories = [
    {
      name: 'Company Formation',
      count: 24,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      name: 'Banking',
      count: 18,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l9-4 9 4m-9-4v20m0 0l9-4m-9 4l-9-4m18 0V8m-9 4h9" />
        </svg>
      )
    },
    {
      name: 'Digital Marketing',
      count: 32,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    {
      name: 'Legal Services',
      count: 15,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    },
    {
      name: 'Accounting',
      count: 21,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'AI Tools',
      count: 28,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  // Featured services
  const featuredServices = [
    {
      id: 1,
      slug: 'techflow',
      name: 'TechFlow Digital Marketing Agency',
      category: 'Digital Marketing',
      rating: 4.9,
      reviewCount: 128
    },
    {
      id: 2,
      slug: 'seo',
      name: 'SEO Optimization Service',
      category: 'Digital Marketing',
      rating: 4.8,
      reviewCount: 94
    },
    {
      id: 3,
      slug: 'firstbase',
      name: 'Firstbase',
      category: 'Company Formation',
      rating: 4.7,
      reviewCount: 650
    }
  ];

  return (
    <Layout>
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Services Directory</h1>
            <p className="mt-2 text-gray-600">
              Browse our comprehensive directory of business services and tools
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchForm className="" />
          </div>

          {/* Categories */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <Link 
                  href={`/services/search?category=${encodeURIComponent(category.name)}`}
                  key={index}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 text-blue-600">
                    {category.icon}
                  </div>
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{category.count} services</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Services */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredServices.map((service) => (
                <Link 
                  href={`/services/${service.slug}`}
                  key={service.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <span>{service.category}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">{service.name}</h3>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(service.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">({service.reviewCount} reviews)</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recently Added */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Added</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="h-32 bg-gray-200 rounded-md mb-4"></div>
                  <h3 className="font-medium text-gray-900 mb-1">New Service {item}</h3>
                  <p className="text-sm text-gray-500 mb-3">Added 2 days ago</p>
                  <Link 
                    href={`/services/service-${item}`}
                    className="text-blue-600 text-sm font-medium hover:text-blue-800"
                  >
                    View details →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
