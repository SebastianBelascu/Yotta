'use client'

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/layout';
import Link from 'next/link';
import { 
  Zap, ShieldCheck, Filter, TrendingUp, Users, Heart, Eye, CheckCircle, Clock, Search, Briefcase
} from 'lucide-react';

type AboutUsItem = {
  id: string;
  title: string;
  description: string;
  icon_name: string | null;
  section: string;
  display_order: number;
  is_published: boolean;
};

const iconMap = {
  'zap': Zap,
  'shield-check': ShieldCheck,
  'filter': Filter,
  'trending-up': TrendingUp,
  'users': Users,
  'heart': Heart,
  'eye': Eye,
  'check-circle': CheckCircle,
  'clock': Clock,
  'search': Search
};

export default function AboutPage() {
  const [items, setItems] = useState<AboutUsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/about-us?published=true');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error('Failed to fetch About Us items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string | null) => {
    if (!iconName) return Zap;
    return iconMap[iconName as keyof typeof iconMap] || Zap;
  };

  const mainContent = items.filter(item => item.section === 'main');
  const introContent = items.filter(item => item.section === 'intro');
  const features = items.filter(item => item.section === 'features');
  const values = items.filter(item => item.section === 'values');
  const stats = items.filter(item => item.section === 'stats');

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col min-h-screen">
          <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About Yotta</h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                Your shortcut to discovering the tools and services that move the needle
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
            {mainContent.length > 0 ? mainContent.map((item) => {
              const IconComponent = getIcon(item.icon_name);
              return (
                <div key={item.id}>
                  <div className="flex justify-center mb-6">
                    <IconComponent className="h-16 w-16 text-orange-200" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">{item.title}</h1>
                  <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
                    {item.description}
                  </p>
                </div>
              );
            }) : (
              <div>
                <div className="flex justify-center mb-6">
                  <Zap className="h-16 w-16 text-orange-200" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About Yotta</h1>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8">
                  Your shortcut to discovering the tools and services that move the needle
                </p>
              </div>
            )}
            <Link 
              href="/list-your-business" 
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-orange-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Get Started Today
            </Link>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              {introContent.length > 0 ? introContent.slice(0, 1).map((item) => (
                <div key={item.id}>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{item.title}</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">{item.description}</p>
                </div>
              )) : (
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Do</h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">We help businesses discover the right tools and services to grow.</p>
                </div>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {introContent.length > 1 ? introContent.slice(1).map((item) => (
                <div key={item.id} className="bg-gray-50 p-8 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              )) : (
                <>
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Curated Directory</h3>
                    <p className="text-gray-600">We carefully select and review every service and tool in our directory.</p>
                  </div>
                  <div className="bg-gray-50 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Expert Reviews</h3>
                    <p className="text-gray-600">Our team provides honest, detailed reviews to help you make informed decisions.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're not just another directory. Here's what makes us different.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.length > 0 ? features.map((feature) => {
                const IconComponent = getIcon(feature.icon_name);
                return (
                  <div key={feature.id} className="text-center">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              }) : (
                <>
                  <div className="text-center">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Assured</h3>
                    <p className="text-gray-600">Every service is vetted and reviewed by our expert team.</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Growth Focused</h3>
                    <p className="text-gray-600">Tools and services designed to help your business grow.</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Driven</h3>
                    <p className="text-gray-600">Built by entrepreneurs, for entrepreneurs.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Yotta</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We understand small teams and solo operators because we are one.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.length > 0 ? values.map((value) => {
                const IconComponent = getIcon(value.icon_name);
                return (
                  <div key={value.id} className="flex items-start space-x-4">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
                );
              }) : (
                <>
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer First</h3>
                      <p className="text-gray-600">We prioritize your success and satisfaction above all else.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparency</h3>
                      <p className="text-gray-600">Honest reviews and clear pricing for every service.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Time Saving</h3>
                      <p className="text-gray-600">Find what you need quickly without endless research.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Thousands</h2>
              <p className="text-xl opacity-90 max-w-3xl mx-auto">
                Join the growing community of successful businesses
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {stats.length > 0 ? stats.map((stat) => {
                const IconComponent = getIcon(stat.icon_name);
                return (
                  <div key={stat.id} className="bg-white bg-opacity-10 rounded-lg p-6">
                    <div className="flex justify-center mb-4">
                      <IconComponent className="h-8 w-8 text-orange-200" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">{stat.title}</div>
                    <div className="text-sm md:text-base opacity-90">{stat.description}</div>
                  </div>
                );
              }) : (
                <>
                  <div className="bg-white bg-opacity-10 rounded-lg p-6">
                    <div className="flex justify-center mb-4">
                      <Users className="h-8 w-8 text-orange-200" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
                    <div className="text-sm md:text-base opacity-90">Happy Customers</div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-6">
                    <div className="flex justify-center mb-4">
                      <Briefcase className="h-8 w-8 text-orange-200" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                    <div className="text-sm md:text-base opacity-90">Services Listed</div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-6">
                    <div className="flex justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-orange-200" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">98%</div>
                    <div className="text-sm md:text-base opacity-90">Satisfaction Rate</div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-lg p-6">
                    <div className="flex justify-center mb-4">
                      <TrendingUp className="h-8 w-8 text-orange-200" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
                    <div className="text-sm md:text-base opacity-90">Support Available</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of businesses that trust Yotta to find the right tools and services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Browse Services
              </Link>
              <Link
                href="/list-your-business"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-orange-500 text-lg font-medium rounded-md text-orange-600 bg-white hover:bg-orange-50 transition-colors"
              >
                List Your Business
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
