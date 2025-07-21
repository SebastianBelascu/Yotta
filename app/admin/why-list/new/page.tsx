'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

const iconOptions = [
  { value: 'users', label: 'Users' },
  { value: 'shield-check', label: 'Shield Check' },
  { value: 'clipboard-list', label: 'Clipboard List' },
  { value: 'megaphone', label: 'Megaphone' },
  { value: 'bar-chart', label: 'Bar Chart' },
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'star', label: 'Star' },
  { value: 'message-circle', label: 'Message Circle' },
  { value: 'smartphone', label: 'Smartphone' },
  { value: 'search', label: 'Search' },
  { value: 'trending-up', label: 'Trending Up' },
  { value: 'heart', label: 'Heart' },
  { value: 'clock', label: 'Clock' },
  { value: 'zap', label: 'Zap' }
];

export default function NewWhyListPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: '',
    category: 'benefit',
    display_order: 0,
    is_published: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    // Handle number inputs
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
      return;
    }
    
    // Handle text inputs
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.display_order < 0) {
      newErrors.display_order = 'Display order must be 0 or greater';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      const response = await fetch('/api/why-list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          icon_name: formData.icon_name || null
        }),
      });
      
      if (response.ok) {
        router.push('/admin/why-list');
      } else {
        const errorData = await response.json();
        alert(`Error creating item: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/admin/why-list')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Item</h1>
              <p className="text-gray-600">Create a new benefit, feature, or statistic</p>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-blue-400"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Item
              </>
            )}
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="e.g. Reach More Customers"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Provide a detailed description of this benefit, feature, or statistic..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="benefit">Benefit</option>
                  <option value="feature">Feature</option>
                  <option value="stat">Statistic</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Benefits: Why providers should join<br/>
                  Features: Platform capabilities<br/>
                  Stats: Numbers and metrics
                </p>
              </div>

              {/* Icon */}
              <div>
                <label htmlFor="icon_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <select
                  id="icon_name"
                  name="icon_name"
                  value={formData.icon_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">No Icon</option>
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Choose an icon to display with this item
                </p>
              </div>

              {/* Display Order */}
              <div>
                <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  id="display_order"
                  name="display_order"
                  min="0"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.display_order ? 'border-red-500' : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  placeholder="0"
                />
                {errors.display_order && <p className="mt-1 text-sm text-red-500">{errors.display_order}</p>}
                <p className="mt-1 text-xs text-gray-500">
                  Lower numbers appear first. Use 0 for default ordering.
                </p>
              </div>

              {/* Published Status */}
              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="is_published"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                  Publish this item
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
