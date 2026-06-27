import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import LayoutWrapper from "@/components/LayoutWrapper";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Omahan Food Katering App",
  description: "Pesan makanan katering favorit Anda dengan mudah dan cepat",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-geist-sans)]`}>
        <SessionProvider>
          <LayoutWrapper>
            {children}
            <Toaster 
              richColors 
              position="top-center" 
              gap={8}
              toastOptions={{
                duration: 3000,
              }}
            />
          </LayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
