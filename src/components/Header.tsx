'use client';

import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

interface HeaderProps {
  title?: string;
}

export default function Header({ 
  title = "Crypto Greed Index"
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'analysis' | 'markets' | null>(null);

  const handleDropdownClick = (dropdown: 'analysis' | 'markets') => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <div className="sticky top-0 z-50">
      <header className="bg-white/300 dark:bg-gray-900/30 backdrop-blur-lg shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-6xl flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative w-10 h-10">
              <Image
                src="/cryptogreedindex.png"
                alt="Crypto Greed Index"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-xl font-bold text-[#048f04] dark:text-white">
              {title}
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span>Home</span>
            </Link>
            <Link 
              href="/about" 
              className="flex items-center space-x-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
              <span>About Us</span>
            </Link>
            <div className="relative">
              <button 
                onClick={() => handleDropdownClick('analysis')}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605" />
                </svg>
                <span>Analysis</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 transition-transform ${activeDropdown === 'analysis' ? 'rotate-180' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 transition-all duration-200 ${activeDropdown === 'analysis' ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <Link 
                  href="/btc-dominance" 
                  className="block px-4 py-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white"
                  onClick={() => setActiveDropdown(null)}
                >
                  BTC Dominance
                </Link>
                <Link 
                  href="/eth-dominance" 
                  className="block px-4 py-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white"
                  onClick={() => setActiveDropdown(null)}
                >
                  ETH Dominance
                </Link>
                <Link 
                  href="/altcoin-dominance" 
                  className="block px-4 py-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white"
                  onClick={() => setActiveDropdown(null)}
                >
                  Altcoin Dominance
                </Link>
              </div>
            </div>

            {/* Markets Dropdown */}
            <div className="relative">
              <button 
                onClick={() => handleDropdownClick('markets')}
                className="flex items-center space-x-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors cursor-pointer"
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
                  className="block px-4 py-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white"
                  onClick={() => setActiveDropdown(null)}
                >
                  Global Markets
                </Link>
                <Link 
                  href="/us-markets" 
                  className="block px-4 py-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white"
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

      {/* Mobile Navigation Menu */}
      <div
        className={`bg-white/300 dark:bg-gray-900/30 backdrop-blur-lg shadow-lg md:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <nav className="container mx-auto px-4 py-4 max-w-6xl flex flex-col space-y-4">
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
          <Link 
            href="/about" 
            className="flex items-center space-x-2 text-gray-600 hover:text-[#048f04] dark:text-gray-300 dark:hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            </svg>
            <span>About Us</span>
          </Link>
          <div className="space-y-2">
            <div className="text-gray-600 dark:text-gray-300 font-medium px-2 dark:hover:text-white transition-colors">Analysis</div>
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

          <div className="flex items-center justify-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
              <span>Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
} 