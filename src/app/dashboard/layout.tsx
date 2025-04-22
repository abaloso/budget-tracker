"use client"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Navbar from "@/components/layout/navbar"
import { Loading } from "@/components/ui/loading"
import type { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading />
      </div>
    )
  }

   if (!user && !loading) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      {children}
    </div>
  )
}
