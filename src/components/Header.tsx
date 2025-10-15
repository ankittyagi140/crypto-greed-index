'use client';

import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { useState, useEffect } from 'react';

interface HeaderProps {
  title?: string;
}

export default function Header({
  title = "CryptogreedIndex.com"
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'analysis' | 'markets' | null>(null);

  const handleDropdownClick = (dropdown: 'analysis' | 'markets') => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="sticky top-0 z-50">
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-gray-700/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src="/cryptogreedindex.png"
                alt="CryptogreedIndex.com"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
              {title}
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span>Home</span>
            </Link>
            <div className="relative">
              <button
                onClick={() => handleDropdownClick('analysis')}
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors cursor-pointer font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
                <span>Analysis</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform ${activeDropdown === 'analysis' ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div className={`absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 dark:border-gray-700/30 py-2 transition-all duration-200 ${activeDropdown === 'analysis' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <Link
                  href="/top-crypto"
                  className="block px-4 py-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors font-medium"
                  onClick={() => setActiveDropdown(null)}
                >
                  Top Cryptocurrencies
                </Link>
                <Link
                  href="/btc-dominance"
                  className="block px-4 py-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors font-medium"
                  onClick={() => setActiveDropdown(null)}
                >
                  BTC Dominance
                </Link>
                <Link
                  href="/eth-dominance"
                  className="block px-4 py-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors font-medium"
                  onClick={() => setActiveDropdown(null)}
                >
                  ETH Dominance
                </Link>
                <Link
                  href="/altcoin-dominance"
                  className="block px-4 py-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors font-medium"
                  onClick={() => setActiveDropdown(null)}
                >
                  Altcoin Dominance
                </Link>
                <Link
                  href="/fear-greed-vs-btc"
                  className="block px-4 py-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors font-medium"
                  onClick={() => setActiveDropdown(null)}
                >
                  Fear & Greed vs BTC
                </Link>
                <Link
                  href="/social-sentiments-btc"
                  className="block px-4 py-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors font-medium"
                  onClick={() => setActiveDropdown(null)}
                >
                  Social Sentiments & BTC
                </Link>
              </div>
            </div>

            {/* Markets Dropdown */}
            <div className="relative">
              <button
                onClick={() => handleDropdownClick('markets')}
                className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors cursor-pointer font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
                </svg>
                <span>Markets</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform ${activeDropdown === 'markets' ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 transition-all duration-200 ${activeDropdown === 'markets' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <Link
                  href="/global-markets"
                  className="block px-4 py-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors font-medium"
                  onClick={() => setActiveDropdown(null)}
                >
                  Global Markets
                </Link>
                <Link
                  href="/us-markets"
                  className="block px-4 py-2 text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors font-medium"
                  onClick={() => setActiveDropdown(null)}
                >
                  US Markets
                </Link>
              </div>
            </div>
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors md:hidden"
            aria-label="Toggle mobile menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu - Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-lg md:hidden transform transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close button */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <Image  src="/cryptogreedindex.png"
                alt="CryptogreedIndex.com"
                width={40}
                height={40}
                className="object-contain"
                 />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile menu content */}
        <nav className="overflow-y-auto h-[calc(100%-64px)] p-4">
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span>Home</span>
            </Link>

            <div className="space-y-2">
              <div className="text-gray-600 dark:text-gray-300 font-medium px-2 dark:hover:text-white transition-colors">Analysis</div>
              <Link
                href="/top-crypto"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors pl-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
                <span>Top Cryptocurrencies</span>
              </Link>
              <Link
                href="/btc-dominance"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors pl-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
                <span>BTC Dominance</span>
              </Link>
              <Link
                href="/eth-dominance"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors pl-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
                <span>ETH Dominance</span>
              </Link>
              <Link
                href="/altcoin-dominance"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors pl-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
                <span>Altcoin Dominance</span>
              </Link>
              <Link
                href="/fear-greed-vs-btc"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors pl-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
                <span>Fear & Greed vs BTC</span>
              </Link>
              <Link
                href="/social-sentiments-btc"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors pl-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
                <span>Social Sentiments & BTC</span>
              </Link>
            </div>

            {/* Mobile Markets Section */}
            <div className="space-y-2">
              <div className="text-gray-600 dark:text-gray-300 font-medium px-2 dark:hover:text-white transition-colors">Markets</div>
              <Link
                href="/global-markets"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors pl-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
                </svg>
                <span>Global Markets</span>
              </Link>
              <Link
                href="/us-markets"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors pl-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />
                </svg>
                <span>US Markets</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <span>Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 bg-opacity-50 md:hidden z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  );
} 