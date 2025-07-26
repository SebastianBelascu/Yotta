'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

type FooterItem = {
  id: string;
  section: string;
  title: string;
  content: string | null;
  link_url: string | null;
  icon_name: string | null;
  display_order: number;
  is_active: boolean;
};

export function Footer() {
  const [footerItems, setFooterItems] = useState<FooterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    async function fetchFooterItems() {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('footer')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching footer items:', error);
        setLoading(false);
        return;
      }
      
      setFooterItems(data || []);
      setLoading(false);
    }
    
    fetchFooterItems();
  }, []);
  
  // Group footer items by section
  const companyInfo = footerItems.filter(item => item.section === 'company_info');
  const quickLinks = footerItems.filter(item => item.section === 'quick_links');
  const categories = footerItems.filter(item => item.section === 'categories');
  const socialMedia = footerItems.filter(item => item.section === 'social_media');
  const legalLinks = footerItems.filter(item => item.section === 'legal_links');
  
  // Render social media icon based on icon_name
  const renderSocialIcon = (iconName: string | null) => {
    switch (iconName?.toLowerCase()) {
      case 'twitter':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
          </svg>
        );
      case 'linkedin':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 9.333l5.333 2.662-5.333 2.672v-5.334zm14-9.333v24h-24v-24h24zm-4 12c-.02-4.123-.323-5.7-2.923-5.877-2.403-.164-7.754-.163-10.153 0-2.598.177-2.904 1.747-2.924 5.877.02 4.123.323 5.7 2.923 5.877 2.399.163 7.75.164 10.153 0 2.598-.177 2.904-1.747 2.924-5.877z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <footer className="w-full bg-[#0a1e3b] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <p>Loading footer...</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-[#0a1e3b] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Company Info Section */}
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-xl font-bold text-[#ff5722]">VentureNext</span>
            </div>
            {companyInfo.map((item) => (
              <p key={item.id} className="text-sm mb-3">{item.content}</p>
            ))}
            <div className="flex space-x-3">
              {socialMedia.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.link_url || '#'} 
                  className="text-white hover:text-[#ff5722]"
                  title={item.title}
                >
                  {renderSocialIcon(item.icon_name)}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Quick Links Section */}
          <div>
            <h3 className="font-semibold text-base mb-2">Quick Links</h3>
            <ul className="space-y-1">
              {quickLinks.map((item) => (
                <li key={item.id}>
                  <Link 
                    href={item.link_url || '#'} 
                    className="text-sm hover:text-[#ff5722]"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Categories Section */}
          <div>
            <h3 className="font-semibold text-base mb-2">Categories</h3>
            <ul className="space-y-1">
              {categories.map((item) => (
                <li key={item.id}>
                  <Link 
                    href={item.link_url || '#'} 
                    className="text-sm hover:text-[#ff5722]"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Legal Section */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-sm">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p>© {new Date().getFullYear()} Yotta. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              {legalLinks.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.link_url || '#'} 
                  className="hover:text-[#ff5722]"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
