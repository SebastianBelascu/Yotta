'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Save, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface TopDeal {
  id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  original_price: number | null;
  currency: string;
  link_url: string;
  display_order: number;
  deal_type: 'service' | 'tool';
  reference_id: string;
  badge_text: string | null;
  badge_color: string | null;
  rating: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TopDealsSettings {
  id: string;
  is_visible: boolean;
  section_title: string;
  max_deals: number;
  updated_at: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  image_url?: string;
}

interface Tool {
  id: string;
  name: string;
  price: number;
  image_url?: string;
}

export default function TopDealsAdminPage() {
  const [deals, setDeals] = useState<TopDeal[]>([]);
  const [settings, setSettings] = useState<TopDealsSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [settingsEditing, setSettingsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState<Partial<TopDealsSettings>>({});
  const [selectedItems, setSelectedItems] = useState<{id: string, type: 'service' | 'tool'}[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch top deals and settings
      const topDealsResponse = await fetch('/api/top-deals');
      if (topDealsResponse.ok) {
        const data = await topDealsResponse.json();
        setDeals(data.deals || []);
        setSettings(data.settings || null);
      }
      
      // Fetch services
      const servicesResponse = await fetch('/api/services?limit=100');
      if (servicesResponse.ok) {
        const data = await servicesResponse.json();
        setServices(data.services || []);
      }
      
      // Fetch tools
      const toolsResponse = await fetch('/api/tools?limit=100');
      if (toolsResponse.ok) {
        const data = await toolsResponse.json();
        setTools(data.tools || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const toggleSettingsVisibility = async () => {
    if (!settings) return;
    
    try {
      const response = await fetch(`/api/top-deals/settings/${settings.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_visible: !settings.is_visible,
        }),
      });
      
      if (response.ok) {
        const updatedSettings = await response.json();
        setSettings(updatedSettings);
        toast.success(`Section ${updatedSettings.is_visible ? 'visible' : 'hidden'}`);
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const saveSettings = async () => {
    if (!settings || !editedSettings) return;
    
    try {
      const response = await fetch(`/api/top-deals/settings/${settings.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedSettings),
      });
      
      if (response.ok) {
        const updatedSettings = await response.json();
        setSettings(updatedSettings);
        setSettingsEditing(false);
        setEditedSettings({});
        toast.success('Settings updated');
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const addDeal = async (item: Service | Tool, type: 'service' | 'tool') => {
    try {
      // Check if we already have 3 deals
      if (deals.length >= 3) {
        toast.error('Maximum 3 deals allowed. Remove a deal first.');
        return;
      }
      
      // Check if this item is already added
      if (deals.some(deal => deal.reference_id === item.id)) {
        toast.error('This item is already in the deals list');
        return;
      }
      
      const newDeal = {
        title: item.name,
        description: `Special offer on ${item.name}`,
        image_url: item.image_url || '',
        price: item.price,
        original_price: item.price * 1.2, // 20% higher as original price
        currency: 'USD',
        link_url: type === 'service' ? `/services/${item.id}` : `/tools/${item.id}`,
        display_order: deals.length + 1,
        deal_type: type,
        reference_id: item.id,
        badge_text: 'Popular',
        badge_color: '#FF6B35',
        is_active: true,
      };
      
      const response = await fetch('/api/top-deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDeal),
      });
      
      if (response.ok) {
        const addedDeal = await response.json();
        setDeals([...deals, addedDeal]);
        toast.success('Deal added successfully');
      } else {
        toast.error('Failed to add deal');
      }
    } catch (error) {
      console.error('Error adding deal:', error);
      toast.error('Failed to add deal');
    }
  };

  const removeDeal = async (id: string) => {
    try {
      const response = await fetch(`/api/top-deals/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setDeals(deals.filter(deal => deal.id !== id));
        toast.success('Deal removed');
      } else {
        toast.error('Failed to remove deal');
      }
    } catch (error) {
      console.error('Error removing deal:', error);
      toast.error('Failed to remove deal');
    }
  };

  const moveDeal = async (id: string, direction: 'up' | 'down') => {
    const dealIndex = deals.findIndex(deal => deal.id === id);
    if (
      (direction === 'up' && dealIndex === 0) ||
      (direction === 'down' && dealIndex === deals.length - 1)
    ) {
      return;
    }
    
    const newDeals = [...deals];
    const swapIndex = direction === 'up' ? dealIndex - 1 : dealIndex + 1;
    
    // Swap display orders
    const tempOrder = newDeals[dealIndex].display_order;
    newDeals[dealIndex].display_order = newDeals[swapIndex].display_order;
    newDeals[swapIndex].display_order = tempOrder;
    
    // Swap positions in array
    [newDeals[dealIndex], newDeals[swapIndex]] = [newDeals[swapIndex], newDeals[dealIndex]];
    
    try {
      // Update both deals in database
      const promises = [
        fetch(`/api/top-deals/${newDeals[dealIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: newDeals[dealIndex].display_order }),
        }),
        fetch(`/api/top-deals/${newDeals[swapIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: newDeals[swapIndex].display_order }),
        }),
      ];
      
      await Promise.all(promises);
      setDeals(newDeals);
    } catch (error) {
      console.error('Error reordering deals:', error);
      toast.error('Failed to reorder deals');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Top Deals Management</h1>
          <p className="text-gray-600">Manage deals shown on the homepage</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/admin/homepage" className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Back to Homepage Admin
          </Link>
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Section Settings</h2>
          <div className="flex space-x-2">
            {settingsEditing ? (
              <>
                <button
                  onClick={saveSettings}
                  className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => {
                    setSettingsEditing(false);
                    setEditedSettings({});
                  }}
                  className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setSettingsEditing(true)}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Edit size={16} />
              </button>
            )}
          </div>
        </div>

        {settings && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Section Visibility:</span>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  name="toggle"
                  id="toggle"
                  checked={settings.is_visible}
                  onChange={toggleSettingsVisibility}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="toggle"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    settings.is_visible ? 'bg-green-400' : 'bg-gray-300'
                  }`}
                ></label>
              </div>
            </div>

            {settingsEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={editedSettings.section_title ?? settings.section_title}
                    onChange={(e) =>
                      setEditedSettings({ ...editedSettings, section_title: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Deals (3 recommended)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={editedSettings.max_deals ?? settings.max_deals}
                    onChange={(e) =>
                      setEditedSettings({
                        ...editedSettings,
                        max_deals: parseInt(e.target.value),
                      })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Section Title:</span>{' '}
                  <span>{settings.section_title}</span>
                </div>
                <div>
                  <span className="font-medium">Maximum Deals:</span>{' '}
                  <span>{settings.max_deals}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Current Deals Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Deals</h2>
        
        {deals.length === 0 ? (
          <p className="text-gray-500 italic">No deals added yet. Add up to 3 deals below.</p>
        ) : (
          <div className="space-y-4">
            {deals.map((deal, index) => (
              <div key={deal.id} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center space-x-4">
                  {deal.image_url && (
                    <img
                      src={deal.image_url}
                      alt={deal.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  )}
                  <div>
                    <h3 className="font-medium">{deal.title}</h3>
                    <p className="text-sm text-gray-600">
                      {deal.deal_type === 'service' ? 'Service' : 'Tool'} • ${deal.price}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => moveDeal(deal.id, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded-md ${
                      index === 0 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveDeal(deal.id, 'down')}
                    disabled={index === deals.length - 1}
                    className={`p-1 rounded-md ${
                      index === deals.length - 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <Link
                    href={`/admin/homepage/top-deals/edit/${deal.id}`}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    onClick={() => removeDeal(deal.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Deals Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Add New Deal</h2>
        
        {deals.length >= 3 ? (
          <p className="text-amber-600">
            Maximum number of deals reached (3). Remove a deal to add a new one.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Services */}
            <div>
              <h3 className="font-medium mb-2">Services</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.slice(0, 6).map((service) => (
                  <div
                    key={service.id}
                    className="border rounded-md p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">${service.price}</p>
                    </div>
                    <button
                      onClick={() => addDeal(service, 'service')}
                      className="p-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                      disabled={deals.some(deal => deal.reference_id === service.id)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tools */}
            <div>
              <h3 className="font-medium mb-2">Tools</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.slice(0, 6).map((tool) => (
                  <div
                    key={tool.id}
                    className="border rounded-md p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{tool.name}</p>
                      <p className="text-sm text-gray-600">${tool.price}</p>
                    </div>
                    <button
                      onClick={() => addDeal(tool, 'tool')}
                      className="p-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                      disabled={deals.some(deal => deal.reference_id === tool.id)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #68D391;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #68D391;
        }
        .toggle-label {
          transition: background-color 0.2s;
        }
        .toggle-checkbox {
          right: 0;
          z-index: 1;
          transition: all 0.3s;
        }
      `}</style>
    </div>
  );
}
