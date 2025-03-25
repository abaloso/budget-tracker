"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { auth } from "../../firebaseConfig"
import type { User } from "firebase/auth"
import { CreditCard, Users } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function ExpensesPage() {
  const [user, setUser] = useState<User | null>(null)
  const [expenses, setExpenses] = useState<Array<{ id: string; title: string; amount: number }>>([])
  const searchParams = useSearchParams()
  const expenseType = searchParams.get("type") || "all"

  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      setUser(currentUser)
      fetchExpenses(currentUser.uid, expenseType)
    }
  }, [expenseType])

  const fetchExpenses = async (_userId: string, _type: string) => {
    try {
      // This is a placeholder for when we implement the expenses collection
      // For now, we'll just set an empty array
      setExpenses([])
    } catch (error) {
      console.error("Error fetching expenses:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="md:flex md:items-center md:justify-between mb-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate font-lexend">
                Expenses
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link
                href="/dashboard/expenses/create"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Expense
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <Link
                href="/dashboard/expenses"
                className={`${
                  expenseType === "all"
                    ? "border-blue-500 text-blue-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium"
                } whitespace-nowrap py-4 px-1 border-b-2 text-sm`}
              >
                All Expenses
              </Link>
              <Link
                href="/dashboard/expenses?type=personal"
                className={`${
                  expenseType === "personal"
                    ? "border-blue-500 text-blue-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium"
                } whitespace-nowrap py-4 px-1 border-b-2 text-sm`}
              >
                Personal
              </Link>
              <Link
                href="/dashboard/expenses?type=group"
                className={`${
                  expenseType === "group"
                    ? "border-blue-500 text-blue-600 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium"
                } whitespace-nowrap py-4 px-1 border-b-2 text-sm`}
              >
                Group
              </Link>
            </nav>
          </div>

          {/* Expenses List */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {expenses.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <li key={expense.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-blue-600 truncate">{expense.title}</p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            ${expense.amount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                  {expenseType === "group" ? (
                    <Users className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  ) : (
                    <CreditCard className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  )}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No expenses</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new expense.</p>
                <div className="mt-6">
                  <Link
                    href="/dashboard/expenses/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <CreditCard className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    New Expense
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

