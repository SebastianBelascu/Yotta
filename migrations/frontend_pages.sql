-- Create frontend_pages table
CREATE TABLE IF NOT EXISTS frontend_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial data for Terms of Service page
INSERT INTO frontend_pages (slug, title, content, is_published)
VALUES (
  'terms-of-service',
  'Terms of Service',
  '<h2 class="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
<p>
  Welcome to Yotta ("Company", "we", "our", "us")! These Terms of Service ("Terms") govern your use of our website located at [website URL] (together or individually "Service") operated by Yotta.
</p>
<p>
  Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Please read it here: [Privacy Policy URL].
</p>
<p>
  By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">2. Communications</h2>
<p>
  By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or by emailing us at [email address].
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">3. Purchases</h2>
<p>
  If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including but not limited to, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
</p>
<p>
  You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">4. Content</h2>
<p>
  Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">5. Prohibited Uses</h2>
<p>
  You may use the Service only for lawful purposes and in accordance with Terms. You agree not to use the Service:
</p>
<ul class="list-disc pl-6 mb-6">
  <li>In any way that violates any applicable national or international law or regulation.</li>
  <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content or otherwise.</li>
  <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
  <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
</ul>

<h2 class="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
<p>
  The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of Yotta and its licensors. The Service is protected by copyright, trademark, and other laws of both Singapore and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Yotta.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">7. Termination</h2>
<p>
  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
</p>
<p>
  If you wish to terminate your account, you may simply discontinue using the Service.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
<p>
  In no event shall Yotta, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
<p>
  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
<p>
  If you have any questions about these Terms, please contact us at:
</p>
<p>
  Email: support@yotta.com<br />
  Address: 123 Business Avenue, Singapore 123456
</p>',
  true
);

-- Insert initial data for Privacy Policy page
INSERT INTO frontend_pages (slug, title, content, is_published)
VALUES (
  'privacy-policy',
  'Privacy Policy',
  '<h2 class="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
<p>
  Welcome to Yotta's Privacy Policy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
</p>
<p>
  We respect your privacy and are committed to protecting personally identifiable information you may provide us through the Website. We have adopted this privacy policy to explain what information may be collected on our Website, how we use this information, and under what circumstances we may disclose the information to third parties.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
<p>
  We collect information that you provide directly to us. For example, we collect information when you create an account, subscribe to our newsletter, or otherwise communicate with us.
</p>
<p>
  The information we may collect includes:
</p>
<ul class="list-disc pl-6 mb-6">
  <li>Personal Information: Name, email address, mailing address, phone number</li>
  <li>Account Information: Username, password, account preferences</li>
  <li>Transaction Information: Purchase history, billing details</li>
  <li>User Content: Comments, feedback, reviews, and other material you submit</li>
</ul>

<h2 class="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
<p>
  We may use the information we collect about you for various purposes, including to:
</p>
<ul class="list-disc pl-6 mb-6">
  <li>Provide, maintain, and improve our services</li>
  <li>Process transactions and send related information</li>
  <li>Send administrative information, such as updates, security alerts, and support messages</li>
  <li>Respond to comments, questions, and requests</li>
  <li>Communicate about products, services, offers, and events</li>
  <li>Monitor and analyze trends, usage, and activities</li>
</ul>

<h2 class="text-2xl font-semibold mt-8 mb-4">4. Sharing of Information</h2>
<p>
  We may share your information as follows:
</p>
<ul class="list-disc pl-6 mb-6">
  <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
  <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process</li>
  <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of us or others</li>
  <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
</ul>

<h2 class="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
<p>
  We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">6. Your Choices</h2>
<p>
  You may update, correct, or delete information about you at any time by logging into your online account or emailing us. If you wish to delete or deactivate your account, please email us, but note that we may retain certain information as required by law or for legitimate business purposes.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">7. Changes to this Privacy Policy</h2>
<p>
  We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
<p>
  If you have any questions about this Privacy Policy, please contact us at:
</p>
<p>
  Email: privacy@yotta.com<br />
  Address: 123 Business Avenue, Singapore 123456
</p>',
  true
);

-- Insert initial data for FAQ page
INSERT INTO frontend_pages (slug, title, content, is_published)
VALUES (
  'faq',
  'Frequently Asked Questions',
  '<h2 class="text-2xl font-semibold mt-8 mb-4">General Questions</h2>

<div class="mb-6">
  <h3 class="text-xl font-medium mb-2">What is Yotta?</h3>
  <p>
    Yotta is a platform that connects businesses with top-quality service providers and tools in various categories. We help businesses find the right solutions for their specific needs.
  </p>
</div>

<div class="mb-6">
  <h3 class="text-xl font-medium mb-2">How does Yotta work?</h3>
  <p>
    Yotta works by curating a selection of high-quality service providers and tools. Businesses can browse our directory, compare options, and request quotes directly through our platform.
  </p>
</div>

<div class="mb-6">
  <h3 class="text-xl font-medium mb-2">Is Yotta free to use?</h3>
  <p>
    Yes, Yotta is completely free for businesses looking for services or tools. We earn commissions from service providers when they successfully win business through our platform.
  </p>
</div>

<h2 class="text-2xl font-semibold mt-8 mb-4">For Businesses</h2>

<div class="mb-6">
  <h3 class="text-xl font-medium mb-2">How do I request a quote?</h3>
  <p>
    Simply browse our directory, find a service provider that matches your needs, and click the "Get Quote" button on their profile. Fill out the brief form with your requirements, and we'll connect you directly with the provider.
  </p>
</div>

<div class="mb-6">
  <h3 class="text-xl font-medium mb-2">How quickly will providers respond to my request?</h3>
  <p>
    Most service providers respond within 24-48 hours. Some may respond even faster during business hours.
  </p>
</div>

<div class="mb-6">
  <h3 class="text-xl font-medium mb-2">Can I request quotes from multiple providers?</h3>
  <p>
    Absolutely! We encourage you to compare options by requesting quotes from multiple providers that match your criteria.
  </p>
</div>

<h2 class="text-2xl font-semibold mt-8 mb-4">For Service Providers</h2>

<div class="mb-6">
  <h3 class="text-xl font-medium mb-2">How can I list my services on Yotta?</h3>
  <p>
    If you're interested in becoming a service provider on our platform, please contact us through our Partner page. We'll review your application and get back to you with next steps.
  </p>
</div>

<div class="mb-6">
  <h3 class="text-xl font-medium mb-2">What are the fees for service providers?</h3>
  <p>
    We operate on a commission-based model. You only pay when you successfully win business through our platform. Commission rates vary by service category.
  </p>
</div>

<div class="mb-6">
  <h3 class="text-xl font-medium mb-2">How are leads qualified?</h3>
  <p>
    We pre-qualify all leads before they reach you, ensuring you only receive relevant inquiries from businesses that match your service offerings and target market.
  </p>
</div>',
  true
);

-- Insert initial data for About page
INSERT INTO frontend_pages (slug, title, content, is_published)
VALUES (
  'about',
  'About Us',
  '<h2 class="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
<p>
  At Yotta, our mission is to empower businesses by connecting them with the right service providers and tools to help them grow and succeed. We believe that finding the perfect match between businesses and service providers creates value for everyone involved.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
<p>
  Yotta was founded in 2023 by a team of entrepreneurs who experienced firsthand the challenges of finding reliable service providers for their businesses. After wasting countless hours on research, vetting, and negotiations, they decided to create a solution that would make this process easier for other business owners.
</p>
<p>
  What started as a simple directory has evolved into a comprehensive platform that helps thousands of businesses find the perfect service providers and tools for their specific needs.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
<ul class="list-disc pl-6 mb-6">
  <li><strong>Quality Over Quantity</strong> - We carefully vet all service providers on our platform to ensure they meet our high standards.</li>
  <li><strong>Transparency</strong> - We believe in clear, honest communication and pricing without hidden fees or surprises.</li>
  <li><strong>Customer-Centric</strong> - Everything we do is focused on creating value for our users and making their lives easier.</li>
  <li><strong>Continuous Improvement</strong> - We're always looking for ways to enhance our platform and provide better service.</li>
</ul>

<h2 class="text-2xl font-semibold mt-8 mb-4">Our Team</h2>
<p>
  Yotta is powered by a diverse team of professionals with backgrounds in technology, marketing, customer service, and business development. We're united by our passion for helping businesses succeed and our commitment to excellence.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">Join Us</h2>
<p>
  Whether you're a business looking for services or a service provider looking to grow your client base, we invite you to join the Yotta community. Together, we can create meaningful connections that drive business success.
</p>

<h2 class="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
<p>
  Have questions or feedback? We'd love to hear from you! Reach out to our team at:
</p>
<p>
  Email: hello@yotta.com<br />
  Address: 123 Business Avenue, Singapore 123456
</p>',
  true
);
