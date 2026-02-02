// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AuthPlus - Next.js + Spring Boot Authentication',
  description: 'Production-ready authentication with Next.js + Spring Boot created by @akarshmi, Akarsh Mishra.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}