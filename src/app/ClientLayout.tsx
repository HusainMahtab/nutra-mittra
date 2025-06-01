"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navbar/Navbar";

import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProviders";
import Footer from "@/components/footer/Footer";
import { Toaster } from "@/components/ui/sonner";
import {Suspense} from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
           defaultTheme="system"
           enableSystem
           disableTransitionOnChange
      >
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
        <Footer/>
        <Toaster />
      </ThemeProvider>
      
    </SessionProvider>
  );
}
