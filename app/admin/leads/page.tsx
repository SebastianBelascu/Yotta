'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { Eye, Filter, ChevronDown } from 'lucide-react';

interface Lead {
  id: string;
  service_id: string;
  provider_id: string;
  metadata: {
    contact_person: string;
    email: string;
    phone: string;
    company_name?: string;
    service_type?: string;
    message?: string;
    status?: string;
    notes?: string;
  };
  sent: boolean;
  created_at: string;
  services?: {
    id: string;
    name: string;
    main_categories: string[];
  };
  vendors?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDetails, setShowLeadDetails] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    provider: 'All Providers',
    listingType: 'All Types'
  });

  // Fetch leads from API
  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch('/api/leads');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched leads data:', data); // Debug log
          setLeads(Array.isArray(data) ? data : []);
          setError(null);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch leads:', response.status, errorText);
          setError(`Failed to fetch leads: ${response.status}`);
          setLeads([]);
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
        setError('Network error while fetching leads');
        setLeads([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, []);

  // Filter leads based on selected filters
  const filteredLeads = useMemo(() => {
    return leads.filter((lead: Lead) => {
      // Filter by date range
      if (filters.startDate && filters.endDate) {
        const leadDate = new Date(lead.created_at);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // Set to end of day
        
        if (leadDate < startDate || leadDate > endDate) {
          return false;
        }
      } else if (filters.startDate) {
        const leadDate = new Date(lead.created_at);
        const startDate = new Date(filters.startDate);
        if (leadDate < startDate) {
          return false;
        }
      } else if (filters.endDate) {
        const leadDate = new Date(lead.created_at);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999); // Set to end of day
        if (leadDate > endDate) {
          return false;
        }
      }

      // Filter by provider
      if (filters.provider !== 'All Providers' && lead.vendors?.name !== filters.provider) {
        return false;
      }

      // Filter by listing type
      if (filters.listingType !== 'All Types') {
        const isService = lead.services?.main_categories?.includes('service');
        if (filters.listingType === 'Service' && !isService) {
          return false;
        }
        if (filters.listingType === 'Tool' && isService) {
          return false;
        }
      }

      return true;
    });
  }, [leads, filters]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Handle lead details view
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadDetails(true);
  };

  // Get unique providers for filter
  const uniqueProviders = Array.from(new Set(leads.map(lead => lead.vendors?.name).filter(Boolean)));

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-6 border-b border-gray-800">
          <h1 className="text-xl font-medium">Lead Gen Admin</h1>
        </div>

        {/* Filters Section */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="w-full">
              <div className="flex items-center mb-2">
                <Filter className="h-4 w-4 mr-2" />
                <h2 className="text-sm font-medium">Filters</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Start Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">End Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Provider</label>
                  <div className="relative">
                    <select
                      value={filters.provider}
                      onChange={(e) => setFilters(prev => ({ ...prev, provider: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 appearance-none"
                    >
                      <option>All Providers</option>
                      {uniqueProviders.map(provider => (
                        <option key={provider} value={provider}>{provider}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Listing Type</label>
                  <div className="relative">
                    <select
                      value={filters.listingType}
                      onChange={(e) => setFilters(prev => ({ ...prev, listingType: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 appearance-none"
                    >
                      <option>All Types</option>
                      <option>Service</option>
                      <option>Tool</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Leads Section */}
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">All Leads</h2>
          
          {/* Leads Table */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead>
                  <tr className="text-left text-xs text-gray-400">
                    <th className="px-6 py-3 font-medium">Lead ID</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Service/Tool Name</th>
                    <th className="px-6 py-3 font-medium">Requester Info</th>
                    <th className="px-6 py-3 font-medium">Sent To</th>
                    <th className="px-6 py-3 font-medium">Type</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredLeads.length > 0 ? filteredLeads.map((lead: Lead, index: number) => (
                    <tr key={lead.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        L{(index + 1).toString().padStart(3, '0')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {lead.services?.name || 'Digital Marketing Strategy'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {lead.metadata.contact_person || 'TechStart Inc. - John Smith'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">
                        {lead.vendors?.email || 'marketing@digitalgrowth.com'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded bg-gray-900 text-white">
                          {index % 3 === 0 ? 'Tool' : 'Service'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewLead(lead)}
                          className="p-1 rounded-full bg-gray-700 hover:bg-gray-600"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center text-gray-400">
                        {leads.length > 0 ? 'No leads match the selected filters' : 'No leads found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Lead Details Modal */}
        {showLeadDetails && selectedLead && (
          <LeadDetailsModal
            lead={selectedLead}
            onClose={() => setShowLeadDetails(false)}
            onUpdate={(updatedLead) => {
              setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
              setShowLeadDetails(false);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}

// Lead Details Modal Component
function LeadDetailsModal({ 
  lead, 
  onClose, 
  onUpdate 
}: { 
  lead: Lead; 
  onClose: () => void; 
  onUpdate: (lead: Lead) => void; 
}) {
  const [status, setStatus] = useState(lead.metadata.status || 'New');
  const [notes, setNotes] = useState(lead.metadata.notes || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/leads/${lead.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metadata: {
            ...lead.metadata,
            status,
            notes
          }
        }),
      });

      if (response.ok) {
        const updatedLead = await response.json();
        onUpdate(updatedLead);
      } else {
        alert('Failed to update lead');
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Error updating lead');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-md border border-gray-800">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-white">Lead Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Responded">Responded</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Date Received</label>
                <div className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300">
                  {new Date(lead.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Contact Information</label>
              <div className="bg-gray-800 p-4 rounded text-sm text-gray-300 border border-gray-700">
                <p className="mb-1"><span className="text-gray-400">Name:</span> {lead.metadata.contact_person}</p>
                <p className="mb-1"><span className="text-gray-400">Email:</span> {lead.metadata.email}</p>
                <p className="mb-1"><span className="text-gray-400">Phone:</span> {lead.metadata.phone}</p>
                {lead.metadata.company_name && (
                  <p><span className="text-gray-400">Company:</span> {lead.metadata.company_name}</p>
                )}
              </div>
            </div>

            {lead.metadata.message && (
              <div>
                <label className="block text-sm text-gray-400 mb-1">Message</label>
                <div className="bg-gray-800 p-4 rounded text-sm text-gray-300 border border-gray-700">
                  {lead.metadata.message}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-400 mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Add notes about this lead..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400 transition-colors"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
