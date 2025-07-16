'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { 
  BarChart3, 
  Users, 
  ListChecks, 
  DollarSign,
  Search,
  Filter,
  Upload,
  Plus
} from 'lucide-react';

export default function AdminDashboard() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  
  // Mock data for the dashboard
  const dashboardStats = [
    {
      title: 'Total Listings',
      value: '247',
      change: '+15% from last month',
      icon: <ListChecks className="h-6 w-6 text-blue-500" />,
    },
    {
      title: 'Active Providers',
      value: '89',
      change: '+7% from last month',
      icon: <Users className="h-6 w-6 text-green-500" />,
    },
    {
      title: 'Pending Payments',
      value: '23',
      change: 'Requires attention',
      icon: <DollarSign className="h-6 w-6 text-orange-500" />,
    },
    {
      title: 'Monthly Revenue',
      value: '$15,420',
      change: '+8% from last month',
      icon: <BarChart3 className="h-6 w-6 text-purple-500" />,
    }
  ];

  // Mock data for listings
  const listings = [
    {
      id: 1,
      name: 'CloudSync Pro',
      category: 'SaaS',
      type: 'AI/SaaS',
      price: '$99',
      provider: 'admin@cloudsync.com',
      billing: 'billing@cloudsync.com',
      frequency: 'Monthly',
      status: 'Active'
    },
    {
      id: 2,
      name: 'AI Content Generator',
      category: 'AI/ML',
      type: 'AI/SaaS',
      price: '$75',
      provider: 'contact@aicontentgen.com',
      billing: 'finance@aicontentgen.com',
      frequency: 'Weekly',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Legal Consulting Services',
      category: 'Professional Services',
      type: 'Service',
      price: '$75',
      provider: 'info@legalconsult.com',
      billing: 'accounts@legalconsult.com',
      frequency: 'Daily',
      status: 'Pending'
    },
    {
      id: 4,
      name: 'Marketing Automation Suite',
      category: 'Marketing',
      type: 'Service',
      price: '$120',
      provider: 'sales@marketauto.com',
      billing: 'billing@marketauto.com',
      frequency: 'Weekly',
      status: 'Active'
    }
  ];

  const toggleRowSelection = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Listings</h1>
          <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            System: Active
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">Manage listings, leads, and billing</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dashboardStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Listing Management Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Listing Management</h2>
            <p className="text-sm text-gray-500">Manage service listings and AI/SaaS tools. Published listings go live on the site immediately.</p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search listings..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <button className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md w-full md:w-44 bg-white">
                  <span>All Categories</span>
                  <Filter className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              
              <div className="relative flex-grow md:flex-grow-0">
                <button className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md w-full md:w-32 bg-white">
                  <span>All Types</span>
                  <Filter className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              
              <button className="bg-blue-900 text-white px-3 py-2 rounded-md flex items-center">
                <Upload className="h-4 w-4 mr-1" />
                <span>CSV Upload</span>
              </button>
              
              <button className="bg-blue-500 text-white px-3 py-2 rounded-md flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                <span>Add Listing</span>
              </button>
            </div>
          </div>
          
          {/* Listings Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onChange={() => {
                        if (selectedRows.length === listings.length) {
                          setSelectedRows([]);
                        } else {
                          setSelectedRows(listings.map(listing => listing.id));
                        }
                      }}
                      checked={selectedRows.length === listings.length && listings.length > 0}
                    />
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Service/Tool Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Lead Price/Commission</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Provider</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Billing Contact</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Frequency</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedRows.includes(listing.id)}
                        onChange={() => toggleRowSelection(listing.id)}
                      />
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{listing.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{listing.category}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{listing.type}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{listing.price}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{listing.provider}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{listing.billing}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{listing.frequency}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        listing.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 flex space-x-2">
                      <button className="text-gray-400 hover:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing 1-4 of 4 listings
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-blue-500 text-white">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
