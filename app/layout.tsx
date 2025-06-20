import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Providers from "./components/Providers";
import { NotificationProvider } from "./components/Notification";
import DecorativeBackground from "./components/DecorativeBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VideoVault",
  description: "Your modern platform to upload, discover, and share videos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative bg-slate-50`}>
        <Providers>
          <NotificationProvider>
            <DecorativeBackground />
            <Header />
            {children}
          </NotificationProvider>
        </Providers>
      </body>
    </html>
  );
}
