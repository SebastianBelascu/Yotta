'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { Breadcrumb } from '@/components/admin/Breadcrumb';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { Plus, Search, Eye, Edit, Trash2, MoreHorizontal, Filter } from 'lucide-react';

// Utility function to convert name to slug
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface Service {
  id: string;
  name: string;
  tagline: string;
  main_categories: string[];
  sub_categories: string[];
  type_of_service: string;
  price_from: number;
  currency: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setServices(services.filter(service => service.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service');
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('services')
        .update({ published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      setServices(services.map(service => 
        service.id === id ? { ...service, published: !currentStatus } : service
      ));
    } catch (error) {
      console.error('Error updating service status:', error);
      alert('Failed to update service status');
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.tagline?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && service.published) ||
                         (statusFilter === 'draft' && !service.published);
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
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
            <h1 className="text-2xl font-bold">Services</h1>
            <p className="text-gray-400 mt-1">Manage your service offerings</p>
          </div>
          <Link
            href="/admin/services/new"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            New Service
          </Link>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <Breadcrumb items={[{ label: 'Services Management' }]} />
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 mt-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Total</div>
              <div className="text-2xl font-bold">{services.length}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Published</div>
              <div className="text-2xl font-bold text-green-400">{services.filter(s => s.published).length}</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="text-sm text-gray-400">Drafts</div>
              <div className="text-2xl font-bold text-yellow-400">{services.filter(s => !s.published).length}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 w-full sm:w-auto">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === 'all' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                onClick={() => setStatusFilter('all')}
              >
                All Services
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === 'published' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                onClick={() => setStatusFilter('published')}
              >
                Published
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${statusFilter === 'draft' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                onClick={() => setStatusFilter('draft')}
              >
                Drafts
              </button>
            </div>

            <div className="relative w-full lg:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>

          {/* Services List */}
          <div className="space-y-4">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <div key={service.id} className="bg-gray-800 rounded-xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            service.published
                              ? 'bg-green-900 text-green-200'
                              : 'bg-yellow-900 text-yellow-200'
                          }`}>
                            {service.published ? 'Published' : 'Draft'}
                          </span>
                          
                          {service.type_of_service && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-200">
                              {service.type_of_service}
                            </span>
                          )}
                          
                          {service.price_from && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                              From {service.currency} {service.price_from}
                            </span>
                          )}
                          
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                            {new Date(service.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-medium text-white">{service.name}</h3>
                        {service.tagline && (
                          <p className="text-sm text-gray-400 mt-1">{service.tagline}</p>
                        )}
                        
                        {(service.main_categories?.length > 0 || service.sub_categories?.length > 0) && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {service.main_categories?.map((category, index) => (
                              <span
                                key={`main-${index}`}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
                              >
                                {category}
                              </span>
                            ))}
                            
                            {service.sub_categories?.map((category, index) => (
                              <span
                                key={`sub-${index}`}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-200"
                              >
                                {category}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Link
                          href={`/services/${nameToSlug(service.name)}`}
                          className="p-2 rounded-lg hover:bg-blue-900/30 text-blue-400"
                          title="View Public Page"
                        >
                          <Eye className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => togglePublished(service.id, service.published)}
                          className={`p-2 rounded-lg ${service.published ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-green-900/30 text-green-400'}`}
                          title={service.published ? 'Unpublish' : 'Publish'}
                        >
                          {service.published ? <Eye className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        <Link
                          href={`/admin/services/edit/${service.id}`}
                          className="p-2 rounded-lg hover:bg-blue-900/30 text-blue-400"
                          title="Edit Service"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-2 rounded-lg hover:bg-red-900/30 text-red-400"
                          title="Delete Service"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                      <span>Updated {new Date(service.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">No services found</p>
                <Link
                  href="/admin/services/new"
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  Create First Service
                </Link>
              </div>
            )}
          </div>


        
          {/* Category Management Section is hidden as it's not fully functional yet */}
        </div>
      </div>
    </AdminLayout>
  );
}
