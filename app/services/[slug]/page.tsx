'use client'

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/layout';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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

// Mock service data with slugs
const mockServices = [
  {
    id: 1,
    slug: 'techflow',
    name: 'TechFlow Digital Marketing Agency',
    category: 'Performance Marketing Agencies',
    description: 'We help startups and SMEs grow their digital presence with performance marketing strategies that actually convert.',
    longDescription: 'At TechFlow Digital, we specialize in performance-driven marketing strategies that help businesses scale efficiently. Our team of certified experts combines data analytics, creative storytelling, and cutting-edge technology to deliver measurable results. We have helped over 200+ businesses increase their revenue by an average of 300% within the first 6 months.',
    rating: 4.9,
    reviewCount: 856,
    price: 'MYR 800/month',
    priceNote: 'Starting price',
    features: [
      'Monthly financial statements and reports',
      'Bookkeeping and transaction recording',
      'Financial advisory and consultation',
      'Tax preparation and filing assistance',
      'GST/VAT compliance and filing',
      'Cloud-based accounting software setup'
    ],
    benefits: [
      'Dedicated account manager',
      'Monthly financial review meetings',
      'Real-time access to financial dashboard',
      'Tax planning and optimization',
      'Compliance monitoring and alerts'
    ],
    faqs: [
      {
        question: 'How long does the setup process take?',
        answer: 'The typical setup process takes 5-7 business days once all required documentation is submitted.'
      },
      {
        question: 'What documents do I need to provide?',
        answer: 'You will need to provide identification documents, proof of address, and business registration details if applicable.'
      },
      {
        question: 'Is there ongoing support after setup?',
        answer: 'Yes, we provide ongoing customer support to help with any questions or issues that may arise after your initial setup.'
      },
      {
        question: 'Can I upgrade my plan later?',
        answer: 'Yes, you can upgrade your plan at any time to access additional features and services.'
      }
    ]
  },
  {
    id: 2,
    slug: 'seo',
    name: 'SEO Optimization Service',
    category: 'Digital Marketing',
    description: 'Boost your website ranking with our comprehensive SEO services tailored for small businesses.',
    longDescription: 'Our SEO Optimization Service helps businesses improve their online visibility and drive organic traffic. We use data-driven strategies to optimize your website for search engines and improve your rankings for relevant keywords.',
    rating: 4.7,
    reviewCount: 425,
    price: 'MYR 600/month',
    priceNote: 'Starting price',
    features: [
      'Keyword research and optimization',
      'On-page SEO improvements',
      'Content optimization',
      'Technical SEO audits',
      'Backlink building',
      'Monthly performance reports'
    ],
    benefits: [
      'Improved search engine rankings',
      'Increased organic traffic',
      'Higher quality leads',
      'Better user experience',
      'Competitive advantage'
    ],
    faqs: [
      {
        question: 'How long does it take to see results?',
        answer: 'SEO is a long-term strategy. While some improvements can be seen within weeks, significant results typically take 3-6 months.'
      },
      {
        question: 'Do you guarantee first page rankings?',
        answer: 'We cannot guarantee specific rankings as search engines constantly update their algorithms. However, we use proven strategies to improve your visibility.'
      }
    ]
  }
];

export default function ServiceDetailsPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const [showPopup, setShowPopup] = useState(false);
  const pathname = usePathname();
  const params = React.use(paramsPromise) as { slug: string };
  
  // Find the service based on slug
  const serviceProvider = mockServices.find(service => service.slug === params.slug) || {
    id: 0,
    slug: params.slug,
    name: slugToName(params.slug),
    category: 'Service Category',
    description: 'Service provider description here',
    longDescription: 'Detailed description of the service provider would go here.',
    rating: 4.5,
    reviewCount: 500,
    price: 'MYR 500/month',
    priceNote: 'Starting price',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
    benefits: [
      'Benefit 1',
      'Benefit 2',
      'Benefit 3',
      'Benefit 4',
      'Benefit 5'
    ],
    faqs: [
      {
        question: 'Frequently Asked Question 1',
        answer: 'Answer to frequently asked question 1.'
      },
      {
        question: 'Frequently Asked Question 2',
        answer: 'Answer to frequently asked question 2.'
      }
    ]
  };

  // Generate similar services based on the current service
  const similarServices = mockServices
    .filter(service => service.slug !== params.slug)
    .slice(0, 4)
    .map(service => ({
      id: service.id,
      slug: service.slug,
      name: service.name,
      category: service.category,
      price: service.price,
      description: service.description
    }));

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
              <form>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="lastName"
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
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company Name (if applicable)</label>
                  <input
                    type="text"
                    id="company"
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">What service are you interested in? <span className="text-red-500">*</span></label>
                  <select
                    id="service"
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
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium flex items-center"
                >
                  Get My Quote
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className='flex-1 w-full flex flex-col items-center bg-gray-50'>
        {/* Header Image Section */}
        <section className='w-full bg-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
            <div className='relative w-full h-48 md:h-64 lg:h-80 bg-gradient-to-r from-blue-100 to-teal-100 rounded-lg overflow-hidden'>
              <div className='absolute inset-0 opacity-20'>
                <Image 
                  src="/images/dashboard-analytics.jpg" 
                  alt="Analytics Dashboard" 
                  width={1200}
                  height={400}
                  className='w-full h-full object-cover opacity-50'
                />
              </div>
              <div className='absolute bottom-0 left-0 p-6 md:p-8 flex items-center'>
                <div className='bg-white p-3 rounded-lg shadow-md mr-4'>
                  <div className='w-16 h-16 bg-gray-200 rounded flex items-center justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>{serviceProvider.name}</h1>
                  <div className='flex items-center mt-1'>
                    <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded'>{serviceProvider.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Info Section */}
        <section className='w-full bg-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
              {/* Left Column - Description */}
              <div className='lg:col-span-2'>
                <div className='mb-8'>
                  <h2 className='text-xl font-bold mb-4'>About Our Services</h2>
                  <p className='text-gray-700'>{serviceProvider.longDescription}</p>
                </div>
                
                {/* Features */}
                <div className='mb-8'>
                  <h2 className='text-xl font-bold mb-4'>What's Included</h2>
                  <ul className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    {serviceProvider.features.map((feature, index) => (
                      <li key={index} className='flex items-start'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className='text-gray-700'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Benefits */}
                <div className='mb-8'>
                  <h2 className='text-xl font-bold mb-4'>Benefits</h2>
                  <ul className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                    {serviceProvider.benefits.map((benefit, index) => (
                      <li key={index} className='flex items-start'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className='text-gray-700'>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Key Features */}
                <div className='mb-8'>
                  <h2 className='text-xl font-bold mb-4'>Key Features</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-y-4'>
                    {serviceProvider.features.map((feature, index) => (
                      <div key={index} className='flex items-start'>
                        <div className='text-orange-500 mr-3'>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <span className='text-gray-700'>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Pricing */}
              <div>
                <div className='bg-yellow-50 rounded-lg p-6 mb-6'>
                  <div className='text-center mb-4'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-1'>{serviceProvider.price}</h2>
                    <p className='text-sm text-gray-600'>{serviceProvider.priceNote}</p>
                  </div>
                  
                  <div className='space-y-3 mb-6'>
                    <button 
                      onClick={() => setShowPopup(true)}
                      className='w-full flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 py-3 px-4 rounded-md'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Get More Details
                    </button>
                    
                    <button 
                      onClick={() => setShowPopup(true)}
                      className='w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Get a Quote
                    </button>
                  </div>
                </div>
                
                {/* Service Details Box */}
                <div className='bg-white border border-gray-200 rounded-lg overflow-hidden mb-6'>
                  <h3 className='text-lg font-bold px-5 py-4 border-b border-gray-200'>Service Details</h3>
                  
                  <div className='px-5 py-3 border-b border-gray-100'>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600'>Service Type</span>
                      <span className='bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded'>Retainer / Monthly</span>
                    </div>
                  </div>
                  
                  <div className='px-5 py-3 border-b border-gray-100'>
                    <div className='flex flex-col'>
                      <span className='text-gray-600 mb-2'>Best For</span>
                      <div className='flex flex-wrap gap-2'>
                        <span className='bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded'>Solopreneurs</span>
                        <span className='bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded'>Early-stage Startups</span>
                        <span className='bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded'>SMEs</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className='px-5 py-3 border-b border-gray-100'>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600'>Turnaround Time</span>
                      <span className='font-medium'>3–5 Business Days</span>
                    </div>
                  </div>
                  
                  <div className='px-5 py-3 border-b border-gray-100'>
                    <div className='flex justify-between items-center'>
                      <span className='text-gray-600'>Free Consultation</span>
                      <span className='text-green-600 font-medium'>Yes</span>
                    </div>
                  </div>
                  
                  <div className='px-5 py-3'>
                    <div className='flex flex-col'>
                      <span className='text-gray-600 mb-2'>Regions Served</span>
                      <div className='flex flex-wrap gap-2'>
                        <span className='inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded'>
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Malaysia
                        </span>
                        <span className='inline-flex items-center bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded'>
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Singapore
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Similar Services */}
        <section className='w-full bg-gray-50 py-12'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-2xl font-bold text-center mb-2'>Similar Services</h2>
            <p className='text-center text-gray-600 mb-8'>Discover other financial services that might interest you</p>
            
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {/* Service 1 */}
              <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                <div className='p-4'>
                  <div className='flex items-center mb-2'>
                    <div className='w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3'>
                      <Image 
                        src="/images/avatar-1.jpg" 
                        alt="Elite Tax Advisors" 
                        width={40} 
                        height={40}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div>
                      <h3 className='font-medium'>Elite Tax Advisors</h3>
                      <div className='flex items-center'>
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className='text-sm ml-1'>4.8</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className='text-sm text-gray-600 mb-3'>Comprehensive tax planning and advisory</p>
                  
                  <div className='flex justify-between items-center mb-3'>
                    <span className='bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded'>Tax Advisory Services</span>
                    <span className='font-bold'>MYR 600<span className='text-sm font-normal text-gray-500'>/mo</span></span>
                  </div>
                  
                  <Link href='/services/elite-tax-advisors' className='block w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-center rounded transition-colors'>
                    View Details
                  </Link>
                </div>
              </div>
              
              {/* Service 2 */}
              <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                <div className='p-4'>
                  <div className='flex items-center mb-2'>
                    <div className='w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3'>
                      <Image 
                        src="/images/avatar-2.jpg" 
                        alt="Virtual CFO Partners" 
                        width={40} 
                        height={40}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div>
                      <h3 className='font-medium'>Virtual CFO Partners</h3>
                      <div className='flex items-center'>
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className='text-sm ml-1'>4.7</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className='text-sm text-gray-600 mb-3'>Strategic financial leadership for growing companies</p>
                  
                  <div className='flex justify-between items-center mb-3'>
                    <span className='bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded'>Virtual CFO Services</span>
                    <span className='font-bold'>MYR 1200<span className='text-sm font-normal text-gray-500'>/mo</span></span>
                  </div>
                  
                  <Link href='/services/virtual-cfo-partners' className='block w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-center rounded transition-colors'>
                    View Details
                  </Link>
                </div>
              </div>
              
              {/* Service 3 */}
              <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                <div className='p-4'>
                  <div className='flex items-center mb-2'>
                    <div className='w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3'>
                      <Image 
                        src="/images/avatar-3.jpg" 
                        alt="Payroll Pro Services" 
                        width={40} 
                        height={40}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div>
                      <h3 className='font-medium'>Payroll Pro Services</h3>
                      <div className='flex items-center'>
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className='text-sm ml-1'>4.6</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className='text-sm text-gray-600 mb-3'>Automated payroll solutions for businesses</p>
                  
                  <div className='flex justify-between items-center mb-3'>
                    <span className='bg-green-100 text-green-800 text-xs px-2 py-1 rounded'>Payroll Providers</span>
                    <span className='font-bold'>MYR 300<span className='text-sm font-normal text-gray-500'>/mo</span></span>
                  </div>
                  
                  <Link href='/services/payroll-pro-services' className='block w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-center rounded transition-colors'>
                    View Details
                  </Link>
                </div>
              </div>
              
              {/* Service 4 */}
              <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
                <div className='p-4'>
                  <div className='flex items-center mb-2'>
                    <div className='w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3'>
                      <Image 
                        src="/images/avatar-4.jpg" 
                        alt="Compliance Experts" 
                        width={40} 
                        height={40}
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div>
                      <h3 className='font-medium'>Compliance Experts</h3>
                      <div className='flex items-center'>
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className='text-sm ml-1'>4.5</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className='text-sm text-gray-600 mb-3'>Regulatory compliance and reporting solutions</p>
                  
                  <div className='flex justify-between items-center mb-3'>
                    <span className='bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded'>Compliance Services</span>
                    <span className='font-bold'>MYR 450<span className='text-sm font-normal text-gray-500'>/mo</span></span>
                  </div>
                  
                  <Link href='/services/compliance-experts' className='block w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white text-center rounded transition-colors'>
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
