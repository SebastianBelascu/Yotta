'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { useRouter } from 'next/navigation';
import { Search, Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function FaqAdminPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    general: 0,
    providers: 0
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  useEffect(() => {
    filterFaqs();
  }, [faqs, searchTerm, filterCategory, filterStatus]);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/faq');
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
        
        // Calculate stats
        const total = data.length;
        const published = data.filter((faq: FaqItem) => faq.is_published).length;
        const general = data.filter((faq: FaqItem) => faq.category === 'general').length;
        const providers = data.filter((faq: FaqItem) => faq.category === 'providers').length;
        
        setStats({
          total,
          published,
          draft: total - published,
          general,
          providers
        });
      } else {
        console.error('Failed to fetch FAQs');
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterFaqs = () => {
    let filtered = faqs;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === filterCategory);
    }
    
    // Apply status filter
    if (filterStatus === 'published') {
      filtered = filtered.filter(faq => faq.is_published);
    } else if (filterStatus === 'draft') {
      filtered = filtered.filter(faq => !faq.is_published);
    }
    
    setFilteredFaqs(filtered);
  };

  const handleTogglePublish = async (faq: FaqItem) => {
    try {
      const response = await fetch(`/api/faq/${faq.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...faq,
          is_published: !faq.is_published
        }),
      });

      if (response.ok) {
        // Update local state
        setFaqs(prevFaqs =>
          prevFaqs.map(f =>
            f.id === faq.id ? { ...f, is_published: !f.is_published } : f
          )
        );
      } else {
        console.error('Failed to update FAQ status');
      }
    } catch (error) {
      console.error('Error updating FAQ status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/faq/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFaqs(prevFaqs => prevFaqs.filter(f => f.id !== id));
      } else {
        console.error('Failed to delete FAQ');
      }
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
      <div className="min-h-screen bg-gray-900 text-white">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-6 border-b border-gray-800">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold">Manage FAQs</h1>
          </div>
          <button
            onClick={() => router.push('/admin/faq/new')}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add FAQ
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {/* Tabs and Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 w-full sm:w-auto">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${filterCategory === 'all' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                onClick={() => setFilterCategory('all')}
              >
                All
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${filterCategory === 'general' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                onClick={() => setFilterCategory('general')}
              >
                Brand FAQs
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${filterCategory === 'providers' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                onClick={() => setFilterCategory('providers')}
              >
                Partner FAQs
              </button>
            </div>

            <div className="relative w-full lg:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Total</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Published</div>
              <div className="text-2xl font-bold text-green-400">{stats.published}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Drafts</div>
              <div className="text-2xl font-bold text-yellow-400">{stats.draft}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">General</div>
              <div className="text-2xl font-bold text-blue-400">{stats.general}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Providers</div>
              <div className="text-2xl font-bold text-purple-400">{stats.providers}</div>
            </div>
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div key={faq.id} className="bg-gray-800 rounded-xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            faq.category === 'general' 
                              ? 'bg-blue-900 text-blue-200'
                              : 'bg-purple-900 text-purple-200'
                          }`}>
                            {faq.category === 'general' ? 'Brand FAQ' : 'Partner FAQ'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            faq.is_published
                              ? 'bg-green-900 text-green-200'
                              : 'bg-yellow-900 text-yellow-200'
                          }`}>
                            {faq.is_published ? (
                              <>
                                <Eye className="mr-1 h-3 w-3" />
                                Published
                              </>
                            ) : (
                              <>
                                <EyeOff className="mr-1 h-3 w-3" />
                                Draft
                              </>
                            )}
                          </span>
                          {faq.display_order > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                              Order: {faq.display_order}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {faq.answer}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleTogglePublish(faq)}
                          className={`p-2 rounded-lg ${faq.is_published ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-green-900/30 text-green-400'}`}
                          title={faq.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {faq.is_published ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => router.push(`/admin/faq/edit/${faq.id}`)}
                          className="p-2 rounded-lg hover:bg-blue-900/30 text-blue-400"
                          title="Edit FAQ"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="p-2 rounded-lg hover:bg-red-900/30 text-red-400"
                          title="Delete FAQ"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                      <span>Updated {formatDate(faq.updated_at)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400">
                  No FAQs found. {searchTerm && 'Try a different search term.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
