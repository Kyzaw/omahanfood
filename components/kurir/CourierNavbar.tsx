'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, Truck, LogOut, User } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

export default function CourierNavbar() {
    const { data: session } = useSession()
    const user = session?.user
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo & Brand */}
                    <div className="flex items-center">
                        <Link href="/kurir" className="flex-shrink-0 flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300 group-hover:scale-105">
                                <Truck className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-slate-800">
                                    Courier Panel
                                </span>
                                <span className="text-xs text-slate-400 font-medium tracking-wide">
                                    DASHBOARD
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-slate-600 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-blue-50"
                        >
                            <Home className="w-4 h-4" />
                            Back to Website
                        </Link>

                        <div className="h-6 w-px bg-slate-200"></div>

                        {/* User Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 focus:outline-none group p-1 pr-3 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                            >
                                {user?.image ? (
                                    <Image
                                        src={user.image}
                                        alt="Profile"
                                        width={36}
                                        height={36}
                                        className="rounded-full ring-2 ring-white shadow-sm"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                        {user?.name?.charAt(0) || 'C'}
                                    </div>
                                )}
                                <div className="text-left hidden lg:block">
                                    <p className="text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                                        {user?.name}
                                    </p>
                                    <p className="text-[10px] text-slate-500 capitalize">
                                        {user?.role?.toLowerCase() || 'courier'}
                                    </p>
                                </div>
                            </button>

                            {isDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsDropdownOpen(false)}
                                    ></div>
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20 animate-in fade-in slide-in-from-top-2 border border-slate-100">
                                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Signed in as</p>
                                            <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
                                        </div>

                                        <div className="p-1">
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <User className="w-4 h-4" />
                                                Profile Settings
                                            </Link>

                                            <button
                                                onClick={() => signOut()}
                                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 shadow-xl absolute w-full z-40 animate-in slide-in-from-top-5">
                    <div className="pt-2 pb-3 space-y-1 px-4">
                        <Link
                            href="/kurir"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-blue-700 bg-blue-50"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Truck className="w-5 h-5" />
                            Dashboard
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Home className="w-5 h-5" />
                            Back to Website
                        </Link>
                    </div>
                    <div className="pt-4 pb-4 border-t border-slate-100 bg-slate-50/50 px-4">
                        <div className="flex items-center px-2 mb-4">
                            <div className="flex-shrink-0">
                                {user?.image ? (
                                    <Image
                                        src={user.image}
                                        alt="Profile"
                                        width={40}
                                        height={40}
                                        className="rounded-full ring-2 ring-white shadow-sm"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-sm">
                                        {user?.name?.charAt(0) || 'C'}
                                    </div>
                                )}
                            </div>
                            <div className="ml-3">
                                <div className="text-base font-medium text-slate-900">{user?.name}</div>
                                <div className="text-sm font-medium text-slate-500">{user?.email}</div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Link
                                href="/profile"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm transition-all"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <User className="w-5 h-5 opacity-70" />
                                Your Profile
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all text-left"
                            >
                                <LogOut className="w-5 h-5 opacity-70" />
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
