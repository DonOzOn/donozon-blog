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
  openGraph: {
    title: AppConfig.title,
    description: AppConfig.description,
    url: AppConfig.url,
    siteName: AppConfig.site_name,
    locale: AppConfig.locale,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: AppConfig.title,
    description: AppConfig.description,
    creator: `@${AppConfig.author}`,
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