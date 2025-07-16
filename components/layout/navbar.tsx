'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [showPopup, setShowPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);
  
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    category: '',
    country: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission, e.g. API call
    console.log('Form submitted:', formData);
    // Reset form and close popup
    setFormData({
      businessName: '',
      email: '',
      phone: '',
      category: '',
      country: ''
    });
    setShowPopup(false);
  };

  return (
    <nav className="w-full flex justify-center h-14 bg-[#0a1e3b] text-white sticky top-0 z-40 shadow-md">
      <div className="w-full max-w-7xl flex justify-between items-center px-4 md:px-6">
        <div className="flex items-center gap-1.5">
          <div className="bg-[#ff5722] text-white w-7 h-7 flex items-center justify-center rounded-md font-bold text-base">
            Y
          </div>
          <Link href={"/"} className="text-xl font-bold">Yotta</Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href={"/"} className="text-base hover:text-[#ff5722] transition-colors">Home</Link>
          <Link href={"/categories"} className="text-base hover:text-[#ff5722] transition-colors">Categories</Link>
          <Link href={"/insights"} className="text-base hover:text-[#ff5722] transition-colors">Insights</Link>
          <Link href={"/about"} className="text-base hover:text-[#ff5722] transition-colors">About</Link>
          <Link href={"/faq"} className="text-base hover:text-[#ff5722] transition-colors">FAQ</Link>
          <Link href={"/contact"} className="text-base hover:text-[#ff5722] transition-colors">Contact</Link>
          <button 
            onClick={() => setShowPopup(true)} 
            className="bg-[#ff5722] text-white px-4 py-1.5 rounded text-base hover:bg-[#e64a19] transition-colors"
          >
            List Your Service
          </button>
        </div>
        
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 bg-[#0a1e3b] z-30 shadow-lg">
          <div className="flex flex-col py-4 px-4 space-y-4">
            <Link 
              href={"/"} 
              className="text-white hover:text-[#ff5722] transition-colors py-2 border-b border-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href={"/categories"} 
              className="text-white hover:text-[#ff5722] transition-colors py-2 border-b border-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link 
              href={"/insights"} 
              className="text-white hover:text-[#ff5722] transition-colors py-2 border-b border-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Insights
            </Link>
            <Link 
              href={"/about"} 
              className="text-white hover:text-[#ff5722] transition-colors py-2 border-b border-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href={"/faq"} 
              className="text-white hover:text-[#ff5722] transition-colors py-2 border-b border-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link 
              href={"/contact"} 
              className="text-white hover:text-[#ff5722] transition-colors py-2 border-b border-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              href={"/partner"} 
              className="text-white hover:text-[#ff5722] transition-colors py-2 border-b border-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              Partner With Us
            </Link>
            <div className="pt-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowPopup(true);
                }}
                className="w-full bg-[#ff5722] text-white py-3 px-4 rounded text-center font-medium hover:bg-[#e64a19] transition-colors"
              >
                List Your Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List Your Service Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative overflow-hidden">
            <div className="p-5 sm:p-6">
              <button 
                onClick={() => setShowPopup(false)} 
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                aria-label="Close popup"
              >
                <X className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-black">List Your Service on Yotta</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-medium text-black mb-1">
                      Business Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Enter your business name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-black"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-black"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-black mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-black"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-black mb-1">
                      Business Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 appearance-none text-black"
                    >
                      <option value="">Select your business category</option>
                      <option value="saas">SaaS Tools</option>
                      <option value="marketing">Digital Marketing</option>
                      <option value="design">Design Services</option>
                      <option value="development">Web Development</option>
                      <option value="consulting">Business Consulting</option>
                      <option value="finance">Financial Services</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-black mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 appearance-none text-black"
                    >
                      <option value="">Select your country</option>
                      <option value="singapore">Singapore</option>
                      <option value="malaysia">Malaysia</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium rounded-md transition-colors"
                  >
                    Submit Application
                  </button>
                </div>
                
                <p className="text-center text-sm text-black mt-4">
                  We'll review your application and send you a detailed form to complete your listing.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
