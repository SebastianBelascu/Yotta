'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Skip rendering breadcrumbs on homepage
  if (pathname === '/') {
    return null;
  }
  
  // Split the pathname into segments
  const segments = pathname.split('/').filter(Boolean);
  
  // Create breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    // Create the path for this breadcrumb
    const path = `/${segments.slice(0, index + 1).join('/')}`;
    
    // Format the label (convert slug to readable text)
    let label = segment;
    
    // Special handling for services section
    if (segments[0] === 'services' && index === 1) {
      // This is a service slug - convert to readable name
      label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    } else {
      // Convert kebab-case or snake_case to Title Case for other segments
      label = segment
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
    }
    
    return {
      label,
      path,
      isLast: index === segments.length - 1
    };
  });

  return (
    <div className="w-full bg-gray-50 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center text-sm text-gray-600">
        <Link href="/" className="flex items-center hover:text-orange-500 transition-colors">
          <Home className="h-4 w-4 mr-1" />
          <span>Home</span>
        </Link>
        
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.path}>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            
            {breadcrumb.isLast ? (
              <span className="font-medium text-gray-900">{breadcrumb.label}</span>
            ) : (
              <Link 
                href={breadcrumb.path}
                className="hover:text-orange-500 transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
