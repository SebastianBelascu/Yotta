'use client'

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/layout';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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

// Database interfaces matching the actual schema
interface Service {
  id: string;
  name: string;
  tagline: string;
  main_categories: string[];
  sub_categories: string[];
  logo_url: string;
  banner_url: string;
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
  vendor_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface Vendor {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export default function ServiceDetailsPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const [showPopup, setShowPopup] = useState(false);
  const [serviceProvider, setServiceProvider] = useState<any>(null);
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [similarServices, setSimilarServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    needs: ''
  });
  const pathname = usePathname();
  const params = React.use(paramsPromise) as { slug: string };
  
  // Fetch service data from database
  useEffect(() => {
    async function fetchServiceData() {
      try {
        const supabase = createClient();
        
        // Get all services
        const { data: services, error: servicesError } = await supabase
          .from('services')
          .select('*');
          
        if (servicesError || !services) {
          console.error('Error fetching services:', servicesError);
          setLoading(false);
          return;
        }
        
        // Find service by slug (name) like in tools
        const service = services.find(s => nameToSlug(s.name) === params.slug);
        
        if (!service) {
          // Create fallback service matching the schema
          const fallbackService = {
            id: params.slug,
            name: slugToName(params.slug),
            tagline: 'Professional service provider',
            main_categories: ['Business Services'],
            sub_categories: [],
            logo_url: '',
            banner_url: '',
            description: 'Professional service provider offering quality solutions for your business needs.',
            who_is_this_for: ['Small businesses', 'Startups', 'Entrepreneurs'],
            type_of_service: 'Professional Service',
            highlights: ['Experienced team', 'Quality results', 'Timely delivery', 'Customer satisfaction'],
            whats_included: ['Professional consultation', 'Expert guidance', 'Quality service delivery', 'Ongoing support'],
            price_from: 500,
            currency: 'MYR',
            turnaround_time: '3-5 business days',
            free_consultation: true,
            portfolio_url: '',
            client_logos: [],
            email_for_leads: '',
            vendor_id: '',
            published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            // Add UI-specific fields
            region_served: ['Malaysia', 'Singapore', 'Global']
          };
          setServiceProvider(fallbackService);
          setLoading(false);
          return;
        }
        
        // Transform service data to match UI expectations with proper schema mapping
        const transformedService = {
          ...service,
          // Map schema fields to UI expectations
          category: Array.isArray(service.main_categories) && service.main_categories.length > 0 ? service.main_categories[0] : 'Business Services',
          longDescription: service.description || 'Professional service provider offering quality solutions for your business needs.',
          features: Array.isArray(service.whats_included) && service.whats_included.length > 0 ? service.whats_included : ['Professional consultation', 'Expert guidance', 'Quality service delivery'],
          benefits: Array.isArray(service.highlights) && service.highlights.length > 0 ? service.highlights : ['Experienced team', 'Quality results', 'Timely delivery'],
          price: service.price_from ? `${service.currency || 'MYR'} ${service.price_from}` : 'Contact for pricing',
          priceNote: 'Starting price',
          // Ensure arrays are properly initialized
          main_categories: Array.isArray(service.main_categories) ? service.main_categories : ['Business Services'],
          sub_categories: Array.isArray(service.sub_categories) ? service.sub_categories : [],
          who_is_this_for: Array.isArray(service.who_is_this_for) ? service.who_is_this_for : ['Small businesses', 'Startups', 'Entrepreneurs'],
          highlights: Array.isArray(service.highlights) ? service.highlights : ['Experienced team', 'Quality results', 'Timely delivery'],
          whats_included: Array.isArray(service.whats_included) ? service.whats_included : ['Professional consultation', 'Expert guidance', 'Quality service delivery'],
          // Note: region_served doesn't exist in schema - services are global
          region_served: ['Malaysia', 'Singapore', 'Global'], // Default regions for display
          // Ensure required fields have defaults
          name: service.name || 'Professional Service',
          tagline: service.tagline || 'Professional service provider',
          description: service.description || 'Professional service provider offering quality solutions for your business needs.',
          type_of_service: service.type_of_service || 'Professional Service',
          turnaround_time: service.turnaround_time || '3-5 business days',
          free_consultation: service.free_consultation || false,
          price_from: service.price_from || 500,
          currency: service.currency || 'MYR',
          logo_url: service.logo_url || '',
          banner_url: service.banner_url || '',
          vendor_id: service.vendor_id || null,
          published: service.published || false
        };
        
        setServiceProvider(transformedService);
        
        // Fetch vendor data if available
        if (service.vendor_id) {
          const { data: vendorData } = await supabase
            .from('vendors')
            .select('*')
            .eq('id', service.vendor_id)
            .single();
          
          if (vendorData) {
            setVendor(vendorData);
          }
        }
        
        // Get similar services
        const relatedServices = services
          .filter(s => s.id !== service.id && s.published)
          .slice(0, 4)
          .map(s => ({
            id: s.id,
            slug: nameToSlug(s.name),
            name: s.name,
            category: s.main_categories?.[0] || 'Business Services',
            price: `${s.currency} ${s.price_from}`,
            description: s.tagline || s.description?.substring(0, 100) + '...'
          }));
        
        setSimilarServices(relatedServices);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching service data:', error);
        setLoading(false);
      }
    }
    
    fetchServiceData();
  }, [params.slug]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceProvider || !vendor) {
      alert('Service information not available. Please try again.');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const leadData = {
        service_id: serviceProvider.id,
        provider_id: serviceProvider.vendor_id || vendor.id,
        metadata: {
          contact_person: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          company_name: formData.company,
          service_type: formData.service,
          message: formData.needs
        }
      };
      
      // Create lead in database
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });
      
      if (response.ok) {
        // Send email to service provider if email_for_leads is available
        if (serviceProvider.email_for_leads) {
          try {
            await fetch('/api/send-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: 'quote-request',
                data: {
                  serviceName: serviceProvider.name,
                  providerEmail: serviceProvider.email_for_leads,
                  firstName: formData.firstName,
                  lastName: formData.lastName,
                  email: formData.email,
                  phone: formData.phone,
                  company: formData.company,
                  service: formData.service,
                  needs: formData.needs
                }
              }),
            });
          } catch (emailError) {
            console.error('Error sending email to provider:', emailError);
            // Don't fail the entire process if email fails
          }
        }
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          needs: ''
        });
        
        // Show success message for 3 seconds then close popup
        setTimeout(() => {
          setSubmitSuccess(false);
          setShowPopup(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to submit quote request'}`);
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      alert('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex-1 w-full flex items-center justify-center bg-gray-50 min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading service details...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!serviceProvider) {
    return (
      <Layout>
        <div className="flex-1 w-full flex items-center justify-center bg-gray-50 min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
            <Link href="/services/search" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md">
              Browse All Services
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Quote Request Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative mx-auto my-8 md:my-0 max-h-[90vh] md:max-h-[80vh] overflow-y-auto">
            {/* Close button */}
            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Form header */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="mb-2">
                <h2 className="text-lg sm:text-xl font-bold">
                  Tell Us About Your Needs
                </h2>
              </div>
              <div className="text-gray-600 text-sm">
                <p>We'll use this information to match you with the best solutions</p>
              </div>
            </div>
            
            {/* Form fields */}
            <div className="p-4 sm:p-6">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Quote Request Sent!</h3>
                  <p className="text-gray-600">We've received your request and will get back to you soon.</p>
                </div>
              ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name (if applicable)</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">What service are you interested in? <span className="text-red-500">*</span></label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select service type</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-app">Mobile App Development</option>
                    <option value="digital-marketing">Digital Marketing</option>
                    <option value="branding">Branding & Design</option>
                    <option value="consulting">Business Consulting</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="needs" className="block text-sm font-medium text-gray-700 mb-1">Tell us more about your specific needs</label>
                  <textarea
                    id="needs"
                    name="needs"
                    value={formData.needs}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="What specific challenges are you facing? What features are most important to you?"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  ></textarea>
                </div>
                
                {/* Submit button */}
                <div className="mt-5 sm:mt-6 flex justify-between">
                <button 
                  type="button" 
                  onClick={() => setShowPopup(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-md font-medium flex items-center"
                >
                  {submitting ? 'Sending...' : 'Get My Quote'}
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              </form>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative">
          {/* Banner Image */}
          {serviceProvider.banner_url && serviceProvider.banner_url.trim() !== '' ? (
            <div className="h-64 md:h-80 relative">
              <Image
                src={serviceProvider.banner_url}
                alt={`${serviceProvider.name} banner`}
                fill
                className="object-cover"
                priority
                unoptimized={serviceProvider.banner_url.startsWith('http')}
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
            </div>
          ) : (
            <div className="h-64 md:h-80 bg-gradient-to-r from-blue-600 to-purple-600" />
          )}
          
          {/* Service Header */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end gap-6">
                {/* Logo */}
                <div className="flex-shrink-0">
                  {serviceProvider.logo_url && serviceProvider.logo_url.trim() !== '' ? (
                    <Image
                      src={serviceProvider.logo_url}
                      alt={`${serviceProvider.name} logo`}
                      width={80}
                      height={80}
                      className="rounded-xl border-4 border-white shadow-lg"
                      unoptimized={serviceProvider.logo_url.startsWith('http')}
                    />
                  ) : (
                    <div className="w-20 h-20 bg-white rounded-xl border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">
                        {serviceProvider.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Service Info */}
                <div className="flex-1 text-white">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{serviceProvider.name}</h1>
                  <p className="text-lg md:text-xl text-gray-200 mb-4">{serviceProvider.tagline}</p>
                  
                  {/* Categories */}
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(serviceProvider.main_categories) && serviceProvider.main_categories.map((category: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white backdrop-blur-sm"
                      >
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
              href="/services"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all backdrop-blur-sm"
            >
              Back to Services
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
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Pricing</h3>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {serviceProvider.currency} {serviceProvider.price_from}
                  </div>
                  <div className="text-sm text-gray-500">Starting price</div>
                </div>

                {/* Turnaround Time */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Turnaround</h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    {serviceProvider.turnaround_time || '3-5 business days'}
                  </div>
                </div>

                {/* Regions */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="flex items-center gap-3 mb-2">
                    <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="font-semibold text-gray-900">Available In</h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    {Array.isArray(serviceProvider.region_served) && serviceProvider.region_served.slice(0, 2).join(', ')}
                    {Array.isArray(serviceProvider.region_served) && serviceProvider.region_served.length > 2 && (
                      <span> +{serviceProvider.region_served.length - 2} more</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About {serviceProvider.name}</h2>
                <div className="prose max-w-none text-gray-600">
                  <p className="text-lg leading-relaxed">{serviceProvider.description || serviceProvider.longDescription}</p>
                </div>
              </div>
              {/* Who Is This For */}
              {Array.isArray(serviceProvider.who_is_this_for) && serviceProvider.who_is_this_for.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Who Is This For</h2>
                  <div className="flex flex-wrap gap-3">
                    {serviceProvider.who_is_this_for.map((audience: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {audience}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {/* What's Included */}
              {Array.isArray(serviceProvider.features) && serviceProvider.features.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceProvider.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Benefits */}
              {Array.isArray(serviceProvider.benefits) && serviceProvider.benefits.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Benefits</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceProvider.benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <svg className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
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
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to get started?</h3>
                  <p className="text-gray-600 mb-6">Get a quote for this service today</p>
                  
                  {/* Pricing Display */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-900">
                      {serviceProvider.currency} {serviceProvider.price_from}
                    </div>
                    <div className="text-sm text-gray-500">Starting price</div>
                    {serviceProvider.free_consultation && (
                      <div className="text-sm text-green-600 font-medium">Free consultation included</div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowPopup(true)}
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Get Quote
                    </button>
                    
                    <button 
                      onClick={() => setShowPopup(true)}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2 font-medium"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Get More Details
                    </button>
                  </div>
                </div>
              </div>
              {/* Service Details */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                <div className="space-y-4">
                  {/* Service Type */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Service Type</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {serviceProvider.type_of_service || 'Professional Service'}
                    </span>
                  </div>

                  {/* Turnaround Time */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Turnaround Time</h4>
                    <span className="text-sm text-gray-600">
                      {serviceProvider.turnaround_time || '3-5 business days'}
                    </span>
                  </div>

                  {/* Free Consultation */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Free Consultation</h4>
                    <span className={`text-sm font-medium ${
                      serviceProvider.free_consultation ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {serviceProvider.free_consultation ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {/* All Regions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Available Regions</h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(serviceProvider.region_served) && serviceProvider.region_served.map((region: string, index: number) => (
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
                      {Array.isArray(serviceProvider.main_categories) && serviceProvider.main_categories.map((category: string, index: number) => (
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

              {/* Related Services */}
              <div className="bg-white rounded-lg p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore More Services</h3>
                <Link
                  href="/services/search"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Browse all services
                  <svg className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

    </Layout>
  );
}