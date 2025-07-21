import React from 'react';
import { Layout } from '@/components/layout/layout';
import Link from 'next/link';
import Image from 'next/image';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Filter, 
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  Monitor,
  Tag
} from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

interface Service {
  id: string;
  name: string;
  tagline: string;
  main_categories: string[];
  sub_categories: string[];
  description: string;
  highlights: string[];
  whats_included: string[];
  type_of_service: string;
  who_is_this_for: string[];
  turnaround_time: string;
  free_consultation: boolean;
  price_from: number;
  currency: string;
  region_served: string[];
  email_for_leads: string;
  logo_url: string;
  banner_url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

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

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams || {};
  const query = resolvedSearchParams.query;
  const type = resolvedSearchParams.type; // 'services', 'tools', or 'all'
  const page = resolvedSearchParams.page;

  // Extract filters from search params
  const searchQuery = typeof query === 'string' ? query : undefined;
  const searchType = typeof type === 'string' ? type : 'all';
  const currentPage = typeof page === 'string' ? parseInt(page, 10) : 1;

  const supabase = await createClient();

  let services: Service[] = [];
  let tools: Tool[] = [];
  let servicesError = null;
  let toolsError = null;

  // Search services if type is 'services' or 'all'
  if (searchType === 'services' || searchType === 'all') {
    let servicesQuery = supabase
      .from('services')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (searchQuery) {
      servicesQuery = servicesQuery.or(`name.ilike.%${searchQuery}%,tagline.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    const { data: servicesData, error: sError } = await servicesQuery;
    services = servicesData || [];
    servicesError = sError;
  }

  // Search tools if type is 'tools' or 'all'
  if (searchType === 'tools' || searchType === 'all') {
    let toolsQuery = supabase
      .from('tools')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (searchQuery) {
      toolsQuery = toolsQuery.or(`name.ilike.%${searchQuery}%,tagline.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    const { data: toolsData, error: tError } = await toolsQuery;
    tools = toolsData || [];
    toolsError = tError;
  }

  if (servicesError || toolsError) {
    console.error('Error fetching data:', { servicesError, toolsError });
    return (
      <Layout>
        <div className="flex-1 w-full flex flex-col items-center bg-gray-50">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading search results</h3>
              <p className="text-gray-600">Please try again later.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Combine and paginate results
  const allResults = [
    ...services.map(s => ({ ...s, type: 'service' as const })),
    ...tools.map(t => ({ ...t, type: 'tool' as const }))
  ];

  const itemsPerPage = 24;
  const totalItems = allResults.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = allResults.slice(startIndex, endIndex);

  return (
    <Layout>
      <div className="flex-1 w-full flex flex-col items-center bg-gray-50">
        {/* Main Content */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Search Filters</h2>
                </div>
                
                {/* Search Type Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Search In</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Results' },
                      { value: 'services', label: 'Services Only' },
                      { value: 'tools', label: 'Tools Only' }
                    ].map((option) => (
                      <Link
                        key={option.value}
                        href={`/search?${new URLSearchParams({
                          ...Object.fromEntries(
                            Object.entries(resolvedSearchParams || {})
                              .filter(([, value]) => value !== undefined)
                              .map(([key, value]) => [key, String(value)])
                          ),
                          type: option.value
                        }).toString()}`}
                        className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          searchType === option.value
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {option.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Browse</h3>
                  <div className="space-y-2">
                    <Link href="/services" className="block text-sm text-blue-600 hover:text-blue-800">
                      All Services
                    </Link>
                    <Link href="/tools" className="block text-sm text-blue-600 hover:text-blue-800">
                      All Tools
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Header with Search */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {searchQuery ? `Search Results for "${searchQuery}"` : 'Search'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {totalItems} result{totalItems !== 1 ? 's' : ''} found
                      {searchType !== 'all' && ` in ${searchType}`}
                    </p>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="w-full sm:w-96">
                    <form method="GET" className="relative">
                      <div className="flex">
                        <input
                          type="text"
                          name="query"
                          defaultValue={searchQuery}
                          placeholder="Search services and tools..."
                          className="flex-1 px-4 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                        >
                          <SearchIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Results Grid */}
              {paginatedResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {paginatedResults.map((result: any) => (
                    <div key={`${result.type}-${result.id}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                      {/* Type Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          result.type === 'service' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {result.type === 'service' ? 'Service' : 'Tool'}
                        </span>
                      </div>

                      {/* Banner */}
                      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
                        {result.banner_url ? (
                          <Image
                            src={result.banner_url}
                            alt={result.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-20" />
                        
                        {/* Logo */}
                        <div className="absolute bottom-4 left-4">
                          {result.logo_url ? (
                            <div className="w-12 h-12 bg-white rounded-lg p-2 shadow-sm">
                              <Image
                                src={result.logo_url}
                                alt={`${result.name} logo`}
                                width={32}
                                height={32}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                              <span className="text-lg font-bold text-gray-700">
                                {result.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Special Badges */}
                        <div className="absolute top-4 right-4">
                          {result.type === 'service' && result.free_consultation && (
                            <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                              Free Consultation
                            </span>
                          )}
                          {result.type === 'tool' && result.pricing_model === 'Free' && (
                            <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                              Free
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {(result.type === 'service' ? result.main_categories : result.categories).slice(0, 2).map((cat: string, index: number) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                              {cat}
                            </span>
                          ))}
                        </div>

                        {/* Name & Tagline */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                          {result.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {result.tagline}
                        </p>

                        {/* Details */}
                        <div className="space-y-2 mb-4">
                          {result.type === 'service' ? (
                            <>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4" />
                                <span>{result.region_served.slice(0, 2).join(', ')}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="h-4 w-4" />
                                <span>{result.turnaround_time}</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Monitor className="h-4 w-4" />
                                <span>{result.platforms_supported.slice(0, 2).join(', ')}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Globe className="h-4 w-4" />
                                <span>{result.regions.slice(0, 2).join(', ')}</span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Pricing */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between">
                            <div>
                              {result.type === 'service' ? (
                                <span className="text-lg font-bold text-gray-900">
                                  {result.currency} {result.price_from}
                                </span>
                              ) : (
                                <span className="text-lg font-bold text-gray-900">
                                  {result.pricing_model === 'Free' ? 'Free' : 
                                   result.starting_price ? `${result.currency} ${result.starting_price}` : result.pricing_model}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex gap-2">
                          <Link
                            href={result.type === 'service' 
                              ? `/services/${nameToSlug(result.name)}`
                              : `/tools/${nameToSlug(result.name)}-${result.id}`
                            }
                            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                          >
                            View Details
                          </Link>
                          {result.type === 'tool' && result.affiliate_link && (
                            <a
                              href={result.affiliate_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center gap-1 text-sm font-medium"
                            >
                              <ExternalLink className="h-4 w-4" />
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
                      <SearchIcon className="h-12 w-12 text-gray-400 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {searchQuery ? 'No results found' : 'Start your search'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery 
                        ? `We couldn't find any ${searchType === 'all' ? 'results' : searchType} matching "${searchQuery}".`
                        : 'Enter a search term to find services and tools.'
                      }
                    </p>
                    {searchQuery && (
                      <Link
                        href="/search"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Clear search
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <Link
                      href={`/search?${new URLSearchParams(
                        Object.fromEntries(
                          Object.entries({ ...resolvedSearchParams, page: Math.max(1, currentPage - 1).toString() })
                            .filter(([, value]) => value !== undefined)
                            .map(([key, value]) => [key, String(value)])
                        )
                      ).toString()}`}
                      className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                        currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                      }`}
                    >
                      Previous
                    </Link>
                    <Link
                      href={`/search?${new URLSearchParams(
                        Object.fromEntries(
                          Object.entries({ ...resolvedSearchParams, page: Math.min(totalPages, currentPage + 1).toString() })
                            .filter(([, value]) => value !== undefined)
                            .map(([key, value]) => [key, String(value)])
                        )
                      ).toString()}`}
                      className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
                        currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                      }`}
                    >
                      Next
                    </Link>
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
                        <Link
                          href={`/search?${new URLSearchParams(
                            Object.fromEntries(
                              Object.entries({ ...resolvedSearchParams, page: Math.max(1, currentPage - 1).toString() })
                                .filter(([, value]) => value !== undefined)
                                .map(([key, value]) => [key, String(value)])
                            )
                          ).toString()}`}
                          className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                            currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </Link>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Link
                              key={pageNum}
                              href={`/search?${new URLSearchParams(
                                Object.fromEntries(
                                  Object.entries({ ...resolvedSearchParams, page: pageNum.toString() })
                                    .filter(([, value]) => value !== undefined)
                                    .map(([key, value]) => [key, String(value)])
                                )
                              ).toString()}`}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                currentPage === pageNum
                                  ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                              }`}
                            >
                              {pageNum}
                            </Link>
                          );
                        })}
                        
                        <Link
                          href={`/search?${new URLSearchParams(
                            Object.fromEntries(
                              Object.entries({ ...resolvedSearchParams, page: Math.min(totalPages, currentPage + 1).toString() })
                                .filter(([, value]) => value !== undefined)
                                .map(([key, value]) => [key, String(value)])
                            )
                          ).toString()}`}
                          className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                            currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <ChevronRight className="h-5 w-5" aria-hidden="true" />
                        </Link>
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
