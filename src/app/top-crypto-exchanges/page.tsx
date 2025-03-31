'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowUpIcon, ArrowDownIcon, MagnifyingGlassIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { jsonLd } from './metadata';
import Script from 'next/script';

interface Exchange {
  id: string;
  name: string;
  logo: string;
  description: string;
  volume24h: number;
  tradingPairs: number;
  status: string;
  founded: string;
  website: string;
  apiUrl: string;
  features: string[];
  trust_score: number;
  trust_rank: number;
}

const ExchangeSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/6"></div>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
    </div>
  </div>
);

export default function TopCryptoExchanges() {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [filteredExchanges, setFilteredExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'volume' | 'name' | 'rank'>('volume');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [exchangesPerPage] = useState(20);

  useEffect(() => {
    const fetchExchanges = async () => {
      const loadingToast = toast.loading('Loading exchanges...');
      try {
        const response = await fetch('/api/exchanges');
        const data = await response.json();
        setExchanges(data);
        setFilteredExchanges(data);
        setLoading(false);
        toast.success('Exchanges loaded successfully!', {
          id: loadingToast,
        });
      } catch (err) {
        setError('Failed to fetch exchange data');
        setLoading(false);
        console.error('Error fetching exchanges:', err);
        toast.error('Failed to load exchanges. Please try again later.', {
          id: loadingToast,
        });
      }
    };

    fetchExchanges();
  }, []);

  useEffect(() => {
    let filtered = [...exchanges];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(exchange => 
        exchange.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exchange.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(exchange => 
        exchange.status.toLowerCase() === statusFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'volume') {
        return sortOrder === 'desc' 
          ? b.volume24h - a.volume24h 
          : a.volume24h - b.volume24h;
      } else if (sortBy === 'name') {
        return sortOrder === 'desc'
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      } else if (sortBy === 'rank') {
        return sortOrder === 'desc'
          ? b.trust_score - a.trust_score
          : a.trust_score - b.trust_score;
      }
      return 0;
    });

    setFilteredExchanges(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder, statusFilter, exchanges]);

  // Calculate pagination values
  const indexOfLastExchange = currentPage * exchangesPerPage;
  const indexOfFirstExchange = indexOfLastExchange - exchangesPerPage;
  const currentExchanges = filteredExchanges.slice(indexOfFirstExchange, indexOfLastExchange);
  const totalPages = Math.ceil(filteredExchanges.length / exchangesPerPage);

  const formatVolume = (volume: number) => {
    if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M BTC`;
    if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K BTC`;
    return volume.toFixed(2) + ' BTC';
  };

  const toggleSort = (field: 'volume' | 'name' | 'rank') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const toggleStatusFilter = (status: 'all' | 'active' | 'inactive') => {
    setStatusFilter(status);
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 20 }).map((_, i) => (
                <ExchangeSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Top Cryptocurrency Exchanges
          </h1>

          {/* Search and Filter Controls */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search exchanges..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            >
              <FunnelIcon className="h-5 w-5" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* Filter Options */}
            {showFilters && (
              <div className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                {/* Status Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStatusFilter('all')}
                      className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
                        statusFilter === 'all'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => toggleStatusFilter('active')}
                      className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
                        statusFilter === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => toggleStatusFilter('inactive')}
                      className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer ${
                        statusFilter === 'inactive'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleSort('volume')}
                      className={`px-4 py-2 rounded-lg border cursor-pointer ${
                        sortBy === 'volume'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                      } hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2`}
                    >
                      Volume
                      {sortBy === 'volume' && (
                        sortOrder === 'desc' ? <ArrowDownIcon className="h-4 w-4" /> : <ArrowUpIcon className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleSort('name')}
                      className={`px-4 py-2 rounded-lg border cursor-pointer ${
                        sortBy === 'name'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                      } hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2`}
                    >
                      Name
                      {sortBy === 'name' && (
                        sortOrder === 'desc' ? <ArrowDownIcon className="h-4 w-4" /> : <ArrowUpIcon className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => toggleSort('rank')}
                      className={`px-4 py-2 rounded-lg border cursor-pointer ${
                        sortBy === 'rank'
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                      } hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2`}
                    >
                      Trust Rank
                      {sortBy === 'rank' && (
                        sortOrder === 'desc' ? <ArrowDownIcon className="h-4 w-4" /> : <ArrowUpIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentExchanges.map((exchange) => (
              <div
                key={exchange.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="relative w-12 h-12 mr-4">
                      <Image
                        src={exchange.logo}
                        alt={`${exchange.name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {exchange.name}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Founded: {exchange.founded}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {exchange.description}
                  </p>

                  <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Status</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        exchange.status === 'Active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {exchange.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Trading Pairs</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {exchange.tradingPairs}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">Trust Rank</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        #{exchange.trust_rank}
                      </span>
                    </div>
                   
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400">24h Volume</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {formatVolume(exchange.volume24h)}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {exchange.features.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-center items-center w-full">
                    <a
                      href={exchange.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-[#048f04] hover:bg-blue-500 text-white rounded-lg transition-colors duration-200"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg cursor-pointer ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 rounded-lg cursor-pointer ${
                    currentPage === index + 1
                      ? 'bg-[#048F04] text-white hover:bg-blue-500'
                      : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg cursor-pointer ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Showing {indexOfFirstExchange + 1} to {Math.min(indexOfLastExchange, filteredExchanges.length)} of {filteredExchanges.length} exchanges
          </div>
        </div>
      </div>
    </>
  );
} 