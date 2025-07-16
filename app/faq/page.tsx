'use client'

import React, { useState } from 'react';
import { Layout } from '@/components/layout/layout';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

type FaqItem = {
  question: string;
  answer: string;
  category: 'general' | 'providers';
};

export default function FaqPage() {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});
  
  const toggleItem = (index: number) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqs: FaqItem[] = [
    {
      question: 'How does Yotta work?',
      answer: 'Yotta connects businesses with verified service providers across various categories. You can search for services, compare options, read reviews, and request quotes directly through our platform.',
      category: 'general'
    },
    {
      question: 'Is Yotta free to use?',
      answer: 'Yes, Yotta is completely free for businesses looking for services. We only charge service providers a small fee to list their services on our platform.',
      category: 'general'
    },
    {
      question: 'How do I get started?',
      answer: 'Simply create an account, browse through our service categories, and reach out to providers that match your needs. You can request quotes, compare offerings, and book services directly through Yotta.',
      category: 'general'
    },
    {
      question: 'Can I trust the service providers on Yotta?',
      answer: 'All service providers on Yotta go through a verification process. We check their credentials, business registration, and collect reviews from past clients to ensure quality and reliability.',
      category: 'general'
    },
    {
      question: 'How can I list my services on Yotta?',
      answer: 'To list your services, create a service provider account, complete your profile with all required information, and submit it for verification. Once approved, you can start listing your services.',
      category: 'providers'
    },
    {
      question: 'What are the requirements to become a provider?',
      answer: 'You need to have a registered business, relevant qualifications or certifications for your service category, and provide references or portfolio of past work. We also conduct interviews for certain service categories.',
      category: 'providers'
    },
    {
      question: 'How much does it cost to list on Yotta?',
      answer: 'We offer different subscription plans starting from MYR 99/month. The cost depends on the number of services you want to list and additional features like premium placement and marketing support.',
      category: 'providers'
    },
    {
      question: 'How do I get more visibility on the platform?',
      answer: 'Complete your profile with high-quality images and detailed service descriptions, collect positive reviews from clients, respond promptly to inquiries, and consider our premium placement options for increased visibility.',
      category: 'providers'
    }
  ];

  const generalFaqs = faqs.filter(faq => faq.category === 'general');
  const providerFaqs = faqs.filter(faq => faq.category === 'providers');

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
                {generalFaqs.map((faq, index) => (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button 
                      onClick={() => toggleItem(index)}
                      className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      <ChevronDownIcon 
                        className={`w-5 h-5 text-gray-500 transition-transform ${openItems[index] ? 'transform rotate-180' : ''}`} 
                      />
                    </button>
                    {openItems[index] && (
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
                {providerFaqs.map((faq, index) => {
                  const globalIndex = index + generalFaqs.length;
                  return (
                    <div 
                      key={globalIndex} 
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button 
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full text-left px-6 py-4 flex justify-between items-center hover:bg-gray-50 focus:outline-none"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <ChevronDownIcon 
                          className={`w-5 h-5 text-gray-500 transition-transform ${openItems[globalIndex] ? 'transform rotate-180' : ''}`} 
                        />
                      </button>
                      {openItems[globalIndex] && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
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
