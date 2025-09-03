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
  FileChartColumn
} from 'lucide-react'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Courier', href: '/admin/kurir', icon: Car },
  { name: 'Category', href: '/admin/category', icon: BookUp },
  { name: 'Menu', href: '/admin/menu', icon: Album },
  { name: 'Report', href: '/admin/reports',icon: FileChartColumn },
  { name: 'Home', href: '/', icon: Home },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-700/50 shadow-2xl fixed left-0 top-0 z-40`}
    >
      {/* Header */}
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

      {/* Navigation */}
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

              {/* Tooltip */}
              {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                  {name}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User section & Logout */}
      <div className="mt-auto space-y-3">
        {/* User Info */}
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

        {/* Logout */}
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

      {/* Tooltip at top if collapsed */}
      {isCollapsed && (
        <div className="absolute left-full top-4 ml-2 px-2 py-1 bg-slate-800 text-xs rounded opacity-0 pointer-events-none transition-opacity duration-200 whitespace-nowrap z-50">
          Admin Panel
        </div>
      )}
    </aside>
  )
}
