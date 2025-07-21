'use client'

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/layout';
import Link from 'next/link';
import { 
  Users, ShieldCheck, ClipboardList, Megaphone, BarChart, CreditCard,
  Star, MessageCircle, Smartphone, Search, TrendingUp, Heart, Clock, Zap
} from 'lucide-react';

type WhyListItem = {
  id: string;
  title: string;
  description: string;
  icon_name: string | null;
  category: string;
  display_order: number;
  is_published: boolean;
};

const iconMap = {
  'users': Users,
  'shield-check': ShieldCheck,
  'clipboard-list': ClipboardList,
  'megaphone': Megaphone,
  'bar-chart': BarChart,
  'credit-card': CreditCard,
  'star': Star,
  'message-circle': MessageCircle,
  'smartphone': Smartphone,
  'search': Search,
  'trending-up': TrendingUp,
  'heart': Heart,
  'clock': Clock,
  'zap': Zap
};

export default function WhyListWithUsPage() {
  const [items, setItems] = useState<WhyListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/why-list?published=true');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error('Failed to fetch Why List With Us items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return Star;
    return iconMap[iconName as keyof typeof iconMap] || Star;
  };

  const benefits = items.filter(item => item.category === 'benefit');
  const features = items.filter(item => item.category === 'feature');
  const stats = items.filter(item => item.category === 'stat');

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col min-h-screen">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Why List With Yotta?</h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                Join thousands of service providers growing their business with us
              </p>
            </div>
          </div>
          <div className="flex-grow bg-white py-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Why List With Yotta?</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
              Join thousands of service providers growing their business with us
            </p>
            <Link 
              href="/list-your-business" 
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-orange-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Get Started Today
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        {stats.length > 0 && (
          <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat) => {
                  const IconComponent = getIcon(stat.icon_name);
                  return (
                    <div key={stat.id} className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="bg-blue-100 rounded-full p-3">
                          <IconComponent className="h-8 w-8 text-blue-600" />
                        </div>
                      </div>
                      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {stat.title}
                      </div>
                      <p className="text-gray-600">{stat.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        {benefits.length > 0 && (
          <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Grow Your Business
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Everything you need to reach more customers and increase your revenue
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit) => {
                  const IconComponent = getIcon(benefit.icon_name);
                  return (
                    <div key={benefit.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="bg-orange-500 rounded-lg p-2 mr-3">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">{benefit.title}</h3>
                      </div>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        {features.length > 0 && (
          <div className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Platform Features
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Professional tools and features designed to help you succeed
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature) => {
                  const IconComponent = getIcon(feature.icon_name);
                  return (
                    <div key={feature.id} className="flex items-start">
                      <div className="bg-orange-100 rounded-full p-3 mr-4 flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of successful service providers on Yotta today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/list-your-business" 
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-orange-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Start Listing Your Services
              </Link>
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-orange-600 transition-colors"
              >
                Talk to Our Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
