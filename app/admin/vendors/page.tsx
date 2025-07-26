'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { Plus, Edit, Trash2, Search, Users, Home, Building } from 'lucide-react';
import Link from 'next/link';

interface Vendor {
  id: string;
  name: string;
  email: string;
  created_at: string;
  services_count?: number;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [totalServices, setTotalServices] = useState(0);

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    const filtered = vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVendors(filtered);
  }, [vendors, searchTerm]);

  const fetchVendors = async () => {
    try {
      // Fetch vendors
      const vendorsResponse = await fetch('/api/vendors');
      if (!vendorsResponse.ok) {
        throw new Error('Failed to fetch vendors');
      }
      const vendorsData = await vendorsResponse.json();
      
      // Fetch services to count per vendor
      const servicesResponse = await fetch('/api/services');
      let servicesData = [];
      if (servicesResponse.ok) {
        servicesData = await servicesResponse.json();
        setTotalServices(servicesData.length);
      }
      
      // Count services per vendor
      const vendorsWithCounts = vendorsData.map((vendor: Vendor) => {
        const serviceCount = servicesData.filter((service: any) => service.vendor_id === vendor.id).length;
        return { ...vendor, services_count: serviceCount };
      });
      
      setVendors(vendorsWithCounts);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/vendors/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVendors(vendors.filter(vendor => vendor.id !== id));
      } else {
        alert('Failed to delete vendor');
      }
    } catch (error) {
      console.error('Error deleting vendor:', error);
      alert('Failed to delete vendor');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      <div className="space-y-6 bg-gray-900 p-6 min-h-screen text-white">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-400 mb-6">
          <Link href="/admin" className="hover:text-white transition-colors">
            Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">Vendors Directory</span>
        </div>
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Vendors Directory</h1>
            <p className="text-gray-400">Manage your service vendors</p>
          </div>
          <Link
            href="/admin/vendors/new"
            className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400 flex items-center gap-2 font-medium"
          >
            <Plus className="h-4 w-4" />
            Add New Vendor
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Vendors</p>
                <p className="text-2xl font-bold text-white">{vendors.length}</p>
              </div>
              <div className="p-3 bg-gray-700 rounded-full">
                <Users className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Vendors</p>
                <p className="text-2xl font-bold text-green-400">{vendors.length}</p>
              </div>
              <div className="p-3 bg-gray-700 rounded-full">
                <Building className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Services Listed</p>
                <p className="text-2xl font-bold text-yellow-400">{totalServices}</p>
              </div>
              <div className="p-3 bg-gray-700 rounded-full">
                <Users className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search vendors by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Vendors List */}
        <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">All Vendors</h2>
          </div>
          
          {filteredVendors.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-16 w-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No vendors found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm ? 'No vendors match your search criteria.' : 'Get started by adding your first vendor.'}
              </p>
              <Link
                href="/admin/vendors/new"
                className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400 inline-flex items-center gap-2 font-medium"
              >
                <Plus className="h-4 w-4" />
                Add New Vendor
              </Link>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 gap-6">
              {filteredVendors.map((vendor) => (
                <div key={vendor.id} className="bg-gray-700 rounded-lg p-5 hover:bg-gray-650 transition-colors border border-gray-600">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium bg-green-900/30 text-green-400 border border-green-700">
                          Active
                        </span>
                        <span className="text-sm text-gray-400">
                          Added {formatDate(vendor.created_at)}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-white mb-2">{vendor.name}</h3>
                      <div className="text-sm text-gray-300">
                        {vendor.email}
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <div className="text-xs px-3 py-1 rounded-md bg-gray-600 text-gray-300">
                          <span className="font-medium text-yellow-400">{vendor.services_count || 0}</span> services
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:self-start">
                      <Link
                        href={`/admin/vendors/edit/${vendor.id}`}
                        className="p-2 text-gray-300 hover:text-white bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(vendor.id, vendor.name)}
                        className="p-2 text-gray-300 hover:text-white bg-gray-600 hover:bg-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
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
