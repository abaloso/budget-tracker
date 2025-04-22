"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { auth, db } from "@/lib/firebase"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  updatePassword,
  updateEmail,
} from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"

// Create a simple logger
const logger = {
  info: (message: string, data?: any) => {
    console.info(`[AUTH] ${message}`, data || "")
  },
  error: (message: string, data?: any) => {
    console.error(`[AUTH] ${message}`, data || "")
  }
}

// Helper function for user-friendly error messages
const handleAuthError = (err: any): string => {
  const errorCode = err.code || ""
  const errorMessage = err instanceof Error ? err.message : String(err)
  
  logger.error("Authentication error", { code: errorCode, message: errorMessage })
  
  if (errorCode === "auth/invalid-email") {
    return "Invalid email format. Please check your email address."
  } else if (errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password") {
    return "Invalid email or password. Please try again."
  } else if (errorCode === "auth/too-many-requests") {
    return "Too many failed login attempts. Please try again later."
  } else if (errorCode === "auth/email-already-in-use") {
    return "This email is already registered. Please use a different email or try logging in."
  } else if (errorCode === "auth/weak-password") {
    return "Password is too weak. Please use a stronger password."
  }
  
  return process.env.NODE_ENV === "development" 
    ? `Error: ${errorMessage}` 
    : "An unexpected error occurred. Please try again later."
}

interface UserData {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  // Add any additional user data fields here
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>
  updateUserEmail: (email: string) => Promise<void>
  updateUserPassword: (password: string) => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        try {
          logger.info("User authenticated", { uid: user.uid })
          // Fetch additional user data from Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setUserData({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              ...userDoc.data(),
            })
          } else {
            // If no additional data exists, just use auth data
            setUserData({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            })
          }
        } catch (err) {
          logger.error("Error fetching user data", err)
        }
      } else {
        setUserData(null)
        logger.info("No authenticated user")
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setError(null)
    try {
      logger.info("Attempting sign in", { email: email.trim() })
      setLoading(true)
      await signInWithEmailAndPassword(auth, email.trim(), password)
      logger.info("Sign in successful")
    } catch (err) {
      const errorMessage = handleAuthError(err)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Sign up function
  const signUp = async (email: string, password: string, fullName: string) => {
    setError(null)
    try {
      logger.info("Attempting sign up", { email: email.trim() })
      setLoading(true)

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password)

      // Update profile with display name
      await updateProfile(userCredential.user, { displayName: fullName.trim() })

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        fullName: fullName.trim(),
        email: email.trim(),
        createdAt: new Date().toISOString(),
      })
      
      logger.info("Sign up successful", { uid: userCredential.user.uid })
    } catch (err) {
      const errorMessage = handleAuthError(err)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      logger.info("Signing out user")
      await firebaseSignOut(auth)
      logger.info("Sign out successful")
      router.push("/login")
    } catch (err) {
      const errorMessage = handleAuthError(err)
      setError(errorMessage)
    }
  }

  // Update user profile
  const updateUserProfile = async (data: { displayName?: string; photoURL?: string }) => {
    if (!user) throw new Error("No user is signed in")

    try {
      logger.info("Updating user profile", data)
      setLoading(true)
      await updateProfile(user, data)

      // Update Firestore data
      if (data.displayName) {
        await updateDoc(doc(db, "users", user.uid), {
          fullName: data.displayName.trim(),
        })
      }

      // Refresh user data
      setUser({ ...user })
      logger.info("Profile update successful")
    } catch (err) {
      const errorMessage = handleAuthError(err)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Update user email
  const updateUserEmail = async (email: string) => {
    if (!user) throw new Error("No user is signed in")

    try {
      logger.info("Updating user email", { email: email.trim() })
      setLoading(true)
      await updateEmail(user, email.trim())

      // Update Firestore data
      await updateDoc(doc(db, "users", user.uid), { email: email.trim() })

      // Refresh user data
      setUser({ ...user })
      logger.info("Email update successful")
    } catch (err) {
      const errorMessage = handleAuthError(err)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Update user password
  const updateUserPassword = async (password: string) => {
    if (!user) throw new Error("No user is signed in")

    try {
      logger.info("Updating user password")
      setLoading(true)
      await updatePassword(user, password)
      logger.info("Password update successful")
    } catch (err) {
      const errorMessage = handleAuthError(err)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}