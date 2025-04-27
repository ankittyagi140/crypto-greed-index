'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaTwitter, FaInstagram, FaLinkedin, FaCoffee } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex flex-col items-center">
            <div className="relative w-12 h-12 mb-2">
              <Image
                src="/cryptogreedindex.png"
                alt="CryptogreedIndex.com"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <span className="text-sm text-gray-300 hover:text-white transition-colors">CryptoGreedIndex.com</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-10">
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">About</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Analysis</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/btc-dominance" className="text-gray-300 hover:text-white transition-colors text-sm">
                  BTC Dominance
                </Link>
              </li>
              <li>
                <Link href="/eth-dominance" className="text-gray-300 hover:text-white transition-colors text-sm">
                  ETH Dominance
                </Link>
              </li>
              <li>
                <Link href="/altcoin-dominance" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Altcoin Dominance
                </Link>
              </li>
              <li>
                <Link href="/fear-greed-vs-btc" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Fear & Greed vs BTC
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Cryptocurrencies</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/social-sentiments-btc" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Social Sentiments & BTC
                </Link>
              </li>
              <li>
                <Link href="/top-10-crypto" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Top 10 Crypto
                </Link>
              </li>
              <li>
                <Link href="/top-crypto" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Top 100 Crypto
                </Link>
              </li>
              <li>
                <Link href="/top-crypto-exchanges" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Top Crypto Exchanges
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Markets</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/global-markets" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Global Markets
                </Link>
              </li>
              <li>
                <Link href="/us-markets" className="text-gray-300 hover:text-white transition-colors text-sm">
                  US Markets
                </Link>
              </li>
              <li>
                <Link href="/us-markets/sp500" className="text-gray-300 hover:text-white transition-colors text-xs pl-2">
                  S&P 500
                </Link>
              </li>
              <li>
                <Link href="/us-markets/nasdaq" className="text-gray-300 hover:text-white transition-colors text-xs pl-2">
                  NASDAQ
                </Link>
              </li>
              <li>
                <Link href="/us-markets/dow-jones" className="text-gray-300 hover:text-white transition-colors text-xs pl-2">
                  Dow Jones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Connect</h3>
            <div className="flex items-center space-x-4 mb-6">
              <a
                href="https://x.com/CryptoGreedIndx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Follow us on Twitter"
              >
                <FaTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/crtptogreedindex/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-400 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/atyagi-js"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Connect on LinkedIn"
              >
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
            <Link
              href="/donate"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200 text-sm"
            >
              <FaCoffee className="w-4 h-4 mr-2" />
              <span>Support Us</span>
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="mb-6">
            <p className="text-xs text-gray-400 leading-relaxed max-w-4xl mx-auto text-center">
              <strong>Disclaimer:</strong> The information provided on this website does not constitute investment advice, financial advice, trading advice, or any other sort of advice. CryptoGreedIndex does not recommend that any cryptocurrency should be bought, sold, or held by you. Conduct your own due diligence and consult your financial advisor before making any investment decisions.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs">
              © {new Date().getFullYear()} CryptoGreedIndex.com. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs mt-2 md:mt-0">
              Market data powered by <a href="https://coinstats.app/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">CoinStats</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 