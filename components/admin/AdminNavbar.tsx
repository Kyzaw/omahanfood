'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  LayoutDashboard,
  LogOut,
  Album,
  BookUp,
  Car,
  Users,
  ChevronLeft,
  FileChartColumn,
  Menu,
  X,
  Star
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Category', href: '/admin/category', icon: BookUp },
  { name: 'Menu', href: '/admin/menu', icon: Album },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Courier', href: '/admin/kurir', icon: Car },
  { name: 'Report', href: '/admin/reports', icon: FileChartColumn },
  { name: 'Home', href: '/', icon: Home },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(false) // Always expanded on mobile when open
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobile, isMobileMenuOpen])

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed top-4 left-4 z-50 p-3 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-700/50 hover:bg-slate-800 transition-colors md:hidden"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-700/50 shadow-2xl z-50 md:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Admin Panel
              </h1>
              <p className="text-xs text-slate-400 mt-1">Management System</p>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex flex-col gap-2 flex-1">
            {sidebarLinks.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <div key={href} className="relative group">
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                        : 'hover:bg-slate-700/30'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"></div>
                    )}

                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 ${
                        isActive
                          ? 'text-blue-400'
                          : 'text-slate-400 group-hover:text-white'
                      }`}
                    />
                    <span
                      className={`font-medium transition-colors duration-200 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-300 group-hover:text-white'
                      }`}
                    >
                      {name}
                    </span>
                  </Link>
                </div>
              )
            })}
          </nav>

          {/* Mobile User section & Logout */}
          <div className="mt-auto space-y-3">
            {user && (
              <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user.name?.split(' ')[0] || 'User'}
                  </p>
                  <p className="text-xs text-slate-400">{user.email || ''}</p>
                </div>
              </div>
            )}

            <button
              onClick={() => signOut()}
              className="group w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200 hover:bg-red-500/10 hover:border-red-500/30 border border-transparent"
            >
              <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors duration-200" />
              <span className="text-red-400 group-hover:text-red-300 font-medium">
                Logout
              </span>
            </button>
          </div>
        </aside>
      </>
    )
  }

  // Desktop Sidebar (unchanged from original)
  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex-col transition-all duration-300 ease-in-out border-r border-slate-700/50 shadow-2xl fixed left-0 top-0 z-40 hidden md:flex`}
    >
      {/* Desktop Header */}
      <div className="flex items-center justify-between mb-8">
        {!isCollapsed && (
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xs text-slate-400 mt-1">Management System</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-200 ${
            isCollapsed ? 'mx-auto' : ''
          }`}
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform duration-300 ${
              isCollapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {sidebarLinks.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <div key={href} className="relative group">
              <Link
                href={href}
                className={`flex items-center ${
                  isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'
                } py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                    : 'hover:bg-slate-700/30 hover:translate-x-1'
                }`}
              >
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-purple-500 rounded-r-full"></div>
                )}

                <Icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    isCollapsed ? 'mx-auto' : ''
                  } ${
                    isActive
                      ? 'text-blue-400'
                      : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                {!isCollapsed && (
                  <span
                    className={`font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {name}
                  </span>
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
              </Link>

              {/* Desktop Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  {name}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Desktop User section & Logout */}
      <div className="mt-auto space-y-3">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {user.name?.split(' ')[0] || 'User'}
              </p>
              <p className="text-xs text-slate-400">{user.email || ''}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => signOut()}
          aria-label="Logout"
          className={`group w-full flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-all duration-200 hover:bg-red-500/10 hover:border-red-500/30 border border-transparent ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors duration-200" />
          {!isCollapsed && (
            <span className="text-red-400 group-hover:text-red-300 font-medium">
              Logout
            </span>
          )}
        </button>
      </div>

      {/* Desktop Tooltip at top if collapsed */}
      {isCollapsed && (
        <div className="absolute left-full top-4 ml-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
          Admin Panel
        </div>
      )}
    </aside>
  )
}