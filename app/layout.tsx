import './globals.css'
import type {Metadata} from 'next'
import React from "react";

export const metadata: Metadata = {
  title: 'title',
  description: 'description',
}

export default function RootLayout({children,}: { children: React.ReactNode }) {
  return (
    <html lang="zh">
    <body>
    {children}
    </body>
    </html>
  )
}
