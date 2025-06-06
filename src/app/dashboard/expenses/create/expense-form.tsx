"use client"
import { useState, type FormEvent } from "react"
import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { Calendar, DollarSign, Tag, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { logger } from "@/lib/logger"

export default function ExpenseForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const expenseType = (searchParams.get("type") as "personal" | "group") || "personal"

  const { user } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)

  const [form, setForm] = useState<{
    title: string
    amount: string
    category: string
    date: string
    description: string
    type: "personal" | "group"
  }>({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    type: expenseType,
  })

  // Predefined categories
  const categories = [
    "Food & Dining",
    "Transportation",
    "Entertainment",
    "Shopping",
    "Utilities",
    "Housing",
    "Travel",
    "Health & Medical",
    "Education",
    "Personal Care",
    "Gifts & Donations",
    "Other",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate amount is a number
      const amount = Number.parseFloat(form.amount)
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount")
      }

      // Add expense to Firestore with error handling
      try {
        const docRef = await addDoc(collection(db, "expenses"), {
          userId: user.uid,
          title: form.title,
          amount,
          category: form.category,
          date: form.date,
          description: form.description,
          type: form.type,
          createdAt: serverTimestamp(),
        })

        logger.info("Expense added successfully", { context: "expense-form", data: { id: docRef.id } })

        // Show success message
        setSuccess(true)

        // Reset form
        setForm({
          title: "",
          amount: "",
          category: form.category, // Keep the category for convenience
          date: new Date().toISOString().split("T")[0],
          description: "",
          type: form.type, // Keep the type for convenience
        })

        // Set submitting to false before redirect
        setSubmitting(false)

        // Redirect after a short delay
        setTimeout(() => {
          router.push(`/dashboard/expenses?type=${form.type}`)
        }, 2000)
      } catch (firestoreError) {
        // Specific error handling for Firestore
        logger.error("Firestore error adding expense", { context: "expense-form", data: firestoreError })
        throw new Error(`Failed to save expense: ${(firestoreError as Error).message}`)
      }
    } catch (error) {
      logger.error("Error adding expense", { context: "expense-form", data: error })
      setError((error as Error).message)
      setSubmitting(false)
    }
  }

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <Link href="/dashboard/expenses" className="mr-2">
                <ArrowLeft className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </Link>
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate font-lexend">
                {form.type === "personal" ? "Add Personal Expense" : "Add Group Expense"}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {error && <div className="mb-4 p-4 rounded-md bg-red-50 text-red-800">{error}</div>}
            {success && (
              <div className="mb-4 p-4 rounded-md bg-green-50 text-green-800 border border-green-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">Expense added successfully! Redirecting...</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="type" className="block text-sm font-semibold text-gray-700">
                    Expense Type
                  </label>
                  <div className="mt-1">
                    <select
                      id="type"
                      name="type"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      value={form.type}
                      onChange={handleChange}
                    >
                      <option value="personal">Personal Expense</option>
                      <option value="group">Group Expense</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                    Title
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="Expense title"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="amount" className="block text-sm font-semibold text-gray-700">
                    Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      name="amount"
                      id="amount"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
                    Category
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Tag className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <select
                      id="category"
                      name="category"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={form.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-semibold text-gray-700">
                    Date
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={form.date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Additional details about this expense"
                      value={form.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/dashboard/expenses"
                    className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Expense"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
