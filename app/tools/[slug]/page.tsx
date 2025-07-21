'use client'

import React from 'react';
import { Layout } from '@/components/layout/layout';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  ExternalLink, 
  Star, 
  Globe, 
  Monitor, 
  Smartphone, 
  Tag, 
  CheckCircle, 
  X, 
  Users, 
  DollarSign,
  ArrowLeft,
  MessageSquare
} from 'lucide-react';
// Helper function to convert slug to readable name
function slugToName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to create slug from name
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper function to extract ID from slug
function extractIdFromSlug(slug: string): string {
  const parts = slug.split('-');
  return parts[parts.length - 1];
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

export default function ToolDetailPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const [tool, setTool] = React.useState<Tool | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [slug, setSlug] = React.useState<string | null>(null);

  // Handle async params
  React.useEffect(() => {
    async function getParams() {
      const resolvedParams = await paramsPromise;
      setSlug(resolvedParams.slug);
    }
    getParams();
  }, [paramsPromise]);

  React.useEffect(() => {
    if (!slug) return;
    
    async function fetchToolData() {
      try {
        const supabase = createClient();
        
        // Get all tools
        const { data: tools, error: toolsError } = await supabase
          .from('tools')
          .select('*');
          
        if (toolsError || !tools) {
          console.error('Error fetching tools:', toolsError);
          setLoading(false);
          return;
        }
        
        // Find tool by slug (name)
        const foundTool = tools.find(t => nameToSlug(t.name) === slug);
        
        if (!foundTool) {
          setError(true);
        } else {
          setTool(foundTool);
          // Update click count when tool is found
          await supabase
            .from('tools')
            .update({ click_count: (foundTool.click_count || 0) + 1 })
            .eq('id', foundTool.id);
        }
      } catch (error) {
        console.error('Error fetching tool:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchToolData();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tool details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !tool) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Tool Not Found</h1>
            <p className="text-gray-600 mb-4">The tool you're looking for doesn't exist or has been removed.</p>
            <Link href="/tools" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Back to Tools
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative">
          {/* Banner Image */}
          {tool.banner_url ? (
            <div className="h-64 md:h-80 relative">
              <Image
                src={tool.banner_url}
                alt={`${tool.name} banner`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </div>
          ) : (
            <div className="h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600" />
          )}
          
          {/* Tool Header */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end gap-6">
                {/* Logo */}
                <div className="flex-shrink-0">
                  {tool.logo_url ? (
                    <Image
                      src={tool.logo_url}
                      alt={`${tool.name} logo`}
                      width={80}
                      height={80}
                      className="rounded-xl border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white rounded-xl border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">
                        {tool.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Tool Info */}
                <div className="flex-1 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{tool.name}</h1>
                  <p className="text-lg md:text-xl text-gray-200 mb-4">{tool.tagline}</p>
                  
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    {tool.categories.map((category: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white backdrop-blur-sm"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Back Button */}
          <div className="absolute top-6 left-6">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tools
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pricing */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Pricing</h3>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {tool.pricing_model === 'Free' ? 'Free' : 
                     tool.starting_price ? `${tool.currency} ${tool.starting_price}` : tool.pricing_model}
                  </div>
                  {tool.starting_price && tool.pricing_model !== 'Free' && (
                    <div className="text-sm text-gray-500">per {tool.pricing_model}</div>
                  )}
                </div>

                {/* Platforms */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-center gap-3 mb-2">
                    <Monitor className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Platforms</h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    {tool.platforms_supported.slice(0, 2).join(', ')}
                    {tool.platforms_supported.length > 2 && (
                      <span> +{tool.platforms_supported.length - 2} more</span>
                    )}
                  </div>
                </div>

                {/* Regions */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">Available In</h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    {tool.regions.slice(0, 2).join(', ')}
                    {tool.regions.length > 2 && (
                      <span> +{tool.regions.length - 2} more</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {tool.name}</h2>
                <div className="prose max-w-none text-gray-600">
                  <p className="text-lg leading-relaxed">{tool.description}</p>
                </div>
              </div>

              {/* Problem Solved */}
              {tool.problem_solved && (
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Problem Solved</h2>
                  <div className="prose max-w-none text-gray-600">
                    <p className="text-lg leading-relaxed">{tool.problem_solved}</p>
                  </div>
                </div>
              )}

              {/* Features */}
              {tool.features && tool.features.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tool.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pros and Cons */}
              {((tool.pros && tool.pros.length > 0) || (tool.cons && tool.cons.length > 0)) && (
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Pros & Cons</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pros */}
                    {tool.pros && tool.pros.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Pros
                        </h3>
                        <ul className="space-y-2">
                          {tool.pros.map((pro: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Cons */}
                    {tool.cons && tool.cons.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-red-700 mb-4 flex items-center gap-2">
                          <X className="h-5 w-5" />
                          Cons
                        </h3>
                        <ul className="space-y-2">
                          {tool.cons.map((con: string, index: number) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Best For */}
              {tool.best_for && tool.best_for.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Best For</h2>
                  <div className="flex flex-wrap gap-3">
                    {tool.best_for.map((audience: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA Card */}
              <div className="bg-white rounded-lg p-6 shadow-sm border sticky top-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to try {tool.name}?</h3>
                  <p className="text-gray-600 mb-6">Get started with this amazing tool today</p>
                  
                  {/* Pricing Display */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900">
                      {tool.pricing_model === 'Free' ? 'Free' : 
                       tool.starting_price ? `${tool.currency} ${tool.starting_price}` : tool.pricing_model}
                    </div>
                    {tool.starting_price && tool.pricing_model !== 'Free' && (
                      <div className="text-sm text-gray-500">per {tool.pricing_model}</div>
                    )}
                    {tool.pricing_model === 'Free' && (
                      <div className="text-sm text-green-600 font-medium">No credit card required</div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {tool.affiliate_link && (
                      <a
                        href={tool.affiliate_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                      >
                        <ExternalLink className="h-5 w-5" />
                        Visit {tool.name}
                      </a>
                    )}
                    
                    <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2 font-medium">
                      <MessageSquare className="h-5 w-5" />
                      Get Quote
                    </button>
                  </div>
                </div>
              </div>

              {/* Tool Details */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Details</h3>
                <div className="space-y-4">
                  {/* All Platforms */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Supported Platforms</h4>
                    <div className="flex flex-wrap gap-2">
                      {tool.platforms_supported.map((platform: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* All Regions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Available Regions</h4>
                    <div className="flex flex-wrap gap-2">
                      {tool.regions.map((region: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {region}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* All Categories */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {tool.categories.map((category: string, index: number) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Tools */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore More Tools</h3>
                <Link
                  href="/tools"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Browse all tools
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}