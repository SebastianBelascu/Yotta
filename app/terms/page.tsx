import React from 'react';
import { Layout } from '@/components/layout/layout';
import { createClient } from '@/lib/supabase/server';

async function getTermsContent() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('frontend_pages')
    .select('*')
    .eq('slug', 'terms')
    .single();

  if (error) {
    console.error('Error fetching terms of service:', error);
    return null;
  }

  return data;
}

export default async function TermsOfService() {
  const termsPage = await getTermsContent();
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">{termsPage?.title || 'Terms of Service'}</h1>
        
        <div className="prose prose-lg">
          {termsPage?.updated_at && (
            <p className="text-gray-600 mb-6">Last updated: {new Date(termsPage.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          )}
          
          {termsPage?.content ? (
            <div dangerouslySetInnerHTML={{ __html: termsPage.content }} />
          ) : (
            <>
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p>
                Welcome to Yotta ("Company", "we", "our", "us")! These Terms of Service ("Terms") govern your use of our website located at [website URL] (together or individually "Service") operated by Yotta.
              </p>
              <p>
                Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Please read it here: [Privacy Policy URL].
              </p>
              <p>
                By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Communications</h2>
              <p>
                By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing us at [email address].
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Purchases</h2>
              <p>
                If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including but not limited to, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
              </p>
              <p>
                You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Content</h2>
              <p>
                Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Prohibited Uses</h2>
              <p>
                You may use the Service only for lawful purposes and in accordance with Terms. You agree not to use the Service:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
              <p>
                The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Yotta and its licensors. The Service is protected by copyright, trademark, and other laws of both Singapore and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Yotta.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p>
                If you wish to terminate your account, you may simply discontinue using the Service.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
              <p>
                In no event shall Yotta, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                Email: support@yotta.com<br />
                Address: 123 Business Avenue, Singapore 123456
              </p>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
