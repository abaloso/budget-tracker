"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore"
import { CreditCard, Users, Plus } from "lucide-react"
import Link from "next/link"
import { logger } from "@/lib/logger"

// Define expense type
interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
  description: string
  type: "personal" | "group"
  createdAt: any
}

export default function ExpensesContent() {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const expenseType = searchParams.get("type") || "all"
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchExpenses(user.uid, expenseType)
    }
  }, [user, expenseType, categoryFilter, dateFilter])

  const fetchExpenses = async (userId: string, type: string) => {
    try {
      setLoading(true)
      logger.info("Fetching expenses", { context: "expenses", data: { type } })

      // Build base query
      const baseQuery = collection(db, "expenses")
      const constraints = [where("userId", "==", userId)]

      // Add type filter if not "all"
      if (type !== "all") {
        constraints.push(where("type", "==", type))
      }

      // Create the query with constraints
      const expensesQuery = query(baseQuery, ...constraints, orderBy("date", "desc"))

      // Execute query
      const querySnapshot = await getDocs(expensesQuery)

      // Process results
      let results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Expense[]

      // Apply additional filters (client-side)
      if (categoryFilter) {
        results = results.filter((expense) => expense.category.toLowerCase().includes(categoryFilter.toLowerCase()))
      }

      if (dateFilter) {
        results = results.filter((expense) => {
          const expenseDate = new Date(expense.date).toISOString().split("T")[0]
          return expenseDate === dateFilter
        })
      }

      setExpenses(results)
      logger.info("Expenses fetched successfully", {
        context: "expenses",
        data: { count: results.length },
      })
    } catch (error) {
      logger.error("Error fetching expenses", { context: "expenses", data: error })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) {
      return
    }

    try {
      await deleteDoc(doc(db, "expenses", expenseId))
      // Refresh the expenses list
      if (user) {
        fetchExpenses(user.uid, expenseType)
      }
      logger.info("Expense deleted successfully", { context: "expenses", data: { id: expenseId } })
    } catch (error) {
      logger.error("Error deleting expense", { context: "expenses", data: error })
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Get unique categories for filter
  const categories = [...new Set(expenses.map((expense) => expense.category))]

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate font-lexend">Expenses</h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              href="/dashboard/expenses/create"
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-1" />
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

        {/* Additional Filters */}
        <div className="bg-white p-4 rounded-md shadow mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Category
              </label>
              <select
                id="category-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={categoryFilter || ""}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Date
              </label>
              <input
                type="date"
                id="date-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={dateFilter || ""}
                onChange={(e) => setDateFilter(e.target.value || null)}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCategoryFilter(null)
                  setDateFilter(null)
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        {loading ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <li key={i} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                  <div className="mt-2">
                    <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : expenses.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {expenses.map((expense) => (
                <li key={expense.id}>
                  <Link href={`/dashboard/expenses/${expense.id}`} className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`mr-3 flex-shrink-0 h-6 w-6 rounded-full ${expense.type === "personal" ? "bg-blue-100" : "bg-green-100"} flex items-center justify-center`}
                          >
                            {expense.type === "personal" ? (
                              <CreditCard className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Users className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <p className="text-sm font-medium text-blue-600 truncate">{expense.title}</p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {formatCurrency(expense.amount)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <span className="truncate">{expense.category}</span>
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p>{new Date(expense.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {expense.description && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 line-clamp-2">{expense.description}</p>
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              {expenseType === "group" ? (
                <Users className="h-6 w-6 text-blue-600" aria-hidden="true" />
              ) : (
                <CreditCard className="h-6 w-6 text-blue-600" aria-hidden="true" />
              )}
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No expenses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {categoryFilter || dateFilter
                ? "Try changing your filters or create a new expense."
                : "Get started by creating a new expense."}
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/expenses/create"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Expense
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
