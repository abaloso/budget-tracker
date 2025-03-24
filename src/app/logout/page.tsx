"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from "../firebaseConfig"
import { signOut } from "firebase/auth"
import Image from "next/image"
import Link from "next/link"

export default function LogoutPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(true)

  useEffect(() => {
    const logoutUser = async () => {
      try {
        await signOut(auth)
        setIsLoggingOut(false)

        setTimeout(() => {
          router.push("/login")
        }, 1500)
      } catch (error) {
        console.error("Error signing out:", error)
        setTimeout(() => {
          router.push("/login")
        }, 1500)
      }
    }

    logoutUser()
  }, [router])

  return (
    <section className="h-screen w-full">
      <div className="grid xl:grid-cols-2 grid-cols-1 h-full">
        {/* Left Side: Message */}
        <div className="max-w-lg mx-auto w-full flex flex-col items-center justify-center">
          <div className="text-center mb-7">
            <Link href="/">
              <Image
                src="/assets/images/full-logo-light.svg"
                alt="BudGo Logo"
                width={200}
                height={80}
                priority
                className="mb-6"
              />
            </Link>
            <div>
              <h3 className="text-2xl font-semibold text-dark mb-3">See you again!</h3>
              <p className="text-base font-medium text-light">
                {isLoggingOut ? "Logging you out..." : "You have been successfully logged out."}
              </p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-44 h-44 mb-7" viewBox="0 0 328 327" fill="none">
            <circle className="fill-blue-700/10" r="163.125" transform="matrix(-1 0 0 1 163.942 163.854)" />
            <path
              className={`stroke-blue-700 ${isLoggingOut ? "fill-blue-700/20" : "fill-blue-700/40"}`}
              d="M146.715 218.157L100.443 171.885C97.0527 167.964 95.4424 164.144 95.4424 160.409C95.4424 156.683 97.0452 152.872 100.42 148.961C104.331 145.587 108.142 143.984 111.868 143.984C115.603 143.984 119.423 145.594 123.343 148.984L146.012 171.653L146.724 172.365L147.431 171.648L204.137 114.131C208.057 110.742 211.876 109.133 215.61 109.133C219.337 109.133 223.148 110.736 227.06 114.112C230.718 118.308 232.441 122.253 232.441 125.964C232.441 129.674 230.717 133.352 227.06 137.008L227.057 137.012L146.715 218.157Z"
              strokeWidth="2"
            />
          </svg>
          <p className="text-light text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-dark font-semibold">
              Login
            </Link>
          </p>
        </div>
        {/* Right Side: Background Image */}
        <div className="hidden xl:block">
          <div
            className="w-full h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/img-4.jpg')" }}
          ></div>
        </div>
      </div>
    </section>
  )
}

