import Link from 'next/link';
import { 
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ChartBarIcon, 
  ArrowsRightLeftIcon,
  FireIcon,
  Squares2X2Icon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { ComponentType } from 'react';

interface MarketCardProps {
  href?: string;
  title: string;
  description: string;
  value?: string;
  change?: string;
  icon: ComponentType<{ className?: string }> | string;
}

// Map string icon names to components
const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  btc: CurrencyDollarIcon,
  eth: CurrencyDollarIcon,
  altcoin: ChartBarIcon,
  volatility: ArrowsRightLeftIcon,
  volume: ChartBarIcon,
  sentiment: ChatBubbleLeftRightIcon,
  dominance: Squares2X2Icon,
  momentum: FireIcon,
  // Add more mappings as needed
};

export default function MarketCard({ href, title, description, value, change, icon }: MarketCardProps) {
  // Determine the icon component to use
  let IconComponent: ComponentType<{ className?: string }> = CurrencyDollarIcon; // Default fallback
  
  if (icon) {
    if (typeof icon === 'string') {
      // Use the mapped component or default to CurrencyDollarIcon
      IconComponent = iconMap[icon] || CurrencyDollarIcon;
    } else {
      // Use the provided component
      IconComponent = icon;
    }
  }

  const content = (
    <>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-[#048F04]">
          {title}
        </h3>
        <IconComponent className="h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-[#048F04]" />
      </div>
      {value && (
        <div className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
          {value}
          {change && change !== "0%" && (
            <span className={`ml-2 text-sm font-normal ${parseFloat(change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change.startsWith('-') ? '' : '+'}{change}
            </span>
          )}
        </div>
      )}
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
        {description}
      </p>
      {href && (
        <div className="flex items-center text-sm text-[#048F04]">
          <span>View {title}</span>
          <ArrowTrendingUpIcon className="h-4 w-4 ml-1" />
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group relative bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-200"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
      {content}
    </div>
  );
} 