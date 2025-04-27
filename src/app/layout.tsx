import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '../components/Providers';
import Script from 'next/script';
import Footer from "../components/Footer";
import Header from "../components/Header";
import { Toaster } from 'react-hot-toast';
import ScrollToTop from '../components/ScrollToTop';

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
  title: 'Crypto Fear and Greed Index | Bitcoin Sentiment Tracker Live',
  description:
    'Live Crypto Fear and Greed Index for Bitcoin and cryptocurrencies. Track crypto sentiment, Bitcoin fear levels, and market emotions updated every 5 minutes. Analyze fear and greed index today and stay ahead in crypto trading.',
  keywords:
    'crypto fear and greed index, bitcoin fear and greed index, fear and greed index today, crypto sentiment index, market fear and greed index, crypto fear index, fear and greed index live, bitcoin market sentiment, greed and fear index crypto, crypto market emotion tracker',
  authors: [{ name: 'cryptogreedindex.com' }],
  creator: 'www.linkedin.com/in/atyagi-js',
  publisher: 'cryptogreedindex.com',
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
    title: 'Crypto Fear and Greed Index | Bitcoin Sentiment Tracker Live',
    description:
      'Live Crypto Fear and Greed Index for Bitcoin and cryptocurrencies. Track crypto sentiment, Bitcoin fear levels, and market emotions updated every 5 minutes. Analyze fear and greed index today and stay ahead in crypto trading.',
    images: [
      {
        url: 'https://www.cryptogreedindex.com/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'Crypto Fear & Greed Index',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Fear and Greed Index | Bitcoin Sentiment Tracker Live',
    description:
      'Live Crypto Fear and Greed Index for Bitcoin and cryptocurrencies. Track crypto sentiment, Bitcoin fear levels, and market emotions updated every 5 minutes. Analyze fear and greed index today and stay ahead in crypto trading.',
    images: ['https://www.cryptogreedindex.com/cryptogreedindex.png'],
    creator: 'www.linkedin.com/in/atyagi-js',
  },
  icons: {
    icon: '/favicon.ico',
    apple: 'https://www.cryptogreedindex.com/cryptogreedindex.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://www.cryptogreedindex.com',
  },
  verification: {
    google: 'YX6CRwtUTPtaHWQ3WIVAoszHABTSc5kj_FxRGWK55jI',
  },
};


const schemaDateModified = new Date().toISOString(); // For consistent reuse

function ThemeInitializer() {
  return (
    <Script
      id="cfi-theme-script"
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={inter.className} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="google-site-verification" content="YX6CRwtUTPtaHWQ3WIVAoszHABTSc5kj_FxRGWK55jI" />
        <ThemeInitializer />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W9J9F0HR2F"
          strategy="afterInteractive"
          async
        />
        <Script id="cfi-google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W9J9F0HR2F');
          `}
        </Script>

        {/* Schema.org: Website */}
        <Script
          id="cfi-schema-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Crypto Fear and Greed Index",
              url: "https://www.cryptogreedindex.com",
              description:
                "Live Crypto Fear and Greed Index for Bitcoin, crypto, and stocks. Monitor market sentiment updated every 5 minutes to make informed decisions",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate:
                    "https://www.cryptogreedindex.com/search?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />

        {/* Schema.org: Organization */}
        <Script
          id="cfi-schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "CryptoGreedIndex",
              url: "https://www.cryptogreedindex.com",
              logo: {
                "@type": "ImageObject",
                url: "https://www.cryptogreedindex.com/cryptogreedindex.png",
                width: 1200,
                height: 630,
                caption: "Crypto Fear & Greed Index Logo",
              },
              sameAs: ["https://twitter.com/AnkiTyagi007"],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                url: "https://www.cryptogreedindex.com/contact",
              },
            }),
          }}
        />

        {/* Schema.org: WebPage + Dataset */}
        <Script
          id="cfi-schema-webpage"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Crypto Fear and Greed Index | Live Market Sentiment Analysis",
              description:
                "Live Crypto Fear and Greed Index for Bitcoin, crypto, and stocks. Monitor market sentiment updated every 5 minutes to make informed decisions",
              url: "https://www.cryptogreedindex.com",
              image: "https://www.cryptogreedindex.com/cryptogreedindex.png",
              mainEntity: {
                "@type": "Dataset",
                name: "Crypto Fear and Greed Index Data",
                description:
                  "Live Crypto Fear and Greed Index for Bitcoin, crypto, and stocks. Monitor market sentiment updated every 5 minutes to make informed decisions",
                keywords:
                  "crypto fear and greed index, market sentiment, crypto analysis",
                variableMeasured: [
                  {
                    "@type": "PropertyValue",
                    name: "Crypto Fear & Greed",
                    description: "Cryptocurrency market sentiment indicator",
                  },
                  {
                    "@type": "PropertyValue",
                    name: "CNN Fear & Greed",
                    description: "Traditional market sentiment indicator",
                  },
                ],
              },
              author: {
                "@type": "Organization",
                name: "CryptoGreedIndex",
                url: "https://www.cryptogreedindex.com",
              },
              publisher: {
                "@type": "Organization",
                name: "CryptoGreedIndex",
                logo: {
                  "@type": "ImageObject",
                  url: "https://www.cryptogreedindex.com/cryptogreedindex.png",
                },
              },
              inLanguage: "en-US",
              isAccessibleForFree: true,
              license: "https://www.cryptogreedindex.com/terms",
              dateModified: schemaDateModified,
              datePublished: "2024-01-01T00:00:00Z",
              breadcrumb: {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://www.cryptogreedindex.com",
                  },
                ],
              },
            }),
          }}
        />

        {/* Schema.org: FAQ */}
        <Script
          id="cfi-schema-faq"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is the Crypto Fear and Greed Index?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The Crypto Fear and Greed Index is a market sentiment indicator that measures investor emotions, ranging from 0 (extreme fear) to 100 (extreme greed).",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does the Crypto Fear and Greed Index work?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The Crypto Fear and Greed Index analyzes multiple factors including market volatility, trading volume, social media sentiment, and market dominance to gauge overall cryptocurrency market sentiment.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What's the difference between Crypto and CNN Fear & Greed Index?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "While both measure market sentiment, the Crypto Fear & Greed Index focuses on cryptocurrency markets, while CNN's index tracks traditional stock markets using different metrics.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </main>
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
        <ScrollToTop />
      </body>
    </html>
  );
}
