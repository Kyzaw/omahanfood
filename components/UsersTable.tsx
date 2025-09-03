"use client"

import { useState } from "react"
import { User, Role } from "@/app/generated/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Eye, 
  MoreHorizontal,
  Mail,
  ShoppingBag,
  Star
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserForm, DeleteUserButton } from "@/components/UserForm"

interface UserWithStats extends User {
  _count: {
    orders: number
    reviews: number
  }
}

interface UsersTableProps {
  users: UserWithStats[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL")
  const [sortBy, setSortBy] = useState<"name" | "email" | "orders">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800 border-red-200"
      case "USER":
        return "bg-green-100 text-green-800 border-green-200"
      case "DAPUR":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "KURIR":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case "ADMIN":
      case "USER":
      case "DAPUR":
      case "KURIR":
      default:
        return ""
    }
  }

  const filteredAndSortedUsers = users
    .filter((user) => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter
      return matchesSearch && matchesRole
    })
    .sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "email":
          aValue = a.email.toLowerCase()
          bValue = b.email.toLowerCase()
          break
        case "orders":
          aValue = a._count.orders
          bValue = b._count.orders
          break
        default:
          return 0
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleViewUser = (userId: string) => {
    // TODO: Implement view user details functionality
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as Role | "ALL")}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="USER">Customer</SelectItem>
              <SelectItem value="KURIR">Courier</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
            const [field, order] = value.split("-")
            setSortBy(field as typeof sortBy)
            setSortOrder(order as typeof sortOrder)
          }}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="email-asc">Email A-Z</SelectItem>
              <SelectItem value="email-desc">Email Z-A</SelectItem>
              <SelectItem value="orders-desc">Most Orders</SelectItem>
              <SelectItem value="orders-asc">Least Orders</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-slate-600">
          {filteredAndSortedUsers.length} of {users.length} users
        </div>
      </div>

      {/* Users Table */}
      {filteredAndSortedUsers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4"></div>
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No Users Found</h3>
          <p className="text-sm text-slate-500">
            {searchTerm || roleFilter !== "ALL" 
              ? "Try adjusting your search or filter criteria."
              : "No users have been registered yet."
            }
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                <div className="col-span-3">User</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Orders</div>
                <div className="col-span-2">Reviews</div>
                <div className="col-span-2">User ID</div>
                <div className="col-span-1">Actions</div>
              </div>
            </div>
            
            <div className="space-y-3">
              {filteredAndSortedUsers.map((user) => (
                <div 
                  key={user.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* User Info */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{user.name}</p>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Role */}
                    <div className="col-span-2">
                      <Badge className={`${getRoleColor(user.role)} border`}>
                        <span className="mr-1">{getRoleIcon(user.role)}</span>
                        {user.role}
                      </Badge>
                    </div>
                    
                    {/* Orders */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{user._count.orders}</span>
                      </div>
                    </div>
                    
                    {/* Reviews */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-slate-400" />
                        <span className="font-medium">{user._count.reviews}</span>
                      </div>
                    </div>
                    
                    {/* User ID */}
                    <div className="col-span-2">
                      <div className="text-sm text-slate-500 font-mono">
                        {user.id.slice(-8)}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="col-span-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewUser(user.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <UserForm 
                              userId={user.id}
                              userData={{
                                name: user.name,
                                email: user.email,
                                role: user.role
                              }}
                              onSuccess={handleRefresh}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <DeleteUserButton 
                              userId={user.id}
                              userName={user.name}
                              onSuccess={handleRefresh}
                            />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {filteredAndSortedUsers.map((user) => (
              <div 
                key={user.id}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  
                  <Badge className={`${getRoleColor(user.role)} border`}>
                    <span className="mr-1">{getRoleIcon(user.role)}</span>
                    {user.role}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium">{user._count.orders} Orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium">{user._count.reviews} Reviews</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="text-sm text-slate-500 font-mono">
                    ID: {user.id.slice(-8)}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewUser(user.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <UserForm 
                      userId={user.id}
                      userData={{
                        name: user.name,
                        email: user.email,
                        role: user.role
                      }}
                      onSuccess={handleRefresh}
                    />
                    <DeleteUserButton 
                      userId={user.id}
                      userName={user.name}
                      onSuccess={handleRefresh}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
