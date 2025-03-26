'use client';

import Link from 'next/link';
import { FaTwitter, FaInstagram, FaCoffee } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 shadow-inner">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Analysis</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/btc-dominance" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors">
                  BTC Dominance
                </Link>
              </li>
              <li>
                <Link href="/eth-dominance" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors">
                  ETH Dominance
                </Link>
              </li>
              <li>
                <Link href="/altcoin-dominance" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors">
                  Altcoin Dominance
                </Link>
              </li>
              <li>
                <Link href="/fear-greed-vs-btc" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors">
                  Fear & Greed vs BTC
                </Link>
              </li>
              <li>
                <Link href="/social-sentiments-btc" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors">
                  Social Sentiments & BTC
                </Link>
              </li>
              <li>
                <Link href="/top-coins" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors">
                  Top 100 Crypto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Markets</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/global-markets" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors">
                  Global Markets
                </Link>
              </li>
              <li>
                <Link href="/us-markets" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors">
                  US Markets
                </Link>
              </li>
              <li>
                <Link href="/us-markets/sp500" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors pl-4 text-sm">
                  S&P 500
                </Link>
              </li>
              <li>
                <Link href="/us-markets/nasdaq" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors pl-4 text-sm">
                  NASDAQ
                </Link>
              </li>
              <li>
                <Link href="/us-markets/dow-jones" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors pl-4 text-sm">
                  Dow Jones
                </Link>
              </li>
              <li>
                <Link href="/us-markets/russell2000" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors pl-4 text-sm">
                  Russell 2000
                </Link>
              </li>
              <li>
                <Link href="/us-markets/dollar-index" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors pl-4 text-sm">
                  US Dollar Index
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-[#048f04] dark:hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Follow Us</h3>
            <div className="flex items-center space-x-4">
              <a
                href="https://x.com/CryptoGreedIndx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-400 dark:text-gray-400 dark:hover:text-blue-300 transition-colors"
                aria-label="Follow us on Twitter"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/crtptogreedindex/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-500 dark:text-gray-400 dark:hover:text-pink-400 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Support Us</h3>
            <Link
              href="/donate"
              className="inline-flex items-center px-4 py-2 bg-[#048f04] hover:bg-blue-500 text-white rounded-lg transition-colors duration-200"
            >
              <FaCoffee className="w-5 h-5 mr-2" />
              <span>Buy me a Coffee</span>
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            © {new Date().getFullYear()} www.cryptogreedindex.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 