"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

interface NavLinkProps {
    href: string
    children: ReactNode
    className?: string
    activeClassName?: string
    icon?: ReactNode
    onClick?: () => void
    exact?: boolean
}

export function NavLink({
    href,
    children,
    className = "",
    activeClassName = "border-blue-500 text-blue-600 font-bold",
    icon,
    onClick,
    exact = false,
}: NavLinkProps) {
    const pathname = usePathname()
    const isActive = exact ? pathname === href : pathname.startsWith(href)

    return (
        <Link
      href= { href }
    className = {`px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 hover:underline transition-all flex items-center ${isActive ? activeClassName : ""
        } ${className}`
}
onClick = { onClick }
    >
    { icon && <span className="mr-3" > { icon } </span>}
{ children }
</Link>
  )
}