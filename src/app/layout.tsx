import type { ReactNode } from "react"
import { Lexend, Roboto } from 'next/font/google'
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lexend",
})

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${lexend.variable} ${roboto.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <title>BudGo | Seamless Saving, Effortless Tracking.</title>
      </head>
      <body className={roboto.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}