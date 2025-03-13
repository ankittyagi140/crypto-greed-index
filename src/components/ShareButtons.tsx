import React from 'react';
import { FaTwitter, FaWhatsapp, FaTelegram } from 'react-icons/fa';

interface ShareButtonsProps {
  title: string;
  text: string;
  hashtags?: string[];
}

export default function ShareButtons({ title, text, hashtags = [] }: ShareButtonsProps) {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const encodedText = encodeURIComponent(`${title}\n\n${text}\n\n${shareUrl}`);
  const encodedHashtags = hashtags.join(',');

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&hashtags=${encodedHashtags}`,
    whatsapp: `https://wa.me/?text=${encodedText}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`${title}\n\n${text}`)}`
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center justify-centergap-2 mt-2">
      <button
        onClick={() => handleShare('twitter')}
        className="p-2 text-blue-400 hover:text-blue-600 dark:text-blue-300 dark:hover:text-blue-400 transition-colors cursor-pointer"
        aria-label="Share on Twitter"
      >
        <FaTwitter className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleShare('whatsapp')}
        className="p-2 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-500 transition-colors cursor-pointer"
        aria-label="Share on WhatsApp"
      >
        <FaWhatsapp className="w-5 h-5" />
      </button>
      <button
        onClick={() => handleShare('telegram')}
        className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500 transition-colors cursor-pointer"
        aria-label="Share on Telegram"
      >
        <FaTelegram className="w-5 h-5" />
      </button>
    </div>
  );
} 