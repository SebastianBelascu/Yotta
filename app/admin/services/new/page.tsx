'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { Breadcrumb } from '@/components/admin/Breadcrumb';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Save, X, AlertCircle, Plus, Minus, Upload, Trash2 } from 'lucide-react';



// Hierarchical service categories based on the design
const SERVICE_CATEGORIES = {
  'Start Your Business': [
    'Incorporation / Company Formation Services',
    'Virtual Office Providers',
    'Licensing & Permit Consultants',
    'Business Advisory Firms',
    'IP & Trademark Agents'
  ],
  'Run & Operate Smoothly': [
    'Payroll Providers',
    'HR Outsourcing Firms',
    'SOP & Process Consultants',
    'Virtual Assistant Agencies',
    'Business Insurance Brokers'
  ],
  'Manage Your Money': [
    'Accounting Firms',
    'Tax Advisory Services',
    'Grant Writing & Funding Consultants',
    'Virtual CFO Services',
    'Financial Planning Firms'
  ],
  'Hire & Build Your Team': [
    'Recruitment Agencies',
    'Employer of Record (EOR) Providers',
    'HR Compliance & Documentation Specialists',
    'Culture & Engagement Coaches'
  ],
  'Get Customers & Grow': [
    'Performance Marketing Agencies',
    'SEO Agencies',
    'Social Media Management Firms',
    'PR Agencies',
    'Branding & Creative Studios'
  ],
  'Build Tech & Digital Presence': [
    'Website Development Agencies',
    'App & Software Developers',
    'E-commerce Setup Experts',
    'No-code / Low-code Agencies',
    'UX/UI Design Firms'
  ],
  'Ship Products': [
    'Shipping Solution Providers',
    'Fulfillment & Warehousing Companies',
    'Inventory & Supply Chain Consultants',
    'Cross-border Logistics Providers',
    'Print-on-Demand Services'
  ],
  'Expand Internationally': [
    'Market Entry Consultants',
    'Global Business Setup Services',
    'Localization & Translation Providers',
    'Visa & Immigration Consultants',
    'International Tax & Compliance Advisors'
  ],
  'Stay Compliant & Protected': [
    'Legal Services / Business Law Firms',
    'Contract & Policy Consultants',
    'Compliance Advisory Firms',
    'IP Protection Specialists',
    'Legal Helplines / On-Demand Lawyers'
  ],
  'Level Up as a Founder': [
    'Startup Coaches & Mentors',
    'Leadership Training Providers',
    'Accelerator & Incubator Programs',
    'Fractional Advisors',
    'Workshop & Masterclass Hosts'
  ]
};

// Get all main categories
const MAIN_CATEGORIES = Object.keys(SERVICE_CATEGORIES);

// Get all subcategories
const ALL_SUBCATEGORIES = Object.values(SERVICE_CATEGORIES).flat();

// Target audience options
const TARGET_AUDIENCE = [
  'Solopreneurs',
  'Early-stage Startups',
  'SMEs',
  'VC-backed Startups',
  'Remote Teams'
];

// Service types
const SERVICE_TYPES = [
  'Hourly Based',
  'One Time Service',
  'Monthly Retainer',
  'Project Based',
  'Custom /Varies',
  'On Demand/Ad Hoc',
  'Commission Based'
];

// Turnaround time options
const TURNAROUND_TIMES = [
  'Within 24 hours',
  'Within 48 hours',
  '3-5 Business Days',
  '1-2 Weeks',
  '1 Month',
  'Ongoing',
  'Custom / Varies'
];

// Currency options
const CURRENCIES = ['SGD', 'USD', 'EUR', 'GBP', 'MYR'];

// Regions
const REGIONS = ['Malaysia', 'Singapore', 'Global'];

export default function NewServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    main_categories: [] as string[],
    sub_categories: [] as string[],
    description: '',
    who_is_this_for: [] as string[],
    type_of_service: '',
    highlights: ['', '', ''] as string[],
    whats_included: ['', '', ''] as string[],
    price_from: '',
    currency: 'SGD',
    turnaround_time: '',
    custom_turnaround_time: '',
    free_consultation: false,
    portfolio_url: '',
    client_logos: [] as string[],
    email_for_leads: '',
    logo_url: '',
    banner_url: '',

    region_served: [] as string[],
    published: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      main_categories: prev.main_categories.includes(category)
        ? prev.main_categories.filter((c: string) => c !== category)
        : [...prev.main_categories, category]
    }));
    
    if (errors.main_categories) {
      setErrors(prev => ({ ...prev, main_categories: '' }));
    }
  };

  const handleTargetAudienceChange = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      who_is_this_for: prev.who_is_this_for.includes(audience)
        ? prev.who_is_this_for.filter(a => a !== audience)
        : [...prev.who_is_this_for, audience]
    }));
    
    if (errors.who_is_this_for) {
      setErrors(prev => ({ ...prev, who_is_this_for: '' }));
    }
  };

  const handleSubCategoryChange = (subcategory: string) => {
    setFormData(prev => ({
      ...prev,
      sub_categories: prev.sub_categories.includes(subcategory)
        ? prev.sub_categories.filter((s: string) => s !== subcategory)
        : [...prev.sub_categories, subcategory]
    }));
    
    if (errors.sub_categories) {
      setErrors(prev => ({ ...prev, sub_categories: '' }));
    }
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    if (currentArray.length < 6) {
      setFormData(prev => ({
        ...prev,
        [field]: [...currentArray, '']
      }));
    }
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    if (currentArray.length > 3) {
      setFormData(prev => ({
        ...prev,
        [field]: currentArray.filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'banner') => {
    try {
      if (type === 'logo') setUploadingLogo(true);
      if (type === 'banner') setUploadingBanner(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/services/upload-media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        [`${type}_url`]: data.url
      }));

    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload ${type}. Please try again.`);
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      if (type === 'banner') setUploadingBanner(false);
    }
  };

  const removeImage = (type: 'logo' | 'banner') => {
    setFormData(prev => ({
      ...prev,
      [`${type}_url`]: ''
    }));
  };

  const validateForm = () => {
    console.log('🔍 Starting form validation...');
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
      console.log('❌ Name validation failed');
    }
    
    if (!formData.tagline.trim()) {
      newErrors.tagline = 'Tagline is required';
      console.log('❌ Tagline validation failed');
    } else if (formData.tagline.length > 150) {
      newErrors.tagline = 'Tagline must be 150 characters or less';
      console.log('❌ Tagline too long');
    }
    

    
    if (!formData.turnaround_time) {
      newErrors.turnaround_time = 'Please select turnaround time';
      console.log('❌ Turnaround time validation failed');
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      console.log('❌ Description validation failed');
    }
    
    if (formData.main_categories.length === 0) {
      newErrors.main_categories = 'Please select at least one main category';
      console.log('❌ Main categories validation failed');
    }
    
    if (formData.who_is_this_for.length === 0) {
      newErrors.who_is_this_for = 'Please select target audience';
      console.log('❌ Target audience validation failed');
    }
    
    if (formData.region_served.length === 0) {
      newErrors.region_served = 'Please select at least one region';
      console.log('❌ Region served validation failed');
    }
    
    if (!formData.type_of_service) {
      newErrors.type_of_service = 'Please select service type';
      console.log('❌ Service type validation failed');
    }
    
    const validHighlights = formData.highlights.filter(h => h.trim() !== '');
    if (validHighlights.length < 3 || validHighlights.length > 6) {
      newErrors.highlights = 'Please provide 3-6 key features';
      console.log('❌ Highlights validation failed:', validHighlights.length);
    }
    
    const validIncluded = formData.whats_included.filter(w => w.trim() !== '');
    if (validIncluded.length < 3 || validIncluded.length > 6) {
      newErrors.whats_included = 'Please provide 3-6 items for what\'s included';
      console.log('❌ What\'s included validation failed:', validIncluded.length);
    }
    
    if (!formData.email_for_leads.trim()) {
      newErrors.email_for_leads = 'Email for leads is required';
      console.log('❌ Email for leads validation failed');
    }
    
    if (formData.price_from && isNaN(Number(formData.price_from))) {
      newErrors.price_from = 'Price must be a valid number';
      console.log('❌ Price validation failed');
    }
    
    console.log('🔍 Validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('🔍 Form is valid:', isValid);
    return isValid;
  };

  // State for error message display
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🚀 Form submission started');
    e.preventDefault();
    
    console.log('📝 Form data:', formData);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }
    
    console.log('✅ Form validation passed');
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const supabase = createClient();
      
      // Clean up array fields - remove empty strings
      const cleanedData = {
        name: formData.name.trim(),
        tagline: formData.tagline.trim(),
        main_categories: formData.main_categories,
        sub_categories: formData.sub_categories,
        description: formData.description.trim(),
        highlights: formData.highlights.filter(h => h.trim() !== ''),
        whats_included: formData.whats_included.filter(w => w.trim() !== ''),
        type_of_service: formData.type_of_service,
        who_is_this_for: formData.who_is_this_for,
        region_served: formData.region_served,
        turnaround_time: formData.turnaround_time === 'Custom / Varies' && formData.custom_turnaround_time ? formData.custom_turnaround_time : formData.turnaround_time,
        free_consultation: formData.free_consultation,
        price_from: formData.price_from ? Number(formData.price_from) : null,
        currency: formData.currency,
        email_for_leads: formData.email_for_leads.trim(),
        logo_url: formData.logo_url,
        banner_url: formData.banner_url,

        published: formData.published,
        portfolio_url: formData.portfolio_url,
        client_logos: formData.client_logos
      };
      
      console.log('Submitting service data:', JSON.stringify(cleanedData, null, 2));
      
      // Use API route to create service with vendor auto-assignment
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error details:', errorData);
        throw new Error(errorData.error || 'Failed to create service');
      }
      
      const data = await response.json();
      
      console.log('Service created successfully:', data);
      router.push('/admin/services');
    } catch (error: any) {
      // Detailed error logging
      console.error('Error creating service:', {
        error: error,
        message: error.message,
        code: error?.code,
        details: error?.details,
        hint: error?.hint,
        formData: {
          ...formData,
          // Exclude large text fields from logging
          description: formData.description.length + ' chars',
        }
      });
      
      // Set user-friendly error message
      const errorMsg = error?.message || 'Unknown error occurred';
      setErrorMessage(`Failed to create service: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[
          { label: 'Services Management', href: '/admin/services' },
          { label: 'New Service' }
        ]} />
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Service</h1>
            <p className="text-gray-600 mt-1">Create a new service listing for the marketplace</p>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
        </div>
        
        {/* Error message display */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-1 text-sm text-red-700">
                  {errorMessage}
                  <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">
                    Check the browser console for more details.
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-orange-600 mb-6">Section 1: Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service/Business Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your service name"
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline / One-Liner (max 150 characters) *
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="Describe your service in one line"
                  maxLength={150}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.tagline ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-500">{formData.tagline.length}/150 characters</span>
                  {errors.tagline && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.tagline}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Categories *
              </label>
              <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-300 rounded-lg p-4">
                {MAIN_CATEGORIES.map((mainCategory: string) => (
                  <div key={mainCategory} className="space-y-2">
                    {/* Main Category Header */}
                    <div className="flex items-center space-x-2 font-medium text-gray-900 bg-gray-50 p-2 rounded">
                      <input
                        type="checkbox"
                        checked={formData.main_categories.includes(mainCategory)}
                        onChange={() => handleCategoryChange(mainCategory)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                      />
                      <span className="text-sm">{mainCategory}</span>
                    </div>
                    
                    {/* Subcategories */}
                    <div className="ml-6 space-y-1">
                      {SERVICE_CATEGORIES[mainCategory as keyof typeof SERVICE_CATEGORIES].map((subCategory) => (
                        <label key={subCategory} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={formData.sub_categories.includes(subCategory)}
                            onChange={() => handleSubCategoryChange(subCategory)}
                            className="h-3 w-3 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                          />
                          <span className="text-xs text-gray-600">{subCategory}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {errors.main_categories && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.main_categories}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo (1:1 ratio) *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  {formData.logo_url ? (
                    <div className="space-y-4">
                      <img 
                        src={formData.logo_url} 
                        alt="Logo preview"
                        className="w-24 h-24 mx-auto object-cover rounded"
                      />
                      <div className="flex justify-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                          <Upload className="h-4 w-4" />
                          Replace
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'logo');
                            }}
                            className="hidden"
                            disabled={uploadingLogo}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeImage('logo')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          disabled={uploadingLogo}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-600 font-medium">Upload your logo (square format)</p>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG, WebP up to 5MB</p>
                      </div>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                        {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, 'logo');
                          }}
                          className="hidden"
                          disabled={uploadingLogo}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Banner (16:9 ratio) *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  {formData.banner_url ? (
                    <div className="space-y-4">
                      <img 
                        src={formData.banner_url} 
                        alt="Banner preview"
                        className="w-full h-32 mx-auto object-cover rounded"
                      />
                      <div className="flex justify-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                          <Upload className="h-4 w-4" />
                          Replace
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, 'banner');
                            }}
                            className="hidden"
                            disabled={uploadingBanner}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removeImage('banner')}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          disabled={uploadingBanner}
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-600 font-medium">Upload your banner (landscape format)</p>
                        <p className="text-sm text-gray-500 mt-1">PNG, JPG, WebP up to 5MB</p>
                      </div>
                      <label className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                        {uploadingBanner ? 'Uploading...' : 'Upload Banner'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, 'banner');
                          }}
                          className="hidden"
                          disabled={uploadingBanner}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Service Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-orange-600 mb-6">Section 2: Service Details</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Service Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of your service..."
                rows={6}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.description}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Who is this for? *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {TARGET_AUDIENCE.map((audience) => (
                  <label key={audience} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.who_is_this_for.includes(audience)}
                      onChange={() => handleTargetAudienceChange(audience)}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{audience}</span>
                  </label>
                ))}
              </div>
              {errors.who_is_this_for && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.who_is_this_for}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Service *
              </label>
              <select
                name="type_of_service"
                value={formData.type_of_service}
                onChange={handleChange}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                  errors.type_of_service ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select service type</option>
                {SERVICE_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {errors.type_of_service && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.type_of_service}
                </p>
              )}
            </div>
          </div>

          {/* Section 3: Display Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-orange-600 mb-6">Section 3: Display Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Key Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Highlights (3-6 points) *
                </label>
                {formData.highlights.map((highlight, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={highlight}
                      onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                      placeholder="Enter a key feature"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('highlights', index)}
                      disabled={formData.highlights.length <= 3}
                      className="p-2 text-red-600 hover:text-red-800 disabled:text-gray-400"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formData.highlights.length < 6 && (
                  <button
                    type="button"
                    onClick={() => addArrayItem('highlights')}
                    className="flex items-center gap-2 text-orange-600 hover:text-orange-800 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </button>
                )}
                {errors.highlights && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.highlights}
                  </p>
                )}
              </div>

              {/* What's Included */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's Included (3-6 points) *
                </label>
                {formData.whats_included.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange('whats_included', index, e.target.value)}
                      placeholder="What's included in your service"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('whats_included', index)}
                      disabled={formData.whats_included.length <= 3}
                      className="p-2 text-red-600 hover:text-red-800 disabled:text-gray-400"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formData.whats_included.length < 6 && (
                  <button
                    type="button"
                    onClick={() => addArrayItem('whats_included')}
                    className="flex items-center gap-2 text-orange-600 hover:text-orange-800 text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Add Item
                  </button>
                )}
                {errors.whats_included && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.whats_included}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Pricing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing
                </label>
                <div className="flex gap-2">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency} value={currency}>{currency}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="price_from"
                    value={formData.price_from}
                    onChange={handleChange}
                    placeholder="Enter starting price"
                    className={`flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                      errors.price_from ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Leave blank for "Custom Pricing"</p>
                {errors.price_from && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.price_from}
                  </p>
                )}
              </div>

              {/* Turnaround Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Typical Turnaround Time *
                </label>
                {formData.turnaround_time === 'Custom / Varies' ? (
                  <div className="space-y-2">
                    <select
                      name="turnaround_time"
                      value={formData.turnaround_time}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Select turnaround time</option>
                      {TURNAROUND_TIMES.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      name="custom_turnaround_time"
                      value={formData.custom_turnaround_time || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, custom_turnaround_time: e.target.value }))}
                      placeholder="Enter custom turnaround time"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                ) : (
                  <select
                    name="turnaround_time"
                    value={formData.turnaround_time}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select turnaround time</option>
                    {TURNAROUND_TIMES.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="free_consultation"
                  checked={formData.free_consultation}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Free Consultation Offered</span>
              </label>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio / Case Study URL (optional)
              </label>
              <input
                type="url"
                name="portfolio_url"
                value={formData.portfolio_url}
                onChange={handleChange}
                placeholder="https://your-portfolio.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Logos (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="text-gray-600 font-medium mt-2">Upload client logos to showcase your work</p>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG, WebP up to 5MB each</p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Upload Logos
                </button>
              </div>
            </div>
          </div>

          {/* Section 4: Contact & Portfolio */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-orange-600 mb-6">Section 4: Region & Contact</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region Served *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {REGIONS.map((region) => (
                  <label key={region} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.region_served.includes(region)}
                      onChange={() => {
                        setFormData(prev => ({
                          ...prev,
                          region_served: prev.region_served.includes(region)
                            ? prev.region_served.filter(r => r !== region)
                            : [...prev.region_served, region]
                        }));
                        if (errors.region_served) {
                          setErrors(prev => ({ ...prev, region_served: '' }));
                        }
                      }}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{region}</span>
                  </label>
                ))}
              </div>
              {errors.region_served && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.region_served}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email for Leads *
              </label>
              <input
                type="email"
                name="email_for_leads"
                value={formData.email_for_leads}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="leads@yourcompany.com"
              />
              {errors.email_for_leads && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.email_for_leads}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio URL (Optional)
              </label>
              <input
                type="url"
                name="portfolio_url"
                value={formData.portfolio_url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="https://yourportfolio.com"
              />
            </div>


          </div>

          {/* Publish Checkbox */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <div>
                <label htmlFor="published" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Publish immediately
                </label>
                <p className="text-sm text-gray-500">Make this service visible to users right away</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Creating...' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
