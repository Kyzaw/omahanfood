"use client";

import { useFormState } from "react-dom";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUpCredentials } from "@/lib/actions";

type FieldErrors = {
  name?: string[];
  email?: string[];
  password?: string[];
};

type RegisterState = {
  error?: FieldErrors;
  message?: string;
};

export default function RegisterPage() {
  const [state, formAction] = useFormState(signUpCredentials, {} as RegisterState);

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
                  Bergabunglah untuk pengalaman kuliner terbaik
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
                Bergabunglah dengan kami untuk merasakan pengalaman kuliner yang tak terlupakan
              </p>
              
              {/* Decorative Elements */}
              <div className="mt-12 flex space-x-4">
                <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-white/70 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="lg:w-1/2 flex items-center justify-center px-6 sm:px-8 lg:px-8 py-8 sm:py-12 lg:py-16 bg-white">
            <div className="w-full max-w-md">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Create Account
                </h2>
                <p className="text-gray-600 text-base sm:text-lg">
                  Sign up to get started with us
                </p>
              </div>

              {state?.message && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-2 sm:ml-3">
                      <p className="text-xs sm:text-sm text-red-800 font-medium">{state.message}</p>
                    </div>
                  </div>
                </div>
              )}

              <form action={formAction} className="space-y-5 sm:space-y-6" noValidate>
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      className={`pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        state?.error?.name 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      aria-invalid={state?.error?.name ? "true" : undefined}
                    />
                  </div>
                  {state?.error?.name && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {state.error.name[0]}
                    </p>
                  )}
                </div>

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
                      className={`pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        state?.error?.email 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      aria-invalid={state?.error?.email ? "true" : undefined}
                    />
                  </div>
                  {state?.error?.email && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {state.error.email[0]}
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
                      className={`pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                        state?.error?.password 
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      aria-invalid={state?.error?.password ? "true" : undefined}
                    />
                  </div>
                  {state?.error?.password && (
                    <p className="text-xs sm:text-sm text-red-600 flex items-center mt-1">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {state.error.password[0]}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 px-4 sm:px-6 text-base sm:text-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  Create Account
                </Button>
              </form>

              <div className="mt-6 sm:mt-8 text-center">
                <p className="text-sm sm:text-base text-gray-600">
                  Already have an account?{" "}
                  <a 
                    href="/login" 
                    className="font-semibold text-orange-600 hover:text-orange-700 transition-colors duration-200 underline decoration-2 underline-offset-2 sm:underline-offset-4 hover:decoration-orange-700"
                  >
                    Sign In
                  </a>
                </p>
              </div>

              {/* Terms and Privacy */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-500 text-center leading-relaxed">
                  By creating an account, you agree to our{" "}
                  <a href="/termsofservice" className="text-orange-600 hover:text-orange-700 underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacypolicy" className="text-orange-600 hover:text-orange-700 underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}