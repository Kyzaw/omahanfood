import AdminSidebar from "@/components/admin/AdminNavbar"
import { UsersTable } from "@/components/admin/UsersTable"
import { UserForm } from "@/components/admin/UserForm"
import { prisma } from "@/lib/prisma"
import { User, Role } from "@/app/generated/prisma"
import { Suspense } from "react"
import { Users, Shield, User as UserIcon, Truck, UsersIcon, BarChart3 } from "lucide-react"

interface UserWithStats extends User {
  _count: {
    orders: number
    reviews: number
  }
}

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          orders: true,
          reviews: true
        }
      }
    },
  })

  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === "ADMIN").length,
    users: users.filter(u => u.role === "USER").length,
    kurir: users.filter(u => u.role === "KURIR").length,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      {/* Main content with responsive spacing */}
      <main className="md:ml-64 min-h-screen transition-all duration-300 ease-in-out">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 md:py-6 shadow-sm mt-16 md:mt-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-sm text-slate-600 mt-1 md:mt-2">
                Manage users, roles, and permissions across the platform
              </p>
            </div>
            <div className="flex items-center justify-end">
              <div className="text-right bg-slate-50 px-3 md:px-4 py-2 rounded-lg border border-slate-200">
                <p className="text-xs md:text-sm font-semibold text-slate-800">
                  {userStats.total} Total Users
                </p>
                <p className="text-xs text-slate-500">
                  {userStats.admins} Admins, {userStats.kurir} Couriers
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-xl md:text-3xl font-bold text-slate-900 truncate">{userStats.total}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                  <Users className="text-white" size={16} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-slate-600">Admins</p>
                  <p className="text-xl md:text-3xl font-bold text-red-600 truncate">{userStats.admins}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                  <Shield className="text-white" size={16} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-slate-600">Customers</p>
                  <p className="text-xl md:text-3xl font-bold text-green-600 truncate">{userStats.users}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                  <UserIcon className="text-white" size={16} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-slate-600">Couriers</p>
                  <p className="text-xl md:text-3xl font-bold text-purple-600 truncate">{userStats.kurir}</p>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
                  <Truck className="text-white" size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white p-4 rounded-xl md:rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center">
                    <UsersIcon className="text-white" size={16} />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-800">
                      All Users
                    </h2>
                    <p className="text-xs md:text-sm text-slate-600">
                      Manage user accounts and permissions
                    </p>
                  </div>
                </div>

                {/* Desktop Add User Button */}
                <div className="hidden sm:flex items-center gap-4">
                  <span className="text-xs md:text-sm text-slate-500 bg-slate-100 px-2 md:px-3 py-1 rounded-full">
                    {userStats.total} total
                  </span>
                  <UserForm />
                </div>
              </div>

              {/* Mobile Add User Button */}
              <div className="sm:hidden mt-4">
                <UserForm />
              </div>
            </div>

            <div className="p-0">
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                    <p className="text-sm text-slate-500">Loading users...</p>
                  </div>
                </div>
              }>
                <div className="overflow-x-auto">
                  <UsersTable users={users as UserWithStats[]} />
                </div>
              </Suspense>
            </div>
          </div>

          {/* Role Distribution Chart - Mobile Optimized */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg md:rounded-xl flex items-center justify-center">
                <BarChart3 className="text-white w-4 md:w-5 h-4 md:h-5" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800">Role Distribution</h3>
                <p className="text-xs md:text-sm text-slate-600">User roles across the platform</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
              <div className="text-center p-3 md:p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-lg md:text-2xl font-bold text-red-600">{userStats.admins}</div>
                <div className="text-xs md:text-sm text-red-700 font-medium">Admins</div>
                <div className="text-xs text-red-600 mt-1">
                  {userStats.total > 0 ? Math.round((userStats.admins / userStats.total) * 100) : 0}%
                </div>
              </div>

              <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-lg md:text-2xl font-bold text-green-600">{userStats.users}</div>
                <div className="text-xs md:text-sm text-green-700 font-medium">Customers</div>
                <div className="text-xs text-green-600 mt-1">
                  {userStats.total > 0 ? Math.round((userStats.users / userStats.total) * 100) : 0}%
                </div>
              </div>

              <div className="text-center p-3 md:p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-lg md:text-2xl font-bold text-purple-600">{userStats.kurir}</div>
                <div className="text-xs md:text-sm text-purple-700 font-medium">Couriers</div>
                <div className="text-xs text-purple-600 mt-1">
                  {userStats.total > 0 ? Math.round((userStats.kurir / userStats.total) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}