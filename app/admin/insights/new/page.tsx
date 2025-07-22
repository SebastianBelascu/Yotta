'use client';

import React, { useState } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Save, X, AlertCircle } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import RichTextEditor from '@/components/admin/RichTextEditor';
import { slugify } from '@/lib/utils/slugify';
import SEOHelper from '@/components/admin/SEOHelper';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    content: '',
    tags: '',
    status: 'Draft',
    author_name: '',
    author_title: '',
    featured_image: '',
    meta_description: '',
    focus_keyword: '',
  });
  
  // Add validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({
    title: '',
    slug: '',
    category: '',
    content: '',
    tags: '',
    author_name: '',
    featured_image: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user makes changes
    setErrors(prev => ({ ...prev, [name]: '' }));
    
    if (name === 'title') {
      // Auto-generate slug from title if title changes
      const generatedSlug = slugify(value);
      setFormData({ ...formData, title: value, slug: generatedSlug });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  // Handle manual slug changes
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Clear error
    setErrors(prev => ({ ...prev, slug: '' }));
    // Only allow lowercase letters, numbers, and hyphens
    const sanitizedSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData({ ...formData, slug: sanitizedSlug });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    
    // Required fields validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      hasErrors = true;
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
      hasErrors = true;
    }
    
    // Check if content is empty or only contains HTML tags with no actual text
    const contentWithoutTags = formData.content ? formData.content.replace(/<[^>]*>/g, '').trim() : '';
    const wordCount = contentWithoutTags ? contentWithoutTags.split(/\s+/).filter(word => word.trim().length > 0).length : 0;
    
    if (!contentWithoutTags || wordCount === 0) {
      newErrors.content = 'Content is required';
      hasErrors = true;
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
      hasErrors = true;
    }
    
    if (!formData.author_name.trim()) {
      newErrors.author_name = 'Author name is required';
      hasErrors = true;
    }
    
    if (!formData.featured_image.trim()) {
      newErrors.featured_image = 'Featured image is required';
      hasErrors = true;
    }
    
    // Check if slug is unique (could be implemented with a database check)
    
    // Update errors state
    setErrors(newErrors);
    
    // If there are errors, don't submit
    if (hasErrors) {
      // Scroll to the first error
      const firstErrorField = Object.keys(newErrors).find(key => newErrors[key]);
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      
      // Convert tags from comma-separated string to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      // Create a new object with only the fields that exist in the database schema
      const insertData = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        content: formData.content,
        tags: tagsArray,
        status: formData.status || 'Draft',
        author_name: formData.author_name,
        author_title: formData.author_title,
        featured_image: formData.featured_image,
        created_at: new Date().toISOString(),
        published_at: formData.status === 'Published' ? new Date().toISOString() : null,
      };
      
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([insertData])
        .select();
      
      if (error) {
        console.error('Error creating blog post:', JSON.stringify(error));
        if (error.message && error.message.includes('duplicate key')) {
          setErrors({ ...newErrors, slug: 'This slug is already in use. Please choose another.' });
        } else {
          alert(`Failed to create blog post: ${JSON.stringify(error)}`);
        }
      } else {
        router.push('/admin/insights');
      }
    } catch (error) {
      console.error('Error creating blog post:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Article</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => router.push('/admin/insights')}
              className="px-4 py-2 border border-gray-300 rounded-md flex items-center text-gray-700 hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center hover:bg-blue-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Article'}
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main content - 2/3 width */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Article Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter article title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>
                
                {/* Slug */}
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    value={formData.slug}
                    onChange={handleSlugChange}
                    className={`w-full px-4 py-2 border ${errors.slug ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="article-url-slug"
                  />
                  {errors.slug ? (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.slug}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      This will be used in the URL: /insights/{formData.slug || 'article-slug'}
                    </p>
                  )}
                </div>
                
                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Article Content <span className="text-red-500">*</span>
                  </label>
                  <RichTextEditor
                    value={formData.content}
                    onChange={(content) => {
                      setFormData(prev => ({ ...prev, content }));
                      // Clear content error when user starts typing
                      if (errors.content) {
                        setErrors(prev => ({ ...prev, content: '' }));
                      }
                    }}
                    placeholder="Write your article content here..."
                    error={errors.content}
                  />
                </div>
                
                {/* Featured Image */}
                <div>
                  <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-1">
                    Featured Image <span className="text-red-500">*</span>
                  </label>
                  <ImageUploader 
                    value={formData.featured_image}
                    onChange={(url) => {
                      setFormData({...formData, featured_image: url});
                      if (url) setErrors(prev => ({ ...prev, featured_image: '' }));
                    }}
                  />
                  {errors.featured_image ? (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.featured_image}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">
                      Upload an image or provide a URL. Images are stored in the blog-images bucket.
                    </p>
                  )}
                </div>
              </div>
              
              {/* Sidebar - 1/3 width */}
              <div className="space-y-6">
                {/* Status */}
                <div className="bg-gray-50 p-4 rounded-md">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.status === 'Published' 
                      ? 'This article will be visible on the site immediately.' 
                      : 'This article will be saved as a draft and won\'t be visible on the site.'}
                  </p>
                </div>
                
                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="" disabled>Select category</option>
                    <option value="Tips">Tips</option>
                    <option value="Guides">Guides</option>
                    <option value="Announcements">Announcements</option>
                    <option value="Industry News">Industry News</option>
                    <option value="Case Studies">Case Studies</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>
                
                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Separate tags with commas
                  </p>
                </div>
                
                {/* Author Info */}
                <div>
                  <label htmlFor="author_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Author Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="author_name"
                    name="author_name"
                    value={formData.author_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${errors.author_name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="e.g., John Doe"
                  />
                  {errors.author_name && (
                    <p className="mt-1 text-xs text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.author_name}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="author_title" className="block text-sm font-medium text-gray-700 mb-1">
                    Author Title
                  </label>
                  <input
                    type="text"
                    id="author_title"
                    name="author_title"
                    value={formData.author_title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Content Specialist"
                  />
                </div>
                
                {/* SEO Fields */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
                  
                  {/* Meta Description */}
                  <div className="mb-4">
                    <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description
                    </label>
                    <textarea
                      id="meta_description"
                      name="meta_description"
                      rows={3}
                      value={formData.meta_description}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="A brief description of your article for search engines (120-160 characters)"
                      maxLength={160}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.meta_description.length}/160 characters
                    </p>
                  </div>
                  
                  {/* Focus Keyword */}
                  <div className="mb-4">
                    <label htmlFor="focus_keyword" className="block text-sm font-medium text-gray-700 mb-1">
                      Focus Keyword
                    </label>
                    <input
                      type="text"
                      id="focus_keyword"
                      name="focus_keyword"
                      value={formData.focus_keyword}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Main keyword you want to rank for"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      The primary keyword you want this article to rank for in search engines
                    </p>
                  </div>
                </div>
              </div>
              
              {/* SEO Helper */}
              <div className="mt-6">
                <SEOHelper
                  title={formData.title}
                  content={formData.content}
                  slug={formData.slug}
                  metaDescription={formData.meta_description}
                  focusKeyword={formData.focus_keyword}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
