"use client";

import { useFormState } from "react-dom";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUpCredentials } from "@/lib/actions";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-[#faf9f7] flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-stone-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="Omahan Food Logo" width={44} height={44} className="rounded-xl object-cover ring-2 ring-white/10" />
            <span className="text-xl font-bold text-white">
              Omahan<span className="text-orange-400">Food</span>
            </span>
          </div>

          <div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Bergabung
              <br />
              <span className="text-orange-400">dengan kami</span>
            </h1>
            <p className="text-stone-400 text-lg leading-relaxed max-w-sm">
              Daftar sekarang dan nikmati kemudahan memesan makanan berkualitas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 ring-2 ring-stone-900 flex items-center justify-center text-[10px] font-bold text-white">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-stone-500 text-sm">500+ pelanggan puas</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <Image src="/logo.jpg" alt="Omahan Food Logo" width={40} height={40} className="rounded-xl object-cover" />
            <span className="text-lg font-bold text-stone-800">
              Omahan<span className="text-orange-500">Food</span>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
              Buat Akun
            </h2>
            <p className="text-stone-500 mt-2">
              Daftar untuk mulai memesan
            </p>
          </div>

          {state?.message && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{state.message}</p>
            </div>
          )}

          <form action={formAction} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-stone-700">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  id="name" name="name" type="text" placeholder="Masukkan nama lengkap"
                  className={`pl-10 h-11 rounded-xl border-stone-200 bg-white focus:border-orange-400 focus:ring-orange-400/20 transition-all ${
                    state?.error?.name ? 'border-red-300' : ''
                  }`}
                />
              </div>
              {state?.error?.name && <p className="text-xs text-red-500">{state.error.name[0]}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-stone-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  id="email" name="email" type="email" placeholder="nama@email.com"
                  className={`pl-10 h-11 rounded-xl border-stone-200 bg-white focus:border-orange-400 focus:ring-orange-400/20 transition-all ${
                    state?.error?.email ? 'border-red-300' : ''
                  }`}
                />
              </div>
              {state?.error?.email && <p className="text-xs text-red-500">{state.error.email[0]}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-stone-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  id="password" name="password" type="password" placeholder="Buat password"
                  className={`pl-10 h-11 rounded-xl border-stone-200 bg-white focus:border-orange-400 focus:ring-orange-400/20 transition-all ${
                    state?.error?.password ? 'border-red-300' : ''
                  }`}
                />
              </div>
              {state?.error?.password && <p className="text-xs text-red-500">{state.error.password[0]}</p>}
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-sm shadow-orange-200 hover:shadow-md hover:shadow-orange-200 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <span>Buat Akun</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-stone-500">
              Sudah punya akun?{" "}
              <a href="/login" className="font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                Masuk
              </a>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-200">
            <p className="text-xs text-stone-400 text-center leading-relaxed">
              Dengan membuat akun, Anda menyetujui{" "}
              <a href="/termsofservice" className="text-orange-500 hover:text-orange-600 underline">Syarat & Ketentuan</a>{" "}
              dan{" "}
              <a href="/privacypolicy" className="text-orange-500 hover:text-orange-600 underline">Kebijakan Privasi</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
