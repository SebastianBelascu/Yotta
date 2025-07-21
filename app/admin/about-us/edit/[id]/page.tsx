'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';

const sectionOptions = [
  { value: 'main', label: 'Main/Hero' },
  { value: 'intro', label: 'Introduction' },
  { value: 'features', label: 'Features' },
  { value: 'values', label: 'Values' },
  { value: 'stats', label: 'Statistics' }
];

const iconOptions = [
  { value: '', label: 'No Icon' },
  { value: 'zap', label: 'Zap (Lightning)' },
  { value: 'shield-check', label: 'Shield Check' },
  { value: 'filter', label: 'Filter' },
  { value: 'trending-up', label: 'Trending Up' },
  { value: 'users', label: 'Users' },
  { value: 'heart', label: 'Heart' },
  { value: 'eye', label: 'Eye' },
  { value: 'check-circle', label: 'Check Circle' },
  { value: 'clock', label: 'Clock' },
  { value: 'search', label: 'Search' }
];

export default function EditAboutUsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: '',
    section: 'main',
    display_order: 0,
    is_published: true
  });

  useEffect(() => {
    fetchItemData();
  }, [resolvedParams.id]);

  const fetchItemData = async () => {
    try {
      const response = await fetch(`/api/about-us/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          title: data.title,
          description: data.description,
          icon_name: data.icon_name || '',
          section: data.section,
          display_order: data.display_order,
          is_published: data.is_published
        });
      } else {
        setErrors({ fetch: 'Failed to load item data' });
      }
    } catch (error) {
      setErrors({ fetch: 'Network error while loading data' });
    } finally {
      setFetchLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.section) {
      newErrors.section = 'Section is required';
    }

    if (formData.display_order < 0) {
      newErrors.display_order = 'Display order must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/about-us/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          icon_name: formData.icon_name || null
        }),
      });

      if (response.ok) {
        router.push('/admin/about-us');
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.error || 'Failed to update item' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseInt(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">{errors.fetch}</div>
          <Link
            href="/admin/about-us"
            className="text-blue-600 hover:text-blue-800"
          >
            Back to About Us
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/admin/about-us"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to About Us
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit About Us Item</h1>
          <p className="text-gray-600 mt-2">Update the content item for your About Us page</p>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-sm text-red-600">{errors.submit}</div>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full rounded-md shadow-sm ${
                  errors.title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Enter item title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full rounded-md shadow-sm ${
                  errors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Enter item description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Section and Icon Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section */}
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
                  Section *
                </label>
                <select
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className={`w-full rounded-md shadow-sm ${
                    errors.section ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                >
                  {sectionOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.section && <p className="mt-1 text-sm text-red-600">{errors.section}</p>}
              </div>

              {/* Icon */}
              <div>
                <label htmlFor="icon_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <select
                  id="icon_name"
                  name="icon_name"
                  value={formData.icon_name}
                  onChange={handleInputChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Display Order and Published Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display Order */}
              <div>
                <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  id="display_order"
                  name="display_order"
                  min="0"
                  value={formData.display_order}
                  onChange={handleInputChange}
                  className={`w-full rounded-md shadow-sm ${
                    errors.display_order ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="0"
                />
                {errors.display_order && <p className="mt-1 text-sm text-red-600">{errors.display_order}</p>}
                <p className="mt-1 text-sm text-gray-500">Lower numbers appear first</p>
              </div>

              {/* Published */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                    Published
                  </label>
                </div>
                <p className="mt-1 text-sm text-gray-500">Uncheck to save as draft</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Link
                href="/admin/about-us"
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Item
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
