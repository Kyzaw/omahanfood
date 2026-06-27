'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { User, Mail, Key, Shield, LogOut } from 'lucide-react'

export default function ProfilePage() {
  const { data: session } = useSession()
  const user = session?.user
  const [isEditing, setIsEditing] = useState(false)
  
  if (!user) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-stone-800 mb-4">Silakan masuk untuk melihat profil</h1>
          <Button
            onClick={() => window.location.href = '/login'}
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
          >
            Masuk
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="hidden md:block h-16" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 md:py-10 pb-24 md:pb-10">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex items-center space-x-5">
            <div className="relative">
              {user.image ? (
                <Image
                  src={user.image}
                  alt="Profile"
                  width={80}
                  height={80}
                  className="rounded-2xl object-cover ring-2 ring-stone-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-orange-500 flex items-center justify-center text-2xl font-bold text-white">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-3 border-white"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-stone-800">{user.name}</h1>
              <p className="text-stone-500 text-sm">{user.email}</p>
              <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-100 capitalize">
                {user.role?.toLowerCase() || 'member'}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 sm:p-8">
          <div className="border-b border-stone-100 pb-4 mb-6">
            <h2 className="text-lg font-bold text-stone-800">Informasi Profil</h2>
            <p className="text-stone-500 text-xs mt-1">Kelola informasi akun Anda</p>
          </div>

          <div className="space-y-6">
            {/* Name Field */}
            <div className="flex items-center space-x-4">
              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                <User className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-stone-600">Nama</label>
                <Input
                  type="text"
                  value={user.name || ''}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="flex items-center space-x-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-stone-600">Email</label>
                <Input
                  type="email"
                  value={user.email || ''}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Role Field */}
            <div className="flex items-center space-x-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-stone-600">Role</label>
                <Input
                  type="text"
                  value={user.role || 'member'}
                  disabled
                  className="mt-1"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex items-center space-x-4">
              <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center">
                <Key className="w-4 h-4 text-stone-500" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-stone-600">Password</label>
                <Input
                  type="password"
                  value="••••••••"
                  disabled
                  className="mt-1"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3 mt-8">
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="border-stone-200 text-stone-700 hover:bg-stone-50 rounded-xl"
              >
                {isEditing ? 'Batal' : 'Edit Profil'}
              </Button>
              {isEditing && (
                <Button
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                  onClick={() => {
                    setIsEditing(false)
                  }}
                >
                  Simpan
                </Button>
              )}
              <Button
                onClick={() => signOut()}
                className="bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}