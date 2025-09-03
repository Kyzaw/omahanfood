import AdminSidebar from "@/components/AdminNavbar"
import { UsersTable } from "@/components/UsersTable"
import { UserForm } from "@/components/UserForm"
import { prisma } from "@/lib/prisma"
import { User, Role } from "@/app/generated/prisma"
import { Suspense } from "react"
import { Users, Shield, User as UserIcon, Truck, UsersIcon } from "lucide-react"

interface UserWithStats extends User {
  _count: {
    orders: number
    reviews: number
  }
}

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
    dapur: users.filter(u => u.role === "DAPUR").length,
    kurir: users.filter(u => u.role === "KURIR").length,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      
      <main className="ml-64 min-h-screen transition-all duration-300 ease-in-out">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200 px-6 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-sm text-slate-600 mt-2">
                Manage users, roles, and permissions across the platform
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                <p className="text-sm font-semibold text-slate-800">
                  {new Date().toLocaleDateString("en-US", { 
                    weekday: "long", 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date().toLocaleTimeString("en-US", { 
                    hour: "2-digit", 
                    minute: "2-digit" 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Users</p>
                  <p className="text-3xl font-bold text-slate-900">{userStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Users className="text-white" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Admins</p>
                  <p className="text-3xl font-bold text-red-600">{userStats.admins}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                  <Shield className="text-white" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Customers</p>
                  <p className="text-3xl font-bold text-green-600">{userStats.users}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <UserIcon className="text-white" size={24} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Couriers</p>
                  <p className="text-3xl font-bold text-purple-600">{userStats.kurir}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Truck className="text-white" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <UsersIcon className="text-white" size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">
                    All Users
                  </h2>
                </div>
                <UserForm />
              </div>
            </div>
            <div className="p-6">
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              }>
                <UsersTable users={users as UserWithStats[]} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}