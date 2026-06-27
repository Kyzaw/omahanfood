"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

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
      setFieldErrors((prev) => ({ ...prev, email: "Email wajib diisi" }));
      setLoading(false);
      return;
    }
    if (!password) {
      setFieldErrors((prev) => ({ ...prev, password: "Password wajib diisi" }));
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
        setFormError("Email atau password salah.");
      } else {
        setFormError("Autentikasi gagal. Silakan coba lagi.");
      }
      return;
    }

    router.push("/redirect");
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-stone-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Omahan Food Logo"
              width={44}
              height={44}
              className="rounded-xl object-cover ring-2 ring-white/10"
            />
            <span className="text-xl font-bold text-white">
              Omahan<span className="text-orange-400">Food</span>
            </span>
          </div>

          {/* Center Content */}
          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Selamat datang
              <br />
              <span className="text-orange-400">kembali</span>
            </h1>
            <p className="text-stone-400 text-lg leading-relaxed max-w-sm">
              Masuk ke akun Anda dan nikmati pengalaman kuliner terbaik dari Omahan Food
            </p>
          </div>

          {/* Bottom Decorative */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 ring-2 ring-stone-900 flex items-center justify-center text-[10px] font-bold text-white">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-stone-500 text-sm">
              500+ pelanggan puas
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Image
              src="/logo.jpg"
              alt="Omahan Food Logo"
              width={40}
              height={40}
              className="rounded-xl object-cover"
            />
            <span className="text-lg font-bold text-stone-800">
              Omahan<span className="text-orange-500">Food</span>
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
              Masuk
            </h2>
            <p className="text-stone-500 mt-2">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* Error */}
          {formError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{formError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-stone-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="nama@email.com"
                  className={`pl-10 h-11 rounded-xl border-stone-200 bg-white focus:border-orange-400 focus:ring-orange-400/20 transition-all ${
                    fieldErrors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' : ''
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-stone-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Masukkan password"
                  className={`pl-10 h-11 rounded-xl border-stone-200 bg-white focus:border-orange-400 focus:ring-orange-400/20 transition-all ${
                    fieldErrors.password ? 'border-red-300 focus:border-red-400 focus:ring-red-400/20' : ''
                  }`}
                />
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-sm shadow-orange-200 hover:shadow-md hover:shadow-orange-200 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Masuk</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-stone-500">
              Belum punya akun?{" "}
              <a
                href="/register"
                className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Daftar sekarang
              </a>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-200">
            <div className="flex items-center justify-center gap-6 text-xs text-stone-400">
              <a href="/privacypolicy" className="hover:text-stone-600 transition-colors">Privacy</a>
              <span>·</span>
              <a href="/termsofservice" className="hover:text-stone-600 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
