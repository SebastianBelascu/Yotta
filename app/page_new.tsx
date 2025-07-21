'use client'

import { hasEnvVars } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/layout';
import { SearchForm } from '@/components/search/search-form';
import FallbackImage from '@/components/ui/FallbackImage';
import { useState, useEffect } from 'react';

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

interface HomepageItem {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon_svg: string | null;
  section: string;
  display_order: number;
  price: string | null;
  original_price: string | null;
  discount_percentage: string | null;
  rating: number | null;
  review_count: number | null;
  company_name: string | null;
  badge_text: string | null;
  badge_color: string | null;
  features: string[] | null;
  button_text: string | null;
  button_link: string | null;
  is_published: boolean;
}

export default function Home() {
  const [homepageItems, setHomepageItems] = useState<HomepageItem[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch homepage content
      const homepageResponse = await fetch('/api/homepage?published=true');
      if (homepageResponse.ok) {
        const homepageData = await homepageResponse.json();
        setHomepageItems(homepageData);
      }

      // Fetch blog posts (keep existing logic)
      const blogResponse = await fetch('/api/blog?limit=3&status=Published');
      if (blogResponse.ok) {
        const blogData = await blogResponse.json();
        setLatestPosts(blogData.posts || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to estimate read time
  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const textLength = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readTime = Math.ceil(textLength / wordsPerMinute);
    return `${readTime} min read`;
  };

  // Filter items by section
  const heroContent = homepageItems.filter(item => item.section === 'hero');
  const categories = homepageItems.filter(item => item.section === 'categories');
  const featuredItems = homepageItems.filter(item => item.section === 'featured');
  const stepsItems = homepageItems.filter(item => item.section === 'steps');
  const dealsItems = homepageItems.filter(item => item.section === 'deals');

  const heroItem = heroContent[0];
  const stepsHeader = stepsItems.find(item => item.display_order === 0);
  const steps = stepsItems.filter(item => item.display_order > 0);
  const dealsHeader = dealsItems.find(item => item.display_order === 0);
  const deals = dealsItems.filter(item => item.display_order > 0);
  const featuredHeader = featuredItems.find(item => item.display_order === 0);
  const featured = featuredItems.filter(item => item.display_order > 0);

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 w-full flex flex-col items-center justify-center bg-gray-50 min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='flex-1 w-full flex flex-col items-center bg-gray-50'>
        {/* Hero Section */}
        <div className='w-full bg-gradient-to-b from-white to-gray-50 py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <h1 className='text-5xl md:text-6xl font-bold mb-6'>
              {heroItem?.title ? (
                <>
                  Find a <span className='text-orange-500'>better deal</span> for you
                </>
              ) : (
                <>
                  Find a <span className='text-orange-500'>better deal</span> for you
                </>
              )}
            </h1>
            <p className='text-gray-600 max-w-2xl mx-auto mb-6'>
              {heroItem?.description || 'Discover, compare and get quotes on the best services, deals, and AI tools to start, scale and succeed in business across Singapore and Malaysia.'}
            </p>

            {/* Search Bar */}
            <div className='max-w-3xl mx-auto'>
              <SearchForm className='p-2' />
            </div>
          </div>
        </div>

        {/* Service Categories */}
        <div className='w-full py-16 px-4'>
          <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
            {categories.map((category) => (
              <div key={category.id} className='bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center'>
                <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4'>
                  {category.icon_svg ? (
                    <div dangerouslySetInnerHTML={{ __html: category.icon_svg }} />
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-8 w-8'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='#000000'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      />
                    </svg>
                  )}
                </div>
                <h3 className='font-semibold text-lg mb-2'>{category.title}</h3>
                <p className='text-gray-600 text-sm'>{category.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured In Section */}
        <div className='w-full bg-gray-50 py-10'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h3 className='text-center text-gray-600 font-medium mb-8'>
              {featuredHeader?.title || 'Featured in:'}
            </h3>
            <div className='flex flex-wrap justify-center items-center gap-8 md:gap-12'>
              {featured.map((item) => (
                <div key={item.id} className='flex items-center'>
                  {item.icon_svg ? (
                    <div dangerouslySetInnerHTML={{ __html: item.icon_svg }} />
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='#FF0000'
                      className='mr-2'
                    >
                      <circle cx='12' cy='12' r='12' opacity='0.2' />
                    </svg>
                  )}
                  <span className='text-gray-700 font-medium'>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How Yotta Works Section */}
        <div className='w-full bg-gray-50 py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-4xl md:text-5xl font-bold text-center mb-3'>
              {stepsHeader?.title || 'How Yotta Works'}
            </h2>
            <p className='text-center text-gray-600 mb-12'>
              {stepsHeader?.description || 'Get started in 4 simple steps'}
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {steps.map((step, index) => (
                <div key={step.id} className='flex flex-col items-center text-center'>
                  <div className='bg-amber-100 rounded-full w-24 h-24 flex items-center justify-center mb-4'>
                    {step.icon_svg ? (
                      <div dangerouslySetInnerHTML={{ __html: step.icon_svg }} />
                    ) : (
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='32'
                        height='32'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-orange-500'
                      >
                        <circle cx='11' cy='11' r='8'></circle>
                        <line x1='21' y1='21' x2='16.65' y2='16.65'></line>
                      </svg>
                    )}
                  </div>
                  <div className='bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mb-4'>
                    {step.display_order}
                  </div>
                  <h3 className='text-xl font-semibold mb-2'>{step.title}</h3>
                  <p className='text-gray-600'>{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Deals Section */}
        <div className='w-full bg-[#FFF1D7] py-12'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-6'>
              <h2 className='text-4xl md:text-5xl font-bold mb-3'>
                {dealsHeader?.title || 'Top Deals This Week'}
              </h2>
              <p className='text-gray-600'>
                {dealsHeader?.description || 'Don\'t miss these exclusive offers - limited time only!'}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {deals.map((deal) => (
                <div key={deal.id} className='bg-white rounded-lg overflow-hidden h-[450px] flex flex-col'>
                  <div className='relative'>
                    {deal.discount_percentage && (
                      <div className='absolute top-2 left-0'>
                        <div className={`${deal.badge_color === 'blue' ? 'bg-blue-500' : 'bg-red-500'} text-white text-xs font-bold px-3 py-1 rounded-r`}>
                          {deal.discount_percentage}
                        </div>
                      </div>
                    )}
                    {deal.badge_text && (
                      <div className='absolute top-2 right-2'>
                        <div className={`${deal.badge_color === 'blue' ? 'bg-blue-600' : deal.badge_color === 'green' ? 'bg-green-500' : 'bg-orange-500'} text-white text-xs font-bold px-3 py-1 rounded`}>
                          {deal.badge_text}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='p-6 flex-1 flex flex-col justify-between'>
                    <div>
                      <h3 className='font-bold text-lg'>{deal.title}</h3>
                      <p className='text-gray-500 text-sm mb-3'>{deal.company_name}</p>

                      <div className='mb-4'>
                        <div className='text-orange-500 font-bold text-xl'>
                          {deal.price}{' '}
                          {deal.original_price && (
                            <span className='text-gray-400 text-sm font-normal line-through'>
                              {deal.original_price}
                            </span>
                          )}
                        </div>
                        {deal.rating && deal.review_count && (
                          <div className='flex items-center mt-1'>
                            <div className='flex text-yellow-400'>
                              <svg
                                xmlns='http://www.w3.org/2000/svg'
                                viewBox='0 0 24 24'
                                fill='currentColor'
                                className='w-4 h-4'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            </div>
                            <span className='ml-1 text-sm font-medium'>{deal.rating}</span>
                            <span className='ml-1 text-xs text-gray-500'>
                              ({deal.review_count} reviews)
                            </span>
                          </div>
                        )}
                      </div>

                      {deal.features && (
                        <ul className='space-y-2 mb-4'>
                          {deal.features.map((feature, index) => (
                            <li key={index} className='flex items-center text-sm'>
                              <svg
                                className='w-4 h-4 text-green-500 mr-2'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth='2'
                                  d='M5 13l4 4L19 7'
                                ></path>
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <button className='w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center mt-auto'>
                      {deal.button_text || 'Get This Deal'}
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 ml-2'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Section - Keep existing logic */}
        {latestPosts && latestPosts.length > 0 && (
          <div className='w-full bg-white py-16'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
              <div className='text-center mb-12'>
                <h2 className='text-4xl md:text-5xl font-bold mb-3'>
                  Latest Insights
                </h2>
                <p className='text-gray-600'>
                  Stay updated with the latest business tips and industry trends
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                {latestPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className='group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden'
                  >
                    <div className='aspect-w-16 aspect-h-9 bg-gray-200'>
                      <FallbackImage
                        src={post.featured_image}
                        alt={post.title}
                        className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                        fallbackSrc='/images/blog-placeholder.jpg'
                      />
                    </div>
                    <div className='p-6'>
                      <div className='flex items-center text-sm text-gray-500 mb-2'>
                        <span className='bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium mr-2'>
                          {post.category}
                        </span>
                        <span>{formatDate(post.published_at || post.created_at)}</span>
                        <span className='mx-1'>•</span>
                        <span>{getReadTime(post.content)}</span>
                      </div>
                      <h3 className='text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors'>
                        {post.title}
                      </h3>
                      <div className='flex items-center text-sm text-gray-600'>
                        <span>By {post.author_name}</span>
                        {post.author_title && (
                          <>
                            <span className='mx-1'>•</span>
                            <span>{post.author_title}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className='text-center mt-12'>
                <Link
                  href='/blog'
                  className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors'
                >
                  View All Articles
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4 ml-2'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
