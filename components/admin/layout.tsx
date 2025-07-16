'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ListChecks, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: 'Listings', 
      href: '/admin/listings', 
      icon: <ListChecks className="h-5 w-5" />,
      active: true
    },
    { 
      name: 'Leads', 
      href: '/admin/leads', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: 'Providers', 
      href: '/admin/providers', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: 'Pricing', 
      href: '/admin/pricing', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      name: 'Analytics', 
      href: '/admin/analytics', 
      icon: <BarChart3 className="h-5 w-5" /> 
    }
  ];

  const secondaryNavItems = [
    { 
      name: 'Settings', 
      href: '/admin/settings', 
      icon: <Settings className="h-5 w-5" /> 
    },
    { 
      name: 'Help', 
      href: '/admin/help', 
      icon: <HelpCircle className="h-5 w-5" /> 
    },
    { 
      name: 'Logout', 
      href: '/logout', 
      icon: <LogOut className="h-5 w-5" /> 
    }
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-20 m-4">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-md"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-10 w-64 transition-transform duration-300 ease-in-out bg-blue-900 text-white flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-blue-800">
          <div className="flex items-center">
            <span className="text-xl font-bold">VentureNext</span>
            <span className="ml-2 text-xs bg-blue-700 px-2 py-0.5 rounded">Admin</span>
          </div>
          <div className="text-sm text-blue-300 mt-1">Admin Dashboard</div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    item.active || pathname === item.href
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <h3 className="px-6 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Featured Pages
            </h3>
            <ul className="mt-2 space-y-1 px-2">
              <li>
                <Link 
                  href="/admin/testimonials"
                  className="flex items-center px-4 py-2 text-blue-200 rounded-md hover:bg-blue-800 hover:text-white"
                >
                  <span className="ml-3">Testimonials</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/faq"
                  className="flex items-center px-4 py-2 text-blue-200 rounded-md hover:bg-blue-800 hover:text-white"
                >
                  <span className="ml-3">FAQ</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/admin/insights"
                  className="flex items-center px-4 py-2 text-blue-200 rounded-md hover:bg-blue-800 hover:text-white"
                >
                  <span className="ml-3">Insights/Blog</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Account section */}
        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                <span className="text-lg font-medium">A</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-blue-300">admin@venturenext.com</p>
            </div>
            <button className="ml-auto text-blue-300 hover:text-white">
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mt-4 space-y-1">
            {secondaryNavItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className="flex items-center px-2 py-1.5 text-sm rounded-md text-blue-200 hover:bg-blue-800 hover:text-white"
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
