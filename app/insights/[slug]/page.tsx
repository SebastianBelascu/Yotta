import React from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/layout';
import { notFound } from 'next/navigation';

// Mock data for blog articles - in a real app, this would come from a CMS or database
const articles = [
  {
    id: 1,
    title: '5 Essential Steps to Register Your Business in Singapore',
    category: 'Business Registration',
    date: 'Dec 15, 2024',
    readTime: '5 min read',
    author: 'Sarah Mitchell',
    authorRole: 'Senior Business Consultant',
    content: `
      <h2>Understanding Business Registration in Singapore</h2>
      <p>Singapore consistently ranks as one of the world's easiest places to do business, thanks to its streamlined registration process, favorable tax system, and strategic location in Southeast Asia. Before diving into the registration steps, it's important to understand the basics of company formation in Singapore.</p>
      
      <h2>Step 1: Choose Your Business Structure</h2>
      <p>The first and most crucial step is deciding on the right business structure. Singapore offers several options:</p>
      <ul>
        <li><strong>Private Limited Company</strong> - The most common choice, offering limited liability protection</li>
        <li><strong>Sole Proprietorship</strong> - Simple structure but without liability protection</li>
        <li><strong>Partnership</strong> - Shared ownership between 2-20 partners</li>
        <li><strong>Limited Liability Partnership (LLP)</strong> - Combines partnership flexibility with limited liability</li>
        <li><strong>Branch Office</strong> - Extension of foreign companies</li>
      </ul>
      <p>Each structure has different implications for taxation, liability, and compliance requirements. For most businesses, a Private Limited Company offers the best balance of credibility, protection, and tax benefits.</p>
      
      <h2>Step 2: Fulfill the Requirements</h2>
      <p>To register a Private Limited Company in Singapore, you'll need:</p>
      <ul>
        <li>At least one shareholder (can be individual or corporate entity)</li>
        <li>At least one director who is a Singapore resident (citizen, permanent resident, or EntrePass holder)</li>
        <li>A company secretary (within 6 months of incorporation)</li>
        <li>Minimum paid-up capital of S$1 (can be increased later)</li>
        <li>A registered physical address in Singapore (not a P.O. box)</li>
      </ul>
      <p>If you don't have a local director, consider using a nominee director service until you establish local presence or obtain relevant passes.</p>
      
      <h2>Step 3: Register with ACRA</h2>
      <p>All businesses must register with the Accounting and Corporate Regulatory Authority (ACRA) through the BizFile+ portal. The registration process involves:</p>
      <ul>
        <li>Reserving a company name</li>
        <li>Submitting company constitution documents</li>
        <li>Providing directors' and shareholders' details</li>
        <li>Declaring compliance with the Companies Act</li>
      </ul>
      <p>Name approval typically takes 1-2 hours if there are no issues, and the entire registration can be completed within 1-3 business days.</p>
      
      <h2>Step 4: Post-Registration Requirements</h2>
      <p>After successful registration, you'll need to:</p>
      <ul>
        <li>Apply for relevant business licenses and permits specific to your industry</li>
        <li>Register for Goods and Services Tax (GST) if your annual turnover exceeds S$1 million</li>
        <li>Open a corporate bank account</li>
        <li>Register with the Central Provident Fund (CPF) if hiring employees</li>
        <li>Set up a proper accounting system to comply with Singapore's reporting requirements</li>
      </ul>
      
      <h2>Step 5: Ongoing Compliance</h2>
      <p>Singapore companies must maintain ongoing compliance with:</p>
      <ul>
        <li>Annual filing of financial statements and tax returns</li>
        <li>Holding Annual General Meetings (AGMs)</li>
        <li>Updating ACRA about any changes in company details</li>
        <li>Maintaining proper corporate records</li>
        <li>Filing annual returns</li>
      </ul>
      <p>Failure to comply with these requirements can result in penalties or even deregistration of your company.</p>
      
      <h2>Conclusion</h2>
      <p>While Singapore offers one of the most efficient business registration processes globally, navigating the requirements can still be complex for newcomers. Many entrepreneurs choose to work with corporate service providers who can handle the entire registration process and ongoing compliance requirements, allowing them to focus on their core business activities.</p>
      <p>By following these five essential steps and ensuring proper compliance from the start, you'll set your Singapore business on the path to success in one of Asia's most dynamic economies.</p>
    `,
    tags: ['Singapore', 'Business Registration', 'ACRA', 'Startup', 'Legal'],
    slug: 'register-business-singapore',
    imagePlaceholder: true
  },
  {
    id: 2,
    title: 'Top AI Tools Every SME Should Consider in 2024',
    category: 'AI Tools',
    date: 'Dec 12, 2024',
    readTime: '7 min read',
    author: 'Michael Chen',
    authorRole: 'Technology Consultant',
    content: `<p>Detailed content about AI tools for SMEs would go here...</p>`,
    tags: ['AI', 'SME', 'Technology', 'Productivity'],
    slug: 'ai-tools-sme-2024',
    imagePlaceholder: true
  },
  // Other articles data would be here...
];

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Since we're using an async function, we can safely use params
  const { slug } = params;
  
  // Find the article matching the slug
  const article = articles.find(article => article.slug === slug);
  
  // If no matching article is found, return 404
  if (!article) {
    notFound();
  }

  return (
    <Layout>
      <div className="flex-1 w-full flex flex-col items-center bg-gray-50">
        {/* Article Header */}
        <div className="w-full bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Category Badge */}
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
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
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {article.date}
              </span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {article.readTime}
              </span>
            </div>
            
            {/* Author Info */}
            <div className="flex items-center mb-8">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                {/* Placeholder for author avatar */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">{article.author}</p>
                <p className="text-sm text-gray-500">{article.authorRole}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured Image */}
        <div className="w-full bg-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="relative h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
              {article.imagePlaceholder && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="w-full bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="prose prose-orange max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
            
            {/* Tags */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Link 
                    key={index} 
                    href={`/insights?tag=${encodeURIComponent(tag)}`}
                    className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Share */}
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Share</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Related Articles */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles
                  .filter(a => a.id !== article.id && a.category === article.category)
                  .slice(0, 2)
                  .map(relatedArticle => (
                    <div key={relatedArticle.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="p-4">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${
                          relatedArticle.category === 'Business Registration' ? 'bg-blue-100 text-blue-800' :
                          relatedArticle.category === 'AI Tools' ? 'bg-purple-100 text-purple-800' :
                          relatedArticle.category === 'Banking & Finance' ? 'bg-orange-100 text-orange-800' :
                          relatedArticle.category === 'Legal & Compliance' ? 'bg-red-100 text-red-800' :
                          relatedArticle.category === 'Marketing' ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {relatedArticle.category}
                        </span>
                        <h3 className="text-lg font-medium mb-2 hover:text-orange-500 transition-colors">
                          <Link href={`/insights/${relatedArticle.slug}`}>
                            {relatedArticle.title}
                          </Link>
                        </h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{relatedArticle.date}</span>
                          <span className="mx-2">•</span>
                          <span>{relatedArticle.readTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="mt-8 text-center">
                <Link 
                  href="/insights" 
                  className="inline-flex items-center px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-500 hover:text-white transition-colors"
                >
                  View All Articles
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
