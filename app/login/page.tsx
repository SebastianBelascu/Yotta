import React, { Suspense } from 'react';
import { LoginForm } from '@/components/login-form';
import { Layout } from '@/components/layout/layout';

function LoginFormWrapper() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <Layout>
      <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="mt-2 text-gray-600">
              Sign in to access your admin dashboard
            </p>
          </div>
          <Suspense fallback={<div className="text-center p-4">Loading login form...</div>}>
            <LoginFormWrapper />
          </Suspense>
        </div>
      </div>
    </Layout>
  );
}
