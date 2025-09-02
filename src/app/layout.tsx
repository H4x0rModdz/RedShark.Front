"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import OptimizedSessionProvider from "@/components/OptimizedSessionProvider";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Improve loading performance
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap", // Improve loading performance
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <OptimizedSessionProvider>
          {children}
          <ToastContainer autoClose={3000} position="top-right"/> 
        </OptimizedSessionProvider>
      </body>
    </html>
  );
}
