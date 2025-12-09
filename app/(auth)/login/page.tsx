"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  // Jika user sudah login, langsung redirect
  if (session?.user) {
    router.push("/redirect");
    return null;
  }

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

    router.push("/redirect");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-6xl bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl overflow-hidden border border-orange-100">
        <div className="flex flex-col lg:flex-row min-h-[500px] sm:min-h-[600px]">
          {/* Mobile/Tablet Header - Visible only on small screens */}
          <div className="lg:hidden bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <Image
                src="/logo.jpg"
                alt="Omahan Food Logo"
                width={80}
                height={80}
                className="rounded-full shadow-lg border-2 border-white/30 object-cover"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Omahan Food
                </h1>
                <p className="text-orange-100 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
                  Nikmati pengalaman kuliner yang tak terlupakan
                </p>
              </div>
            </div>
          </div>

          {/* Left Side - Branding (Desktop only) */}
          <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
              <div className="absolute bottom-20 right-16 w-24 h-24 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10 flex flex-col justify-center items-center text-center px-8 py-16 h-full">
              <div className="mb-8">
                <Image
                  src="/logo.jpg"
                  alt="Omahan Food Logo"
                  width={120}
                  height={120}
                  className="rounded-full shadow-2xl border-4 border-white/20 object-cover"
                />
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Omahan Food
              </h1>

              <p className="text-orange-100 text-lg lg:text-xl max-w-sm leading-relaxed">
                Nikmati pengalaman kuliner yang tak terlupakan dengan hidangan lezat dan berkualitas tinggi
              </p>

              {/* Decorative Elements */}
              <div className="mt-12 flex space-x-4">
                <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-white/70 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:w-1/2 flex items-center justify-center px-6 sm:px-8 lg:px-8 py-8 sm:py-12 lg:py-16 bg-white">
            <div className="w-full max-w-md">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 text-base sm:text-lg">
                  Login to your account to continue
                </p>
              </div>

              {formError && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-2 sm:ml-3">
                      <p className="text-xs sm:text-sm text-red-800 font-medium">{formError}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6" noValidate>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className={`pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.email
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                      aria-invalid={fieldErrors.email ? "true" : undefined}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      className={`pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${fieldErrors.password
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                      aria-invalid={fieldErrors.password ? "true" : undefined}
                    />
                  </div>
                  {fieldErrors.password && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 sm:py-3 px-4 sm:px-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm sm:text-base">Signing In...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 sm:mt-8 text-center">
                <p className="text-sm sm:text-base text-gray-600">
                  Don&apos;t have an account?{" "}
                  <a
                    href="/register"
                    className="font-semibold text-orange-600 hover:text-orange-700 transition-colors duration-200 underline decoration-2 underline-offset-2 sm:underline-offset-4 hover:decoration-orange-700"
                  >
                    Register
                  </a>
                </p>
              </div>

              {/* Additional Features - Hidden on very small screens */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6 text-xs sm:text-sm text-gray-500">
                  <a href="/privacypolicy" className="hover:text-orange-600 transition-colors duration-200">Privacy</a>
                  <span className="text-gray-300">•</span>
                  <a href="/termsofservice" className="hover:text-orange-600 transition-colors duration-200">Terms</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}