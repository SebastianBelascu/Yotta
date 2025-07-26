'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { Breadcrumb } from '@/components/admin/Breadcrumb';
import { CategoryManager } from '@/components/admin/CategoryManager';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { Tool } from '@/lib/types/tool';

export default function ToolsAdminPage() {
  const router = useRouter();
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    fetchTools();
  }, []);

  useEffect(() => {
    filterTools();
  }, [tools, searchTerm, filterStatus]);

  const fetchTools = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tools:', error);
        return;
      }

      setTools(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTools = () => {
    let filtered = tools;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (filterStatus === 'published') {
      filtered = filtered.filter(tool => tool.published);
    } else if (filterStatus === 'draft') {
      filtered = filtered.filter(tool => !tool.published);
    }

    setFilteredTools(filtered);
  };

  const togglePublished = async (toolId: string, currentStatus: boolean) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('tools')
        .update({ published: !currentStatus })
        .eq('id', toolId);

      if (error) {
        console.error('Error updating tool status:', error);
        return;
      }

      // Update local state
      setTools(tools.map(tool => 
        tool.id === toolId ? { ...tool, published: !currentStatus } : tool
      ));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteTool = async (toolId: string) => {
    if (!confirm('Are you sure you want to delete this tool? This action cannot be undone.')) {
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', toolId);

      if (error) {
        console.error('Error deleting tool:', error);
        return;
      }

      // Update local state
      setTools(tools.filter(tool => tool.id !== toolId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const stats = {
    total: tools.length,
    published: tools.filter(tool => tool.published).length,
    drafts: tools.filter(tool => !tool.published).length,
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
            <h1 className="text-2xl font-bold">Tools Management</h1>
            <p className="text-gray-400 mt-1">Manage your tools directory</p>
          </div>
          <button
            onClick={() => router.push('/admin/tools/new')}
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Tool
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <Breadcrumb items={[{ label: 'Tools Management' }]} />
          
          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 mt-4">
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
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 w-full sm:w-auto">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md ${filterStatus === 'all' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}
                onClick={() => setFilterStatus('all')}
              >
                All Tools
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
                Drafts
              </button>
            </div>

            <div className="relative w-full lg:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
          </div>

          {/* Tools List */}
          <div className="space-y-4">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool) => (
                <div key={tool.id} className="bg-gray-800 rounded-xl overflow-hidden">
                  <div className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {tool.logo_url ? (
                            <img
                              src={tool.logo_url}
                              alt={tool.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-700 flex items-center justify-center">
                              <span className="text-gray-300 font-medium text-lg">
                                {tool.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-medium text-white">{tool.name}</h3>
                            <p className="text-sm text-gray-400">{tool.tagline}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tool.published
                              ? 'bg-green-900 text-green-200'
                              : 'bg-yellow-900 text-yellow-200'
                          }`}>
                            {tool.published ? (
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
                          
                          {tool.categories.map((category, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
                            >
                              {category}
                            </span>
                          ))}
                          
                          {tool.pricing_model && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900 text-purple-200">
                              {tool.pricing_model}
                            </span>
                          )}
                          
                          {tool.starting_price && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                              From {tool.currency} {tool.starting_price}
                            </span>
                          )}
                          
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-200">
                            {tool.click_count} clicks
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {tool.affiliate_link && (
                          <a
                            href={tool.affiliate_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-blue-900/30 text-blue-400"
                            title="Visit Affiliate Link"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                        <button
                          onClick={() => togglePublished(tool.id, tool.published)}
                          className={`p-2 rounded-lg ${tool.published ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-green-900/30 text-green-400'}`}
                          title={tool.published ? 'Unpublish' : 'Publish'}
                        >
                          {tool.published ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        <a
                          href={`/admin/tools/edit/${tool.id}`}
                          className="p-2 rounded-lg hover:bg-blue-900/30 text-blue-400"
                          title="Edit Tool"
                        >
                          <Edit className="h-5 w-5" />
                        </a>
                        <button
                          onClick={() => deleteTool(tool.id)}
                          className="p-2 rounded-lg hover:bg-red-900/30 text-red-400"
                          title="Delete Tool"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                      <a 
                        href={`/tools/${tool.name.toLowerCase().replace(/\s+/g, '-')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                      >
                        View Public Page
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center">
                <p className="text-gray-400 mb-4">No tools found matching your criteria.</p>
                <button
                  onClick={() => router.push('/admin/tools/new')}
                  className="bg-yellow-500 hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors mx-auto"
                >
                  <Plus className="h-5 w-5" />
                  Add First Tool
                </button>
              </div>
            )}
          </div>

          {/* Category Management Section is hidden as it's not fully functional yet */}
        </div>
      </div>
    </AdminLayout>
  );
}
