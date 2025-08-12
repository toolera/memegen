import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Free Meme Generator - Create Custom Memes Online | MemeGen",
  description: "Create hilarious memes instantly with our free online meme generator. Choose from popular templates like Drake, Distracted Boyfriend, and more. Add custom text, download, and share on social media.",
  keywords: [
    "meme generator",
    "meme maker",
    "create memes",
    "free memes",
    "online meme tool",
    "drake meme",
    "distracted boyfriend",
    "meme templates",
    "social media memes",
    "viral content"
  ],
  authors: [{ name: "MemeGen Team" }],
  creator: "MemeGen",
  publisher: "MemeGen",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://memegen.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Free Meme Generator - Create Custom Memes Online",
    description: "Create hilarious memes instantly with our free online meme generator. Choose from popular templates, add custom text, and share on social media.",
    url: 'https://memegen.vercel.app',
    siteName: 'MemeGen',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MemeGen - Free Online Meme Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Meme Generator - Create Custom Memes Online',
    description: 'Create hilarious memes instantly with our free online meme generator. Choose from popular templates and share on social media.',
    images: ['/twitter-image.jpg'],
    creator: '@memegen',
  },
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
    google: 'google-site-verification-token',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "MemeGen - Free Meme Generator",
              "description": "Create hilarious memes instantly with our free online meme generator. Choose from popular templates, add custom text, and share on social media.",
              "url": "https://memegen.vercel.app",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "MemeGen Team"
              },
              "screenshot": "https://memegen.vercel.app/screenshot.jpg",
              "softwareVersion": "1.0",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              }
            })
          }}
        />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className={`font-inter antialiased bg-gray-50 text-gray-900`}>
        {children}
        
        {/* Install PWA prompt */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              let deferredPrompt;
              
              window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                
                // Show install button
                const installBtn = document.createElement('button');
                installBtn.innerText = '📱 Install App';
                installBtn.className = 'fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors z-40';
                installBtn.onclick = async () => {
                  if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const result = await deferredPrompt.userChoice;
                    deferredPrompt = null;
                    installBtn.remove();
                  }
                };
                document.body.appendChild(installBtn);
                
                // Auto-hide after 10 seconds
                setTimeout(() => {
                  if (installBtn.parentNode) {
                    installBtn.remove();
                  }
                }, 10000);
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
