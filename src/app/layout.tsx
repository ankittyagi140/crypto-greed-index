import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from '../components/Providers';
import Script from 'next/script';
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crypto Fear & Greed Index | Real-time Market Sentiment Analysis",
  description: "Track the cryptocurrency market sentiment with real-time Fear & Greed Index updates. Make informed investment decisions based on market psychology and sentiment analysis.",
  keywords: "crypto fear and greed index, cryptocurrency sentiment, market psychology, crypto market analysis, bitcoin sentiment, crypto investment tools, What is greed and fear in crypto?, Fear and Greed Index Live, BTC fear and greed, Bitcoin fear and greed, fear and greed index today, fear and greed index today ",
  authors: [{ name: "Crypto Greed Index" }],
  creator: "Crypto Greed Index",
  publisher: "Crypto Greed Index",
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
    title: "Crypto Fear & Greed Index | Real-time Market Sentiment Analysis",
    description: "Track the cryptocurrency market sentiment with real-time Fear & Greed Index updates. Make informed investment decisions based on market psychology and sentiment analysis.",
    url: 'https://www.cryptogreedindex.com',
    siteName: 'Crypto Greed Index',
    images: [
      {
        url: '/cryptogreedindex.png',
        width: 1200,
        height: 630,
        alt: 'Crypto Greed Index',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Crypto Fear & Greed Index | Real-time Market Sentiment Analysis",
    description: "Track the cryptocurrency market sentiment with real-time Fear & Greed Index updates. Make informed investment decisions based on market psychology and sentiment analysis.",
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
              "@type": "WebPage",
              "name": "Crypto Fear & Greed Index | Real-time Market Sentiment Analysis",
              "description": "Track the cryptocurrency market sentiment with real-time Fear & Greed Index updates.",
              "url": "https://www.cryptogreedindex.com",
              "image": "https://www.cryptogreedindex.com/cryptogreedindex.png"
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <Header/>
          <main>{children}</main>
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}