"use client";
import Link from "next/link";
import Image from "next/image";
import { Lexend } from "next/font/google";

const lexend = Lexend({
  subsets: ["latin"],
  weight: "700",
});

export default function LandingPage() {
  return (
    <section
      className="relative h-screen w-full flex items-center justify-center text-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/images/hero.jpg')" }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center px-4">
        <Image src="/assets/images/full-logo-light.svg" alt="BudGo Logo" width={200} height={80} priority className="mb-6" />

        <h1 className={`${lexend.className} text-4xl md:text-6xl font-extrabold mb-4`}>
          A new way to save.
        </h1>

        <p className="text-lg md:text-2xl mb-8">
          Seamless Saving, Effortless Tracking.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/login">
            <button className="px-8 py-3 bg-blue-700 font-bold text-white rounded-md transition-transform duration-150 cursor-pointer active:scale-90">
              Log In
            </button>
          </Link>
          <Link href="/register">
            <button className="px-8 py-3 bg-blue-700 font-bold text-white rounded-md transition-transform duration-150 cursor-pointer active:scale-90">
              Register
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
