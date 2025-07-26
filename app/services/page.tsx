import React from 'react';
import { Layout } from '@/components/layout/layout';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ExternalLink, Users, Globe, Clock, Tag, Filter, MapPin, CheckCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import ServicesFiltersNew from '../../components/services/ServicesFiltersNew';

interface Service {
  id: string;
  name: string;
  tagline: string;
  main_categories: string[];
  sub_categories: string[];
  description: string;
  who_is_this_for: string[];
  type_of_service: string;
  highlights: string[];
  whats_included: string[];
  price_from: number;
  currency: string;
  turnaround_time: string;
  free_consultation: boolean;
  portfolio_url: string;
  client_logos: string[];
  email_for_leads: string;
  logo_url: string;
  banner_url: string;
  vendor_id: string;
  published: boolean;
  created_at: string;
  vendor?: {
    name: string;
  };
}

function nameToSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams || {};
  const query = resolvedSearchParams.query;
  const category = resolvedSearchParams.category;
  const region = resolvedSearchParams.region;
  const priceRange = resolvedSearchParams.price;
  const consultation = resolvedSearchParams.consultation;
  const page = resolvedSearchParams.page;

  // Extract filters from search params
  const searchQuery = typeof query === 'string' ? query : undefined;
  const categoryFilter = typeof category === 'string' ? category : undefined;
  const regionFilter = typeof region === 'string' ? region : undefined;
  const priceRangeFilter = typeof priceRange === 'string' ? priceRange : undefined;
  const consultationFilter = typeof consultation === 'string' ? consultation : undefined;
  const currentPage = typeof page === 'string' ? parseInt(page) : 1;

  // Create Supabase client
  const supabase = await createClient();

  // Build query
  let query_builder = supabase
    .from('services')
    .select(`
      *,
      vendor:vendors(name)
    `)
    .eq('published', true)
    .order('created_at', { ascending: false });

  // Apply search filter
  if (searchQuery) {
    query_builder = query_builder.or(`name.ilike.%${searchQuery}%,tagline.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }

  // Apply category filter
  if (categoryFilter) {
    query_builder = query_builder.contains('main_categories', [categoryFilter]);
  }

  // Apply region filter
  if (regionFilter && regionFilter !== 'Global') {
    query_builder = query_builder.contains('region_served', [regionFilter]);
  }

  // Apply consultation filter
  if (consultationFilter === 'true') {
    query_builder = query_builder.eq('free_consultation', true);
  }

  // Fetch services
  const { data: services, error } = await query_builder;

  if (error) {
    console.error('Error fetching services:', error);
    return (
      <Layout>
        <div className="flex-1 w-full flex flex-col items-center bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Services</h1>
              <p className="text-gray-600">Please try again later.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Client-side price filtering
  let filteredServices = services || [];
  if (priceRangeFilter) {
    filteredServices = filteredServices.filter(service => {
      const price = service.starting_price || 0;
      switch (priceRangeFilter) {
        case '0-500':
          return price >= 0 && price <= 500;
        case '500-1000':
          return price > 500 && price <= 1000;
        case '1000-2500':
          return price > 1000 && price <= 2500;
        case '2500-5000':
          return price > 2500 && price <= 5000;
        case '5000+':
          return price > 5000;
        default:
          return true;
      }
    });
  }

  // Pagination
  const itemsPerPage = 24;
  const totalItems = filteredServices.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  // Build current filters for display
  const activeFilters = [];
  if (searchQuery) activeFilters.push({ label: `Search: "${searchQuery}"`, value: searchQuery, param: 'query' });
  if (categoryFilter) activeFilters.push({ label: `Category: ${categoryFilter}`, value: categoryFilter, param: 'category' });
  if (regionFilter) activeFilters.push({ label: `Region: ${regionFilter}`, value: regionFilter, param: 'region' });
  if (priceRangeFilter) activeFilters.push({ label: `Price: ${priceRangeFilter}`, value: priceRangeFilter, param: 'price' });
  if (consultationFilter) activeFilters.push({ label: `Free Consultation`, value: consultationFilter, param: 'consultation' });

  return (
    <Layout>
      <div className="flex-1 w-full flex flex-col items-center bg-gray-50">
        {/* Main Content */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <ServicesFiltersNew />
            </div>

            {/* Results */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {searchQuery ? `Search Results for "${searchQuery}"` : 'All Services'}
                  </h2>
                  <p className="text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} services
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
                      const newParams = new URLSearchParams(typeof window !== 'undefined' ? window?.location?.search || '' : '');
                      newParams.delete(filter.param);
                      const href = `?${newParams.toString()}`;
                      
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
                      href="/services"
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Clear all
                    </Link>
                  </div>
                </div>
              )}

              {/* Services Grid */}
              {paginatedServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {paginatedServices.map((service) => (
                    <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                      {/* Service Banner */}
                      {service.banner_url && (
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                          <Image
                            src={service.banner_url}
                            alt={`${service.name} banner`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="p-6">
                        {/* Service Header */}
                        <div className="flex items-start gap-4 mb-4">
                          {service.logo_url ? (
                            <Image
                              src={service.logo_url}
                              alt={`${service.name} logo`}
                              width={48}
                              height={48}
                              className="rounded-lg object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-600 font-bold text-lg">
                                {service.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                              {service.name}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {service.tagline}
                            </p>
                          </div>
                        </div>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {service.main_categories.slice(0, 2).map((category: string, index: number) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {category}
                            </span>
                          ))}
                          {service.main_categories.length > 2 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                              +{service.main_categories.length - 2} more
                            </span>
                          )}
                        </div>

                        {/* What's Included */}
                        <div className="mb-4">
                          <ul className="space-y-1">
                            {service.whats_included.slice(0, 3).map((item: string, index: number) => (
                              <li key={index} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                <span className="line-clamp-1">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Pricing */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-bold text-gray-900">
                                {service.starting_price ? `${service.currency} ${service.starting_price}` : service.pricing_model}
                              </span>
                              {service.starting_price && (
                                <span className="text-sm text-gray-500 ml-1">/ {service.pricing_model}</span>
                              )}
                            </div>
                            {service.free_consultation && (
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                Free Consultation
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Turnaround Time */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{service.turnaround_time}</span>
                          </div>
                        </div>

                        {/* Regions */}
                        {service.region_served && service.region_served.length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span>{service.region_served.slice(0, 2).join(', ')}</span>
                              {service.region_served.length > 2 && (
                                <span>+{service.region_served.length - 2} more</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Link
                            href={`/services/${nameToSlug(service.name)}`}
                            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                          >
                            View Details
                          </Link>
                          <button className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center gap-1 text-sm font-medium">
                            Get Quote
                          </button>
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                    <p className="text-gray-600 mb-4">
                      We couldn't find any services matching your criteria. Try adjusting your filters or search terms.
                    </p>
                    <Link
                      href="/services"
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
                        href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(resolvedSearchParams).filter(([key]) => key !== 'page')), page: String(currentPage - 1) }).toString()}`}
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
                        href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(resolvedSearchParams).filter(([key]) => key !== 'page')), page: String(currentPage + 1) }).toString()}`}
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
                        {/* Previous button */}
                        {currentPage > 1 ? (
                          <Link
                            href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(resolvedSearchParams).filter(([key]) => key !== 'page')), page: String(currentPage - 1) }).toString()}`}
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
                          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                          if (pageNum > totalPages) return null;
                          
                          return (
                            <Link
                              key={pageNum}
                              href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(resolvedSearchParams).filter(([key]) => key !== 'page')), page: String(pageNum) }).toString()}`}
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

                        {/* Next button */}
                        {currentPage < totalPages ? (
                          <Link
                            href={`?${new URLSearchParams({ ...Object.fromEntries(Object.entries(resolvedSearchParams).filter(([key]) => key !== 'page')), page: String(currentPage + 1) }).toString()}`}
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