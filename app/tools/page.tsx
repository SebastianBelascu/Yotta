import React from 'react';
import { Layout } from '@/components/layout/layout';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ExternalLink, Users, Globe, Smartphone, Monitor, Tag, Filter, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import ToolsFilters from '../../components/tools/ToolsFilters';

interface Tool {
  id: string;
  name: string;
  tagline: string;
  categories: string[];
  description: string;
  problem_solved: string;
  best_for: string[];
  features: string[];
  pros: string[];
  cons: string[];
  pricing_model: string;
  starting_price: number;
  currency: string;
  platforms_supported: string[];
  regions: string[];
  logo_url: string;
  banner_url: string;
  affiliate_link: string;
  published: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
}

function nameToSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams || {};
  const query = resolvedSearchParams.query;
  const category = resolvedSearchParams.category;
  const region = resolvedSearchParams.region;
  const priceRange = resolvedSearchParams.price;
  const platform = resolvedSearchParams.platform;
  const page = resolvedSearchParams.page;

  // Extract filters from search params
  const searchQuery = typeof query === 'string' ? query : undefined;
  const categoryFilter = typeof category === 'string' ? category : undefined;
  const regionFilter = typeof region === 'string' ? region : undefined;
  const priceRangeFilter = typeof priceRange === 'string' ? priceRange : undefined;
  const platformFilter = typeof platform === 'string' ? platform : undefined;
  const currentPage = typeof page === 'string' ? parseInt(page) : 1;

  // Create Supabase client
  const supabase = await createClient();

  // Build query
  let query_builder = supabase
    .from('tools')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  // Apply search filter
  if (searchQuery) {
    query_builder = query_builder.or(`name.ilike.%${searchQuery}%,tagline.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }

  // Apply category filter
  if (categoryFilter) {
    query_builder = query_builder.contains('categories', [categoryFilter]);
  }

  // Apply region filter
  if (regionFilter) {
    query_builder = query_builder.contains('regions', [regionFilter]);
  }

  // Apply platform filter
  if (platformFilter) {
    query_builder = query_builder.contains('platforms_supported', [platformFilter]);
  }

  // Fetch tools
  const { data: tools, error } = await query_builder;

  if (error) {
    console.error('Error fetching tools:', error);
    return (
      <Layout>
        <div className="flex-1 w-full flex flex-col items-center bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Tools</h1>
              <p className="text-gray-600">Please try again later.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Client-side price filtering
  let filteredTools = tools || [];
  if (priceRangeFilter) {
    filteredTools = filteredTools.filter(tool => {
      const price = tool.starting_price || 0;
      switch (priceRangeFilter) {
        case '0-50':
          return price >= 0 && price <= 50;
        case '50-100':
          return price > 50 && price <= 100;
        case '100-500':
          return price > 100 && price <= 500;
        case '500+':
          return price > 500;
        case 'free':
          return tool.pricing_model === 'Free' || price === 0;
        default:
          return true;
      }
    });
  }

  // Pagination
  const itemsPerPage = 24;
  const totalItems = filteredTools.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTools = filteredTools.slice(startIndex, endIndex);

  // Build current filters for display
  const activeFilters = [];
  if (searchQuery) activeFilters.push({ label: `Search: "${searchQuery}"`, value: searchQuery, param: 'query' });
  if (categoryFilter) activeFilters.push({ label: `Category: ${categoryFilter}`, value: categoryFilter, param: 'category' });
  if (regionFilter) activeFilters.push({ label: `Region: ${regionFilter}`, value: regionFilter, param: 'region' });
  if (priceRangeFilter) activeFilters.push({ label: `Price: ${priceRangeFilter}`, value: priceRangeFilter, param: 'price' });
  if (platformFilter) activeFilters.push({ label: `Platform: ${platformFilter}`, value: platformFilter, param: 'platform' });

  return (
    <Layout>
      <div className="flex-1 w-full flex flex-col items-center bg-gray-50">
        {/* Main Content */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <ToolsFilters />
            </div>

            {/* Results */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'All Tools'}
                  </h2>
                  <p className="text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} tools
                    {currentPage > 1 && ` (Page ${currentPage} of ${totalPages})`}
                  </p>
                </div>
              </div>

              {/* Active Filters */}
              {activeFilters.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Active filters:</span>
                    {activeFilters.map((filter, index) => {
                      // Create new params by filtering out this specific param
                      const currentParams = { ...resolvedSearchParams };
                      delete currentParams[filter.param];
                      
                      // Convert to query string
                      const queryString = Object.entries(currentParams)
                        .filter(([_, value]) => value !== undefined)
                        .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
                        .join('&');
                      
                      const href = queryString ? `?${queryString}` : '';
                      
                      return (
                        <Link
                          key={index}
                          href={href}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200"
                        >
                          {filter.label}
                          <span className="ml-1 text-blue-600 hover:text-blue-800">×</span>
                        </Link>
                      );
                    })}
                    <Link
                      href="/tools"
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Clear all
                    </Link>
                  </div>
                </div>
              )}

              {/* Tools Grid */}
              {paginatedTools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {paginatedTools.map((tool) => (
                    <div key={tool.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                      {/* Tool Banner */}
                      {tool.banner_url && (
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                          <Image
                            src={tool.banner_url}
                            alt={`${tool.name} banner`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        {/* Tool Header */}
                        <div className="flex items-start gap-4 mb-4">
                          {tool.logo_url ? (
                            <Image
                              src={tool.logo_url}
                              alt={`${tool.name} logo`}
                              width={48}
                              height={48}
                              className="rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-600 font-bold text-lg">
                                {tool.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                              {tool.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {tool.tagline}
                            </p>
                          </div>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {tool.categories.slice(0, 2).map((category: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {category}
                            </span>
                          ))}
                          {tool.categories.length > 2 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{tool.categories.length - 2} more
                            </span>
                          )}
                        </div>

                        {/* Features */}
                        <div className="mb-4">
                          <ul className="space-y-1">
                            {tool.features.slice(0, 3).map((feature: string, index: number) => (
                              <li key={index} className="flex items-center text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                                <span className="line-clamp-1">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Pricing */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-gray-900">
                                {tool.pricing_model === 'Free' ? 'Free' : 
                                 tool.starting_price ? `${tool.currency} ${tool.starting_price}` : tool.pricing_model}
                              </span>
                              {tool.starting_price && tool.pricing_model !== 'Free' && (
                                <span className="text-sm text-gray-500 ml-1">/ {tool.pricing_model}</span>
                              )}
                            </div>
                            {tool.pricing_model === 'Free' && (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                Free
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Platforms */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Monitor className="h-4 w-4" />
                            <span>{tool.platforms_supported.slice(0, 2).join(', ')}</span>
                            {tool.platforms_supported.length > 2 && (
                              <span>+{tool.platforms_supported.length - 2} more</span>
                            )}
                          </div>
                        </div>

                        {/* Regions */}
                        <div className="mb-6">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Globe className="h-4 w-4" />
                            <span>{tool.regions.slice(0, 2).join(', ')}</span>
                            {tool.regions.length > 2 && (
                              <span>+{tool.regions.length - 2} more</span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Link
                            href={`/tools/${nameToSlug(tool.name)}`}
                            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                          >
                            View Details
                          </Link>
                          {tool.affiliate_link && (
                            <a
                              href={tool.affiliate_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center gap-1 text-sm font-medium"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Visit
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="mb-4">
                      <Filter className="h-12 w-12 text-gray-400 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any tools matching your criteria. Try adjusting your filters or search terms.
                    </p>
                    <Link
                      href="/tools"
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Clear all filters
                    </Link>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
                  <div className="flex flex-1 justify-between sm:hidden">
                    {currentPage > 1 ? (
                      <Link
                        href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(searchParams).filter(([key]) => key !== 'page')), page: String(currentPage - 1) }).toString()}`}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Previous
                      </Link>
                    ) : (
                      <span className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400">
                        Previous
                      </span>
                    )}
                    {currentPage < totalPages ? (
                      <Link
                        href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(searchParams).filter(([key]) => key !== 'page')), page: String(currentPage + 1) }).toString()}`}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Next
                      </Link>
                    ) : (
                      <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400">
                        Next
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{' '}
                        <span className="font-medium">{totalItems}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {currentPage > 1 ? (
                          <Link
                            href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(searchParams).filter(([key]) => key !== 'page')), page: String(currentPage - 1) }).toString()}`}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        ) : (
                          <span className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300">
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                        
                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <Link
                              key={pageNum}
                              href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(searchParams).filter(([key]) => key !== 'page')), page: String(pageNum) }).toString()}`}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                pageNum === currentPage
                                  ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                              }`}
                            >
                              {pageNum}
                            </Link>
                          );
                        })}
                        
                        {currentPage < totalPages ? (
                          <Link
                            href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(searchParams).filter(([key]) => key !== 'page')), page: String(currentPage + 1) }).toString()}`}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        ) : (
                          <span className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300">
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}