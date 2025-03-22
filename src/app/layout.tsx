import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from '../components/Providers';
import Script from 'next/script';
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypto Fear & Greed Index Today | Bitcoin Market Sentiment Analysis",
  description: "Make smarter crypto investment decisions with our real-time Fear & Greed Index. Get live Bitcoin sentiment analysis, market psychology insights, and trading signals updated every 5 minutes.",
  keywords: [
    "crypto fear and greed index",
    "bitcoin fear and greed index",
    "cryptocurrency sentiment",
    "bitcoin market sentiment",
    "crypto market analysis",
    "btc fear and greed",
    "crypto trading signals",
    "bitcoin market psychology",
    "cryptocurrency trading tools",
    "bitcoin dominance",
    "market sentiment indicator",
    "crypto market mood",
    "bitcoin trading signals",
    "crypto market trends",
    "crypto fear and greed index today",
    "fear and greed index today",
    "BTCD"
  ].join(", "),
  authors: [{ name: "Cryptogreedindex.com" }],
  creator: "Cryptogreedindex.com",
  publisher: "Cryptogreedindex.com",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.cryptogreedindex.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Crypto Fear & Greed Index | Live Bitcoin Market Sentiment",
    description: "Make better crypto investment decisions with our real-time Fear & Greed Index. Get live Bitcoin sentiment analysis, market psychology insights, and trading signals updated every 5 minutes.",
    url: 'https://www.cryptogreedindex.com',
    siteName: 'Cryptogreedindex.com',
    images: [
      {
        url: '/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'Crypto Fear & Greed Index - Live Market Sentiment',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Crypto Fear & Greed Index | Live Bitcoin Market Sentiment",
    description: "Make better crypto investment decisions with our real-time Fear & Greed Index. Get live Bitcoin sentiment analysis, market psychology insights, and trading signals updated every 5 minutes.",
    images: ['/cryptogreedindex.png'],
    creator: '@cryptogreedindex',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
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
  verification: {
    google: 'YX6CRwtUTPtaHWQ3WIVAoszHABTSc5kj_FxRGWK55jI',
  },
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
    <html lang="en" suppressHydrationWarning>
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
              "name": "Crypto Fear & Greed Index",
              "url": "https://www.cryptogreedindex.com",
              "description": "Real-time cryptocurrency market sentiment analysis and Fear & Greed Index tracking",
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
                "https://twitter.com/cryptogreedindex"
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
              "name": "Crypto Fear & Greed Index | Real-time Market Sentiment Analysis",
              "description": "Make smarter crypto investment decisions with our real-time Fear & Greed Index. Get live Bitcoin sentiment analysis, market psychology insights, and trading signals updated every 5 minutes.",
              "url": "https://www.cryptogreedindex.com",
              "image": "https://www.cryptogreedindex.com/cryptogreedindex.png",
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
              "mainEntity": {
                "@type": "DataVisualization",
                "name": "Crypto Fear & Greed Index",
                "description": "Real-time cryptocurrency market sentiment indicator",
                "dataType": "Financial Data",
                "temporalCoverage": "Real-time",
                "updateFrequency": "PT5M",
                "variableMeasured": "Market Sentiment",
                "measurementTechnique": "Multi-factor Analysis",
                "about": {
                  "@type": "Thing",
                  "name": "Cryptocurrency Market",
                  "description": "The overall cryptocurrency market sentiment and psychology"
                }
              },
              "inLanguage": "en-US",
              "isAccessibleForFree": true,
              "license": "https://www.cryptogreedindex.com/terms",
              "keywords": "crypto fear and greed index, bitcoin fear and greed index, cryptocurrency sentiment, bitcoin market sentiment, crypto market analysis",
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-grow w-full max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
            <Footer/>
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