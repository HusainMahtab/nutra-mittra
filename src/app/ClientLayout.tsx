"use client";

import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/navbar/Navbar";

import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProviders";
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
        {children}
      </ThemeProvider>
      
    </SessionProvider>
  );
}
