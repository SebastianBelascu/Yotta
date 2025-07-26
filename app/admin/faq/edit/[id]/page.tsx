'use client';

import React, { useState, useEffect, use } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_published: boolean;
}

export default function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    display_order: 0,
    is_published: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchFaqData();
  }, [resolvedParams.id]);

  const fetchFaqData = async () => {
    try {
      const response = await fetch(`/api/faq/${resolvedParams.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          question: data.question,
          answer: data.answer,
          category: data.category,
          display_order: data.display_order,
          is_published: data.is_published
        });
      } else {
        console.error('Failed to fetch FAQ data');
        alert('Error fetching FAQ data. Please try again.');
        router.push('/admin/faq');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again.');
      router.push('/admin/faq');
    } finally {
      setLoading(false);
    }
  };

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
    
    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    }
    
    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
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
      const response = await fetch(`/api/faq/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        router.push('/admin/faq');
      } else {
        const errorData = await response.json();
        alert(`Error updating FAQ: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
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

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/admin/faq')}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Edit FAQ</h1>
                  <p className="text-sm text-gray-500 truncate max-w-md">{formData.question}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/admin/faq')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* FAQ Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">FAQ Content</h2>
                <p className="text-sm text-gray-500 mt-1">Edit the question and answer for this FAQ item</p>
              </div>
              <div className="px-6 py-6 space-y-6">
                {/* Question */}
                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                    Question <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    className={`block w-full px-4 py-3 text-base border ${
                      errors.question ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                    placeholder="Enter your FAQ question here..."
                  />
                  {errors.question && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.question}
                    </p>
                  )}
                </div>

                {/* Answer */}
                <div>
                  <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                    Answer <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="answer"
                    name="answer"
                    rows={6}
                    value={formData.answer}
                    onChange={handleInputChange}
                    className={`block w-full px-4 py-3 text-base border ${
                      errors.answer ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors resize-none`}
                    placeholder="Provide a detailed and helpful answer to the question..."
                  />
                  {errors.answer && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                      {errors.answer}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Settings Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">FAQ Settings</h2>
                <p className="text-sm text-gray-500 mt-1">Configure the category, order, and visibility settings</p>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="general">General</option>
                      <option value="providers">Providers</option>
                    </select>
                  </div>

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
                      className={`block w-full px-4 py-3 text-base border ${
                        errors.display_order ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors`}
                      placeholder="0"
                    />
                    {errors.display_order && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
                        {errors.display_order}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Lower numbers appear first. Use 0 for default ordering.
                    </p>
                  </div>

                  {/* Published Status */}
                  <div className="flex items-start pt-2">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        id="is_published"
                        name="is_published"
                        checked={formData.is_published}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="is_published" className="text-sm font-medium text-gray-700">
                        Publish FAQ
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Make this FAQ visible to users
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Save Button */}
            <div className="sm:hidden">
              <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
