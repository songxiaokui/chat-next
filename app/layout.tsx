import "./globals.css"
import type { Metadata } from "next"
import React from "react"
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: "ChatGPT Next",
  description: "ChatGPT Next",
  viewport: {
    viewportFit: "cover",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    title: "ChatGPT Next",
  },
  themeColor: "#f3f4f6",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh">
    <body>
    {children}
    <Toaster toastOptions={{ className: "text-sm text-gray-100 !p-1.5 !max-w-3xl" }}/>
    </body>
    </html>
  )
}