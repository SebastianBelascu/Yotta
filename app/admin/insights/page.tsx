'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  author_name: string;
  published_at: string | null;
  created_at: string;
}

export default function AdminBlogPage() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stats for the dashboard - will be updated with real data
  const [dashboardStats, setDashboardStats] = useState([
    {
      title: 'Total Articles',
      value: '0',
      change: 'All time',
      icon: <Filter className="h-6 w-6 text-blue-500" />,
    },
    {
      title: 'Published',
      value: '0',
      change: 'Live on site',
      icon: <Eye className="h-6 w-6 text-green-500" />,
    },
    {
      title: 'Drafts',
      value: '0',
      change: 'In progress',
      icon: <Pencil className="h-6 w-6 text-orange-500" />,
    },
    {
      title: 'Categories',
      value: '0',
      change: 'Content types',
      icon: <Filter className="h-6 w-6 text-purple-500" />,
    }
  ]);

  const updateDashboardStats = (posts: BlogPost[]) => {
    const published = posts.filter(post => post.status === 'Published').length || 0;
    const drafts = posts.filter(post => post.status === 'Draft').length || 0;
    
    // Get unique categories (excluding null/undefined values)
    const uniqueCategories = new Set();
    posts.forEach(post => {
      if (post.category) uniqueCategories.add(post.category);
    });
    
    setDashboardStats([
      {
        title: 'Total Articles',
        value: String(posts.length || 0),
        change: 'All time',
        icon: <Filter className="h-6 w-6 text-blue-500" />,
      },
      {
        title: 'Published',
        value: String(published),
        change: 'Live on site',
        icon: <Eye className="h-6 w-6 text-green-500" />,
      },
      {
        title: 'Drafts',
        value: String(drafts),
        change: 'In progress',
        icon: <Pencil className="h-6 w-6 text-orange-500" />,
      },
      {
        title: 'Categories',
        value: String(uniqueCategories.size),
        change: 'Content types',
        icon: <Filter className="h-6 w-6 text-purple-500" />,
      }
    ]);
  };

  useEffect(() => {
    async function fetchBlogPosts() {
      setIsLoading(true);
      const supabase = createClient();
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching blog posts:', error);
        } else {
          const posts = data || [];
          setBlogPosts(posts);
          updateDashboardStats(posts);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchBlogPosts();
  }, []);

  const toggleRowSelection = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not published';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'All Categories' || post.category === filterCategory;
    const matchesStatus = filterStatus === 'All Status' || post.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const uniqueCategories = ['All Categories', ...Array.from(new Set(blogPosts.map(post => post.category)))];
  const statusOptions = ['All Status', 'Published', 'Draft'];

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Insights (Blog Management)</h1>
          <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            System: Active
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">Manage blog posts, articles, and insights</p>
        
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
        
        {/* Blog Management Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Blog Management</h2>
            <p className="text-sm text-gray-500">Manage articles, blog posts, and insights. Published posts go live on the site immediately.</p>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <select
                  className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md w-full md:w-44 bg-white appearance-none"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {uniqueCategories.map((category, index) => (
                    <option key={index} value={category}>{category || 'Uncategorized'}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
              
              <div className="relative flex-grow md:flex-grow-0">
                <select
                  className="flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md w-full md:w-32 bg-white appearance-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {statusOptions.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
              
              <Link href="/admin/insights/new" className="bg-blue-500 text-white px-3 py-2 rounded-md flex items-center">
                <Plus className="h-4 w-4 mr-1" />
                <span>New Article</span>
              </Link>
            </div>
          </div>
          
          {/* Blog Posts Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-3 px-4 text-left w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      onChange={() => {
                        if (selectedRows.length === blogPosts.length) {
                          setSelectedRows([]);
                        } else {
                          setSelectedRows(blogPosts.map(post => post.id));
                        }
                      }}
                      checked={selectedRows.length === blogPosts.length && blogPosts.length > 0}
                    />
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Title</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Slug</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Author</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Published Date</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-gray-500">Loading blog posts...</td>
                  </tr>
                ) : filteredPosts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-4 text-center text-gray-500">No blog posts found</td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedRows.includes(post.id)}
                          onChange={() => toggleRowSelection(post.id)}
                        />
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">{post.title}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{post.slug}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{post.category || 'Uncategorized'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{post.author_name || 'Admin'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatDate(post.published_at || post.created_at)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex space-x-2">
                        {post.status === 'Published' && (
                          <Link href={`/insights/${post.slug}`} className="text-gray-400 hover:text-blue-500">
                            <Eye className="h-5 w-5" />
                          </Link>
                        )}
                        <Link href={`/admin/insights/edit/${post.id}`} className="text-gray-400 hover:text-blue-500">
                          <Pencil className="h-5 w-5" />
                        </Link>
                        <button 
                          className="text-gray-400 hover:text-red-500"
                          onClick={async () => {
                            if (confirm('Are you sure you want to delete this blog post?')) {
                              const supabase = createClient();
                              const { error } = await supabase
                                .from('blog_posts')
                                .delete()
                                .eq('id', post.id);
                              
                              if (error) {
                                console.error('Error deleting post:', error);
                                alert('Failed to delete post');
                              } else {
                                const updatedPosts = blogPosts.filter(p => p.id !== post.id);
                                setBlogPosts(updatedPosts);
                                updateDashboardStats(updatedPosts);
                              }
                            }
                          }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {filteredPosts.length} of {blogPosts.length} posts
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
