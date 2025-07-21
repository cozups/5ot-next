import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
import MainHeader from '@/components/main-header';
import Footer from '@/components/footer';
import clsx from 'clsx';
import { Toaster } from '@/components/ui/sonner';

const NotoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
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
          `${NotoSansKr.className} antialiased`,
          `w-screen relative`
        )}
      >
        <MainHeader />
        {children}
        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
