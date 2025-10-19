import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import MainHeader from "@/components/main-header";
import Footer from "@/components/footer";
import clsx from "clsx";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";
import dynamic from "next/dynamic";

const AppSidebar = dynamic(() => import("@/components/ui/app-sidebar"));

const NotoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "5ot Next",
  description: "Next.js 기반 의류 쇼핑몰 5ot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(`${NotoSansKr.className} antialiased`, `w-screen relative`)}>
        <SidebarProvider defaultOpen={false}>
          <Providers>
            <AppSidebar />
            <div className="w-full flex flex-col min-h-screen">
              <MainHeader />
              <div
                className={cn(
                  "w-full h-full min-h-[calc(100vh-8rem)] lg:min-h-[calc(100vh-10rem)]",
                  "px-8 mx-auto",
                  "lg:w-[64rem] lg:px-0 lg:py-8"
                )}
              >
                {children}
              </div>
              <Footer />
            </div>
            <Toaster expand position="bottom-right" richColors />
          </Providers>
        </SidebarProvider>
      </body>
    </html>
  );
}
