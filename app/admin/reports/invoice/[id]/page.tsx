'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminNavbar';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  User, 
  MapPin, 
  Package, 
  CreditCard,
  Calendar,
  Clock,
  Truck,
  FileText,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate, getStatusColor, getStatusText } from '@/hooks/useReports';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  menuId?: string;
  id?: string;
}

interface AddressData {
  nama: string;
  noHp: string;
  alamat: string;
}

interface OrderDetails {
  id: string;
  invoice: string;
  status: string;
  items: OrderItem[] | string;
  totalAmount: number;
  address: string;
  paymentMethod: string;
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
  deliveryTime: string;
  jenisPaket: string;
  user: {
    name: string;
    email: string;
  };
  courier: {
    name: string;
    email: string;
  } | null;
}

function parseAddressString(addressString: string): AddressData | null {
  // Try to parse as JSON first
  try {
    const parsed = JSON.parse(addressString);
    if (typeof parsed === 'object' && parsed !== null) {
      return {
        nama: parsed.name || parsed.nama || '',
        noHp: parsed.phone || parsed.noHp || parsed.telepon || '',
        alamat: parsed.fullAddress || parsed.alamat || parsed.address || ''
      };
    }
  } catch {
    // If not JSON, try to parse as delimited string
  }

  // Pattern 1: "Nama | 08123456789 | Jl. Address"
  const pattern1 = addressString.split(' | ');
  if (pattern1.length === 3) {
    return {
      nama: pattern1[0].trim(),
      noHp: pattern1[1].trim(),
      alamat: pattern1[2].trim()
    };
  }
  
  // Pattern 2: "Nama, 08123456789, Jl. Address"
  const pattern2 = addressString.split(', ');
  if (pattern2.length >= 3) {
    return {
      nama: pattern2[0].trim(),
      noHp: pattern2[1].trim(),
      alamat: pattern2.slice(2).join(', ').trim()
    };
  }
  
  // Pattern 3: "Nama - 08123456789 - Jl. Address"
  const pattern3 = addressString.split(' - ');
  if (pattern3.length === 3) {
    return {
      nama: pattern3[0].trim(),
      noHp: pattern3[1].trim(),
      alamat: pattern3[2].trim()
    };
  }
  
  // Pattern 4: Extract phone number with regex and split accordingly
  const phoneRegex = /(\+62|62|0)[\s-]?8[1-9][0-9]{6,10}/g;
  const phoneMatch = addressString.match(phoneRegex);
  
  if (phoneMatch && phoneMatch.length > 0) {
    const phone = phoneMatch[0];
    const parts = addressString.split(phone);
    
    if (parts.length === 2) {
      const beforePhone = parts[0].trim().replace(/[,|-]$/, '').trim();
      const afterPhone = parts[1].trim().replace(/^[,|-]/, '').trim();
      
      return {
        nama: beforePhone || '',
        noHp: phone,
        alamat: afterPhone || ''
      };
    }
  }
  
  // If no pattern matches, return null
  return null;
}

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        
        // Parse items if it's a string
        let items: OrderItem[] = [];
        if (typeof data.items === 'string') {
          try {
            items = JSON.parse(data.items);
          } catch {
            items = [];
          }
        } else if (Array.isArray(data.items)) {
          items = data.items;
        }

        setOrder({
          ...data,
          items,
          invoice: `INV-${data.id.slice(-8).toUpperCase()}`,
          createdAt: new Date(data.createdAt).toISOString(),
          paidAt: data.paidAt ? new Date(data.paidAt).toISOString() : null,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrderDetails();
    }
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (printWindow && order) {
      printWindow.document.write(`
        <html>
  <head>
    <title>Invoice ${order.invoice}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px 20px;
        min-height: 100vh;
      }
      
      .invoice-container {
        max-width: 800px;
        margin: 0 auto;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden;
      }
      
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 40px;
        text-align: center;
        position: relative;
      }
      
      .header::after {
        content: '';
        position: absolute;
        bottom: -20px;
        left: 0;
        right: 0;
        height: 40px;
        background: white;
        border-radius: 50% 50% 0 0 / 100% 100% 0 0;
      }
      
      .header h1 {
        font-size: 32px;
        margin-bottom: 10px;
        font-weight: 700;
        letter-spacing: 1px;
      }
      
      .header .company-name {
        font-size: 18px;
        opacity: 0.95;
        font-weight: 300;
      }
      
      .invoice-number {
        display: inline-block;
        background: rgba(255, 255, 255, 0.2);
        padding: 8px 20px;
        border-radius: 20px;
        margin-top: 15px;
        font-size: 14px;
        letter-spacing: 2px;
      }
      
      .content {
        padding: 60px 40px 40px;
      }
      
      .section {
        margin-bottom: 40px;
      }
      
      .section-title {
        font-size: 20px;
        font-weight: 600;
        color: #667eea;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 3px solid #667eea;
        display: inline-block;
      }
      
      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
        margin-top: 15px;
      }
      
      .info-item {
        display: flex;
        align-items: flex-start;
      }
      
      .info-label {
        font-weight: 600;
        color: #555;
        min-width: 120px;
        margin-right: 10px;
      }
      
      .info-value {
        color: #333;
        flex: 1;
      }
      
      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
      
      .items-table thead {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      
      .items-table th {
        padding: 15px;
        text-align: left;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 0.5px;
      }
      
      .items-table th:last-child,
      .items-table td:last-child {
        text-align: right;
      }
      
      .items-table tbody tr {
        border-bottom: 1px solid #f0f0f0;
        transition: background 0.2s;
      }
      
      .items-table tbody tr:hover {
        background: #f8f9ff;
      }
      
      .items-table tbody tr:last-child {
        border-bottom: none;
      }
      
      .items-table td {
        padding: 18px 15px;
        color: #333;
      }
      
      .item-name {
        font-weight: 500;
        color: #333;
      }
      
      .item-quantity {
        color: #666;
        font-size: 14px;
      }
      
      .total-section {
        margin-top: 40px;
        padding-top: 30px;
        border-top: 2px solid #e0e0e0;
      }
      
      .total-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 25px 30px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
      }
      
      .total-label {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: 1px;
      }
      
      .total-amount {
        font-size: 32px;
        font-weight: 700;
      }
      
      .footer {
        background: #f8f9fa;
        padding: 30px 40px;
        text-align: center;
        color: #666;
        font-size: 14px;
        border-top: 1px solid #e0e0e0;
      }
      
      .footer p {
        margin: 5px 0;
      }
      
      @media print {
        body {
          background: white;
          padding: 0;
        }
        
        .invoice-container {
          box-shadow: none;
          border-radius: 0;
        }
      }
      
      @media (max-width: 600px) {
        .content {
          padding: 40px 20px 20px;
        }
        
        .header {
          padding: 30px 20px;
        }
        
        .header h1 {
          font-size: 24px;
        }
        
        .total-label {
          font-size: 18px;
        }
        
        .total-amount {
          font-size: 24px;
        }
        
        .items-table th,
        .items-table td {
          padding: 12px 10px;
          font-size: 13px;
        }
      }
    </style>
  </head>
  <body>
    <div class="invoice-container">
      <!-- Header -->
      <div class="header">
        <h1>INVOICE</h1>
        <p class="company-name">Omahan Food Katering</p>
        <div class="invoice-number">#${order.invoice}</div>
      </div>
      
      <!-- Content -->
      <div class="content">
        <!-- Customer Information -->
        <div class="section">
          <h2 class="section-title">Customer Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Name:</span>
              <span class="info-value">${order.user.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Email:</span>
              <span class="info-value">${order.user.email}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phone Number:</span>
              <span class="info-value">${addressData.noHp}</span>
            </div>
          </div>
        </div>
        
        <!-- Order Items -->
        <div class="section">
          <h2 class="section-title">Order Details</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Quantity</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${Array.isArray(order.items) ? order.items.map((item: OrderItem) => `
                <tr>
                  <td class="item-name">${item.name}</td>
                  <td class="item-quantity">${item.quantity}</td>
                  <td>${formatCurrency(item.price * item.quantity)}</td>
                </tr>
              `).join('') : ''}
            </tbody>
          </table>
          
          <!-- Total -->
          <div class="total-section">
            <div class="total-row">
              <span class="total-label">TOTAL</span>
              <span class="total-amount">${formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <p><strong>Thank you for your order!</strong></p>
        <p>For any inquiries, please contact us at info@omahanfood.com</p>
      </div>
    </div>
  </body>
</html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        <main className="md:ml-64 min-h-screen transition-all duration-300 ease-in-out">
          <div className="p-4 md:p-8 mt-16 md:mt-0">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading invoice details...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        <main className="md:ml-64 min-h-screen transition-all duration-300 ease-in-out">
          <div className="p-4 md:p-8 mt-16 md:mt-0">
            <div className="max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 md:p-8 text-center">
                <h2 className="text-lg md:text-xl font-semibold text-red-800 mb-2">Error</h2>
                <p className="text-red-600 mb-6">{error || 'Order not found'}</p>
                <Button onClick={() => router.back()}>Go Back</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  
  // Parse address to extract phone number
  const parsedAddress = parseAddressString(order.address);
  const addressData = parsedAddress || {
    nama: '',
    noHp: '',
    alamat: order.address
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="md:ml-64 min-h-screen transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 md:py-6 shadow-sm mt-16 md:mt-0">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                    Invoice Details
                  </h1>
                  <p className="text-xs md:text-sm text-slate-600 mt-1 md:mt-2">
                    {order.invoice}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="gap-2"
                >
                  <Printer className="h-4 w-4" />
                  <span className="hidden sm:inline">Print</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Invoice Header Card */}
            <Card className="shadow-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl md:text-2xl font-bold text-slate-800 mb-2">
                      {order.invoice}
                    </CardTitle>
                    <p className="text-sm text-slate-600">Omahan Food Katering</p>
                  </div>
                  <Badge className={`${getStatusColor(order.status)} px-4 py-2 text-sm font-semibold`}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">Order Date</span>
                    </div>
                    <p className="text-slate-900 font-semibold">{formatDate(order.createdAt)}</p>
                  </div>
                  {order.paidAt && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">Paid At</span>
                      </div>
                      <p className="text-slate-900 font-semibold">{formatDate(order.paidAt)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer & Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-indigo-600" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Name</p>
                    <p className="font-semibold text-slate-900">{order.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-semibold text-slate-900">{order.user.email}</p>
                  </div>
                  {addressData.noHp && (
                    <div>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </p>
                      <p className="font-semibold text-slate-900 mt-1">{addressData.noHp}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Delivery Information */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Truck className="h-5 w-5 text-purple-600" />
                    Delivery Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </p>
                    <p className="font-semibold text-slate-900 mt-1">{addressData.alamat || order.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Delivery Time</p>
                    <p className="font-semibold text-slate-900">{order.deliveryTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Package Type</p>
                    <p className="font-semibold text-slate-900">{order.jenisPaket}</p>
                  </div>
                  {order.courier && (
                    <div>
                      <p className="text-sm text-slate-600">Courier</p>
                      <p className="font-semibold text-slate-900">{order.courier.name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Items */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-orange-600" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {items.length > 0 ? (
                        items.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="px-4 py-4">
                              <p className="font-semibold text-slate-900">{item.name}</p>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item.quantity}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right text-slate-600">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-4 py-4 text-right font-semibold text-slate-900">
                              {formatCurrency(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                            No items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot className="bg-slate-50">
                      <tr>
                        <td colSpan={3} className="px-4 py-4 text-right font-bold text-slate-900">
                          Total Amount:
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-lg text-green-600">
                          {formatCurrency(order.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-green-600" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">Payment Method</p>
                  <p className="font-semibold text-slate-900">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Amount</p>
                  <p className="font-bold text-xl text-green-600">{formatCurrency(order.totalAmount)}</p>
                </div>
                {order.notes && (
                  <div>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Notes
                    </p>
                    <p className="font-semibold text-slate-900 mt-1">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

