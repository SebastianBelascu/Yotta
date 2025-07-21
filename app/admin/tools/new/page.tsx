'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { useRouter } from 'next/navigation';
import { Save, X, AlertCircle, Plus, Minus, Upload } from 'lucide-react';
import { 
  TOOL_CATEGORIES, 
  PRICING_MODELS, 
  PLATFORMS, 
  REGIONS, 
  BEST_FOR_OPTIONS, 
  CURRENCIES,
  CreateToolData 
} from '@/lib/types/tool';

export default function NewToolPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateToolData>({
    name: '',
    tagline: '',
    categories: [''],
    description: '',
    problem_solved: '',
    best_for: [],
    features: [''],
    pros: [''],
    cons: [''],
    pricing_model: '',
    starting_price: undefined,
    currency: 'USD',
    platforms_supported: [],
    regions: [],
    logo_url: '',
    banner_url: '',
    affiliate_link: '',
    published: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Tool name is required';
    if (formData.tagline && formData.tagline.length > 150) newErrors.tagline = 'Tagline must be 150 characters or less';
    if (!formData.categories.some(cat => cat.trim())) newErrors.categories = 'At least one category is required';
    if (!formData.description?.trim()) newErrors.description = 'Product description is required';
    if (!formData.problem_solved?.trim()) newErrors.problem_solved = 'Main problem solved is required';
    if (formData.best_for.length === 0) newErrors.best_for = 'Please select who this tool is best for';
    if (!formData.features.some(feature => feature.trim())) newErrors.features = 'At least one core feature is required';
    if (formData.features.filter(f => f.trim()).length < 3) newErrors.features = 'At least 3 core features are required';
    if (formData.features.filter(f => f.trim()).length > 5) newErrors.features = 'Maximum 5 core features allowed';
    if (!formData.pricing_model) newErrors.pricing_model = 'Pricing model is required';
    if (formData.regions.length === 0) newErrors.regions = 'At least one region must be selected';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const cleanedData = {
        ...formData,
        categories: formData.categories.filter(cat => cat.trim()),
        features: formData.features.filter(feature => feature.trim()),
        pros: formData.pros.filter(pro => pro.trim()),
        cons: formData.cons.filter(con => con.trim()),
        starting_price: formData.starting_price || undefined,
      };

      const response = await fetch('/api/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create tool');
      }

      router.push('/admin/tools');
    } catch (error) {
      console.error('Error creating tool:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to create tool' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'banner') => {
    const setUploading = type === 'logo' ? setLogoUploading : setBannerUploading;
    setUploading(true);

    try {
      await fetch('/api/tools/setup-storage', { method: 'POST' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/tools/upload-media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');
      const { url } = await response.json();
      
      setFormData(prev => ({
        ...prev,
        [type === 'logo' ? 'logo_url' : 'banner_url']: url
      }));
    } catch (error) {
      console.error('Upload error:', error);
      setErrors({ [type]: 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  const addArrayItem = (field: keyof CreateToolData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: keyof CreateToolData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: keyof CreateToolData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const toggleArrayValue = (field: keyof CreateToolData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return { ...prev, [field]: newArray };
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Tool</h1>
            <p className="text-gray-600">Create a new tool listing for your directory</p>
          </div>
          <button onClick={() => router.push('/admin/tools')} className="text-gray-600 hover:text-gray-900">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">1</div>
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tool / Software Name *</label>
                <input
                  type="text"
                  placeholder="Enter your tool name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tagline / One-Liner *</label>
                <input
                  type="text"
                  placeholder="Max 150 characters"
                  value={formData.tagline}
                  onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                  maxLength={150}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="mt-1 text-sm text-gray-500">{formData.tagline?.length || 0}/150</div>
                {errors.tagline && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.tagline}</p>}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tool Categories *</label>
              <select
                value={formData.categories[0] || ''}
                onChange={(e) => updateArrayItem('categories', 0, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select main category</option>
                {TOOL_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.categories && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.categories}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Upload *</label>
                <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center">
                  {formData.logo_url ? (
                    <div className="space-y-2">
                      <img src={formData.logo_url} alt="Logo preview" className="w-20 h-20 object-cover rounded-lg mx-auto" />
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, logo_url: '' }))} className="text-sm text-red-600 hover:text-red-800">Remove</button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-pink-400 mx-auto" />
                      <p className="text-sm text-gray-600">Upload 1:1 ratio logo</p>
                      <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, 'logo'); }} className="hidden" id="logo-upload" disabled={logoUploading} />
                      <label htmlFor="logo-upload" className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        {logoUploading ? 'Uploading...' : 'Choose File'}
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Banner Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Screenshot / Banner (Optional)</label>
                <div className="border-2 border-dashed border-pink-300 rounded-lg p-6 text-center">
                  {formData.banner_url ? (
                    <div className="space-y-2">
                      <img src={formData.banner_url} alt="Banner preview" className="w-full h-20 object-cover rounded-lg" />
                      <button type="button" onClick={() => setFormData(prev => ({ ...prev, banner_url: '' }))} className="text-sm text-red-600 hover:text-red-800">Remove</button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-pink-400 mx-auto" />
                      <p className="text-sm text-gray-600">Upload promo banner</p>
                      <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(file, 'banner'); }} className="hidden" id="banner-upload" disabled={bannerUploading} />
                      <label htmlFor="banner-upload" className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        {bannerUploading ? 'Uploading...' : 'Choose File'}
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Tool Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-semibold">2</div>
              <h2 className="text-xl font-semibold text-gray-900">Tool Details</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Description *</label>
                <textarea
                  placeholder="Describe your tool in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Problem Solved *</label>
                <textarea
                  placeholder="What primary problem does your tool solve?"
                  value={formData.problem_solved}
                  onChange={(e) => setFormData(prev => ({ ...prev, problem_solved: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.problem_solved && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.problem_solved}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Best For *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {BEST_FOR_OPTIONS.map(option => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.best_for.includes(option)}
                        onChange={() => toggleArrayValue('best_for', option)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.best_for && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.best_for}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Display Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-semibold">3</div>
              <h2 className="text-xl font-semibold text-gray-900">Display Information</h2>
            </div>

            <div className="space-y-6">
              {/* Core Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Core Features (3-5) *</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Feature ${index + 1}`}
                      value={feature}
                      onChange={(e) => updateArrayItem('features', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {formData.features.length > 1 && (
                      <button type="button" onClick={() => removeArrayItem('features', index)} className="p-2 text-red-600 hover:text-red-800">
                        <Minus className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {formData.features.length < 5 && (
                  <button type="button" onClick={() => addArrayItem('features')} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <Plus className="h-4 w-4" />Add Core Feature
                  </button>
                )}
                {errors.features && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.features}</p>}
              </div>

              {/* Pros and Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pros</label>
                  {formData.pros.map((pro, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder={`Pro ${index + 1}`}
                        value={pro}
                        onChange={(e) => updateArrayItem('pros', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.pros.length > 1 && (
                        <button type="button" onClick={() => removeArrayItem('pros', index)} className="p-2 text-red-600 hover:text-red-800">
                          <Minus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('pros')} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <Plus className="h-4 w-4" />Add Pros
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cons</label>
                  {formData.cons.map((con, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder={`Con ${index + 1}`}
                        value={con}
                        onChange={(e) => updateArrayItem('cons', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.cons.length > 1 && (
                        <button type="button" onClick={() => removeArrayItem('cons', index)} className="p-2 text-red-600 hover:text-red-800">
                          <Minus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => addArrayItem('cons')} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                    <Plus className="h-4 w-4" />Add Cons
                  </button>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Model *</label>
                  <select
                    value={formData.pricing_model}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricing_model: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select pricing model</option>
                    {PRICING_MODELS.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                  {errors.pricing_model && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.pricing_model}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Starting Price (Optional)</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value as any }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {CURRENCIES.map(currency => (
                        <option key={currency.value} value={currency.value}>{currency.label}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.starting_price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, starting_price: e.target.value ? parseFloat(e.target.value) : undefined }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Region & Support */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-semibold">4</div>
              <h2 className="text-xl font-semibold text-gray-900">Region & Support</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Where Does This Tool Operate? *</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {REGIONS.map(region => (
                    <label key={region} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.regions.includes(region)}
                        onChange={() => toggleArrayValue('regions', region)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{region}</span>
                    </label>
                  ))}
                </div>
                {errors.regions && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.regions}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platforms Supported</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PLATFORMS.map(platform => (
                    <label key={platform} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.platforms_supported.includes(platform)}
                        onChange={() => toggleArrayValue('platforms_supported', platform)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Affiliate Link</label>
                <input
                  type="url"
                  placeholder="https://example.com/affiliate-link"
                  value={formData.affiliate_link}
                  onChange={(e) => setFormData(prev => ({ ...prev, affiliate_link: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Publish immediately</span>
                </label>
              </div>

              <div className="flex space-x-4">
                <button type="button" onClick={() => router.push('/admin/tools')} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {isSubmitting ? 'Creating...' : 'Create Tool'}
                </button>
              </div>
            </div>
            {errors.submit && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" />{errors.submit}</p>}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
