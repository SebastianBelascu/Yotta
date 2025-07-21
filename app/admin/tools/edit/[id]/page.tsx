'use client';

import React, { useState, useEffect, use } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Save, X, AlertCircle, Plus, Minus, Upload } from 'lucide-react';
import { 
  TOOL_CATEGORIES, 
  PRICING_MODELS, 
  PLATFORMS, 
  REGIONS, 
  BEST_FOR_OPTIONS, 
  CURRENCIES,
  Tool,
  UpdateToolData 
} from '@/lib/types/tool';

interface EditToolPageProps {
  params: Promise<{ id: string }>;
}

export default function EditToolPage({ params }: EditToolPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tool, setTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState<UpdateToolData>({
    id: '',
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

  useEffect(() => {
    fetchTool();
  }, [resolvedParams.id]);

  const fetchTool = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (error) {
        console.error('Error fetching tool:', error);
        router.push('/admin/tools');
        return;
      }

      setTool(data);
      setFormData({
        id: data.id,
        name: data.name || '',
        tagline: data.tagline || '',
        categories: data.categories || [''],
        description: data.description || '',
        problem_solved: data.problem_solved || '',
        best_for: data.best_for || [],
        features: data.features || [''],
        pros: data.pros || [''],
        cons: data.cons || [''],
        pricing_model: data.pricing_model || '',
        starting_price: data.starting_price || undefined,
        currency: data.currency || 'USD',
        platforms_supported: data.platforms_supported || [],
        regions: data.regions || [],
        logo_url: data.logo_url || '',
        banner_url: data.banner_url || '',
        affiliate_link: data.affiliate_link || '',
        published: data.published || false,
      });
    } catch (error) {
      console.error('Error:', error);
      router.push('/admin/tools');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Tool name is required';
    if (formData.tagline && formData.tagline.length > 150) newErrors.tagline = 'Tagline must be 150 characters or less';
    if (!formData.categories?.some(cat => cat.trim())) newErrors.categories = 'At least one category is required';
    if (!formData.description?.trim()) newErrors.description = 'Product description is required';
    if (!formData.problem_solved?.trim()) newErrors.problem_solved = 'Main problem solved is required';
    if (!formData.best_for || formData.best_for.length === 0) newErrors.best_for = 'Please select who this tool is best for';
    if (!formData.features?.some(feature => feature.trim())) newErrors.features = 'At least one core feature is required';
    if (formData.features && formData.features.filter(f => f.trim()).length < 3) newErrors.features = 'At least 3 core features are required';
    if (formData.features && formData.features.filter(f => f.trim()).length > 5) newErrors.features = 'Maximum 5 core features allowed';
    if (!formData.pricing_model) newErrors.pricing_model = 'Pricing model is required';
    if (!formData.regions || formData.regions.length === 0) newErrors.regions = 'At least one region must be selected';
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
        categories: formData.categories?.filter(cat => cat.trim()) || [],
        features: formData.features?.filter(feature => feature.trim()) || [],
        pros: formData.pros?.filter(pro => pro.trim()) || [],
        cons: formData.cons?.filter(con => con.trim()) || [],
        starting_price: formData.starting_price || undefined,
      };

      const response = await fetch(`/api/tools/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update tool');
      }

      router.push('/admin/tools');
    } catch (error) {
      console.error('Error updating tool:', error);
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to update tool' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (file: File, type: 'logo' | 'banner') => {
    const setUploading = type === 'logo' ? setLogoUploading : setBannerUploading;
    setUploading(true);

    try {
      await fetch('/api/tools/setup-storage', { method: 'POST' });
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', type);

      const response = await fetch('/api/tools/upload-media', {
        method: 'POST',
        body: formDataUpload,
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

  const addArrayItem = (field: keyof UpdateToolData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[] || []), '']
    }));
  };

  const removeArrayItem = (field: keyof UpdateToolData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: keyof UpdateToolData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).map((item, i) => i === index ? value : item)
    }));
  };

  const toggleArrayValue = (field: keyof UpdateToolData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return { ...prev, [field]: newArray };
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!tool) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Tool not found.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Tool</h1>
            <p className="text-gray-600">Update tool information</p>
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
                value={formData.categories?.[0] || ''}
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
                  <span className="text-sm text-gray-700">Published</span>
                </label>
              </div>

              <div className="flex space-x-4">
                <button type="button" onClick={() => router.push('/admin/tools')} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {isSubmitting ? 'Updating...' : 'Update Tool'}
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
