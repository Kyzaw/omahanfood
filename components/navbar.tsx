'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronDown, ShoppingCart, Home, FileText, User, Shield, Truck, History, LogOut, Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import useCheckoutQty from '@/hooks/useCheckoutQty'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { data: session } = useSession()
  const user = session?.user
  const qty = useCheckoutQty()
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isActive = (href: string) => pathname === href

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/myorders', label: 'Pesanan', icon: FileText },
    { href: '/orderhistory', label: 'Riwayat', icon: History },
  ]

  const mobileMenuItems = [
    { id: 'home', label: 'Home', href: '/', icon: Home },
    { id: 'myorders', label: 'Pesanan', href: '/myorders', icon: FileText },
    { id: 'history', label: 'Riwayat', href: '/orderhistory', icon: History },
    { id: 'checkout', label: 'Keranjang', href: '/checkout', icon: ShoppingCart, badge: qty },
    ...(user
      ? [{ id: 'profile', label: 'Profil', href: '/profile', icon: User }]
      : [{ id: 'signin', label: 'Masuk', href: '/login', icon: User }]
    ),
  ]

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`hidden md:flex fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.06)] border-b border-stone-200/50'
          : 'bg-white/60 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm ring-1 ring-stone-200/50 group-hover:shadow-md group-hover:ring-orange-200 transition-all duration-300">
              <img src="/logo-removebg.png" alt="Omahan Food" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-bold tracking-tight text-stone-800 group-hover:text-orange-600 transition-colors">
              Omahan<span className="text-orange-500">Food</span>
            </span>
          </Link>

          {/* Center Nav Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    active
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-orange-500 rounded-full" />
                  )}
                </Link>
              )
            })}
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive('/admin')
                    ? 'text-violet-600 bg-violet-50'
                    : 'text-stone-600 hover:text-violet-600 hover:bg-violet-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
            {user?.role === 'KURIR' && (
              <Link
                href="/kurir"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive('/kurir')
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-stone-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>Kurir</span>
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* Cart Button */}
                <Link href="/checkout" className="relative group p-2.5 rounded-xl bg-stone-50 hover:bg-orange-50 border border-stone-200/60 hover:border-orange-200 transition-all duration-200">
                  <ShoppingCart className="w-5 h-5 text-stone-600 group-hover:text-orange-600 transition-colors" />
                  {qty > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-orange-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {qty > 99 ? '99+' : qty}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2.5 pl-2.5 pr-3 py-1.5 rounded-xl hover:bg-stone-50 border border-transparent hover:border-stone-200/60 transition-all duration-200"
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-lg object-cover ring-2 ring-stone-100"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-sm font-bold text-white">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-semibold text-stone-800 leading-tight">
                        {user.name?.split(' ')[0] || 'User'}
                      </p>
                      <p className="text-[11px] text-stone-400 capitalize">
                        {user.role?.toLowerCase() || 'member'}
                      </p>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-stone-200/80 rounded-xl shadow-lg shadow-stone-200/50 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-stone-100">
                        <p className="text-sm font-semibold text-stone-800">{user.name}</p>
                        <p className="text-xs text-stone-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-1.5">
                        <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                          <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors cursor-pointer">
                            <Settings className="w-4 h-4" />
                            Pengaturan Profil
                          </div>
                        </Link>
                      </div>
                      <div className="border-t border-stone-100 pt-1.5">
                        <button
                          onClick={() => signOut()}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <button className="text-sm font-medium text-stone-600 hover:text-stone-900 px-4 py-2 rounded-lg hover:bg-stone-50 transition-all duration-200">
                    Masuk
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm shadow-orange-200 hover:shadow-md hover:shadow-orange-200 transition-all duration-200">
                    Daftar
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-xl border-t border-stone-200/60">
        <div className="flex items-center justify-around px-2 py-1.5 pb-[env(safe-area-inset-bottom,8px)]">
          {mobileMenuItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 ${
                  active
                    ? 'text-orange-600'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-all ${active ? 'scale-110' : ''}`} />
                  {'badge' in item && item.badge !== undefined && (item.badge as number) > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {(item.badge as number) > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-0.5 font-medium ${active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
                {active && (
                  <span className="absolute -top-0.5 w-5 h-0.5 bg-orange-500 rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
