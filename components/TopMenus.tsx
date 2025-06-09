"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, TrendingUp, ShoppingCart } from "lucide-react"

interface Menu {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: {
    name: string
  }
  reviews: { rating: number }[]
  _count?: {
    orderItems: number
  }
  orderCount?: number
}

function averageRating(reviews: { rating: number }[]) {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return (sum / reviews.length).toFixed(1)
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

export function TopMenus({ menus }: { menus: Menu[] }) {
  // Sort menus by order count (popularity) and take top 5
  const popularMenus = menus
    .sort((a, b) => {
      const aCount = a._count?.orderItems || a.orderCount || 0
      const bCount = b._count?.orderItems || b.orderCount || 0
      return bCount - aCount
    })
    .slice(0, 5)

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-3">
        <p className="text-sm text-gray-600">Menu yang paling banyak dipesan</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {popularMenus.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Belum ada data pesanan</p>
          </div>
        ) : (
          popularMenus.map((menu, index) => {
            const orderCount = menu._count?.orderItems || menu.orderCount || 0
            const rating = averageRating(menu.reviews)
            const hasReviews = menu.reviews.length > 0
            
            return (
              <div
                key={menu.id}
                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 hover:border-orange-200"
              >
                {/* Ranking Badge */}
                <div className="flex-shrink-0">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${index === 0 ? 'bg-yellow-500 text-white' : 
                      index === 1 ? 'bg-gray-400 text-white' : 
                      index === 2 ? 'bg-orange-600 text-white' : 
                      'bg-gray-200 text-gray-600'}
                  `}>
                    {index + 1}
                  </div>
                </div>

                {/* Menu Image */}
                <div className="flex-shrink-0">
                  <img
                    src={menu.image}
                    alt={menu.name}
                    className="w-16 h-16 rounded-lg object-cover border-2 border-gray-100"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/64/64'
                    }}
                  />
                </div>

                {/* Menu Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {menu.name}
                      </h3>
                      <p className="text-sm whitespace-normal text-gray-500 truncate">
                        {menu.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {menu.category.name}
                        </Badge>
                        <span className="text-sm font-medium text-green-600">
                          {formatPrice(menu.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex flex-col items-end gap-1 text-sm">
                  {hasReviews && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-medium">{rating}</span>
                      <span className="text-gray-400">({menu.reviews.length})</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-orange-600">
                    <ShoppingCart className="h-4 w-4" />
                    <span className="font-medium">{orderCount}</span>
                    <span className="text-gray-400 text-xs">pesanan</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}