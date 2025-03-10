"use client";
import { ReactNode } from "react";
import { Lexend, Roboto } from "next/font/google";
import * as motion from "motion/react-client";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-lexend",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-roboto",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${lexend.variable} ${roboto.variable}`}>
      <head>
        {/* ✅ Favicon Added Here */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <title>BudGo | Seamless Saving, Effortless Tracking.</title>
      </head>
      <body className={roboto.className}>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </body>
    </html>
  );
}
