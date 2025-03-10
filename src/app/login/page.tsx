"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <section className="h-screen w-full">
      <div className="grid xl:grid-cols-2 grid-cols-1 h-full">
        <div className="max-w-lg mx-auto w-full flex flex-col justify-center items-center p-6">
          <div className="text-center mb-7">
            <Link href="/">
              <Image src="/assets/images/full-logo.svg" alt="BudGo Logo" width={200} height={80} priority className="mx-auto mb-6" />
            </Link>
            <h3 className="text-2xl font-semibold text-dark mb-3">Welcome to BudGo</h3>
            <p className="text-base font-medium text-light">Welcome back! Sign in to your account.</p>
          </div>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-base font-semibold text-dark mb-2">Email address</label>
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
              <label htmlFor="password" className="block text-base font-semibold text-dark mb-2">Password</label>
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
                className="w-full inline-flex items-center justify-center px-6 py-2.5 bg-blue-700 font-bold text-base text-white rounded-md transition-all duration-500 cursor-pointer active:scale-90"
              >
                Log In
              </button>
            </div>
            <p className="text-center text-light">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-dark font-semibold">
                Register
              </Link>
            </p>
          </form>
        </div>
        <div className="hidden xl:block">
          <div className="w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url(/assets/images/img-2.jpg)" }}></div>
        </div>
      </div>
    </section>
  );
}
