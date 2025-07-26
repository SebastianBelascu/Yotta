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
            <div className="text-center mb-8">
              {introContent.length > 0 ? introContent.slice(0, 1).map((item) => (
                <div key={item.id}>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{item.title}</h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Building a business is hard. Finding the right tools and services shouldn't be.
                  </p>
                </div>
              )) : (
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Do</h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Building a business is hard. Finding the right tools and services shouldn't be.
                  </p>
                </div>
              )}
            </div>
            
            <div className="max-w-3xl mx-auto text-center">
              {introContent.length > 1 ? introContent.slice(1, 3).map((item, index) => (
                <p key={item.id} className="text-gray-600 mb-6">
                  {item.description}
                </p>
              )) : (
                <>
                  <p className="text-gray-600 mb-6">
                    VentureNext is a handpicked marketplace built to help ambitious founders and lean teams cut through the noise.
                    Whether you're starting your first side hustle or running your fifth venture, we help you discover the best
                    platforms, providers, and solutions tailored for early-stage and growing businesses.
                  </p>
                  <p className="text-gray-600 mb-12">
                    No fluff, no overwhelm—just what works. From legal to marketing, CRMs to coworking spaces, we bring the next
                    best thing straight to your fingertips.
                  </p>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Feature Cards */}
              {introContent.length > 3 ? introContent.slice(3).map((item, index) => {
                // Map backend icons to the specific icons needed for this section
                let iconComponent;
                if (index === 0) {
                  iconComponent = <div className="bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                    </svg>
                  </div>;
                } else if (index === 1) {
                  iconComponent = <div className="bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" fill="currentColor"/>
                    </svg>
                  </div>;
                } else {
                  iconComponent = <div className="bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>
                    </svg>
                  </div>;
                }
                
                return (
                  <div key={item.id} className="text-center">
                    {iconComponent}
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                );
              }) : (
                <>
                  {/* Feature 1 */}
                  <div className="text-center">
                    <div className="bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Curated Selection</h3>
                    <p className="text-gray-600">
                      Handpicked marketplace built to help ambitious founders and lean teams cut through the noise.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="text-center">
                    <div className="bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No Fluff, No Overwhelm</h3>
                    <p className="text-gray-600">
                      Just what works. From legal to marketing, CRMs to coworking spaces.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="text-center">
                    <div className="bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                      <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Next Best Thing</h3>
                    <p className="text-gray-600">
                      We bring the solutions straight to your fingertips, tailored for early-stage and growing businesses.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Who We Serve Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {features.length > 0 && features[0]?.title ? features[0].title : "Who We Serve"}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {features.length > 0 && features[0]?.description ? 
                  features[0].description : 
                  "From solo entrepreneurs to growing teams, we support businesses at every stage of their journey with tailored solutions and expert guidance."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {features.length > 1 ? features.slice(1).map((feature, index) => {
                const IconComponent = getIcon(feature.icon_name);
                // Define color based on index
                const bgColors = ["bg-orange-100", "bg-blue-100", "bg-green-100", "bg-purple-100"];
                const textColors = ["text-orange-500", "text-blue-500", "text-green-500", "text-purple-500"];
                const bgColor = bgColors[index % bgColors.length];
                const textColor = textColors[index % textColors.length];
                
                // Create bullet points from description if it contains newlines or semicolons
                const descriptionParts = feature.description?.split(/[;\n]/).filter(Boolean) || [];
                const mainDescription = descriptionParts.length > 0 ? descriptionParts[0] : feature.description;
                const bulletPoints = descriptionParts.slice(1).map(item => item.trim()).filter(Boolean);
                
                return (
                  <div key={feature.id} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className={`${bgColor} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className={`h-8 w-8 ${textColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{mainDescription}</p>
                    
                    {bulletPoints.length > 0 && (
                      <ul className="space-y-2">
                        {bulletPoints.map((point, i) => (
                          <li key={i} className="flex items-start">
                            <span className={`${textColor} mr-2 mt-1`}>•</span>
                            <span className="text-gray-600">{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              }) : (
                <>
                  {/* Solopreneurs */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="bg-orange-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                      <svg className="h-8 w-8 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" fill="currentColor"/>
                        <path d="M18 21a1 1 0 01-1-1v-2a4 4 0 00-4-4H11a4 4 0 00-4 4v2a1 1 0 01-2 0v-2a6 6 0 016-6h2a6 6 0 016 6v2a1 1 0 01-1 1z" fill="currentColor"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Solopreneurs</h3>
                    <p className="text-gray-600 mb-4">Individual entrepreneurs building their dream business from the ground up</p>
                    
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">Personal branding tools</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">Productivity solutions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">Marketing automation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">Finance management</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Startup Founders */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="bg-blue-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                      <svg className="h-8 w-8 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Startup Founders</h3>
                    <p className="text-gray-600 mb-4">Innovative leaders launching the next big thing with their founding teams</p>
                    
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">MVP development</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">Investor relations</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">Team collaboration</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">Legal compliance</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Small Teams */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="bg-green-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                      <svg className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Small Teams</h3>
                    <p className="text-gray-600 mb-4">Growing businesses with 2-20 employees ready to scale their operations</p>
                    
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">HR solutions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">Project management</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">Customer support</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">Sales optimization</span>
                      </li>
                    </ul>
                  </div>
                  
                  {/* SMEs */}
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                      <svg className="h-8 w-8 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">SMEs</h3>
                    <p className="text-gray-600 mb-4">Established small and medium enterprises looking to innovate and expand</p>
                    
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">Enterprise tools</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">Business intelligence</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">Process automation</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-purple-500 mr-2 mt-1">•</span>
                        <span className="text-gray-600">Market expansion</span>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Why Use VentureNext Section */}
        <div className="bg-cream-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <div className="bg-pink-100 rounded-full p-2">
                  <svg className="h-6 w-6 text-pink-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14h2v7h-2zm0 8h2v2h-2z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Use VentureNext?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Your business deserves better than random Google searches and 50 open tabs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.length > 0 ? values.map((value, index) => {
                const IconComponent = getIcon(value.icon_name);
                // Define a set of icons and colors to use
                const icons = [
                  <svg key="icon1" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>,
                  <svg key="icon2" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 7a4 4 0 100-8 4 4 0 000 8z" fill="currentColor"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>,
                  <svg key="icon3" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ];
                const bgColors = ["bg-orange-500", "bg-blue-500", "bg-green-500"];
                
                return (
                  <div key={value.id} className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`${bgColors[index % bgColors.length]} rounded-md p-2 inline-flex`}>
                        {icons[index % icons.length]}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              }) : (
                <>
                  {/* Built for doers */}
                  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-orange-500 rounded-md p-2 inline-flex">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Built for doers</h3>
                    <p className="text-gray-600">We don't just list services. We curate what works, ditch what doesn't, and get straight to the point.</p>
                  </div>
                  
                  {/* Founder-first */}
                  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-blue-500 rounded-md p-2 inline-flex">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Founder-first</h3>
                    <p className="text-gray-600">We understand small teams and solo operators because we are one.</p>
                  </div>
                  
                  {/* Curated, not cluttered */}
                  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-orange-500 rounded-md p-2 inline-flex">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Curated, not cluttered</h3>
                    <p className="text-gray-600">Less doom-scrolling, more decision-making.</p>
                  </div>
                </>
              )}
            </div>
            
            {/* Second row of cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {values.length > 3 ? values.slice(3, 6).map((value, index) => {
                const IconComponent = getIcon(value.icon_name);
                // Define a set of icons and colors to use
                const icons = [
                  <svg key="icon4" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>,
                  <svg key="icon5" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>,
                  <svg key="icon6" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ];
                const bgColors = ["bg-orange-500", "bg-blue-500", "bg-orange-500"];
                
                return (
                  <div key={value.id} className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`${bgColors[index % bgColors.length]} rounded-md p-2 inline-flex`}>
                        {icons[index % icons.length]}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                );
              }) : (
                <>
                  {/* Real-world use cases */}
                  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-orange-500 rounded-md p-2 inline-flex">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-world use cases</h3>
                    <p className="text-gray-600">Tools and providers recommended by real businesses doing real things.</p>
                  </div>
                  
                  {/* Save time and money */}
                  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-blue-500 rounded-md p-2 inline-flex">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Save time and money</h3>
                    <p className="text-gray-600">Skip the trial-and-error phase. We've already done it.</p>
                  </div>
                  
                  {/* Better than Google */}
                  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <div className="flex justify-center mb-4">
                      <div className="bg-orange-500 rounded-md p-2 inline-flex">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Better than Google</h3>
                    <p className="text-gray-600">Your business deserves better than random Google searches and 50 open tabs.</p>
                  </div>
                </>
              )}
            </div>
            
            {/* CTA Button */}
            <div className="flex justify-center mt-12">
              <Link href="/services" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-md transition duration-300">
                Start Building Smarter
              </Link>
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
