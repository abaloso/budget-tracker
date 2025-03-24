"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Home, CreditCard, User, LogOut } from "lucide-react"
import type { User as FirebaseUser } from "firebase/auth"

interface NavbarProps {
  user: FirebaseUser | null
}

export default function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/full-logo-Di5zi0JUFhgLuagoi8OBlsmAOVRdg5.svg"
                  alt="BudGo Logo"
                  width={120}
                  height={40}
                  priority
                />
              </Link>
            </div>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link
              href="/dashboard"
              className="px-3 py-2 rounded-md text-sm font-semibold text-gray-900 hover:bg-gray-100 hover:underline transition-all"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/expenses"
              className="px-3 py-2 rounded-md text-sm font-semibold text-gray-900 hover:bg-gray-100 hover:underline transition-all"
            >
              Expenses
            </Link>
            <Link
              href="/dashboard/profile"
              className="px-3 py-2 rounded-md text-sm font-semibold text-gray-900 hover:bg-gray-100 hover:underline transition-all"
            >
              My Profile
            </Link>
            <Link
              href="/logout"
              className="px-3 py-2 rounded-md text-sm font-semibold text-gray-900 hover:bg-gray-100 hover:underline transition-all"
            >
              Logout
            </Link>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded-md text-base font-semibold text-gray-900 hover:bg-gray-100 hover:underline transition-all text-center"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center justify-center">
              <Home className="mr-3 h-5 w-5" />
              Dashboard
            </div>
          </Link>
          <Link
            href="/dashboard/expenses"
            className="block px-3 py-2 rounded-md text-base font-semibold text-gray-900 hover:bg-gray-100 hover:underline transition-all text-center"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center justify-center">
              <CreditCard className="mr-3 h-5 w-5" />
              Expenses
            </div>
          </Link>
          <Link
            href="/dashboard/profile"
            className="block px-3 py-2 rounded-md text-base font-semibold text-gray-900 hover:bg-gray-100 hover:underline transition-all text-center"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center justify-center">
              <User className="mr-3 h-5 w-5" />
              My Profile
            </div>
          </Link>
          <Link
            href="/logout"
            className="block px-3 py-2 rounded-md text-base font-semibold text-gray-900 hover:bg-gray-100 hover:underline transition-all text-center"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center justify-center">
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}

