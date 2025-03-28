export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "US Markets Live | US Stock Market Today & Indices",
          "description": "Track real-time US market data, stock indices, and market trends. Get live updates from major US markets including S&P 500, Dow Jones, NASDAQ, and Russell 2000.",
          "url": "https://www.cryptogreedindex.com/us-markets",
          "mainEntity": {
            "@type": "DataFeed",
            "name": "US Markets Data",
            "description": "Real-time US market data and indices",
            "dataFeedElement": [
              {
                "@type": "DataFeedItem",
                "dateModified": new Date().toISOString(),
                "item": {
                  "@type": "FinancialProduct",
                  "name": "S&P 500",
                  "category": "US Stock Market Index",
                  "marketStatus": "Open"
                }
              },
              {
                "@type": "DataFeedItem",
                "dateModified": new Date().toISOString(),
                "item": {
                  "@type": "FinancialProduct",
                  "name": "NASDAQ",
                  "category": "US Stock Market Index",
                  "marketStatus": "Open"
                }
              },
              {
                "@type": "DataFeedItem",
                "dateModified": new Date().toISOString(),
                "item": {
                  "@type": "FinancialProduct",
                  "name": "Dow Jones",
                  "category": "US Stock Market Index",
                  "marketStatus": "Open"
                }
              },
              {
                "@type": "DataFeedItem",
                "dateModified": new Date().toISOString(),
                "item": {
                  "@type": "FinancialProduct",
                  "name": "Russell 2000",
                  "category": "US Stock Market Index",
                  "marketStatus": "Open"
                }
              }
            ]
          }
        })
      }}
    />
  );
} 