"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import { db } from "@/lib/firebase"
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { CreditCard, Users, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"
import { logger } from "@/lib/logger"

// Define expense type
interface Expense {
  id: string
  title: string
  amount: number
  category: string
  date: string
  type: "personal" | "group"
  createdAt: any
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([])
  const [summaryData, setSummaryData] = useState({
    personalTotal: 0,
    groupTotal: 0,
    monthlyChange: 0, // percentage change from last month
  })

  useEffect(() => {
    if (user) {
      fetchDashboardData(user.uid)
    }
  }, [user])

  const fetchDashboardData = async (userId: string) => {
    try {
      setLoading(true)
      logger.info("Fetching dashboard data", { context: "dashboard" })

      // Get the current date
      const today = new Date()
      const currentMonth = today.getMonth()
      const currentYear = today.getFullYear()

      // Calculate first day of current and previous month
      const firstDayCurrentMonth = new Date(currentYear, currentMonth, 1)
      const firstDayPreviousMonth = new Date(currentYear, currentMonth - 1, 1)

      // Fetch all expenses for the current user
      const expensesQuery = query(
        collection(db, "expenses"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(5),
      )

      const expensesSnapshot = await getDocs(expensesQuery)
      const expensesData = expensesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Expense[]

      setRecentExpenses(expensesData)

      // Calculate summary data
      let personalTotal = 0
      let groupTotal = 0
      let currentMonthTotal = 0
      let previousMonthTotal = 0

      // Get all expenses for monthly calculations
      const allExpensesQuery = query(collection(db, "expenses"), where("userId", "==", userId))

      const allExpensesSnapshot = await getDocs(allExpensesQuery)

      allExpensesSnapshot.docs.forEach((doc) => {
        const data = doc.data()

        // Calculate personal and group totals
        if (data.type === "personal") {
          personalTotal += data.amount
        } else if (data.type === "group") {
          groupTotal += data.amount
        }

        // Calculate monthly totals for trend
        const expenseDate = new Date(data.date)

        if (expenseDate >= firstDayCurrentMonth) {
          currentMonthTotal += data.amount
        } else if (expenseDate >= firstDayPreviousMonth && expenseDate < firstDayCurrentMonth) {
          previousMonthTotal += data.amount
        }
      })

      // Calculate monthly change percentage
      let monthlyChange = 0
      if (previousMonthTotal > 0) {
        monthlyChange = Math.round(((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100)
      }

      setSummaryData({
        personalTotal,
        groupTotal,
        monthlyChange,
      })

      logger.info("Dashboard data fetched successfully", {
        context: "dashboard",
        data: {
          expenseCount: expensesData.length,
          personalTotal,
          groupTotal,
          monthlyChange,
        },
      })
    } catch (error) {
      logger.error("Error fetching dashboard data", { context: "dashboard", data: error })
    } finally {
      setLoading(false)
    }
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate font-lexend">
              Welcome, {user?.displayName || "BudGo User"}!
            </h2>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Personal Expenses Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CreditCard className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-gray-500 truncate">Personal Expenses</dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">
                        {loading ? (
                          <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                          formatCurrency(summaryData.personalTotal)
                        )}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link
                  href="/dashboard/expenses?type=personal"
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              </div>
            </div>
          </div>

          {/* Group Expenses Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-gray-500 truncate">Group Expenses</dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">
                        {loading ? (
                          <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                          formatCurrency(summaryData.groupTotal)
                        )}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/dashboard/expenses?type=group" className="font-medium text-blue-600 hover:text-blue-700">
                  View all
                </Link>
              </div>
            </div>
          </div>

          {/* Monthly Trend Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-semibold text-gray-500 truncate">Monthly Trend</dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">
                        {loading ? (
                          <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                        ) : (
                          `${summaryData.monthlyChange >= 0 ? "+" : ""}${summaryData.monthlyChange}%`
                        )}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link href="/dashboard/reports" className="font-medium text-blue-600 hover:text-blue-700">
                  View reports
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-bold text-gray-900 font-lexend">Recent Expenses</h3>
            <Link
              href="/dashboard/expenses/create"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New
            </Link>
          </div>

          {loading ? (
            <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <div className="bg-white p-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between py-3">
                    <div className="h-6 w-1/3 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : recentExpenses.length > 0 ? (
            <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      Title
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {recentExpenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                        {expense.title}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{expense.category}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500">
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-white shadow rounded-lg">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <CreditCard className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No expenses yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new expense.</p>
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

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg leading-6 font-bold text-gray-900 font-lexend">Quick Actions</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-semibold text-gray-900 font-lexend">Add Personal Expense</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Track your personal expenses quickly and easily.</p>
                </div>
                <div className="mt-5">
                  <Link
                    href="/dashboard/expenses/create?type=personal"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Expense
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-semibold text-gray-900 font-lexend">Add Group Expense</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Split expenses with friends, family, or roommates.</p>
                </div>
                <div className="mt-5">
                  <Link
                    href="/dashboard/expenses/create?type=group"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Group Expense
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
