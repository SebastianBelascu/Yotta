'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { useRouter } from 'next/navigation';
import { Search, Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

interface WhyListItem {
  id: string;
  title: string;
  description: string;
  icon_name: string | null;
  category: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function WhyListAdminPage() {
  const router = useRouter();
  const [items, setItems] = useState<WhyListItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<WhyListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    benefits: 0,
    features: 0,
    stats: 0
  });

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchTerm, filterCategory, filterStatus]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/why-list');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
        
        // Calculate stats
        const total = data.length;
        const published = data.filter((item: WhyListItem) => item.is_published).length;
        const benefits = data.filter((item: WhyListItem) => item.category === 'benefit').length;
        const features = data.filter((item: WhyListItem) => item.category === 'feature').length;
        const statsCount = data.filter((item: WhyListItem) => item.category === 'stat').length;
        
        setStats({
          total,
          published,
          draft: total - published,
          benefits,
          features,
          stats: statsCount
        });
      } else {
        console.error('Failed to fetch Why List items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }
    
    // Apply status filter
    if (filterStatus === 'published') {
      filtered = filtered.filter(item => item.is_published);
    } else if (filterStatus === 'draft') {
      filtered = filtered.filter(item => !item.is_published);
    }
    
    setFilteredItems(filtered);
  };

  const handleTogglePublish = async (item: WhyListItem) => {
    try {
      const response = await fetch(`/api/why-list/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          is_published: !item.is_published
        }),
      });

      if (response.ok) {
        // Update local state
        setItems(prevItems =>
          prevItems.map(i =>
            i.id === item.id ? { ...i, is_published: !i.is_published } : i
          )
        );
      } else {
        console.error('Failed to update item status');
      }
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/why-list/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems(prevItems => prevItems.filter(i => i.id !== id));
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'benefit':
        return 'bg-blue-900 text-blue-200';
      case 'feature':
        return 'bg-purple-900 text-purple-200';
      case 'stat':
        return 'bg-green-900 text-green-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
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
            <h1 className="text-2xl font-bold">Why List With Us</h1>
            <p className="text-gray-400 mt-1">Manage benefits, features, and statistics</p>
          </div>
          <button
            onClick={() => router.push('/admin/why-list/new')}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Item
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
                className={`px-4 py-2 text-sm font-medium rounded-md ${filterCategory === 'benefit' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                onClick={() => setFilterCategory('benefit')}
              >
                Benefits
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${filterCategory === 'feature' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                onClick={() => setFilterCategory('feature')}
              >
                Features
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${filterCategory === 'stat' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                onClick={() => setFilterCategory('stat')}
              >
                Statistics
              </button>
            </div>

            <div className="relative w-full lg:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex mb-6 space-x-1 bg-gray-800 rounded-lg p-1 w-fit">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${filterStatus === 'all' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
              onClick={() => setFilterStatus('all')}
            >
              All Status
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${filterStatus === 'published' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
              onClick={() => setFilterStatus('published')}
            >
              Published
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${filterStatus === 'draft' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
              onClick={() => setFilterStatus('draft')}
            >
              Draft
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
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
              <div className="text-sm text-gray-400">Benefits</div>
              <div className="text-2xl font-bold text-blue-400">{stats.benefits}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Features</div>
              <div className="text-2xl font-bold text-purple-400">{stats.features}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Statistics</div>
              <div className="text-2xl font-bold text-green-400">{stats.stats}</div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div key={item.id} className="bg-gray-800 rounded-xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.category === 'benefit' 
                              ? 'bg-blue-900 text-blue-200'
                              : item.category === 'feature'
                                ? 'bg-purple-900 text-purple-200'
                                : 'bg-green-900 text-green-200'
                          }`}>
                            {item.category === 'benefit' ? 'Benefit' : item.category === 'feature' ? 'Feature' : 'Statistic'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.is_published
                              ? 'bg-green-900 text-green-200'
                              : 'bg-yellow-900 text-yellow-200'
                          }`}>
                            {item.is_published ? (
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
                          {item.display_order > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                              Order: {item.display_order}
                            </span>
                          )}
                          {item.icon_name && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                              Icon: {item.icon_name}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-white">{item.title}</h3>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleTogglePublish(item)}
                          className={`p-2 rounded-lg ${item.is_published ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-green-900/30 text-green-400'}`}
                          title={item.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {item.is_published ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => router.push(`/admin/why-list/edit/${item.id}`)}
                          className="p-2 rounded-lg hover:bg-blue-900/30 text-blue-400"
                          title="Edit Item"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg hover:bg-red-900/30 text-red-400"
                          title="Delete Item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                      <span>Updated {formatDate(item.updated_at)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400">
                  No items found. {searchTerm && 'Try a different search term.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
