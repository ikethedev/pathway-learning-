"use client";
import type { ReactNode } from "react";
import React from "react";
import "./global/global.css";
import { Inter } from "next/font/google";
import Sidebar from "./components /sidebar/Sidebar";
import styles from "./AppLayout.module.css";
import { usePathname } from 'next/navigation'


const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});



export default function RootLayout({ children }) {
  const pathname = usePathname()
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup')

  return (
    <html lang="en">
      <body className={styles.layout}>
        {!isAuthPage && <Sidebar />}
        <main className={`${!isAuthPage ? 'with-sidebar' : 'full-width'} ${styles.content}`}>
          {children}
        </main>
      </body>
    </html>
  )
}