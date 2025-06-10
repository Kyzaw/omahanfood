'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ShoppingCart, Home, FileText, User, Shield, Truck } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import useCheckoutQty from '@/hooks/useCheckoutQty'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeMobileTab, setActiveMobileTab] = useState('home')
  const { data: session } = useSession()
  const user = session?.user
  const qty = useCheckoutQty()

  const mobileMenuItems = [
    { id: 'home', label: 'Home', href: '/', icon: <Home className="w-5 h-5" /> },
    { id: 'myorders', label: 'Orders', href: '/myorders', icon: <FileText className="w-5 h-5" /> },
    { id: 'checkout', label: 'Cart', href: '/checkout', icon: (
      <div className="relative">
        <ShoppingCart className="w-5 h-5" />
        {qty > 0 && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-lg">
            {qty > 99 ? '99+' : qty}
          </span>
        )}
      </div>
    )},
    user
      ? { id: 'profile', label: 'Profile', href: '/profile', icon: <User className="w-5 h-5" /> }
      : { id: 'signin', label: 'Sign In', href: '/login', icon: <User className="w-5 h-5" /> },
  ]

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden sm:flex fixed top-0 left-1/2 -translate-x-1/2 z-[100] bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl px-8 py-4 justify-between items-center max-w-7xl w-[95%] mt-6 border border-gray-100">
        {/* Logo & Navigation */}
        <div className="flex items-center space-x-2 gap-12">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="/logo-removebg.png"
                alt="Branding Image"
                className="w-16 h-12 rounded-xl object-cover shadow-md"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                FoodApp
              </h1>
            </div>
          </div>
          
          <ul className="flex space-x-8 text-sm font-semibold">
            <li>
              <Link href="/" className="text-gray-700 hover:text-orange-600 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-xl hover:bg-orange-50 flex items-center">
                Home
              </Link>
            </li>
            <li>
              <Link href="/myorders" className="text-gray-700 hover:text-orange-600 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-xl hover:bg-orange-50 flex items-center">
                My Orders
              </Link>
            </li>
            {user?.role === 'ADMIN' && (
              <li>
                <Link href="/admin" className="text-gray-700 hover:text-purple-600 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-xl hover:bg-purple-50 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              </li>
            )}
            {user?.role === 'KURIR' && (
              <li>
                <Link href="/kurir" className="text-gray-700 hover:text-purple-600 transition-all duration-300 hover:scale-105 px-3 py-2 rounded-xl hover:bg-purple-50 flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Kurir
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {user ? (
            <>
              <Link href="/checkout" className="relative group">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-100 to-red-100 hover:from-orange-200 hover:to-red-200 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-orange-600 group-hover:text-red-600 transition-colors" />
                  {qty > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg animate-bounce">
                      {qty > 99 ? '99+' : qty}
                    </span>
                  )}
                </div>
              </Link>

              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-orange-50 hover:to-red-50 px-4 py-3 rounded-2xl transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="relative">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt="Profile"
                        width={36}
                        height={36}
                        className="rounded-full object-cover ring-2 ring-orange-200 group-hover:ring-orange-400 transition-all"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-sm font-bold text-white uppercase shadow-lg">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-800">
                      {user.name?.split(' ')[0] || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role?.toLowerCase() || 'member'}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl py-3 w-48 z-20 animate-in slide-in-from-top-2">
                    <Link href="/profile">
                      <div className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-600 cursor-pointer transition-all duration-200 mx-2 rounded-xl">
                        <User className="w-4 h-4 mr-3" />
                        Profile Settings
                      </div>
                    </Link>
                    <div className="h-px bg-gray-200 mx-4 my-2"></div>
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center px-4 py-3 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 mx-2 rounded-xl"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <button className="text-sm font-semibold text-gray-700 px-6 py-3 rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="sm:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100] bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl px-2 py-3 flex justify-between items-center w-[92vw] max-w-md border border-gray-100">
        {mobileMenuItems.map((item) => {
          const isActive = activeMobileTab === item.id
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setActiveMobileTab(item.id)}
              className={`flex flex-col items-center justify-center cursor-pointer px-4 py-3 rounded-2xl transition-all duration-300 min-w-[70px] ${
                isActive 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-orange-600 hover:scale-105'
              }`}
            >
              <div className={`transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-xs mt-1 font-medium ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-6 h-1 bg-white rounded-full opacity-80"></div>
              )}
            </Link>
          )
        })}
      </nav>
    </>
  )
}