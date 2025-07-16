import React from 'react';
import { Layout } from '@/components/layout/layout';
import Link from 'next/link';

export default function ServicesSearchResults() {
  // Mock data for service providers
  const serviceProviders = [
    {
      id: 1,
      slug: 'atlas',
      name: 'Stripe Atlas',
      category: 'Company Formation',
      description: 'Incorporate a Delaware C-corp, get a tax ID, and US bank account',
      rating: 4.9,
      reviewCount: 856,
      price: '$500 setup',
      features: [
        'Delaware incorporation',
        'EIN setup',
        'Bank account'
      ]
    },
    {
      id: 2,
      slug: 'mercury',
      name: 'Mercury',
      category: 'Banking',
      description: 'Modern business banking designed for startups and growing companies',
      rating: 4.8,
      reviewCount: 1250,
      price: 'Free',
      features: [
        'No monthly fees',
        'API access',
        'Virtual cards'
      ]
    },
    {
      id: 3,
      slug: 'firstbase',
      name: 'Firstbase',
      category: 'Company Formation',
      description: 'Launch your company in the US from anywhere in the world',
      rating: 4.7,
      reviewCount: 650,
      price: '$399 setup',
      features: [
        'US incorporation',
        'EIN & ITIN',
        'Banking setup'
      ]
    },
    // Additional mock data to show pagination
    ...Array.from({ length: 21 }, (_, i) => {
      const id = i + 4;
      return {
        id: id,
        slug: `service-${id}`,
        name: `Service Provider ${id}`,
        category: i % 2 === 0 ? 'Company Formation' : 'Banking',
        description: 'Service provider description here',
        rating: 4.5,
        reviewCount: 500,
        price: i % 3 === 0 ? 'Free' : `$${(i + 1) * 100} setup`,
        features: [
          'Feature 1',
          'Feature 2',
          'Feature 3'
        ]
      };
    })
  ];

  // Display only the first 24 results as per requirements
  const displayedProviders = serviceProviders.slice(0, 24);

  return (
    <Layout>
      <div className="flex-1 w-full flex flex-col items-center bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters Section */}
          <div className="bg-white rounded-lg p-4 mb-8 flex items-center space-x-4">
            <div className="flex items-center">
              <span className="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </span>
              <span className="font-medium">Filters:</span>
            </div>
            
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Highest Rated</option>
                <option>Lowest Rated</option>
                <option>Newest</option>
                <option>Oldest</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Prices</option>
                <option>Free</option>
                <option>$1 - $100</option>
                <option>$101 - $500</option>
                <option>$501+</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProviders.map((provider) => (
              <div key={provider.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-100 rounded-lg p-3 mr-4">
                      {provider.category === 'Company Formation' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{provider.name}</h3>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        provider.category === 'Company Formation' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {provider.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{provider.description}</p>
                  
                  <div className="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-bold ml-1 mr-2">{provider.rating}</span>
                    <span className="text-gray-500 text-sm">({provider.reviewCount} reviews)</span>
                    <span className="ml-auto font-bold text-orange-500">{provider.price}</span>
                  </div>
                  
                  <ul className="mb-4">
                    {provider.features.map((feature, index) => (
                      <li key={index} className="flex items-center mb-1 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex space-x-2">
                    <Link href={`/services/${provider.slug}`} className="block text-center w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors">
                      View Details
                    </Link>
                    <Link href={`/services/${provider.slug}`} className="block text-center w-full py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                      Get Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="inline-flex rounded-md shadow">
              <a href="#" className="py-2 px-4 bg-white border border-gray-300 rounded-l-md text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </a>
              <a href="#" className="py-2 px-4 bg-blue-600 border border-blue-600 text-sm font-medium text-white">
                1
              </a>
              <a href="#" className="py-2 px-4 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
                2
              </a>
              <a href="#" className="py-2 px-4 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50">
                3
              </a>
              <span className="py-2 px-4 bg-white border border-gray-300 text-sm font-medium text-gray-700">
                ...
              </span>
              <a href="#" className="py-2 px-4 bg-white border border-gray-300 rounded-r-md text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </a>
            </nav>
          </div>
        </div>
      </div>
    </Layout>
  );
}
