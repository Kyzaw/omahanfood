interface Order {
  id: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email?: string;
  };
  total?: number;
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'shipped':
      case 'on-delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return '✅';
      case 'pending':
        return '⏳';
      case 'processing':
        return '🔄';
      case 'cancelled':
      case 'failed':
        return '❌';
      case 'shipped':
      case 'on-delivery':
        return '🚚';
      default:
        return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-slate-600 mb-2">No Recent Orders</h3>
          <p className="text-sm text-slate-500">Orders will appear here once customers start placing them.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-600 uppercase tracking-wide">
                <div className="col-span-4">Customer</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-3">Date & Time</div>
              </div>
            </div>
            
            <div className="space-y-3">
              {orders.map((order, index) => (
                <div 
                  key={order.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Customer Info */}
                    <div className="col-span-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {order.user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{order.user.name}</p>
                          <p className="text-xs text-slate-500">#{order.id.slice(-8)}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status */}
                    <div className="col-span-3">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                        <span>{getStatusIcon(order.status)}</span>
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                    
                    {/* Date */}
                    <div className="col-span-3">
                      <div className="text-sm">
                        <p className="font-medium text-slate-800">{formatDate(order.createdAt)}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {orders.map((order, index) => (
              <div 
                key={order.id}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {order.user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{order.user.name}</p>
                      <p className="text-xs text-slate-500">Order #{order.id.slice(-8)}</p>
                    </div>
                  </div>
                  
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                    <span>{getStatusIcon(order.status)}</span>
                    <span className="capitalize">{order.status}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="text-sm text-slate-600">
                    {formatDate(order.createdAt)}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      

    </div>
  );
}