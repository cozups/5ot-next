import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import MainHeader from '@/components/main-header';
import Footer from '@/components/footer';
import clsx from 'clsx';

const NotoSansKr = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '5ot Next',
  description: 'Next.js 기반 의류 쇼핑몰 5ot',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          `${NotoSansKr.variable} antialiased`,
          `w-screen relative`
        )}
      >
        <MainHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
