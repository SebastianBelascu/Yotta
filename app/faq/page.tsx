'use client'

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/layout';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_published: boolean;
};

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/faq?published=true');
      if (response.ok) {
        const data = await response.json();
        setFaqs(data);
      } else {
        console.error('Failed to fetch FAQs');
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const generalFaqs = faqs.filter(faq => faq.category === 'general');
  const providerFaqs = faqs.filter(faq => faq.category === 'providers');

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col min-h-screen">
          <div className="bg-blue-700 text-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-lg md:text-xl max-w-3xl mx-auto">
                Everything you need to know about using Yotta to grow your business
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
        <div className="bg-blue-700 text-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg md:text-xl max-w-3xl mx-auto">
              Everything you need to know about using Yotta to grow your business
            </p>
          </div>
        </div>

        {/* FAQ Content */}
        <div className="flex-grow bg-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* How It Works Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h2>
              <div className="space-y-4">
                {generalFaqs.map((faq) => (
                  <div 
                    key={faq.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button 
                      onClick={() => toggleItem(faq.id)}
                      className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <ChevronDownIcon 
                        className={`w-5 h-5 text-gray-500 transition-transform ${openItems[faq.id] ? 'transform rotate-180' : ''}`} 
                      />
                    </button>
                    {openItems[faq.id] && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* For Service Providers Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">For Service Providers</h2>
              <div className="space-y-4">
                {providerFaqs.map((faq) => (
                  <div 
                    key={faq.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button 
                      onClick={() => toggleItem(faq.id)}
                      className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <ChevronDownIcon 
                        className={`w-5 h-5 text-gray-500 transition-transform ${openItems[faq.id] ? 'transform rotate-180' : ''}`} 
                      />
                    </button>
                    {openItems[faq.id] && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Still Have Questions */}
            <div className="mt-16 text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-6">
                If you couldn't find the answer to your question, feel free to contact our support team.
              </p>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
