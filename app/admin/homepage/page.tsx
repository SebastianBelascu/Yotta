'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout';
import { Breadcrumb } from '@/components/admin/Breadcrumb';

type HomepageItem = {
  id: string;
  title: string;
  content: string;
  section: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

const SECTIONS = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'features', label: 'Features' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'cta', label: 'Call to Action' },
  { value: 'stats', label: 'Statistics' },
  { value: 'about', label: 'About Preview' }
];

export default function HomepageAdminPage() {
  const [items, setItems] = useState<HomepageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [publishedFilter, setPublishedFilter] = useState('all');

  useEffect(() => {
    fetchItems();
  }, [selectedSection, publishedFilter]);

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedSection !== 'all') params.append('section', selectedSection);
      if (publishedFilter !== 'all') params.append('published', publishedFilter);

      const response = await fetch(`/api/homepage?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error('Failed to fetch homepage items');
      }
    } catch (error) {
      console.error('Error fetching homepage items:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/homepage/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_published: !currentStatus }),
      });

      if (response.ok) {
        fetchItems();
      } else {
        console.error('Failed to update item status');
      }
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/homepage/${id}`, {
        method: 'DELETE',
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

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: items.length,
    published: items.filter(item => item.is_published).length,
    drafts: items.filter(item => !item.is_published).length,
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64 bg-gray-900">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto bg-gray-900 min-h-screen text-white -m-6">
        {/* Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: 'Homepage Management' }
          ]}
        />
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Homepage Management</h1>
            <p className="text-gray-400 mt-2">Manage homepage sections and content</p>
          </div>
          <Link
            href="/admin/homepage/new"
            className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus size={20} />
            Add New Section
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Items</p>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="p-3 bg-gray-700 rounded-full">
              <Filter className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Published</p>
              <p className="text-3xl font-bold text-green-400">{stats.published}</p>
            </div>
            <div className="p-3 bg-gray-700 rounded-full">
              <Eye className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Drafts</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.drafts}</p>
            </div>
            <div className="p-3 bg-gray-700 rounded-full">
              <EyeOff className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

        {/* Filters */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
            >
              <option value="all">All Sections</option>
              {SECTIONS.map(section => (
                <option key={section.value} value={section.value}>
                  {section.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={publishedFilter}
              onChange={(e) => setPublishedFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
            >
              <option value="all">All Status</option>
              <option value="true">Published</option>
              <option value="false">Draft</option>
            </select>
          </div>
        </div>
      </div>

        {/* Items List */}
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Homepage Content Items</h2>
        </div>
        
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="flex flex-col items-center">
              <Filter className="h-16 w-16 text-gray-500 mb-4" />
              <p className="text-xl font-medium text-white mb-2">No items found</p>
              <p className="text-gray-400 mb-6">Try adjusting your filters or create a new item</p>
              <Link
                href="/admin/homepage/new"
                className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus size={18} />
                Add New Section
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-gray-700 rounded-lg p-5 hover:bg-gray-650 transition-colors border border-gray-600">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-600 text-yellow-400">
                        {SECTIONS.find(s => s.value === item.section)?.label || item.section}
                      </span>
                      <span className="text-sm text-gray-400">
                        Order: {item.display_order}
                      </span>
                      <button
                        onClick={() => togglePublished(item.id, item.is_published)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                          item.is_published
                            ? 'bg-green-900/30 text-green-400 border border-green-700'
                            : 'bg-gray-800 text-gray-400 border border-gray-600'
                        }`}
                      >
                        {item.is_published ? (
                          <>
                            <Eye size={12} className="mr-1" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff size={12} className="mr-1" />
                            Draft
                          </>
                        )}
                      </button>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">{item.title}</h3>
                    <div className="text-sm text-gray-300 line-clamp-2">
                      {item.content ? item.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 'No content'}
                    </div>
                    <div className="text-xs text-gray-400 mt-3">
                      Updated {new Date(item.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:self-start">
                    <Link
                      href={`/admin/homepage/edit/${item.id}`}
                      className="p-2 text-gray-300 hover:text-white bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </Link>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-gray-300 hover:text-white bg-gray-600 hover:bg-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </AdminLayout>
  );
}
