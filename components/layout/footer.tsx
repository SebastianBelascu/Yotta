import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-[#0a1e3b] text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <div className="bg-[#ff5722] text-white w-7 h-7 flex items-center justify-center rounded-md font-bold text-base">
                Y
              </div>
              <span className="text-xl font-bold">Yotta</span>
            </div>
            <p className="text-sm mb-3">Your marketplace for discovering the best business services, tools, and solutions in Singapore and Malaysia.</p>
            <div className="flex space-x-3">
              <Link href="#" className="text-white hover:text-[#ff5722]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
              </Link>
              <Link href="#" className="text-white hover:text-[#ff5722]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </Link>
              <Link href="#" className="text-white hover:text-[#ff5722]">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M10 9.333l5.333 2.662-5.333 2.672v-5.334zm14-9.333v24h-24v-24h24zm-4 12c-.02-4.123-.323-5.7-2.923-5.877-2.403-.164-7.754-.163-10.153 0-2.598.177-2.904 1.747-2.924 5.877.02 4.123.323 5.7 2.923 5.877 2.399.163 7.75.164 10.153 0 2.598-.177 2.904-1.747 2.924-5.877z"/></svg>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-base mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link href="/about" className="text-sm hover:text-[#ff5722]">About Us</Link></li>
              <li><Link href="/services" className="text-sm hover:text-[#ff5722]">Browse Services</Link></li>
              <li><Link href="/insights" className="text-sm hover:text-[#ff5722]">Insights</Link></li>
              <li><Link href="/faq" className="text-sm hover:text-[#ff5722]">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-[#ff5722]">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-base mb-2">Categories</h3>
            <ul className="space-y-1">
              <li><Link href="/register" className="text-sm hover:text-[#ff5722]">Register a Business</Link></li>
              <li><Link href="/legal" className="text-sm hover:text-[#ff5722]">Legal & Compliance</Link></li>
              <li><Link href="/banking" className="text-sm hover:text-[#ff5722]">Banking & Finance</Link></li>
              <li><Link href="/saas" className="text-sm hover:text-[#ff5722]">SaaS & AI Tools</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-4 text-sm">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p>© 2025 Yotta. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link href="/terms" className="hover:text-[#ff5722]">Terms of Service</Link>
              <Link href="/privacy" className="hover:text-[#ff5722]">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
