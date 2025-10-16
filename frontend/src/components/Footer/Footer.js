'use client';

import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-green-600 text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-center">
        <nav aria-label="Footer">
          <ul className="flex space-x-8">
            <li>
              <Link href="/contact" className="hover:underline focus:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:underline focus:underline">
                Help Center
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
