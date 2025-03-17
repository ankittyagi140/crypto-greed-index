export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Global Markets Today',
    description: 'Real-time performance of major stock indices worldwide',
    dateModified: new Date().toISOString(),
    mainEntity: {
      '@type': 'Dataset',
      name: 'Global Market Indices',
      description: 'Live market data for major stock indices across Asia Pacific, Europe, Americas, Middle East & Africa',
      temporalCoverage: `${new Date().getFullYear()}/P1Y`,
      creator: {
        '@type': 'Organization',
        name: 'Market Analysis Platform'
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 