"use client"
import { Suspense } from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

// Dynamically import the component that uses useSearchParams with ssr disabled
const ExpenseForm = dynamic(() => import("./expense-form"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
    </div>
  ),
})

export default function CreateExpensePage() {
  const router = useRouter()

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ExpenseForm />
    </Suspense>
  )
}

