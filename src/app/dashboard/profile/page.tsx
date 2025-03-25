"use client"
import { useEffect, useState, type FormEvent } from "react"
import type React from "react"

import { auth, db } from "../../firebaseConfig"
import { updateProfile, updateEmail, updatePassword, type User } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { UserIcon, Mail, Lock, Save } from "lucide-react"
import Navbar from "@/components/Navbar"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      setUser(currentUser)
      setFormData({
        displayName: currentUser.displayName || "",
        email: currentUser.email || "",
        newPassword: "",
        confirmPassword: "",
      })
      fetchUserData(currentUser.uid)
    }
  }, [])

  const fetchUserData = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setFormData((prev) => ({
          ...prev,
          displayName: userData.fullName || prev.displayName,
        }))
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    setMessage(null)

    try {
      // Update display name if changed
      if (formData.displayName !== user.displayName) {
        await updateProfile(user, { displayName: formData.displayName })
        await updateDoc(doc(db, "users", user.uid), {
          fullName: formData.displayName,
        })
      }

      // Update email if changed
      if (formData.email !== user.email) {
        await updateEmail(user, formData.email)
        await updateDoc(doc(db, "users", user.uid), {
          email: formData.email,
        })
      }

      // Update password if provided
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMessage({ type: "error", text: "Passwords do not match" })
          setSaving(false)
          return
        }
        await updatePassword(user, formData.newPassword)
        setFormData((prev) => ({
          ...prev,
          newPassword: "",
          confirmPassword: "",
        }))
      }

      setMessage({ type: "success", text: "Profile updated successfully" })
      // Refresh user data
      setUser(auth.currentUser)
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage({ type: "error", text: `Error: ${(error as Error).message}` })
    } finally {
      setSaving(false)
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
                My Profile
              </h2>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {message && (
                <div
                  className={`mb-4 p-4 rounded-md ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-semibold text-gray-700">
                      Full Name
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="displayName"
                        id="displayName"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Your full name"
                        value={formData.displayName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
                      New Password (leave blank to keep current)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="New password"
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                      Confirm New Password
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

