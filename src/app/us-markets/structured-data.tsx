export default function StructuredData() {
  const dateModified = new Date().toISOString();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "US Markets Live | S&P 500, NASDAQ, Dow Jones & Russell 2000 Today",
    "url": "https://www.cryptogreedindex.com/us-markets",
    "description":
      "Track real-time US market data, stock indices, and market trends. Get live updates from major US markets including S&P 500, NASDAQ, Dow Jones, and Russell 2000.",
    "dateModified": dateModified,
    "publisher": {
      "@type": "Organization",
      "name": "CryptoGreedIndex.com",
      "url": "https://www.cryptogreedindex.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.cryptogreedindex.com/cryptogreedindex.png"
      }
    },
    "mainEntity": {
      "@type": "DataFeed",
      "name": "US Markets Data Feed",
      "description":
        "Live data feed for major US stock market indices including S&P 500, NASDAQ, Dow Jones, and Russell 2000.",
      "dataFeedElement": [
        {
          "@type": "DataFeedItem",
          "dateModified": dateModified,
          "item": {
            "@type": "FinancialProduct",
            "name": "S&P 500",
            "category": "US Stock Market Index",
            "additionalProperty": {
              "@type": "PropertyValue",
              "name": "Market Status",
              "value": "Open"
            }
          }
        },
        {
          "@type": "DataFeedItem",
          "dateModified": dateModified,
          "item": {
            "@type": "FinancialProduct",
            "name": "NASDAQ",
            "category": "US Stock Market Index",
            "additionalProperty": {
              "@type": "PropertyValue",
              "name": "Market Status",
              "value": "Open"
            }
          }
        },
        {
          "@type": "DataFeedItem",
          "dateModified": dateModified,
          "item": {
            "@type": "FinancialProduct",
            "name": "Dow Jones",
            "category": "US Stock Market Index",
            "additionalProperty": {
              "@type": "PropertyValue",
              "name": "Market Status",
              "value": "Open"
            }
          }
        },
        {
          "@type": "DataFeedItem",
          "dateModified": dateModified,
          "item": {
            "@type": "FinancialProduct",
            "name": "Russell 2000",
            "category": "US Stock Market Index",
            "additionalProperty": {
              "@type": "PropertyValue",
              "name": "Market Status",
              "value": "Open"
            }
          }
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
