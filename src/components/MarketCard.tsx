import Link from 'next/link';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { ComponentType } from 'react';

interface MarketCardProps {
  href: string;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

export default function MarketCard({ href, title, description, icon: Icon }: MarketCardProps) {
  return (
    <Link
      href={href}
      className="group relative bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-[#048F04]">
          {title}
        </h3>
        <Icon className="h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-[#048F04]" />
      </div>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
        {description}
      </p>
      <div className="flex items-center text-sm text-[#048F04]">
        <span>View {title}</span>
        <ArrowTrendingUpIcon className="h-4 w-4 ml-1" />
      </div>
    </Link>
  );
} 