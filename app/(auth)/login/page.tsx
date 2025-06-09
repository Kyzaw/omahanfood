"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const { data:session } = useSession()
  const user = session?.user

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";

    if (!email) {
      setFieldErrors((prev) => ({ ...prev, email: "Email is required" }));
      setLoading(false);
      return;
    }
    if (!password) {
      setFieldErrors((prev) => ({ ...prev, password: "Password is required" }));
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      if (result.error.toLowerCase().includes("credentials")) {
        setFormError("Invalid email or password.");
      } else {
        setFormError("Authentication failed. Please try again.");
      }
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col sm:flex-row w-full max-w-5xl mx-auto sm:my-50 shadow-lg rounded-lg overflow-hidden border">
      {/* Kiri*/}
      <div className="w-full sm:w-1/2 bg-orange-600 flex flex-col justify-center items-center text-center px-6 py-10">
        <img
          src="/logo.jpg"
          alt="Branding Image"
          className="w-24 h-24 rounded-full mb-6 object-cover"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">Omahan Food</h1>
        <p className="text-black text-sm sm:text-base">
          Join us for an unforgettable culinary experience.
        </p>
      </div>

      {/* Kanan*/}
      <div className="w-full sm:w-1/2 flex items-center justify-center bg-white px-6 sm:px-10 py-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Sign In</h2>
          <p className="text-gray-600 mb-6">Welcome Back</p>

          {formError && (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100"
              role="alert"
            >
              <span className="font-medium">{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                className="rounded-full px-4 py-2"
                aria-invalid={fieldErrors.email ? "true" : undefined}
              />
              <div aria-live="polite" aria-atomic="true">
                <span className="text-sm text-red-500">{fieldErrors.email}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                className="rounded-full px-4 py-2"
                aria-invalid={fieldErrors.password ? "true" : undefined}
              />
              <div aria-live="polite" aria-atomic="true">
                <span className="text-sm text-red-500">{fieldErrors.password}</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center my-4 text-sm text-gray-500">Or</div>

          <div className="flex flex-col gap-2">
            <Button variant="outline" className="rounded-full flex items-center justify-center gap-2">
              <FcGoogle className="text-xl" />
              Sign Up with Google
            </Button>
          </div>

          <p className="mt-6 text-sm text-center">
            Don't have an account?{" "}
            <a href="/register" className="font-semibold text-black">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
