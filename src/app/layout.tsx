import type { Metadata } from 'next';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Plus_Jakarta_Sans } from 'next/font/google';

import { AppConfig } from '@/utils/AppConfig';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/contexts/AuthContext';

import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
  title: AppConfig.title,
  description: AppConfig.description,
  authors: [{ name: AppConfig.author }],
  creator: AppConfig.author,
  metadataBase: new URL(AppConfig.url),
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  openGraph: {
    title: AppConfig.title,
    description: AppConfig.description,
    url: AppConfig.url,
    siteName: AppConfig.site_name,
    locale: AppConfig.locale,
    type: 'website',
    images: [
      {
        url: '/donozon.png',
        width: 1200,
        height: 630,
        alt: `${AppConfig.author} - ${AppConfig.site_name}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: AppConfig.title,
    description: AppConfig.description,
    creator: `@${AppConfig.author}`,
    images: ['/donozon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang={AppConfig.locale} 
      className="overflow-x-hidden" 
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#0f0f23" />
        <link rel="manifest" href="/manifest.json" />
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body { 
              background-color: #0f0f23 !important;
              color-scheme: dark !important;
              margin: 0;
              padding: 0;
            }
          `
        }} />
      </head>
      <body 
        className={`${plusJakartaSans.variable} font-sans antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <QueryProvider>
          <AuthProvider>
            <AntdRegistry>
              <div className="min-h-screen bg-[#0f0f23]">
                {children}
              </div>
            </AntdRegistry>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}