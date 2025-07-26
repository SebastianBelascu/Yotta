'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Edit, Plus, Search, Filter, ToggleLeft, ToggleRight } from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';
import { Breadcrumb } from '@/components/admin/Breadcrumb';

interface FooterItem {
  id: number;
  section: string;
  title: string;
  content: string;
  link_url: string;
  icon_name: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function FooterAdminPage() {
  const [footerItems, setFooterItems] = useState<FooterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const sections = [
    { value: 'company_info', label: 'Company Info' },
    { value: 'quick_links', label: 'Quick Links' },
    { value: 'categories', label: 'Categories' },
    { value: 'social_media', label: 'Social Media' },
    { value: 'legal_links', label: 'Legal Links' }
  ];

  useEffect(() => {
    fetchFooterItems();
  }, []);

  const fetchFooterItems = async () => {
    try {
      const response = await fetch('/api/footer');
      if (response.ok) {
        const data = await response.json();
        setFooterItems(data);
      }
    } catch (error) {
      console.error('Error fetching footer items:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/footer/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_active: !currentStatus,
        }),
      });

      if (response.ok) {
        setFooterItems(items =>
          items.map(item =>
            item.id === id ? { ...item, is_active: !currentStatus } : item
          )
        );
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this footer item?')) return;

    try {
      const response = await fetch(`/api/footer/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFooterItems(items => items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredItems = footerItems.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = !sectionFilter || item.section === sectionFilter;
    const matchesStatus = !statusFilter || 
                         (statusFilter === 'active' && item.is_active) ||
                         (statusFilter === 'inactive' && !item.is_active);
    
    return matchesSearch && matchesSection && matchesStatus;
  });

  const getStats = () => {
    const total = footerItems.length;
    const active = footerItems.filter(item => item.is_active).length;
    const inactive = total - active;
    
    return { total, active, inactive };
  };

  const stats = getStats();

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
            <h1 className="text-2xl font-bold">Footer Management</h1>
            <p className="text-gray-400 mt-1">Manage footer links, social media, and company information</p>
          </div>
          <Link
            href="/admin/footer/new"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Footer Item
          </Link>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <Breadcrumb items={[{ label: 'Footer Management' }]} />
          
          {/* Tabs and Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 mt-4">
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 w-full sm:w-auto overflow-x-auto">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${!sectionFilter ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                onClick={() => setSectionFilter('')}
              >
                All Sections
              </button>
              {sections.map(section => (
                <button 
                  key={section.value}
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap ${sectionFilter === section.value ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                  onClick={() => setSectionFilter(section.value)}
                >
                  {section.label}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search footer items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex mb-6 space-x-1 bg-gray-800 rounded-lg p-1 w-fit">
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === '' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
              onClick={() => setStatusFilter('')}
            >
              All Status
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === 'active' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
              onClick={() => setStatusFilter('active')}
            >
              Active
            </button>
            <button 
              className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === 'inactive' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
              onClick={() => setStatusFilter('inactive')}
            >
              Inactive
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Total</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Active</div>
              <div className="text-2xl font-bold text-green-400">{stats.active}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Inactive</div>
              <div className="text-2xl font-bold text-red-400">{stats.inactive}</div>
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
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                            {sections.find(s => s.value === item.section)?.label || item.section}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.is_active
                              ? 'bg-green-900 text-green-200'
                              : 'bg-red-900 text-red-200'
                          }`}>
                            {item.is_active ? (
                              <>
                                <ToggleRight className="mr-1 h-3 w-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="mr-1 h-3 w-3" />
                                Inactive
                              </>
                            )}
                          </span>
                          {item.display_order > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                              Order: {item.display_order}
                            </span>
                          )}
                          {item.icon_name && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-200">
                              Icon: {item.icon_name}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-medium text-white">{item.title}</h3>
                        <div className="text-sm text-gray-400 mt-1">
                          {item.link_url ? (
                            <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                              {item.link_url}
                            </a>
                          ) : (
                            <p className="line-clamp-2">{item.content}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => toggleStatus(item.id, item.is_active)}
                          className={`p-2 rounded-lg ${item.is_active ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-green-900/30 text-green-400'}`}
                          title={item.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {item.is_active ? <ToggleLeft className="h-5 w-5" /> : <ToggleRight className="h-5 w-5" />}
                        </button>
                        <Link
                          href={`/admin/footer/edit/${item.id}`}
                          className="p-2 rounded-lg hover:bg-blue-900/30 text-blue-400"
                        >
                          <Edit className="h-5 w-5" />
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
                <p className="text-gray-400 mb-4">No footer items found</p>
                <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
                <Link
                  href="/admin/footer/new"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  Add First Footer Item
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
