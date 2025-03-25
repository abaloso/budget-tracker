"use client"
import { useState, type ChangeEvent, type FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "../firebaseConfig"
import { createUserWithEmailAndPassword, updateProfile, onAuthStateChanged } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface RegisterForm {
  fullName: string
  email: string
  password: string
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>({ fullName: "", email: "", password: "" })
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User authenticated, redirecting to dashboard...")
        router.replace("/dashboard")
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("Starting registration...")

      // Check if auth and db are initialized
      if (!auth || !db) {
        throw new Error("Authentication or database not initialized. Please check your Firebase configuration.")
      }

      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password)
      console.log("User created:", userCredential.user.uid)

      await updateProfile(userCredential.user, { displayName: form.fullName })

      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName: form.fullName,
        email: form.email,
        createdAt: new Date().toISOString(),
      })

      console.log("User profile updated and data stored.")
      router.push("/dashboard")
    } catch (err) {
      console.error("Registration error:", err)

      const errorMessage = (err as Error).message
      if (errorMessage.includes("email-already-in-use")) {
        setError("This email is already registered. Please use a different email or try logging in.")
      } else if (errorMessage.includes("weak-password")) {
        setError("Password is too weak. Please use a stronger password.")
      } else if (errorMessage.includes("invalid-email")) {
        setError("Invalid email address. Please check and try again.")
      } else {
        setError(`Registration failed: ${errorMessage}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="h-screen w-full">
      <div className="grid xl:grid-cols-2 grid-cols-1 h-full">
        {/* Left Side: Form */}
        <div className="max-w-lg mx-auto w-full flex flex-col justify-center items-center p-6">
          <div className="text-center mb-7">
            <Link href="/">
              <Image
                src="/assets/images/full-logo.svg"
                alt="BudGo Logo"
                width={200}
                height={80}
                priority
                className="mx-auto mb-6"
              />
            </Link>
            <div>
              <h3 className="text-2xl font-semibold text-dark mb-3">Welcome to BudGo</h3>
              <p className="text-base font-medium text-light">Create a new account to get started.</p>
            </div>
          </div>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-base font-semibold text-dark mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                className="w-full rounded-md py-2.5 px-4 border border-gray-300 focus:border-primary focus:outline-none placeholder:text-light"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-base font-semibold text-dark mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md py-2.5 px-4 border border-gray-300 focus:border-primary focus:outline-none placeholder:text-light"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-base font-semibold text-dark mb-2">
                Password
              </label>
              <div className="flex">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-l-md py-2.5 px-4 border border-gray-300 focus:border-primary focus:outline-none placeholder:text-light"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-r-md"
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-dark" /> : <Eye className="h-5 w-5 text-dark" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="text-center mb-7">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-6 py-2.5 bg-blue-700 font-bold text-base text-white rounded-md transition-all duration-500 cursor-pointer active:scale-90"
              >
                {loading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </div>
            <p className="text-center text-light">
              Already have an account?{" "}
              <Link href="/login" className="text-dark font-semibold">
                Login
              </Link>
            </p>
          </form>
        </div>
        {/* Right Side: Background Image */}
        <div className="hidden xl:block">
          <div
            className="w-full h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/img-3.jpg')" }}
          ></div>
        </div>
      </div>
    </section>
  )
}

