'use client'

import React, { useState } from 'react';
import { Layout } from '@/components/layout/layout';
import Link from 'next/link';
import Image from 'next/image';

export default function PartnerPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    country: '',
    serviceCategory: '',
    website: '',
    serviceDescription: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
  };
  return (
    <Layout>
      <div className='flex-1 w-full flex flex-col items-center'>
        {/* Hero Section */}
        <section className='w-full bg-gray-900 text-white py-16 md:py-24'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <h1 className='text-4xl md:text-5xl font-bold mb-6'>Partner With VentureNext</h1>
            <p className='text-lg md:text-xl max-w-3xl mx-auto mb-12'>
              Join our network of trusted business service providers and connect with thousands of entrepreneurs
              looking for your expertise.
            </p>
            
            {/* Stats */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12'>
              <div className='flex flex-col items-center'>
                <span className='text-orange-500 text-4xl md:text-5xl font-bold mb-2'>50K+</span>
                <span className='text-gray-300'>Monthly Visitors</span>
              </div>
              <div className='flex flex-col items-center'>
                <span className='text-orange-500 text-4xl md:text-5xl font-bold mb-2'>1,000+</span>
                <span className='text-gray-300'>Active Businesses</span>
              </div>
              <div className='flex flex-col items-center'>
                <span className='text-orange-500 text-4xl md:text-5xl font-bold mb-2'>95%</span>
                <span className='text-gray-300'>Client Satisfaction</span>
              </div>
            </div>
            
            {/* CTA Button */}
            <Link href="/partner/apply" className='inline-flex items-center px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors'>
              Start Your Application
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </section>
        
        {/* Why Partner Section */}
        <section className='w-full bg-white py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-3xl md:text-4xl font-bold text-center mb-12'>Why Partner With VentureNext?</h2>
            <p className='text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16'>
              We're more than just a marketplace. We're your growth partner, connecting you with
              high-quality leads and helping you scale your business.
            </p>
            
            {/* Benefits Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {/* Benefit 1 */}
              <div className='flex flex-col items-center text-center'>
                <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className='text-xl font-bold mb-2'>Quality Leads</h3>
                <p className='text-gray-600'>
                  Pre-qualified prospects actively seeking your services, not tire-kickers.
                </p>
              </div>
              
              {/* Benefit 2 */}
              <div className='flex flex-col items-center text-center'>
                <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className='text-xl font-bold mb-2'>Growth Focused</h3>
                <p className='text-gray-600'>
                  Our marketing drives consistent traffic and leads to help grow your business.
                </p>
              </div>
              
              {/* Benefit 3 */}
              <div className='flex flex-col items-center text-center'>
                <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className='text-xl font-bold mb-2'>Trusted Platform</h3>
                <p className='text-gray-600'>
                  Join a vetted network of professionals with established credibility.
                </p>
              </div>
              
              {/* Benefit 4 */}
              <div className='flex flex-col items-center text-center'>
                <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className='text-xl font-bold mb-2'>Easy Setup</h3>
                <p className='text-gray-600'>
                  Simple onboarding process gets you listed and generating leads quickly.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Application Process */}
        <section className='w-full bg-gray-50 py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-3xl md:text-4xl font-bold text-center mb-12'>How It Works</h2>
            
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
              {/* Step 1 */}
              <div className='bg-white p-6 rounded-lg shadow-md'>
                <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-500 font-bold text-xl'>1</div>
                <h3 className='text-xl font-bold mb-3'>Apply</h3>
                <p className='text-gray-600'>
                  Fill out our simple application form with details about your business and services.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className='bg-white p-6 rounded-lg shadow-md'>
                <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-500 font-bold text-xl'>2</div>
                <h3 className='text-xl font-bold mb-3'>Get Verified</h3>
                <p className='text-gray-600'>
                  Our team reviews your application and verifies your business credentials.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className='bg-white p-6 rounded-lg shadow-md'>
                <div className='w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4 text-orange-500 font-bold text-xl'>3</div>
                <h3 className='text-xl font-bold mb-3'>Start Growing</h3>
                <p className='text-gray-600'>
                  Once approved, your profile goes live and you start receiving qualified leads.
                </p>
              </div>
            </div>
            
            {/* CTA Button */}
            <div className='text-center'>
              <Link href="/partner/apply" className='inline-flex items-center px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors'>
                Apply Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Application Form Section */}
        <section className='w-full bg-white py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl md:text-4xl font-bold mb-4'>Get in Touch!</h2>
              <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
                Fill out the form below and we'll get back to you with next steps.
              </p>
            </div>
            
            <div className='max-w-3xl mx-auto'>
              {formSubmitted ? (
                <div className='text-center py-12 bg-gray-50 rounded-lg p-8'>
                  <div className='w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className='text-2xl font-bold mb-4'>Application Received!</h3>
                  <p className='text-lg text-gray-600 mb-8'>
                    Thank you for your interest in partnering with VentureNext. Our team will review your application and get back to you within 2-3 business days.
                  </p>
                  <button 
                    onClick={() => setFormSubmitted(false)}
                    className='px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors'
                  >
                    Submit Another Application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className='space-y-6 bg-gray-50 p-8 rounded-lg'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Business Name */}
                    <div>
                      <label htmlFor="businessName" className='block text-sm font-medium text-gray-700 mb-1'>
                        Business Name <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        placeholder="Your Business Name"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                      />
                    </div>
                    
                    {/* Contact Person */}
                    <div>
                      <label htmlFor="contactPerson" className='block text-sm font-medium text-gray-700 mb-1'>
                        Contact Person <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type="text"
                        id="contactPerson"
                        placeholder="John Doe"
                        required
                        value={formData.contactPerson}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                      />
                    </div>
                  </div>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Email Address */}
                    <div>
                      <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-1'>
                        Email Address <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="john@example.com"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                      />
                    </div>
                    
                    {/* Phone Number */}
                    <div>
                      <label htmlFor="phone" className='block text-sm font-medium text-gray-700 mb-1'>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        placeholder="+65 1234 5678"
                        value={formData.phone}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                      />
                    </div>
                  </div>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {/* Country */}
                    <div>
                      <label htmlFor="country" className='block text-sm font-medium text-gray-700 mb-1'>
                        Country <span className='text-red-500'>*</span>
                      </label>
                      <select
                        id="country"
                        required
                        value={formData.country}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                      >
                        <option value="">Select a country</option>
                        <option value="malaysia">Malaysia</option>
                        <option value="singapore">Singapore</option>
                        <option value="indonesia">Indonesia</option>
                        <option value="thailand">Thailand</option>
                        <option value="vietnam">Vietnam</option>
                        <option value="philippines">Philippines</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    {/* Service Category */}
                    <div>
                      <label htmlFor="serviceCategory" className='block text-sm font-medium text-gray-700 mb-1'>
                        Service Category <span className='text-red-500'>*</span>
                      </label>
                      <select
                        id="serviceCategory"
                        required
                        value={formData.serviceCategory}
                        onChange={handleChange}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                      >
                        <option value="">Select a category</option>
                        <option value="digital-marketing">Digital Marketing</option>
                        <option value="web-development">Web Development</option>
                        <option value="mobile-app-development">Mobile App Development</option>
                        <option value="graphic-design">Graphic Design</option>
                        <option value="business-consulting">Business Consulting</option>
                        <option value="financial-services">Financial Services</option>
                        <option value="legal-services">Legal Services</option>
                        <option value="hr-services">HR Services</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Website URL */}
                  <div>
                    <label htmlFor="website" className='block text-sm font-medium text-gray-700 mb-1'>
                      Website URL
                    </label>
                    <input
                      type="url"
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={formData.website}
                      onChange={handleChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                    />
                  </div>
                  
                  {/* Service Description */}
                  <div>
                    <label htmlFor="serviceDescription" className='block text-sm font-medium text-gray-700 mb-1'>
                      Service Description <span className='text-red-500'>*</span>
                    </label>
                    <textarea
                      id="serviceDescription"
                      rows={6}
                      placeholder="Please describe your services in detail..."
                      required
                      value={formData.serviceDescription}
                      onChange={handleChange}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500'
                    ></textarea>
                  </div>
                  
                  {/* Submit Button */}
                  <div className='pt-4'>
                    <button
                      type="submit"
                      className='w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors'
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
        
        {/* Final CTA */}
        <section className='w-full bg-gray-900 text-white py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <h2 className='text-3xl md:text-4xl font-bold mb-6'>Ready to Grow Your Business?</h2>
            <p className='text-lg max-w-2xl mx-auto mb-8'>
              Join our network of successful service providers and start connecting with qualified clients today.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className='inline-flex items-center px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors'
            >
              Apply Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
