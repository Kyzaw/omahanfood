"use client";

import { useFormState } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
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
  // Ganti null dengan {} as RegisterState supaya tipe cocok
  const [state, formAction] = useFormState(signUpCredentials, {} as RegisterState);

  return (
    <div className="flex flex-col sm:flex-row w-full max-w-5xl mx-auto sm:my-50 shadow-lg rounded-lg overflow-hidden border">
      {/* Kiri */}
      <div className="w-full sm:w-1/2 bg-orange-600 flex flex-col justify-center items-center text-center px-6 py-10">
        <img
          src="/logo.jpg"
          alt="Branding Image"
          className="w-24 h-24 rounded-full mb-6 object-cover"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">Omahan Food</h1>
        <p className="text-black text-sm sm:text-base">Join us for an unforgettable culinary experience.</p>
      </div>

      {/* Kanan */}
      <div className="w-full sm:w-1/2 flex items-center justify-center bg-white px-6 sm:px-10 py-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Sign Up</h2>
          <p className="text-gray-600 mb-6">Create an account</p>

          <form action={formAction} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                className="rounded-full px-4 py-2"
              />
              <div aria-live="polite" aria-atomic="true">
                <span className="text-sm text-red-500">{state?.error?.name?.[0]}</span>
              </div>
            </div>
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
              />
              <div aria-live="polite" aria-atomic="true">
                <span className="text-sm text-red-500">{state?.error?.email?.[0]}</span>
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
              />
              <div aria-live="polite" aria-atomic="true">
                <span className="text-sm text-red-500">{state?.error?.password?.[0]}</span>
              </div>
            </div>
            <Button className="w-full rounded-full bg-orange-600 hover:bg-orange-700 text-white">
              Sign Up
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
            Already have an account?{" "}
            <a href="/login" className="font-semibold text-black">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
