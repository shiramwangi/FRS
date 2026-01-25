import type React from "react"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "FaceID - Attendance System",
  description: "Facial recognition attendance system for RU students",
  generator: "Mwangi-Apps",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <header className="w-full flex items-center justify-center py-6">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/images/riara-logo.png" alt="Riara University logo" width={40} height={40} className="h-10 w-10 object-contain" />
              <span className="sr-only">Riara University</span>
            </Link>
          </header>
          {children}
          <Toaster />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
