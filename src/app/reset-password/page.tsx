"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebaseConfig";
import { updatePassword } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        setMessage("Password updated successfully");
        setTimeout(() => router.push("/dashboard"), 2000);
      } else {
        setMessage("No authenticated user found");
      }
    } catch (err) {
      setMessage("Error updating password: " + (err as Error).message);
    }
  };

  return (
    <section className="h-screen w-full">
      <div className="grid xl:grid-cols-2 grid-cols-1 h-full">
        {/* Left Side: Form */}
        <div className="max-w-lg mx-auto w-full flex flex-col justify-center items-center p-6">
          <div className="text-center mb-7">
            <Link href="/">
        <Image src="/assets/images/full-logo-light.svg" alt="BudGo Logo" width={200} height={80} priority className="mb-6" />
            </Link>
            <div>
              <h3 className="text-2xl font-semibold text-dark mb-3">Change Your Password</h3>
              <p className="text-base font-medium text-light">
                Enter your new password and confirm it.
              </p>
            </div>
          </div>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-base font-semibold text-dark mb-2">
                New Password
              </label>
              <div className="flex">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  className="w-full rounded-l-md py-2.5 px-4 border border-gray-300 focus:border-primary focus:outline-none placeholder:text-light"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-base font-semibold text-dark mb-2">
                Confirm New Password
              </label>
              <div className="flex">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  className="w-full rounded-l-md py-2.5 px-4 border border-gray-300 focus:border-primary focus:outline-none placeholder:text-light"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
            {message && <p className="text-center text-red-500 mb-4">{message}</p>}
            <div className="text-center mb-7">
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-6 py-2.5 bg-blue-700 font-bold text-base text-white rounded-md transition-all duration-500 cursor-pointer active:scale-90"
              >
                Change Password
              </button>
            </div>
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
  );
}
