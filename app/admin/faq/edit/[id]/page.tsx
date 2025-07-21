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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => router.push('/admin/faq')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit FAQ</h1>
              <p className="text-gray-600">{formData.question}</p>
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
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question */}
            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="question"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.question ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="e.g. How does Yotta work?"
              />
              {errors.question && <p className="mt-1 text-sm text-red-500">{errors.question}</p>}
            </div>

            {/* Answer */}
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-1">
                Answer <span className="text-red-500">*</span>
              </label>
              <textarea
                id="answer"
                name="answer"
                rows={4}
                value={formData.answer}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${
                  errors.answer ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Provide a detailed answer to the question..."
              />
              {errors.answer && <p className="mt-1 text-sm text-red-500">{errors.answer}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <option value="general">General</option>
                  <option value="providers">Providers</option>
                </select>
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
                  Publish this FAQ
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
