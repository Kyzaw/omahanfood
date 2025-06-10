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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please sign in to view your profile</h1>
          <Button
            onClick={() => window.location.href = '/login'}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
          >
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 pb-28 md:pt-36 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {user.image ? (
                <Image
                  src={user.image}
                  alt="Profile"
                  width={96}
                  height={96}
                  className="rounded-full object-cover ring-4 ring-orange-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-3xl font-bold text-white">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 capitalize">
                {user.role?.toLowerCase() || 'member'}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            <p className="text-gray-500 text-sm mt-1">Update your account information</p>
          </div>

          <div className="space-y-6">
            {/* Name Field */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Name</label>
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
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Email</label>
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
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Role</label>
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
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Key className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Password</label>
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
                className="border-orange-500 text-orange-500 hover:bg-orange-50"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
              {isEditing && (
                <Button
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                  onClick={() => {
                    setIsEditing(false)
                  }}
                >
                  Save Changes
                </Button>
              )}
              <Button
                onClick={() => signOut()}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}