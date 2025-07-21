import React from 'react';
import { Layout } from '@/components/layout/layout';
import { createClient } from '@/lib/supabase/client';

async function getPrivacyContent() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('frontend_pages')
    .select('*')
    .eq('slug', 'privacy')
    .single();

  if (error) {
    console.error('Error fetching privacy policy:', error);
    return null;
  }

  return data;
}

export default async function PrivacyPolicy() {
  const privacyPage = await getPrivacyContent();
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{privacyPage?.title || 'Privacy Policy'}</h1>
        
        <div className="prose prose-lg">
          {privacyPage?.updated_at && (
            <p className="text-gray-600 mb-6">Last updated: {new Date(privacyPage.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          )}
          
          {privacyPage?.content ? (
            <div dangerouslySetInnerHTML={{ __html: privacyPage.content }} />
          ) : (
            <>
              <p className="mb-6">
                This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Interpretation and Definitions</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Interpretation</h3>
              <p>
                The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Use of Your Personal Data</h3>
              <p>The Company may use Personal Data for the following purposes:</p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>To provide and maintain our Service</strong>, including to monitor the usage of our Service.</li>
                <li><strong>To manage Your Account:</strong> to manage Your registration as a user of the Service.</li>
                <li><strong>For the performance of a contract:</strong> the development, compliance and undertaking of the purchase contract.</li>
                <li><strong>To contact You:</strong> To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication.</li>
                <li><strong>To provide You</strong> with news, special offers and general information about other goods, services and events.</li>
                <li><strong>To manage Your requests:</strong> To attend and manage Your requests to Us.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Security of Your Personal Data</h2>
              <p>
                The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, You can contact us at:
              </p>
              <p>
                Email: privacy@yotta.com<br />
                Address: 123 Business Avenue, Singapore 123456
              </p>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
