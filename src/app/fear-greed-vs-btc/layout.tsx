import { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Bitcoin Fear & Greed Index vs Price Analysis | Historical Trends',
  description: 'Analyze the relationship between crypto market sentiment and Bitcoin price movements. Track historical Fear & Greed Index trends and understand their impact on BTC price action.',
  keywords: [
    'bitcoin fear and greed index',
    'crypto market sentiment',
    'bitcoin price analysis',
    'crypto fear index history',
    'bitcoin market psychology',
    'crypto trading indicators',
    'market sentiment analysis',
    'bitcoin price correlation',
    'crypto market trends',
    'fear and greed historical data'
  ].join(', '),
  openGraph: {
    title: 'Bitcoin Fear & Greed Index vs Price Analysis',
    description: 'Track the relationship between market sentiment and Bitcoin price movements with our comprehensive Fear & Greed Index analysis tools.',
    type: 'website',
    url: 'https://cryptogreedindex.com/fear-greed-vs-btc',
    images: [
      {
        url: '/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'Fear & Greed Index vs Bitcoin Price Analysis'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitcoin Fear & Greed Index vs Price Analysis',
    description: 'Track the relationship between market sentiment and Bitcoin price movements with our comprehensive Fear & Greed Index analysis tools.',
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
        "@id": "https://cryptogreedindex.com/fear-greed-vs-btc",
        "url": "https://cryptogreedindex.com/fear-greed-vs-btc",
        "name": "Bitcoin Fear & Greed Index Analysis",
        "description": "Comprehensive analysis of Bitcoin market sentiment using the Fear & Greed Index, including historical trends and price correlation.",
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
        "@type": "TechArticle",
        "headline": "Understanding the Fear & Greed Index and Bitcoin Price Correlation",
        "description": "Learn how to use the Fear & Greed Index for Bitcoin market analysis and trading decisions.",
        "keywords": "bitcoin trading, market sentiment, crypto analysis, fear and greed index",
        "articleBody": "The Crypto Fear & Greed Index is a market sentiment indicator that measures two primary emotions driving cryptocurrency investors: fear and greed. The index ranges from 0 to 100, where 0 represents Extreme Fear and 100 indicates Extreme Greed.",
        "author": {
          "@type": "Organization",
          "name": "Cryptogreedindex.com"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Cryptogreedindex.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://cryptogreedindex.com/cryptogreedindex.png"
          }
        }
      },
      {
        "@type": "Dataset",
        "name": "Fear & Greed Index Historical Data",
        "description": "Historical data showing the relationship between market sentiment and Bitcoin price movements",
        "temporalCoverage": "P1Y",
        "creator": {
          "@type": "Organization",
          "name": "Cryptogreedindex.com"
        },
        "variableMeasured": [
          {
            "@type": "PropertyValue",
            "name": "Market Sentiment",
            "valueReference": {
              "@type": "PropertyValue",
              "minValue": 0,
              "maxValue": 100,
              "unitText": "Index Value"
            }
          },
          {
            "@type": "PropertyValue",
            "name": "Bitcoin Price",
            "unitText": "USD"
          },
          {
            "@type": "PropertyValue",
            "name": "Trading Volume",
            "unitText": "USD"
          },
          {
            "@type": "PropertyValue",
            "name": "Market Momentum",
            "description": "Measurement of market trend strength"
          }
        ],
        "measurementTechnique": [
          "Market Sentiment Analysis",
          "Price Analysis",
          "Volume Analysis",
          "Technical Analysis"
        ]
      },
      {
        "@type": "FinancialProduct",
        "name": "Bitcoin Fear & Greed Index Analysis",
        "description": "Comprehensive analysis of Bitcoin market sentiment using the Fear & Greed Index, including historical trends and price correlation.",
        "category": "Cryptocurrency Market Analysis",
        "url": "https://cryptogreedindex.com/fear-greed-vs-btc",
        "provider": {
          "@type": "Organization",
          "name": "Cryptogreedindex.com",
          "url": "https://cryptogreedindex.com"
        },
        "termsOfService": "https://cryptogreedindex.com/terms",
        "featureList": [
          "Real-time sentiment analysis",
          "Historical trend analysis",
          "Bitcoin price correlation",
          "Market psychology insights",
          "Trading signals"
        ]
      },
      {
        "@type": "HowTo",
        "name": "How to Use the Fear & Greed Index",
        "description": "Learn how to effectively use the Fear & Greed Index for cryptocurrency trading decisions",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Compare Historical Patterns",
            "text": "Compare current sentiment levels with historical patterns to identify potential market trends"
          },
          {
            "@type": "HowToStep",
            "name": "Analyze Price Divergence",
            "text": "Look for divergences between sentiment and price action to spot potential market reversals"
          },
          {
            "@type": "HowToStep",
            "name": "Consider Multiple Timeframes",
            "text": "Use the time range selector to analyze different market cycles and timeframes"
          },
          {
            "@type": "HowToStep",
            "name": "Combine with Other Indicators",
            "text": "Consider the index as one of many tools in your investment strategy"
          }
        ],
        "tool": [
          {
            "@type": "HowToTool",
            "name": "Fear & Greed Index Chart"
          },
          {
            "@type": "HowToTool",
            "name": "Bitcoin Price Comparison Tool"
          },
          {
            "@type": "HowToTool",
            "name": "Time Range Selector"
          }
        ]
      }
    ]
  };

  return (
    <>
      <Script
        id="fear-greed-vs-btc-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      {children}
    </>
  );
} 