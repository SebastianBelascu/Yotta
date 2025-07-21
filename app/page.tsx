import { hasEnvVars } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/layout';
import { SearchForm } from '@/components/search/search-form';
import { createClient } from '@/lib/supabase/server';
import FallbackImage from '@/components/ui/FallbackImage';

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

export default async function Home() {
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

  // Fetch latest blog posts from Supabase
  const supabase = await createClient();
  const { data: latestPosts, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'Published')
    .order('published_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching blog posts:', error);
  }
  return (
    <Layout>
      <div className='flex-1 w-full flex flex-col items-center bg-gray-50'>
        {/* Hero Section */}
        <div className='w-full bg-gradient-to-b from-white to-gray-50 py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <h1 className='text-5xl md:text-6xl font-bold mb-6'>
              Find a <span className='text-orange-500'>better deal</span> for
              you
            </h1>
            <p className='text-gray-600 max-w-2xl mx-auto mb-6'>
              Discover, compare and get quotes on the best services, deals, and
              AI tools to start, scale and succeed in business across Singapore
              and Malaysia.
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
            {/* Category 1 */}
            <div className='bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4'>
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
              </div>
              <h3 className='font-semibold text-lg mb-2'>SaaS Tools</h3>
              <p className='text-gray-600 text-sm'>
                Software solutions for business growth
              </p>
            </div>

            {/* Category 2 */}
            <div className='bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4'>
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
                    d='M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
                  />
                </svg>
              </div>
              <h3 className='font-semibold text-lg mb-2'>AI Tools</h3>
              <p className='text-gray-600 text-sm'>
                Artificial intelligence powered services
              </p>
            </div>

            {/* Category 3 */}
            <div className='bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4'>
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
                    d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                  />
                </svg>
              </div>
              <h3 className='font-semibold text-lg mb-2'>
                Register A Business
              </h3>
              <p className='text-gray-600 text-sm'>
                Legal incorporation and setup services
              </p>
            </div>

            {/* Category 4 */}
            <div className='bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4'>
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
                    d='M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <h3 className='font-semibold text-lg mb-2'>Marketing Services</h3>
              <p className='text-gray-600 text-sm'>
                Digital marketing and growth solutions
              </p>
            </div>

            {/* Category 5 */}
            <div className='bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center'>
              <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4'>
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
                    d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
              </div>
              <h3 className='font-semibold text-lg mb-2'>Design & Creative</h3>
              <p className='text-gray-600 text-sm'>
                Branding, logos, and creative services
              </p>
            </div>
          </div>
        </div>

        {/* Featured In Section */}
        <div className='w-full bg-gray-50 py-10'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h3 className='text-center text-gray-600 font-medium mb-8'>
              Featured in:
            </h3>
            <div className='flex flex-wrap justify-center items-center gap-8 md:gap-12'>
              <div className='flex items-center'>
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
                <span className='text-gray-700 font-medium'>TechCrunch</span>
              </div>
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='#000000'
                  className='mr-2'
                  opacity='0.7'
                >
                  <rect width='24' height='24' opacity='0.2' />
                </svg>
                <span className='text-gray-700 font-medium'>Forbes</span>
              </div>
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='#000000'
                  className='mr-2'
                  opacity='0.7'
                >
                  <rect width='24' height='24' opacity='0.2' />
                </svg>
                <span className='text-gray-700 font-medium'>
                  The Straits Times
                </span>
              </div>
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='#0088CC'
                  className='mr-2'
                >
                  <rect width='24' height='24' rx='4' opacity='0.2' />
                </svg>
                <span className='text-gray-700 font-medium'>
                  Channel NewsAsia
                </span>
              </div>
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='#00AAFF'
                  className='mr-2'
                >
                  <circle cx='12' cy='12' r='12' opacity='0.2' />
                </svg>
                <span className='text-gray-700 font-medium'>Tech in Asia</span>
              </div>
              <div className='flex items-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='#FF5722'
                  className='mr-2'
                >
                  <path d='M12 2L2 12h3v10h14V12h3L12 2z' opacity='0.2' />
                </svg>
                <span className='text-gray-700 font-medium'>e27</span>
              </div>
            </div>
          </div>
        </div>

        {/* How Yotta Works Section */}
        <div className='w-full bg-gray-50 py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-4xl md:text-5xl font-bold text-center mb-3'>
              How Yotta Works
            </h2>
            <p className='text-center text-gray-600 mb-12'>
              Get started in 4 simple steps
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {/* Step 1 */}
              <div className='flex flex-col items-center text-center'>
                <div className='bg-amber-100 rounded-full w-24 h-24 flex items-center justify-center mb-4'>
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
                </div>
                <div className='bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mb-4'>
                  1
                </div>
                <h3 className='text-xl font-semibold mb-2'>
                  Search & Discover
                </h3>
                <p className='text-gray-600'>
                  Browse through our curated marketplace of business services
                  and tools
                </p>
              </div>

              {/* Step 2 */}
              <div className='flex flex-col items-center text-center'>
                <div className='bg-amber-100 rounded-full w-24 h-24 flex items-center justify-center mb-4'>
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
                    <path d='M12 20h9'></path>
                    <path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'></path>
                  </svg>
                </div>
                <div className='bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mb-4'>
                  2
                </div>
                <h3 className='text-xl font-semibold mb-2'>Compare Options</h3>
                <p className='text-gray-600'>
                  View detailed comparisons, pricing, and reviews from real
                  users
                </p>
              </div>

              {/* Step 3 */}
              <div className='flex flex-col items-center text-center'>
                <div className='bg-amber-100 rounded-full w-24 h-24 flex items-center justify-center mb-4'>
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
                    <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path>
                  </svg>
                </div>
                <div className='bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mb-4'>
                  3
                </div>
                <h3 className='text-xl font-semibold mb-2'>Get Quotes</h3>
                <p className='text-gray-600'>
                  Request personalized quotes from multiple providers instantly
                </p>
              </div>

              {/* Step 4 */}
              <div className='flex flex-col items-center text-center'>
                <div className='bg-amber-100 rounded-full w-24 h-24 flex items-center justify-center mb-4'>
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
                    <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
                    <polyline points='22 4 12 14.01 9 11.01'></polyline>
                  </svg>
                </div>
                <div className='bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold mb-4'>
                  4
                </div>
                <h3 className='text-xl font-semibold mb-2'>Choose & Start</h3>
                <p className='text-gray-600'>
                  Select the best option and start growing your business
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Deals Section */}
        <div className='w-full bg-[#FFF1D7] py-12'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='text-center mb-6'>
              <h2 className='text-4xl md:text-5xl font-bold mb-3'>
                Top Deals This Week
              </h2>
              <p className='text-gray-600'>
                Don't miss these exclusive offers - limited time only!
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Deal 1 */}
              <div className='bg-white rounded-lg overflow-hidden h-[450px] flex flex-col'>
                <div className='relative'>
                  <div className='absolute top-2 left-0'>
                    <div className='bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-r'>
                      40% OFF
                    </div>
                  </div>
                  <div className='absolute top-2 right-2'>
                    <div className='bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded'>
                      Most Popular
                    </div>
                  </div>
                </div>

                <div className='p-6 flex-1 flex flex-col justify-between'>
                  <div>
                    <h3 className='font-bold text-lg'>
                      Singapore Company Formation
                    </h3>
                    <p className='text-gray-500 text-sm mb-3'>FormSG Pro</p>

                    <div className='mb-4'>
                      <div className='text-orange-500 font-bold text-xl'>
                        From $299{' '}
                        <span className='text-gray-400 text-sm font-normal line-through'>
                          $499
                        </span>
                      </div>
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
                        <span className='ml-1 text-sm font-medium'>4.8</span>
                        <span className='ml-1 text-xs text-gray-500'>
                          (127 reviews)
                        </span>
                      </div>
                    </div>

                    <ul className='space-y-2 mb-4'>
                      <li className='flex items-center text-sm'>
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
                        ACRA Registration
                      </li>
                      <li className='flex items-center text-sm'>
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
                        Corporate Secretary
                      </li>
                      <li className='flex items-center text-sm'>
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
                        Registered Address
                      </li>
                    </ul>
                  </div>

                  <button className='w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center mt-auto'>
                    Get This Deal
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

              {/* Deal 2 */}
              <div className='bg-white rounded-lg overflow-hidden h-[450px] flex flex-col'>
                <div className='relative'>
                  <div className='absolute top-2 left-0'>
                    <div className='bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-r'>
                      50% OFF
                    </div>
                  </div>
                  <div className='absolute top-2 right-2'>
                    <div className='bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded'>
                      Best Value
                    </div>
                  </div>
                </div>

                <div className='p-6 flex-1 flex flex-col justify-between'>
                  <div>
                    <h3 className='font-bold text-lg'>AI-Powered CRM System</h3>
                    <p className='text-gray-500 text-sm mb-3'>SmartCRM Asia</p>

                    <div className='mb-4'>
                      <div className='text-orange-500 font-bold text-xl'>
                        From $49/month{' '}
                        <span className='text-gray-400 text-sm font-normal line-through'>
                          $99/month
                        </span>
                      </div>
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
                        <span className='ml-1 text-sm font-medium'>4.7</span>
                        <span className='ml-1 text-xs text-gray-500'>
                          (89 reviews)
                        </span>
                      </div>
                    </div>

                    <ul className='space-y-2 mb-4'>
                      <li className='flex items-center text-sm'>
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
                        Lead Management
                      </li>
                      <li className='flex items-center text-sm'>
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
                        Analytics Dashboard
                      </li>
                      <li className='flex items-center text-sm'>
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
                        24/7 Support
                      </li>
                    </ul>
                  </div>

                  <button className='w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center'>
                    Get This Deal
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

              {/* Deal 3 */}
              <div className='bg-white rounded-lg overflow-hidden h-[450px] flex flex-col'>
                <div className='relative'>
                  <div className='absolute top-2 left-0'>
                    <div className='bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-r'>
                      100% OFF
                    </div>
                  </div>
                  <div className='absolute top-2 right-2'>
                    <div className='bg-green-600 text-white text-xs font-bold px-3 py-1 rounded'>
                      Limited Time
                    </div>
                  </div>
                </div>

                <div className='p-6 flex-1 flex flex-col justify-between'>
                  <div>
                    <h3 className='font-bold text-lg'>
                      Business Banking Package
                    </h3>
                    <p className='text-gray-500 text-sm mb-3'>FinanceHub SG</p>

                    <div className='mb-4'>
                      <div className='text-orange-500 font-bold text-xl'>
                        Free Setup{' '}
                        <span className='text-gray-400 text-sm font-normal line-through'>
                          $200 Setup
                        </span>
                      </div>
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
                        <span className='ml-1 text-sm font-medium'>4.9</span>
                        <span className='ml-1 text-xs text-gray-500'>
                          (203 reviews)
                        </span>
                      </div>
                    </div>

                    <ul className='space-y-2 mb-4'>
                      <li className='flex items-center text-sm'>
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
                        Multi-currency Account
                      </li>
                      <li className='flex items-center text-sm'>
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
                        Online Banking
                      </li>
                      <li className='flex items-center text-sm'>
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
                        Debit Cards
                      </li>
                    </ul>
                  </div>

                  <button className='w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center'>
                    Get This Deal
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
            </div>

            <div className='mt-8 text-center'>
              <button className='inline-flex items-center px-6 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-md transition-colors font-medium'>
                View All Deals
              </button>
            </div>
          </div>
        </div>

        <div className='w-full bg-gray-50 py-16'>
  <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
    <h2 className='text-4xl md:text-5xl font-bold text-center mb-3'>
      More Services to Grow Your Business
    </h2>
    <p className='text-center text-gray-600 mb-12'>
      Everything you need to start, scale, and succeed
    </p>

    <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4'>
      {/* Payment Gateways */}
      <div className='bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center'>
        <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-8 w-8 text-black'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
            />
          </svg>
        </div>
        <h3 className='font-medium text-sm'>Payment Gateways</h3>
      </div>

      {/* Funding & Capital */}
      <div className='bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center'>
        <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-8 w-8 text-black'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <h3 className='font-medium text-sm'>Funding & Capital</h3>
      </div>

      {/* Insurance */}
      <div className='bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center'>
        <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-8 w-8 text-black'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
            />
          </svg>
        </div>
        <h3 className='font-medium text-sm'>Insurance</h3>
      </div>

      {/* HR & Payroll */}
      <div className='bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center'>
        <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-8 w-8 text-black'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
            />
          </svg>
        </div>
        <h3 className='font-medium text-sm'>HR & Payroll</h3>
      </div>

      {/* Market Entry */}
      <div className='bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center'>
        <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-8 w-8 text-black'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <h3 className='font-medium text-sm'>Market Entry</h3>
      </div>

      {/* Website & Online */}
      <div className='bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center'>
        <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-8 w-8 text-black'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
            />
          </svg>
        </div>
        <h3 className='font-medium text-sm'>Website & Online</h3>
      </div>

      {/* Shipping & Fulfillment */}
      <div className='bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center'>
        <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-8 w-8 text-black'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path d='M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z' />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0'
            />
          </svg>
        </div>
        <h3 className='font-medium text-sm'>Shipping & Fulfillment</h3>
      </div>

      {/* Accounting & Tax */}
      <div className='bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center'>
        <div className='w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-3'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-8 w-8 text-black'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z'
            />
          </svg>
        </div>
        <h3 className='font-medium text-sm'>Accounting & Tax</h3>
      </div>
    </div>
  </div>
</div>;


        {/* Explore Categories Section */}
        <div className='w-full bg-white py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-4xl md:text-5xl font-bold text-center mb-3'>
              Explore Categories
            </h2>
            <p className='text-center text-gray-600 mb-16'>
              Find the right tools for every aspect of your business
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {/* Company Formation & Banking */}
              <div className='flex'>
                <div className='mr-6 bg-blue-100 rounded-lg p-4 h-16 w-16 flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-8 w-8 text-blue-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-xl font-bold mb-2'>Company Formation & Banking</h3>
                  <p className='text-gray-600 mb-2'>Incorporate your business and set up banking solutions</p>
                  <p className='text-blue-600 font-medium'>45+ tools</p>
                </div>
              </div>

              {/* SAAS Tools */}
              <div className='flex'>
                <div className='mr-6 bg-orange-100 rounded-lg p-4 h-16 w-16 flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-8 w-8 text-orange-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-xl font-bold mb-2'>SAAS Tools</h3>
                  <p className='text-gray-600 mb-2'>HR, payroll, email, hosting, and CRM solutions</p>
                  <p className='text-orange-600 font-medium'>120+ tools</p>
                </div>
              </div>

              {/* AI Tools */}
              <div className='flex'>
                <div className='mr-6 bg-blue-100 rounded-lg p-4 h-16 w-16 flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-8 w-8 text-blue-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 10V3L4 14h7v7l9-11h-7z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-xl font-bold mb-2'>AI Tools</h3>
                  <p className='text-gray-600 mb-2'>Marketing, content creation, and coding assistants</p>
                  <p className='text-blue-600 font-medium'>85+ tools</p>
                </div>
              </div>

              {/* Incubators & Accelerators */}
              <div className='flex'>
                <div className='mr-6 bg-orange-100 rounded-lg p-4 h-16 w-16 flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-8 w-8 text-orange-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-xl font-bold mb-2'>Incubators & Accelerators</h3>
                  <p className='text-gray-600 mb-2'>Programs to accelerate your startup growth</p>
                  <p className='text-orange-600 font-medium'>30+ programs</p>
                </div>
              </div>

              {/* Government Grants & Funding */}
              <div className='flex'>
                <div className='mr-6 bg-blue-100 rounded-lg p-4 h-16 w-16 flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-8 w-8 text-blue-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-xl font-bold mb-2'>Government Grants & Funding</h3>
                  <p className='text-gray-600 mb-2'>Funding and grants for eligible businesses</p>
                  <p className='text-blue-600 font-medium'>25+ grants</p>
                </div>
              </div>

              {/* Legal, Tax & Compliance */}
              <div className='flex'>
                <div className='mr-6 bg-orange-100 rounded-lg p-4 h-16 w-16 flex items-center justify-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-8 w-8 text-orange-600'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='text-xl font-bold mb-2'>Legal, Tax & Compliance</h3>
                  <p className='text-gray-600 mb-2'>Legal services, tax, and compliance tools</p>
                  <p className='text-orange-600 font-medium'>40+ services</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Business Insights Section */}
        <div className='w-full bg-gray-50 py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-4xl md:text-5xl font-bold text-center mb-3'>
              Latest Business Insights
            </h2>
            <p className='text-center text-gray-600 mb-16'>
              Stay ahead with expert tips and industry trends
            </p>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {latestPosts && latestPosts.length > 0 ? (
                latestPosts.map((post: BlogPost) => (
                  <div key={post.id} className='bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300'>
                    <div className='relative h-48 bg-gray-200 flex items-center justify-center'>
                      {post.featured_image ? (
                        <FallbackImage
                          src={post.featured_image}
                          alt={post.title}
                          className="h-full w-full object-cover"
                          fallbackSrc="https://via.placeholder.com/800x400?text=Image+Not+Found"
                          fill
                        />
                      ) : (
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-12 w-12 text-gray-400'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                          />
                        </svg>
                      )}
                    </div>
                    <div className='p-6'>
                      <div className='flex justify-between items-center mb-4'>
                        <span className={`bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded ${post.category ? '' : 'hidden'}`}>
                          {post.category || 'Uncategorized'}
                        </span>
                        <span className='text-gray-500 text-sm'>
                          {formatDate(post.published_at || post.created_at)}
                        </span>
                      </div>
                      <h3 className='font-bold text-xl mb-4'>{post.title}</h3>
                      <div className='flex justify-between items-center'>
                        <span className='text-gray-500 text-sm'>{getReadTime(post.content)}</span>
                        <Link 
                          href={`/insights/${post.slug}`} 
                          className='text-orange-500 hover:text-orange-600 font-medium flex items-center'
                        >
                          Read More
                          <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 ml-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Fallback when no posts are available
                <div className="col-span-3 flex flex-col items-center justify-center py-12 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
                  <p className="mt-1 text-gray-500">
                    There are no published articles yet. Check back soon!
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
          </div>
        </div>

        {/* Stay Updated with Yotta Section */}
        <div className='w-full bg-orange-600 py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-4'>
              Stay Updated with Yotta
            </h2>
            <p className='text-white text-lg mb-8 max-w-3xl mx-auto'>
              Get the latest service provider spotlights, business tips, and marketplace updates delivered to your inbox.
            </p>
            
            <div className='max-w-md mx-auto'>
              <div className='flex rounded-full bg-white p-1 shadow-sm'>
                <input
                  type='email'
                  placeholder='Enter your email address'
                  className='w-full bg-transparent px-4 py-3 rounded-full focus:outline-none'
                />
                <button
                  type='button'
                  className='ml-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none'
                >
                  Subscribe
                </button>
              </div>
              <p className='text-white text-sm mt-4'>
                Join 10,000+ entrepreneurs. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}

{
  /* More Services Section */
}
