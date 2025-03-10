"use client";
import { useState, FormEvent } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/app/firebaseConfig";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent!");
    } catch (err) {
      setMessage("Error: " + (err as Error).message);
    }
  };

  return (
    <section className="h-screen w-full">
      <div className="grid xl:grid-cols-2 grid-cols-1 h-full">
        {/* Left Side: Form */}
        <div className="max-w-lg mx-auto w-full flex flex-col justify-center items-center p-6">
          <div className="text-center mb-7">
            <Link href="/">
              <Image src="/assets/images/full-logo.svg" alt="Logo" width={150} height={50} priority className="mb-8" />
            </Link>
            <div>
              <h3 className="text-2xl font-semibold text-dark mb-3">Forgot Your Password?</h3>
              <p className="text-base font-medium text-light">
                Fill in your email address to reset your account.
              </p>
            </div>
          </div>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-base font-semibold text-dark mb-2">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md py-2.5 px-4 border border-gray-300 focus:border-primary focus:outline-none placeholder:text-light"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-between items-center mt-8">
              <Link href="/login">
                <span className="inline-flex items-center text-blue-700 font-semibold hover:text-blue-700/80">
                  Back to sign in
                </span>
              </Link>
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-700 font-bold text-base text-white rounded-md transition-all duration-500 cursor-pointer active:scale-90"
              >
                Forgot Password
              </button>
            </div>
            {message && <p className="mt-4 text-center text-dark">{message}</p>}
          </form>
        </div>
        {/* Right Side: Background Image */}
        <div className="hidden xl:block">
          <div
            className="w-full h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/img-2.jpg')" }}
          ></div>
        </div>
      </div>
    </section>
  );
}
