import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import QueryProvider from "@/components/providers/QueryProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"
import "./globals.css"

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Apply Yourself",
  description: "Apply Yourself",
}

export const viewport = {
  viewportFit: "cover",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn("antialiased", fontSans.variable, fontMono.variable)}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider>
            <QueryProvider>
              <TooltipProvider>{children}</TooltipProvider>
              <Toaster position="bottom-right" />
            </QueryProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
