import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '../components/Providers';
import Script from 'next/script';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  colorScheme: 'dark light',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cryptogreedindex.com'),
  title: 'Fear and Greed Index | Live Crypto & Stock Market Sentiment',
  description: 'Track real-time Fear and Greed Index for crypto and traditional markets. Compare Bitcoin, CNN, and Stock market sentiment indicators updated every 5 minutes.',
  keywords: [
    'fear and greed index',
    'crypto fear and greed index',
    'bitcoin fear and greed index',
    'cnn fear and greed',
    'fear greed index',
    'market fear and greed index',
    'crypto market sentiment',
    'fear and greed indicator',
    'crypto fear index',
    'stock market fear and greed'
  ].join(', '),
  authors: [{ name: 'Crypto Fear & Greed Index' }],
  creator: 'Crypto Fear & Greed Index',
  publisher: 'Crypto Fear & Greed Index',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cryptogreedindex.com',
    siteName: 'Crypto Fear & Greed Index',
    title: 'Fear and Greed Index | Live Market Sentiment',
    description: 'Real-time Fear & Greed Index tracking for crypto, Bitcoin, and traditional markets. Compare CNN Fear & Greed with crypto market sentiment.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Crypto Fear & Greed Index'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fear and Greed Index | Live Market Sentiment',
    description: 'Real-time Fear & Greed Index tracking for crypto and traditional markets',
    images: ['/twitter-image.png'],
    creator: '@YourTwitterHandle'
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/feargreedindex.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://www.cryptogreedindex.com'
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  }
};

function ThemeInitializer() {
  return (
    <Script
      id="theme-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            function getInitialTheme() {
              const savedTheme = localStorage.getItem('theme');
              if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
              return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            const theme = getInitialTheme();
            document.documentElement.classList.add(theme);
          })();
        `,
      }}
    />
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <ThemeInitializer />
        <meta name="google-site-verification" content="YX6CRwtUTPtaHWQ3WIVAoszHABTSc5kj_FxRGWK55jI" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W9J9F0HR2F"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W9J9F0HR2F');
          `}
        </Script>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Fear and Greed Index",
              "url": "https://www.cryptogreedindex.com",
              "description": "Real-time market sentiment analysis and Fear & Greed Index tracking for crypto and traditional markets",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://www.cryptogreedindex.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        <Script
          id="organization-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CryptoGreedIndex",
              "url": "https://www.cryptogreedindex.com",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.cryptogreedindex.com/cryptogreedindex.png",
                "width": 1200,
                "height": 630,
                "caption": "Crypto Fear & Greed Index Logo"
              },
              "sameAs": [
                "https://twitter.com/AnkiTyagi007"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "url": "https://www.cryptogreedindex.com/contact"
              }
            })
          }}
        />
        <Script
          id="webpage-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Fear and Greed Index | Live Market Sentiment Analysis",
              "description": "Make smarter investment decisions with our real-time Fear & Greed Index. Get live sentiment analysis, market psychology insights, and trading signals updated every 5 minutes.",
              "url": "https://www.cryptogreedindex.com",
              "image": "https://www.cryptogreedindex.com/cryptogreedindex.png",
              "mainEntity": {
                "@type": "Dataset",
                "name": "Fear and Greed Index Data",
                "description": "Comprehensive market sentiment data across crypto and traditional markets",
                "keywords": "fear and greed index, market sentiment, crypto analysis",
                "variableMeasured": [
                  {
                    "@type": "PropertyValue",
                    "name": "Crypto Fear & Greed",
                    "description": "Cryptocurrency market sentiment indicator"
                  },
                  {
                    "@type": "PropertyValue",
                    "name": "CNN Fear & Greed",
                    "description": "Traditional market sentiment indicator"
                  }
                ]
              },
              "author": {
                "@type": "Organization",
                "name": "CryptoGreedIndex",
                "url": "https://www.cryptogreedindex.com"
              },
              "publisher": {
                "@type": "Organization",
                "name": "CryptoGreedIndex",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.cryptogreedindex.com/cryptogreedindex.png"
                }
              },
              "inLanguage": "en-US",
              "isAccessibleForFree": true,
              "license": "https://www.cryptogreedindex.com/terms",
              "dateModified": new Date().toISOString(),
              "datePublished": "2024-01-01T00:00:00Z",
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://www.cryptogreedindex.com"
                  }
                ]
              }
            })
          }}
        />
        <Script
          id="faq-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is the Fear and Greed Index?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Fear and Greed Index is a market sentiment indicator that measures investor emotions, ranging from 0 (extreme fear) to 100 (extreme greed)."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does the Crypto Fear and Greed Index work?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Crypto Fear and Greed Index analyzes multiple factors including market volatility, trading volume, social media sentiment, and market dominance to gauge overall cryptocurrency market sentiment."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What's the difference between Crypto and CNN Fear & Greed Index?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "While both measure market sentiment, the Crypto Fear & Greed Index focuses on cryptocurrency markets, while CNN's index tracks traditional stock markets using different metrics."
                  }
                }
              ]
            })
          }}
        />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1332831285527693"
          crossOrigin="anonymous"></Script>
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 5000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#059669',
                color: '#fff',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#DC2626',
                color: '#fff',
              },
            },
            loading: {
              style: {
                background: '#2563EB',
                color: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}