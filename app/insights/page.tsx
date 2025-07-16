import React from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/layout';
import Image from 'next/image';

export default function InsightsPage() {
  // Mock data for blog articles
  const articles = [
    {
      id: 1,
      title: '5 Essential Steps to Register Your Business in Singapore',
      category: 'Business Registration',
      date: 'Dec 15, 2024',
      readTime: '5 min read',
      excerpt: 'Navigate the process of company formation with our comprehensive guide covering ACRA registration, statutory requirements, and key considerations.',
      slug: 'register-business-singapore',
      imagePlaceholder: true
    },
    {
      id: 2,
      title: 'Top AI Tools Every SME Should Consider in 2024',
      category: 'AI Tools',
      date: 'Dec 12, 2024',
      readTime: '7 min read',
      excerpt: 'Discover the latest AI solutions that can streamline operations, boost productivity, and give your business a competitive edge.',
      slug: 'ai-tools-sme-2024',
      imagePlaceholder: true
    },
    {
      id: 3,
      title: 'Banking Solutions for Startups: Singapore vs Malaysia',
      category: 'Banking & Finance',
      date: 'Dec 10, 2024',
      readTime: '6 min read',
      excerpt: 'Compare banking options, account opening requirements, and financial services tailored for emerging businesses in both markets.',
      slug: 'banking-solutions-startups',
      imagePlaceholder: true
    },
    {
      id: 4,
      title: 'Legal Compliance Checklist for New Businesses',
      category: 'Legal & Compliance',
      date: 'Dec 8, 2024',
      readTime: '8 min read',
      excerpt: 'Ensure your business stays compliant with this comprehensive checklist covering all legal requirements for new companies in Singapore.',
      slug: 'legal-compliance-checklist',
      imagePlaceholder: true
    },
    {
      id: 5,
      title: 'Digital Marketing Strategies for Local Businesses',
      category: 'Marketing',
      date: 'Dec 5, 2024',
      readTime: '9 min read',
      excerpt: 'Learn effective digital marketing tactics specifically designed for local businesses to increase visibility and attract customers.',
      slug: 'digital-marketing-strategies',
      imagePlaceholder: true
    },
    {
      id: 6,
      title: 'Funding Options for Early-Stage Startups in Southeast Asia',
      category: 'Funding',
      date: 'Dec 3, 2024',
      readTime: '10 min read',
      excerpt: 'Explore various funding sources available to early-stage startups in Southeast Asia, from angel investors to government grants.',
      slug: 'funding-options-startups',
      imagePlaceholder: true
    },
    {
      id: 7,
      title: 'How to Choose the Right Business Structure for Your Company',
      category: 'Business Registration',
      date: 'Nov 30, 2024',
      readTime: '7 min read',
      excerpt: 'Understand the differences between sole proprietorship, partnership, LLC, and corporation to make the best choice for your business.',
      slug: 'choose-business-structure',
      imagePlaceholder: true
    },
    {
      id: 8,
      title: 'Implementing AI Chatbots for Customer Service',
      category: 'AI Tools',
      date: 'Nov 28, 2024',
      readTime: '6 min read',
      excerpt: 'A step-by-step guide to implementing AI chatbots that can handle customer inquiries and improve service efficiency.',
      slug: 'ai-chatbots-customer-service',
      imagePlaceholder: true
    },
    {
      id: 9,
      title: 'Managing Business Finances: Best Practices for SMEs',
      category: 'Banking & Finance',
      date: 'Nov 25, 2024',
      readTime: '8 min read',
      excerpt: 'Essential financial management practices that every small and medium enterprise should implement for sustainable growth.',
      slug: 'managing-business-finances',
      imagePlaceholder: true
    },
    {
      id: 10,
      title: 'Data Protection Regulations in Singapore and Malaysia',
      category: 'Legal & Compliance',
      date: 'Nov 22, 2024',
      readTime: '9 min read',
      excerpt: 'An overview of PDPA in Singapore and PDPA in Malaysia, and how businesses can ensure compliance with data protection laws.',
      slug: 'data-protection-regulations',
      imagePlaceholder: true
    },
    {
      id: 11,
      title: 'Social Media Marketing for B2B Companies',
      category: 'Marketing',
      date: 'Nov 20, 2024',
      readTime: '7 min read',
      excerpt: 'Strategies and tactics for B2B companies to effectively leverage social media platforms for lead generation and brand building.',
      slug: 'social-media-b2b',
      imagePlaceholder: true
    },
    {
      id: 12,
      title: 'Venture Capital vs Angel Investment: Which is Right for Your Startup?',
      category: 'Funding',
      date: 'Nov 18, 2024',
      readTime: '8 min read',
      excerpt: 'Compare the pros and cons of venture capital and angel investment to determine the best funding source for your startup.',
      slug: 'vc-vs-angel-investment',
      imagePlaceholder: true
    }
  ];

  // Category filters
  const categories = [
    { name: 'All', active: true },
    { name: 'Business Registration', active: false },
    { name: 'AI Tools', active: false },
    { name: 'Banking & Finance', active: false },
    { name: 'Legal & Compliance', active: false },
    { name: 'Marketing', active: false },
    { name: 'Funding', active: false }
  ];

  return (
    <Layout>
      <div className='flex-1 w-full flex flex-col items-center bg-gray-50'>
        {/* Header Section */}
        <section className='w-full bg-yellow-50 py-12'>
          <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <h1 className='text-4xl md:text-5xl font-bold mb-4 text-gray-900'>Business Insights & Resources</h1>
            <p className='text-lg text-gray-600'>
              Stay ahead with expert insights, guides, and industry trends to help your business
              thrive in Singapore and Malaysia.
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <section className='w-full bg-white border-b border-gray-200'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-x-auto'>
            <div className='flex space-x-2'>
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/insights${category.name === 'All' ? '' : `?category=${encodeURIComponent(category.name)}`}`}
                  className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                    category.active 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className='w-full py-12'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {articles.map((article) => (
                <div key={article.id} className='bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300'>
                  {/* Image Placeholder */}
                  <div className='relative h-48 bg-gray-200 flex items-center justify-center'>
                    {article.imagePlaceholder && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  
                  <div className='p-6'>
                    {/* Category Tag */}
                    <div className='mb-4'>
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        article.category === 'Business Registration' ? 'bg-blue-100 text-blue-800' :
                        article.category === 'AI Tools' ? 'bg-purple-100 text-purple-800' :
                        article.category === 'Banking & Finance' ? 'bg-orange-100 text-orange-800' :
                        article.category === 'Legal & Compliance' ? 'bg-red-100 text-red-800' :
                        article.category === 'Marketing' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {article.category}
                      </span>
                    </div>
                    
                    {/* Article Title */}
                    <h2 className='text-xl font-bold mb-2 hover:text-orange-500 transition-colors'>
                      <Link href={`/insights/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>
                    
                    {/* Meta Info */}
                    <div className='flex items-center text-sm text-gray-500 mb-3'>
                      <span className='flex items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {article.date}
                      </span>
                      <span className='mx-2'>•</span>
                      <span className='flex items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {article.readTime}
                      </span>
                    </div>
                    
                    {/* Excerpt */}
                    <p className='text-gray-600 mb-4 line-clamp-3'>
                      {article.excerpt}
                    </p>
                    
                    {/* Read More Link */}
                    <Link 
                      href={`/insights/${article.slug}`}
                      className='inline-flex items-center text-orange-500 hover:text-orange-600 font-medium'
                    >
                      Read More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className='mt-12 flex justify-center'>
              <nav className='inline-flex rounded-md shadow'>
                <a href="#" className='py-2 px-4 bg-white border border-gray-300 rounded-l-md text-sm font-medium text-gray-500 hover:bg-gray-50'>
                  Previous
                </a>
                <a href="#" className='py-2 px-4 bg-orange-500 border border-orange-500 text-sm font-medium text-white'>
                  1
                </a>
                <a href="#" className='py-2 px-4 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50'>
                  2
                </a>
                <a href="#" className='py-2 px-4 bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50'>
                  3
                </a>
                <span className='py-2 px-4 bg-white border border-gray-300 text-sm font-medium text-gray-700'>
                  ...
                </span>
                <a href="#" className='py-2 px-4 bg-white border border-gray-300 rounded-r-md text-sm font-medium text-gray-500 hover:bg-gray-50'>
                  Next
                </a>
              </nav>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
