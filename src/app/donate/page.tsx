'use client';

import { useState } from 'react';
import { FaEthereum, FaCopy, FaCheckCircle, FaCoffee, FaBitcoin } from 'react-icons/fa';
import { SiSolana } from 'react-icons/si';
import { BiCoinStack } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const cryptoAddresses = {
  bitcoin:"bc1qd4msd4yyx2val8k6ejuz6zq4yj6n96f0t5pdrr",  
  ethereum: '0xA8ccDb51Be31C54EA317Ac0b0a14347fd867f091',
  solana: '7GQN5YfUC2DRPZ98R7dN5BgqRuCD7gUci3N5KbQKWtcF',
  usdc: '7GQN5YfUC2DRPZ98R7dN5BgqRuCD7gUci3N5KbQKWtcF' // Using ETH address for USDC
};

export default function DonatePage() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopyAddress = (type: keyof typeof cryptoAddresses) => {
    navigator.clipboard.writeText(cryptoAddresses[type]).then(() => {
      setCopiedAddress(type);
      toast.success(`${type.toUpperCase()} address copied!`);
      setTimeout(() => setCopiedAddress(null), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container w-8xl px-4 py-12 mx-auto">
        <div className="max-w-8xl mx-auto">
          {/* Back button */}
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 bg-[#048f04] rounded-full mb-4">
              <FaCoffee className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Buy me a Coffee
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Support the development of Crypto Fear & Greed Index with your favorite cryptocurrency
            </p>
          </div>

          {/* Donation Options */}
          <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaBitcoin className="w-8 h-8 text-[#627EEA]" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                    Bitcoin (BTC)
                  </h2>
                </div>
                <button
                  onClick={() => handleCopyAddress('bitcoin')}
                  className="flex items-center space-x-2 text-[#627EEA] hover:text-[#4c63bb] transition-colors cursor-pointer"
                >
                  {copiedAddress === 'bitcoin' ? <FaCheckCircle className="w-5 h-5" /> : <FaCopy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono break-all">
                {cryptoAddresses.bitcoin}
              </p>
            </div>
            {/* Solana */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <SiSolana className="w-8 h-8 text-[#9945FF]" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                    Solana (SOL)
                  </h2>
                </div>
                <button
                  onClick={() => handleCopyAddress('solana')}
                  className="flex items-center space-x-2 text-[#9945FF] hover:text-[#7d37d6] transition-colors cursor-pointer"
                >
                  {copiedAddress === 'solana' ? <FaCheckCircle className="w-5 h-5" /> : <FaCopy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono break-all">
                {cryptoAddresses.solana}
              </p>
            </div>

            {/* Ethereum */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaEthereum className="w-8 h-8 text-[#627EEA]" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                    Ethereum (ETH)
                  </h2>
                </div>
                <button
                  onClick={() => handleCopyAddress('ethereum')}
                  className="flex items-center space-x-2 text-[#627EEA] hover:text-[#4c63bb] transition-colors cursor-pointer"
                >
                  {copiedAddress === 'ethereum' ? <FaCheckCircle className="w-5 h-5" /> : <FaCopy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono break-all">
                {cryptoAddresses.ethereum}
              </p>
            </div>

            {/* USDC */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <BiCoinStack className="w-8 h-8 text-[#2775CA]" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
                    USD Coin (USDC)
                  </h2>
                </div>
                <button
                  onClick={() => handleCopyAddress('usdc')}
                  className="flex items-center space-x-2 text-[#2775CA] hover:text-[#1f5ca1] transition-colors cursor-pointer"
                >
                  {copiedAddress === 'usdc' ? <FaCheckCircle className="w-5 h-5" /> : <FaCopy className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono break-all">
                {cryptoAddresses.usdc}
              </p>
            </div>
          </div>

          {/* Thank you message */}
          <div className="mt-12 text-center text-gray-600 dark:text-gray-300">
            <p>Thank you for your support! ❤️</p>
            <p className="mt-2 text-sm">Your contribution helps keep this project running and improving.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 