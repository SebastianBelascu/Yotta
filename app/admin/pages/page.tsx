'use client';

import React from 'react';
import { AdminLayout } from '@/components/admin/layout';
import FrontendPagesList from '@/components/admin/FrontendPagesList';

interface FrontendPage {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function PagesAdminPage() {
  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Frontend Pages</h1>
            <p className="text-gray-600">Manage your static frontend pages</p>
          </div>
        </div>

        {/* Pages List Component */}
        <FrontendPagesList />
      </div>
    </AdminLayout>
  );
}
