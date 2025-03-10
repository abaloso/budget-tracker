"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        router.replace("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleResetPassword = () => {
    router.push("/reset-password");
  };

  const handleLogout = () => {
    router.push("/logout");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-6">
      {user ? (
        <>
          {/* Logo */}
          <Image src="/assets/images/full-logo.svg" alt="BudGo Logo" width={150} height={50} priority className="mb-4" />

          {/* Welcome Message */}
          <h1 className="text-3xl font-bold text-dark mb-4">
            Welcome, {user.displayName || "BudGo User"}!
          </h1>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <button
              onClick={handleResetPassword}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-700 font-bold text-base text-white rounded-md transition-all duration-500 cursor-pointer active:scale-90"
            >
              Reset Password
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-700 font-bold text-base text-white rounded-md transition-all duration-500 cursor-pointer active:scale-90"
            >
              Logout
            </button>
          </div>
        </>
      ) : (
        <h1 className="text-2xl font-bold text-gray-700">Loading...</h1>
      )}
    </div>
  );
}
