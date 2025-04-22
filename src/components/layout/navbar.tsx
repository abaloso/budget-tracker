"use client"
import { useState } from "react"
import Image from "next/image"
import { NavLink } from "@/components/ui/nav-link"
import { Menu, X, Home, CreditCard, User, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: <Home className="h-5 w-5" />, exact: true },
  { href: "/dashboard/expenses", label: "Expenses", icon: <CreditCard className="h-5 w-5" /> },
  { href: "/dashboard/profile", label: "My Profile", icon: <User className="h-5 w-5" /> },
]

export default function Navbar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const { signOut } = useAuth()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <NavLink href="/dashboard" exact>
                <Image src="/assets/images/full-logo.svg" alt="BudGo Logo" width={120} height={40} priority />
              </NavLink>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} exact={item.exact}>
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 hover:underline transition-all"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
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
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              className="flex justify-center"
              onClick={() => setIsOpen(false)}
              exact={item.exact}
            >
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex justify-center items-center px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 hover:underline transition-all"
          >
            <div className="flex items-center justify-center">
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
