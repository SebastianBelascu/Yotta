'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard, 
  ListChecks, 
  Users, 
  LogOut,
  Menu,
  X,
  Briefcase,
  BookOpen,
  Wrench,
  FileText,
  HelpCircle,
  Award,
  Info,
  Home
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string | null; name: string | null }>({ email: null, name: null });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser({
            email: user.email || 'admin@example.com',
            name: user.user_metadata?.name || 'Admin User'
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if there's an error
      router.push('/auth/login');
    }
  };
  
  const navItems = [
    { 
      name: 'Dashboard', 
      href: '/admin', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: 'Homepage', 
      href: '/admin/homepage', 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      name: 'Services', 
      href: '/admin/services', 
      icon: <Briefcase className="h-5 w-5" /> 
    },
    { 
      name: 'Tools', 
      href: '/admin/tools', 
      icon: <Wrench className="h-5 w-5" /> 
    },
    { 
      name: 'Insights', 
      href: '/admin/insights', 
      icon: <BookOpen className="h-5 w-5" /> 
    },
    { 
      name: 'Leads', 
      href: '/admin/leads', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: 'Vendors', 
      href: '/admin/vendors', 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      name: 'Privacy / Policy terms', 
      href: '/admin/pages', 
      icon: <FileText className="h-5 w-5" /> 
    },
    { 
      name: 'FAQ', 
      href: '/admin/faq', 
      icon: <HelpCircle className="h-5 w-5" /> 
    },
    { 
      name: 'Why List With Us', 
      href: '/admin/why-list', 
      icon: <Award className="h-5 w-5" /> 
    },
    { 
      name: 'About Us', 
      href: '/admin/about-us', 
      icon: <Info className="h-5 w-5" /> 
    }
  ];

  const secondaryNavItems = [];

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
                    pathname === item.href
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


        </nav>

        {/* Account section */}
        <div className="p-4 border-t border-blue-800">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user.name || 'Admin User'}</p>
              <p className="text-xs text-blue-300">{user.email || 'admin@example.com'}</p>
            </div>
          </div>
          
          <div className="mt-4 space-y-1">            
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="flex items-center px-2 py-1.5 text-sm rounded-md text-blue-200 hover:bg-blue-800 hover:text-white w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-2">Logout</span>
            </button>
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
