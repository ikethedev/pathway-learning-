import type { ReactNode } from 'react'
import React from 'react'
import './global/global.css';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});


export default function RootLayout({
    children,
  }: {
    children: ReactNode
  }) {
    return (
      <html lang="en" className={inter.variable}>
        <body>{children}</body>
      </html>
    )
  }