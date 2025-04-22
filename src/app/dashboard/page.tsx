"use client"
import { useEffect, useState } from "react"
import { auth } from "../../lib/firebase"
import type { User } from "firebase/auth"
import { CreditCard, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [recentExpenses, setRecentExpenses] = useState<Array<{ id: string; title: string; amount: number }>>([])

  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      setUser(currentUser)
      fetchRecentExpenses(currentUser.uid)
    }
  }, [])

  const fetchRecentExpenses = async (_userId: string) => {
    try {
      // placeholder for when we implement the expenses collection
      setRecentExpenses([])
    } catch (error) {
      console.error("Error fetching recent expenses:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
                        <div className="text-lg font-bold text-gray-900">$0.00</div>
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
                        <div className="text-lg font-bold text-gray-900">$0.00</div>
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
                        <div className="text-lg font-bold text-gray-900">--</div>
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
          {recentExpenses.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg leading-6 font-bold text-gray-900 font-lexend">Recent Expenses</h3>
              <div className="mt-2 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                        Title
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
                        <td className="whitespace-nowrap px-3 py-4 text-right text-sm text-gray-500">
                          ${expense.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
    </div>
  )
}

