"use client"
import Link from "next/link"
import type { ReactNode } from "react"

interface ButtonLinkProps {
  href: string
  children: ReactNode
  className?: string
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  onClick?: () => void
}

export function ButtonLink({
  href,
  children,
  className = "",
  variant = "primary",
  size = "md",
  onClick,
}: ButtonLinkProps) {
  // Base styles
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
  
  // Variant styles
  const variantStyles = {
    primary: "bg-blue-700 text-white hover:bg-blue-800 focus-visible:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500"
  }
  
  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  }
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`

  return (
    <Link href={href} className={combinedClassName} onClick={onClick}>
      {children}
    </Link>
  )
}