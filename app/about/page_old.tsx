import React from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/layout';
import { createClient } from '@/lib/supabase/client';

async function getAboutContent() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('frontend_pages')
    .select('*')
    .eq('slug', 'about')
    .single();

  if (error) {
    console.error('Error fetching about page:', error);
    return null;
  }

  return data;
}

export default async function AboutPage() {
  const aboutPage = await getAboutContent();
  
  return (
    <Layout>
      {aboutPage?.content ? (
        <div dangerouslySetInnerHTML={{ __html: aboutPage.content }} />
      ) : (
        <div className='flex-1 w-full flex flex-col items-center bg-gray-50'>
        {/* Section 1: About Yotta */}
        <section className='w-full bg-gray-50 py-16'>
          <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <div className='flex justify-center mb-4'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h1 className='text-4xl md:text-5xl font-bold mb-6 text-gray-900'>About Yotta</h1>
            <p className='text-lg text-gray-600 mb-8'>
              Yotta is your shortcut to discovering the tools, services, and partners that
              actually move the needle—curated for solopreneurs, startups, and modern small
              businesses building the future.
            </p>
            <Link 
              href="/categories" 
              className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors'
            >
              Explore Our Platform
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Section 2: What We Do */}
        <section className='w-full bg-gray-50 py-16'>
          <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900'>What We Do</h2>
            <p className='text-lg text-gray-600 mb-8 text-center'>
              Building a business is hard. Finding the right tools and services shouldn't be.
            </p>
            <div className='max-w-3xl mx-auto'>
              <p className='text-gray-600 mb-6 text-center'>
                Yotta is a handpicked marketplace built to help ambitious founders and lean teams cut through the noise.
                Whether you're starting your first side hustle or running your fifth venture, we help you discover the best
                platforms, providers, and solutions tailored for early-stage and growing businesses.
              </p>
              <p className='text-gray-600 mb-12 text-center'>
                No fluff, no overwhelm—just what works. From legal to marketing, CRMs to coworking spaces, we bring the next
                best thing straight to your fingertips.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
              {/* Feature 1 */}
              <div className='text-center'>
                <div className='bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold mb-2'>Curated Selection</h3>
                <p className='text-gray-600'>
                  Handpicked marketplace built to help ambitious founders and lean teams cut through the noise.
                </p>
              </div>

              {/* Feature 2 */}
              <div className='text-center'>
                <div className='bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold mb-2'>No Fluff, No Overwhelm</h3>
                <p className='text-gray-600'>
                  Just what works. From legal to marketing, CRMs to coworking spaces.
                </p>
              </div>

              {/* Feature 3 */}
              <div className='text-center'>
                <div className='bg-orange-500 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold mb-2'>Next Best Thing</h3>
                <p className='text-gray-600'>
                  We bring the solutions straight to your fingertips, tailored for early-stage and growing businesses.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Why Use Yotta */}
        <section className='w-full bg-yellow-50 py-16'>
          <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-center mb-4'>
              <div className='bg-pink-100 rounded-full p-2'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h2 className='text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900'>Why Use Yotta?</h2>
            <p className='text-lg text-gray-600 mb-12 text-center'>
              Your business deserves better than random Google searches and 50 open tabs.
            </p>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Reason 1 */}
              <div className='bg-white p-6 rounded-lg shadow-sm'>
                <div className='bg-orange-500 rounded-lg h-12 w-12 flex items-center justify-center mb-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold mb-2'>Built for doers</h3>
                <p className='text-gray-600'>
                  We don't just list services. We curate what works, ditch what doesn't, and get straight to the point.
                </p>
              </div>

              {/* Reason 2 */}
              <div className='bg-white p-6 rounded-lg shadow-sm'>
                <div className='bg-orange-500 rounded-lg h-12 w-12 flex items-center justify-center mb-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold mb-2'>Founder-first</h3>
                <p className='text-gray-600'>
                  We understand small teams and solo operators because we are one.
                </p>
              </div>

              {/* Reason 3 */}
              <div className='bg-white p-6 rounded-lg shadow-sm'>
                <div className='bg-orange-500 rounded-lg h-12 w-12 flex items-center justify-center mb-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold mb-2'>Curated, not cluttered</h3>
                <p className='text-gray-600'>
                  Less doom-scrolling, more decision-making.
                </p>
              </div>

              {/* Reason 4 */}
              <div className='bg-white p-6 rounded-lg shadow-sm'>
                <div className='bg-orange-500 rounded-lg h-12 w-12 flex items-center justify-center mb-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold mb-2'>Real-world use cases</h3>
                <p className='text-gray-600'>
                  Tools and providers recommended by real businesses doing real things.
                </p>
              </div>

              {/* Reason 5 */}
              <div className='bg-white p-6 rounded-lg shadow-sm'>
                <div className='bg-orange-500 rounded-lg h-12 w-12 flex items-center justify-center mb-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold mb-2'>Save time and money</h3>
                <p className='text-gray-600'>
                  Skip the trial-and-error phase. We've already done it.
                </p>
              </div>

              {/* Reason 6 */}
              <div className='bg-white p-6 rounded-lg shadow-sm'>
                <div className='bg-orange-500 rounded-lg h-12 w-12 flex items-center justify-center mb-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className='text-xl font-semibold mb-2'>Better than Google</h3>
                <p className='text-gray-600'>
                  Your business deserves better than random Google searches and 50 open tabs.
                </p>
              </div>
            </div>

            <div className='mt-12 text-center'>
              <Link 
                href="/categories" 
                className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors'
              >
                Start Building Smarter
              </Link>
            </div>
          </div>
        </section>
        </div>
      )}
    </Layout>
  );
}
