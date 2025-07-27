export default function StructuredData() {
  const dateModified = new Date().toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "S&P 500, Dow Jones, NASDAQ Live Index Tracker | CryptoGreedIndex",
    "headline": "Live US Stock Market Indices - S&P 500, Dow Jones, NASDAQ 2025",
    "description": "Track real-time data of S&P 500, Dow Jones, NASDAQ, and Russell 2000. Get live updates on US stock market indices, futures, and ETF insights for informed investing.",
    "url": "https://www.cryptogreedindex.com/us-markets",
    "dateModified": dateModified,
    "inLanguage": "en-US",

    "author": {
      "@type": "Organization",
      "name": "CryptoGreedIndex",
      "url": "https://www.cryptogreedindex.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.cryptogreedindex.com/cryptogreedindex.png",
        "width": 600,
        "height": 60
      },
      "sameAs": [
        "https://twitter.com/cryptogreedindex",
        "https://www.linkedin.com/in/atyagi-js/"
      ]
    },

    "publisher": {
      "@type": "Organization",
      "name": "CryptoGreedIndex",
      "url": "https://www.cryptogreedindex.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.cryptogreedindex.com/cryptogreedindex.png",
        "width": 600,
        "height": 60
      }
    },

    "mainEntity": {
      "@type": "DataFeed",
      "name": "Live Data Feed - US Stock Indices",
      "description": "Live updates of US stock market indices: S&P 500, NASDAQ Composite, Dow Jones, and Russell 2000.",
      "dataFeedElement": [
        {
          "@type": "DataFeedItem",
          "dateModified": dateModified,
          "item": {
            "@type": "FinancialProduct",
            "name": "S&P 500 Index",
            "category": "Large-Cap US Stocks",
            "additionalProperty": [
              { "@type": "PropertyValue", "name": "Market Status", "value": "Open" },
              { "@type": "PropertyValue", "name": "Index Type", "value": "Broad Market Index" }
            ]
          }
        },
        {
          "@type": "DataFeedItem",
          "dateModified": dateModified,
          "item": {
            "@type": "FinancialProduct",
            "name": "NASDAQ Composite",
            "category": "Tech-Focused US Stocks",
            "additionalProperty": [
              { "@type": "PropertyValue", "name": "Market Status", "value": "Open" },
              { "@type": "PropertyValue", "name": "Index Type", "value": "Technology Index" }
            ]
          }
        },
        {
          "@type": "DataFeedItem",
          "dateModified": dateModified,
          "item": {
            "@type": "FinancialProduct",
            "name": "Dow Jones Industrial Average",
            "category": "Blue-Chip Stocks",
            "additionalProperty": [
              { "@type": "PropertyValue", "name": "Market Status", "value": "Open" },
              { "@type": "PropertyValue", "name": "Index Type", "value": "Price-Weighted Index" }
            ]
          }
        },
        {
          "@type": "DataFeedItem",
          "dateModified": dateModified,
          "item": {
            "@type": "FinancialProduct",
            "name": "Russell 2000",
            "category": "Small-Cap US Stocks",
            "additionalProperty": [
              { "@type": "PropertyValue", "name": "Market Status", "value": "Open" },
              { "@type": "PropertyValue", "name": "Index Type", "value": "Small-Cap Index" }
            ]
          }
        }
      ]
    },

    "about": [
      {
        "@type": "Thing",
        "name": "S&P 500",
        "description": "A stock market index tracking the performance of 500 leading publicly traded companies in the United States."
      },
      {
        "@type": "Thing",
        "name": "Stock Market Index",
        "description": "A benchmark that measures the performance of a specific set of stocks to represent a segment of the market."
      },
      {
        "@type": "Thing",
        "name": "Futures Market",
        "description": "A marketplace where futures contracts are bought and sold for future delivery."
      },
      {
        "@type": "Thing",
        "name": "NASDAQ",
        "description": "A global electronic marketplace for buying and selling securities, focused on tech stocks."
      }
    ],

    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.cryptogreedindex.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },

    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.cryptogreedindex.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "US Markets",
          "item": "https://www.cryptogreedindex.com/us-markets"
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
