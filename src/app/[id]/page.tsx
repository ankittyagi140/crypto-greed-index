import { Metadata } from 'next';
import ClientPage from './ClientPage';
import Script from 'next/script';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `${id} price | ${id} Live Charts`,
    description: `Detailed information about ${id} cryptocurrency including price, market data, and technical analysis.`,
    keywords: `${id} details, ${id} price, ${id} market data, ${id} technical analysis`,
    openGraph: {
      title: `${id} Details | Crypto Live Charts`,
      description: `Detailed information about ${id} cryptocurrency including price, market data, and technical analysis.`,
      type: 'website',
      images: ['/cryptogreedindex.png'],
      url: `https://www.cryptogreedindex.com/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${id} Details | ${id} Live Charts`,
      description: `Detailed information about ${id} cryptocurrency including price, market data, and technical analysis.`,
      images: ['/cryptogreedindex.png'],
    }
  };
}

export default async function CoinPage({ params }: Props) {
  const { id } = await params;
  return (
    <>
      <Script
        id="coin-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Cryptocurrency",
            "name": id,
            "symbol": id,
            "description": `Detailed information about ${id} cryptocurrency including price, market data, and technical analysis.`,
            "url": `https://www.cryptogreedindex.com/${id}`,
            "image": `https://assets.coingecko.com/coins/images/1/${id}.png`,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://www.cryptogreedindex.com/${id}`
            },
          })
        }}
      />
      <ClientPage id={id} />
    </>
  );
} 