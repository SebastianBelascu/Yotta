'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface CategoryManagerProps {
  type: 'service' | 'tool' | 'space';
  title: string;
  placeholder?: string;
  onCategoriesChange?: (categories: string[]) => void;
}

export function CategoryManager({ type, title, placeholder = "Enter category name", onCategoriesChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [type]);

  const fetchCategories = async () => {
    try {
      const supabase = createClient();
      let data: string[] = [];
      
      if (type === 'tool') {
        try {
          // For tools, fetch from the categories field
          const { data: toolsData, error } = await supabase
            .from('tools')
            .select('categories');
          
          if (error) throw error;
          
          // Extract all categories and flatten the array
          const allCategories = toolsData
            .flatMap(tool => tool.categories || [])
            .filter(Boolean);
          
          // Remove duplicates
          data = [...new Set(allCategories)];
          
          // If no categories found, use default tool categories
          if (data.length === 0) {
            data = [
              'AI & Machine Learning',
              'Analytics & Reporting',
              'Communication',
              'Content Creation',
              'CRM & Sales',
              'Customer Support',
              'Design & Creative',
              'Development',
              'E-commerce',
              'Finance & Accounting',
              'HR & Team Management',
              'Legal',
              'Marketing',
              'Productivity',
              'Project Management',
              'Social Media'
            ];
          }
        } catch (error) {
          console.error('Error fetching tool categories:', error);
          // Provide default categories as fallback
          data = [
            'AI & Machine Learning',
            'Analytics & Reporting',
            'Communication',
            'Content Creation',
            'CRM & Sales',
            'Customer Support',
            'Design & Creative',
            'Development',
            'E-commerce',
            'Finance & Accounting',
            'HR & Team Management',
            'Legal',
            'Marketing',
            'Productivity',
            'Project Management',
            'Social Media'
          ];
        }
      } 
      else if (type === 'service') {
        try {
          // For services, fetch from main_categories or sub_categories based on type
          const { data: servicesData, error } = await supabase
            .from('services')
            .select('main_categories, sub_categories');
          
          if (error) throw error;
          
          // Determine which field to use
          const fieldName = 'main_categories';
          
          // Extract all categories and flatten the array
          const allCategories = servicesData
            .flatMap(service => service[fieldName] || [])
            .filter(Boolean);
          
          // Remove duplicates
          data = [...new Set(allCategories)];
          
          // If no categories found, use default service categories
          if (data.length === 0) {
            data = [
              'Start Your Business',
              'Run & Operate Smoothly',
              'Manage Your Money',
              'Hire & Build Your Team',
              'Get Customers & Grow',
              'Build Tech & Digital Presence',
              'Ship Products',
              'Expand Internationally',
              'Stay Compliant & Protected',
              'Level Up as a Founder'
            ];
          }
        } catch (error) {
          console.error('Error fetching service categories:', error);
          // Provide default categories as fallback
          data = [
            'Start Your Business',
            'Run & Operate Smoothly',
            'Manage Your Money',
            'Hire & Build Your Team',
            'Get Customers & Grow',
            'Build Tech & Digital Presence',
            'Ship Products',
            'Expand Internationally',
            'Stay Compliant & Protected',
            'Level Up as a Founder'
          ];
        }
      }
      else if (type === 'space') {
        try {
          // For spaces, we'll use a similar approach as tools
          // First check if the is_space column exists
          const { data: toolsData, error } = await supabase
            .from('tools')
            .select('categories');
          
          if (error) throw error;
          
          // Since we might not have an is_space column, we'll use a hardcoded list of space categories
          // This is a fallback solution
          const spaceCategories = [
            'Coworking & Business Spaces',
            'Entertainment Spaces',
            'Event Spaces',
            'Food & Beverage Spaces',
            'Retail Spaces',
            'Wellness & Fitness Spaces'
          ];
          
          data = spaceCategories;
        } catch (error) {
          console.error('Error fetching space categories:', error);
          // Provide default categories as fallback
          data = [
            'Coworking & Business Spaces',
            'Entertainment Spaces',
            'Event Spaces',
            'Food & Beverage Spaces',
            'Retail Spaces',
            'Wellness & Fitness Spaces'
          ];
        }
      }
      
      // Sort alphabetically
      data.sort((a, b) => a.localeCompare(b));
      setCategories(data);
    } catch (error) {
      console.error(`Error fetching ${type} categories:`, error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      // Add the new category to our local state
      const updatedCategories = [...categories, newCategoryName.trim()];
      setCategories(updatedCategories);
      
      // Reset form
      setNewCategoryName('');
      setIsAdding(false);
      
      // Notify parent component if callback exists
      if (onCategoriesChange) {
        onCategoriesChange(updatedCategories);
      }
    } catch (error) {
      console.error(`Error adding ${type} category:`, error);
    }
  };

  const updateCategory = async (index: number, newName: string) => {
    if (!newName.trim()) return;

    try {
      // Create a copy of the categories array
      const updatedCategories = [...categories];
      
      // Update the category at the specified index
      updatedCategories[index] = newName.trim();
      
      // Update state
      setCategories(updatedCategories);
      setEditingIndex(null);
      setEditingName('');
      
      // Notify parent component if callback exists
      if (onCategoriesChange) {
        onCategoriesChange(updatedCategories);
      }
    } catch (error) {
      console.error(`Error updating ${type} category:`, error);
    }
  };

  const deleteCategory = async (index: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      // Create a copy of the categories array without the deleted item
      const updatedCategories = categories.filter((_, i) => i !== index);
      
      // Update state
      setCategories(updatedCategories);
      
      // Notify parent component if callback exists
      if (onCategoriesChange) {
        onCategoriesChange(updatedCategories);
      }
    } catch (error) {
      console.error(`Error deleting ${type} category:`, error);
    }
  };

  const startEditing = (index: number, name: string) => {
    setEditingIndex(index);
    setEditingName(name);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingName('');
  };

  const cancelAdding = () => {
    setIsAdding(false);
    setNewCategoryName('');
  };

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </button>
        )}
      </div>

      {/* Add new category form */}
      {isAdding && (
        <div className="mb-4 p-3 bg-gray-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={placeholder}
              className="flex-1 bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && addCategory()}
              autoFocus
            />
            <button
              onClick={addCategory}
              disabled={!newCategoryName.trim()}
              className="text-green-400 hover:text-green-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
            </button>
            <button
              onClick={cancelAdding}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Categories list */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-4">
            No categories found. Add one to get started.
          </div>
        ) : (
          categories.map((categoryName, index) => (
            <div
              key={`${categoryName}-${index}`}
              className="flex items-center justify-between p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
            >
              {editingIndex === index ? (
                <div className="flex items-center space-x-2 flex-1">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 bg-gray-700 text-white border border-gray-600 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && updateCategory(index, editingName)}
                    autoFocus
                  />
                  <button
                    onClick={() => updateCategory(index, editingName)}
                    disabled={!editingName.trim()}
                    className="text-green-400 hover:text-green-300 disabled:text-gray-500 disabled:cursor-not-allowed"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gray-600 rounded-full mr-3"></div>
                    <span className="text-white text-sm">{categoryName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEditing(index, categoryName)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteCategory(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
