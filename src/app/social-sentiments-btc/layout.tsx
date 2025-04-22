import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Bitcoin Social Sentiment Analysis | Social Media Crypto Trends',
  description: 'Track Bitcoin sentiment across Twitter, Reddit, and Telegram. Analyze social media trends and their correlation with BTC price movements.',
  keywords: [
    'bitcoin social sentiment',
    'crypto social analysis',
    'btc social media trends',
    'twitter bitcoin sentiment',
    'reddit crypto analysis',
    'telegram bitcoin trends',
    'social trading signals',
    'crypto social indicators',
    'bitcoin social metrics',
    'cryptocurrency social sentiment'
  ].join(', '),
  openGraph: {
    title: 'Bitcoin Social Sentiment Analysis | Social Media Trends',
    description: 'Comprehensive analysis of Bitcoin sentiment across major social media platforms. Track social trends and their impact on BTC price.',
    type: 'website',
    url: 'https://cryptogreedindex.com/social-sentiments-btc',
    images: [
      {
        url: '/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'Bitcoin Social Sentiment Analysis'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin Social Sentiment Analysis',
    description: 'Track Bitcoin sentiment across social media platforms and analyze its impact on price movements.',
    images: ['/cryptogreedindex.png']
  }
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://cryptogreedindex.com/social-sentiments-btc",
        "url": "https://cryptogreedindex.com/social-sentiments-btc",
        "name": "Bitcoin Social Sentiment Analysis",
        "description": "Track and analyze Bitcoin sentiment across major social media platforms.",
        "isPartOf": {
          "@type": "Website",
          "@id": "https://cryptogreedindex.com/#website",
          "name": "Crypto Fear & Greed Index",
          "description": "Real-time cryptocurrency market sentiment analysis and trading tools",
          "publisher": {
            "@type": "Organization",
            "name": "Cryptogreedindex.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://cryptogreedindex.com/cryptogreedindex.png"
            }
          }
        }
      },
      {
        "@type": "Dataset",
        "name": "Bitcoin Social Sentiment Data",
        "description": "Comprehensive dataset of Bitcoin sentiment analysis across social media platforms",
        "temporalCoverage": "P1Y",
        "creator": {
          "@type": "Organization",
          "name": "Cryptogreedindex.com"
        },
        "variableMeasured": [
          {
            "@type": "PropertyValue",
            "name": "Twitter Sentiment",
            "description": "Sentiment analysis of Bitcoin-related tweets"
          },
          {
            "@type": "PropertyValue",
            "name": "Reddit Sentiment",
            "description": "Sentiment analysis of Bitcoin-related Reddit posts and comments"
          },
          {
            "@type": "PropertyValue",
            "name": "Telegram Sentiment",
            "description": "Sentiment analysis of Bitcoin-related Telegram messages"
          },
          {
            "@type": "PropertyValue",
            "name": "Social Volume",
            "description": "Volume of Bitcoin-related social media activity"
          }
        ],
        "measurementTechnique": [
          "Natural Language Processing",
          "Sentiment Analysis",
          "Social Media Analytics",
          "Volume Analysis"
        ]
      },
      {
        "@type": "TechArticle",
        "headline": "Understanding Bitcoin Social Sentiment Analysis",
        "description": "Learn how social media sentiment affects Bitcoin price movements and market trends.",
        "keywords": "bitcoin, social sentiment, crypto analysis, social media trends",
        "articleBody": "Social sentiment analysis measures the overall market mood towards Bitcoin across major social media platforms, providing insights into potential price movements and market psychology.",
        "author": {
          "@type": "Organization",
          "name": "Cryptogreedindex.com"
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="social-sentiments-btc-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      {children}
    </>
  );
} 