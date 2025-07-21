import React from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/layout';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import FallbackImage from '@/components/ui/FallbackImage';
// Using searchParams prop instead of useSearchParams hook for server components

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  status: string;
  author_name: string;
  author_title: string;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category;
  const tag = resolvedSearchParams.tag;
  const page = resolvedSearchParams.page;

  // Convert to proper types
  const categoryFilter = typeof category === 'string' ? category : undefined;
  const tagFilter = typeof tag === 'string' ? tag : undefined;
  const currentPage = typeof page === 'string' ? parseInt(page, 10) : 1;

  // Fetch blog posts from Supabase
  const supabase = await createClient();

  let query = supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'Published')
    .order('published_at', { ascending: false });

  if (categoryFilter) {
    query = query.eq('category', categoryFilter);
  }

  if (tagFilter) {
    query = query.contains('tags', [tagFilter]);
  }

  const { data: articles, error } = await query;

  if (error) {
    console.error('Error fetching blog posts:', error);
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to generate excerpt from content
  const getExcerpt = (content: string) => {
    // Remove HTML tags and get first 150 characters
    return content
      .replace(/<[^>]*>/g, '')
      .substring(0, 150)
      .trim() + '...';
  };

  // Helper function to estimate read time
  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const textLength = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(textLength / wordsPerMinute);
    return `${readTime} min read`;
  };

  // Pagination settings
  const ITEMS_PER_PAGE = 12;
  const filteredArticles = articles || [];
  const totalArticles = filteredArticles.length;
  const totalPages = Math.ceil(totalArticles / ITEMS_PER_PAGE);
  
  // Get current page articles
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // Extract unique categories from articles
  const uniqueCategories = ['All', ...Array.from(new Set((articles || []).map(post => post.category || 'Uncategorized')))];
  
  // Category filters
  const categories = uniqueCategories.map(category => ({
    name: category,
    active: categoryFilter ? category === categoryFilter : category === 'All'
  }));

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
              {currentArticles.length > 0 ? (
                currentArticles.map((article: BlogPost) => (
                  <div key={article.id} className='bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300'>
                    {/* Featured Image */}
                    <div className='relative h-48 bg-gray-200 flex items-center justify-center'>
                      {article.featured_image ? (
                        <FallbackImage
                          src={article.featured_image}
                          alt={article.title}
                          className="h-full w-full object-cover"
                          fallbackSrc="https://via.placeholder.com/800x400?text=Image+Not+Found"
                          fill
                        />
                      ) : (
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
                          {article.category || 'Uncategorized'}
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
                          {formatDate(article.published_at || article.created_at)}
                        </span>
                        <span className='mx-2'>•</span>
                        <span className='flex items-center'>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {getReadTime(article.content)}
                        </span>
                      </div>
                      
                      {/* Excerpt */}
                      <p className='text-gray-600 mb-4 line-clamp-3'>
                        {getExcerpt(article.content)}
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
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
                  <p className="mt-1 text-gray-500">
                    {categoryFilter || tagFilter ? 
                      `No articles match your current filters. Try adjusting your search criteria.` : 
                      `There are no published articles yet. Check back soon!`}
                  </p>
                  <Link 
                    href="/insights"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    View All Articles
                  </Link>
                </div>
              )}
            </div>
            
            {/* Pagination - only show if we have more than ITEMS_PER_PAGE articles */}
            {totalPages > 1 && (
              <div className='mt-12 flex justify-center'>
                <nav className='inline-flex rounded-md shadow'>
                  {/* Previous Page Button */}
                  <Link 
                    href={{
                      pathname: '/insights',
                      query: {
                        ...(categoryFilter ? { category: categoryFilter } : {}),
                        ...(tagFilter ? { tag: tagFilter } : {}),
                        ...(currentPage > 1 ? { page: currentPage - 1 } : {})
                      }
                    }}
                    className={`py-2 px-4 border rounded-l-md text-sm font-medium ${
                      currentPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                    aria-disabled={currentPage === 1}
                  >
                    Previous
                  </Link>
                  
                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Show first page, last page, current page, and pages around current
                    const showPageNum = pageNum === 1 || 
                                      pageNum === totalPages || 
                                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                    
                    if (!showPageNum) {
                      // Show ellipsis for skipped pages, but only once per gap
                      if (pageNum === 2 || pageNum === totalPages - 1) {
                        return (
                          <span key={`ellipsis-${pageNum}`} className='py-2 px-4 bg-white border border-gray-300 text-sm font-medium text-gray-700'>
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                    
                    return (
                      <Link
                        key={pageNum}
                        href={{
                          pathname: '/insights',
                          query: {
                            ...(categoryFilter ? { category: categoryFilter } : {}),
                            ...(tagFilter ? { tag: tagFilter } : {}),
                            ...(pageNum !== 1 ? { page: pageNum } : {})
                          }
                        }}
                        className={`py-2 px-4 border text-sm font-medium ${
                          pageNum === currentPage
                            ? 'bg-orange-500 border-orange-500 text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                  
                  {/* Next Page Button */}
                  <Link
                    href={{
                      pathname: '/insights',
                      query: {
                        ...(categoryFilter ? { category: categoryFilter } : {}),
                        ...(tagFilter ? { tag: tagFilter } : {}),
                        page: currentPage + 1
                      }
                    }}
                    className={`py-2 px-4 border rounded-r-md text-sm font-medium ${
                      currentPage >= totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                    aria-disabled={currentPage >= totalPages}
                  >
                    Next
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
