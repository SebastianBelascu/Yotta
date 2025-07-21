'use client';

import React, { useState, useEffect, use } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Save, X, Loader2, AlertCircle, Plus, Minus } from 'lucide-react';
import ServiceImageUploader from '@/components/admin/ServiceImageUploader';
import RichTextEditor from '@/components/admin/RichTextEditor';

const REGIONS = ['Malaysia', 'Singapore', 'Global'];

interface Vendor {
  id: string;
  name: string;
  email: string;
}

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
  vendor_id: string;
  published: boolean;
  created_at: string;
  portfolio_url: string;
  client_logos: string[];
}

export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: serviceId } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    main_categories: [] as string[],
    sub_categories: [] as string[],
    description: '',
    highlights: [] as string[],
    whats_included: [] as string[],
    type_of_service: '',
    who_is_this_for: [] as string[],
    region_served: [] as string[],
    turnaround_time: '',
    free_consultation: false,
    price_from: '',
    currency: 'SGD',
    email_for_leads: '',
    portfolio_url: '',
    client_logos: [] as string[],
    logo_url: '',
    banner_url: '',
    vendor_id: '',
    published: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchService();
    fetchVendors();
  }, [serviceId]);

  const fetchVendors = async () => {
    try {
      const response = await fetch('/api/vendors');
      if (response.ok) {
        const data = await response.json();
        setVendors(data);
      } else {
        console.error('Failed to fetch vendors');
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const fetchService = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) throw error;

      if (data) {
        // Ensure all array fields are properly initialized
        const ensureArray = (arr: any[] | null | undefined) => {
          return Array.isArray(arr) && arr.length > 0 ? arr : [''];
        };
        
        const ensureEmptyArray = (arr: any[] | null | undefined) => {
          return Array.isArray(arr) ? arr : [];
        };
        
        setFormData({
          name: data.name || '',
          tagline: data.tagline || '',
          main_categories: ensureArray(data.main_categories),
          sub_categories: ensureArray(data.sub_categories),
          description: data.description || '',
          highlights: ensureEmptyArray(data.highlights),
          whats_included: ensureEmptyArray(data.whats_included),
          type_of_service: data.type_of_service || '',
          who_is_this_for: ensureEmptyArray(data.who_is_this_for),
          region_served: ensureEmptyArray(data.region_served),
          turnaround_time: data.turnaround_time || '',
          free_consultation: data.free_consultation || false,
          price_from: data.price_from ? data.price_from.toString() : '',
          currency: data.currency || 'SGD',
          email_for_leads: data.email_for_leads || '',
          portfolio_url: data.portfolio_url || '',
          client_logos: ensureEmptyArray(data.client_logos),
          logo_url: data.logo_url || '',
          banner_url: data.banner_url || '',
          vendor_id: data.vendor_id || '',
          published: data.published || false,
        });
      }
    } catch (error) {
      console.error('Error fetching service:', error);
      alert('Failed to load service');
      router.push('/admin/services');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const newArray = [...(formData[field as keyof typeof formData] as string[])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: string) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    setFormData({ ...formData, [field]: [...currentArray, ''] });
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = formData[field as keyof typeof formData] as string[];
    if (currentArray.length > 1) {
      const newArray = currentArray.filter((_, i) => i !== index);
      setFormData({ ...formData, [field]: newArray });
    }
  };

  const handleRichTextChange = (content: string) => {
    setFormData({ ...formData, description: content });
    setErrors(prev => ({ ...prev, description: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }
    
    if (!formData.vendor_id.trim()) {
      newErrors.vendor_id = 'Please select a vendor';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.email_for_leads.trim()) {
      newErrors.email_for_leads = 'Email for leads is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email_for_leads)) {
      newErrors.email_for_leads = 'Please enter a valid email address';
    }
    
    if (formData.region_served.length === 0) {
      newErrors.region_served = 'Please select at least one region';
    }
    
    if (formData.price_from && isNaN(Number(formData.price_from))) {
      newErrors.price_from = 'Price must be a valid number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      
      // Clean up array fields - remove empty strings
      const cleanedData = {
        ...formData,
        main_categories: formData.main_categories.filter(cat => cat.trim() !== ''),
        sub_categories: formData.sub_categories.filter(cat => cat.trim() !== ''),
        highlights: formData.highlights.filter(highlight => highlight.trim() !== ''),
        whats_included: formData.whats_included.filter(item => item.trim() !== ''),
        who_is_this_for: formData.who_is_this_for.filter(who => who.trim() !== ''),
        client_logos: formData.client_logos.filter(logo => logo.trim() !== ''),
        price_from: formData.price_from ? Number(formData.price_from) : null,
      };
      
      const { error } = await supabase
        .from('services')
        .update(cleanedData)
        .eq('id', serviceId);
      
      if (error) throw error;
      
      router.push('/admin/services');
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const ArrayInput = ({ 
    field, 
    label, 
    placeholder 
  }: { 
    field: string; 
    label: string; 
    placeholder: string; 
  }) => {
    const values = formData[field as keyof typeof formData] as string[] || [];
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        {Array.isArray(values) && values.map((value, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={value}
              onChange={(e) => handleArrayChange(field, index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => removeArrayItem(field, index)}
              disabled={values.length === 1}
              className="p-2 text-red-600 hover:text-red-800 disabled:text-gray-400"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem(field)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
        >
          <Plus className="h-4 w-4" />
          Add {label.toLowerCase()}
        </button>
      </div>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto pb-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
          <p className="text-gray-600">Update your service information</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., SEO Audit & Strategy"
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
                  Vendor *
                </label>
                <select
                  name="vendor_id"
                  value={formData.vendor_id}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.vendor_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a vendor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
                {errors.vendor_id && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.vendor_id}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief catchy description"
                />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArrayInput
                field="main_categories"
                label="Main Categories"
                placeholder="e.g., Digital Marketing"
              />
              
              <ArrayInput
                field="sub_categories"
                label="Sub Categories"
                placeholder="e.g., SEO Agencies"
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Description *
              </label>
              <RichTextEditor
                value={formData.description}
                onChange={handleRichTextChange}
                placeholder="Describe your service in detail..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ArrayInput
                field="highlights"
                label="Key Highlights"
                placeholder="e.g., Comprehensive keyword research"
              />
              
              <ArrayInput
                field="whats_included"
                label="What's Included"
                placeholder="e.g., Technical SEO audit"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type of Service
                </label>
                <select
                  name="type_of_service"
                  value={formData.type_of_service}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  <option value="One-time">One-time</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Retainer">Retainer</option>
                  <option value="Project-based">Project-based</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Turnaround Time
                </label>
                <input
                  type="text"
                  name="turnaround_time"
                  value={formData.turnaround_time}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3-5 Business Days"
                />
              </div>
            </div>

            <div className="mt-6">
              <ArrayInput
                field="who_is_this_for"
                label="Who Is This For"
                placeholder="e.g., Startups, SMEs"
              />
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="free_consultation"
                  checked={formData.free_consultation}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Free consultation available</span>
              </label>
            </div>
          </div>

          {/* Pricing & Location */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price From
                </label>
                <div className="flex gap-2">
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD</option>
                    <option value="MYR">MYR</option>
                    <option value="SGD">SGD</option>
                    <option value="GBP">GBP</option>
                  </select>
                  <input
                    type="number"
                    name="price_from"
                    value={formData.price_from}
                    onChange={handleChange}
                    className={`flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.price_from ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="800"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.price_from && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.price_from}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email for Leads *
                </label>
                <input
                  type="email"
                  name="email_for_leads"
                  value={formData.email_for_leads}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email_for_leads ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="leads@yourcompany.com"
                />
                {errors.email_for_leads && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email_for_leads}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6">
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
          </div>

          {/* Images */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <ServiceImageUploader
                  value={formData.logo_url}
                  onChange={(url: string) => setFormData({ ...formData, logo_url: url })}
                  label="Logo (Square)"
                  helpText="Upload a square logo image for your service. Stored in services-media bucket."
                />
              </div>

              <div>
                <ServiceImageUploader
                  value={formData.banner_url}
                  onChange={(url: string) => setFormData({ ...formData, banner_url: url })}
                  label="Banner (16:9)"
                  helpText="Upload a banner image (16:9 ratio) for your service. Stored in services-media bucket."
                />
              </div>
            </div>
          </div>

          {/* Publish Toggle */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Publish Service</h3>
                <p className="text-sm text-gray-500">Make this service visible to users</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {formData.published ? 'Published' : 'Draft'}
                </span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSubmitting ? 'Updating...' : 'Update Service'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
