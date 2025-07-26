'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout';
import { Breadcrumb } from '@/components/admin/Breadcrumb';
import { 
  Plus, Search, Filter, Edit2, Trash2, Eye, EyeOff, 
  Zap, ShieldCheck, TrendingUp, Users, Heart, CheckCircle, Clock
} from 'lucide-react';

type AboutUsItem = {
  id: string;
  title: string;
  description: string;
  icon_name: string | null;
  section: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

const sectionOptions = [
  { value: 'all', label: 'All Sections' },
  { value: 'main', label: 'Main/Hero' },
  { value: 'intro', label: 'Introduction' },
  { value: 'features', label: 'Features' },
  { value: 'values', label: 'Values' },
  { value: 'stats', label: 'Statistics' }
];

const iconMap = {
  'zap': Zap,
  'shield-check': ShieldCheck,
  'trending-up': TrendingUp,
  'users': Users,
  'heart': Heart,
  'check-circle': CheckCircle,
  'clock': Clock
};

export default function AboutUsAdminPage() {
  const [items, setItems] = useState<AboutUsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [publishedFilter, setPublishedFilter] = useState('all');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams();
      if (sectionFilter !== 'all') params.append('section', sectionFilter);
      if (publishedFilter !== 'all') params.append('published', publishedFilter);
      
      const response = await fetch(`/api/about-us?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error('Failed to fetch About Us items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const item = items.find(i => i.id === id);
      if (!item) return;

      const response = await fetch(`/api/about-us/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          is_published: !currentStatus
        })
      });

      if (response.ok) {
        fetchItems();
      } else {
        console.error('Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/about-us/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchItems();
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = sectionFilter === 'all' || item.section === sectionFilter;
    const matchesPublished = publishedFilter === 'all' || 
                            (publishedFilter === 'true' && item.is_published) ||
                            (publishedFilter === 'false' && !item.is_published);
    
    return matchesSearch && matchesSection && matchesPublished;
  });

  const getIcon = (iconName: string | null) => {
    if (!iconName) return null;
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? <IconComponent className="h-5 w-5 text-gray-200" /> : null;
  };

  const stats = {
    total: items.length,
    published: items.filter(item => item.is_published).length,
    drafts: items.filter(item => !item.is_published).length,
    sections: new Set(items.map(item => item.section)).size
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
            <h1 className="text-2xl font-bold">About Us Management</h1>
            <p className="text-gray-400 mt-1">Manage your About Us page content and sections</p>
          </div>
          <Link
            href="/admin/about-us/new"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Item
          </Link>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <Breadcrumb items={[{ label: 'About Us Management' }]} />
          
          {/* Tabs and Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 mt-4">
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
              {sectionOptions.map(option => (
                <button 
                  key={option.value}
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${sectionFilter === option.value ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                  onClick={() => setSectionFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
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
              className={`px-4 py-2 text-sm font-medium rounded-md ${publishedFilter === 'all' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
              onClick={() => setPublishedFilter('all')}
            >
              All Status
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${publishedFilter === 'true' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
              onClick={() => setPublishedFilter('true')}
            >
              Published
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${publishedFilter === 'false' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
              onClick={() => setPublishedFilter('false')}
            >
              Draft
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
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
              <div className="text-2xl font-bold text-yellow-400">{stats.drafts}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Sections</div>
              <div className="text-2xl font-bold text-blue-400">{stats.sections}</div>
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
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                            {item.section}
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
                        <div className="flex items-center gap-2">
                          {getIcon(item.icon_name) && (
                            <div className="flex-shrink-0 bg-gray-700 p-2 rounded-md">
                              {getIcon(item.icon_name)}
                            </div>
                          )}
                          <h3 className="text-lg font-medium text-white">{item.title}</h3>
                        </div>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => togglePublished(item.id, item.is_published)}
                          className={`p-2 rounded-lg ${item.is_published ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-green-900/30 text-green-400'}`}
                          title={item.is_published ? 'Unpublish' : 'Publish'}
                        >
                          {item.is_published ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        <Link
                          href={`/admin/about-us/edit/${item.id}`}
                          className="p-2 rounded-lg hover:bg-blue-900/30 text-blue-400"
                        >
                          <Edit2 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 rounded-lg hover:bg-red-900/30 text-red-400"
                          title="Delete Item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                      <span>Updated {new Date(item.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">No items found</p>
                <Link
                  href="/admin/about-us/new"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Add First Item
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
