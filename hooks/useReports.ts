import { useState, useEffect } from 'react';
import { format, parseISO, isValid } from 'date-fns';


interface OverviewData {
  totalSales: number;
  totalTransactions: number;
  avgTransaction: number;
  totalProductsSold: number;
  monthlySales: Array<{
    date: string;
    value: number;
  }>;
  dailySales: Array<{
    date: string;
    value: number;
  }>;
}

interface ProductData {
  products: Array<{
    name: string;
    category: string;
    sold: number;
    revenue: number;
  }>;
  categoryPerformance: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
}

interface TransactionData {
  transactions: Array<{
    id: string;
    invoice: string;
    date: string;
    customer: string;
    items: number;
    paymentMethod: string;
    total: number;
    status: string;
  }>;
}

interface ReportData {
  overview: OverviewData | null;
  products: ProductData | null;
  transactions: TransactionData | null;
}

export const useReports = (dateRange: string = 'week') => {
  const [reportData, setReportData] = useState<ReportData>({
    overview: null,
    products: null,
    transactions: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);

    try {
      const endDate = new Date();
      const startDate = new Date();

      switch (dateRange) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      const baseUrl = '/api/reports';
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const [overviewRaw, products, transactions] = await Promise.all([
        fetch(`${baseUrl}?type=overview&${params}`).then(async res => {
          if (!res.ok) throw new Error('Failed to fetch overview data');
          return res.json();
        }),
        fetch(`${baseUrl}?type=products&${params}`).then(async res => {
          if (!res.ok) throw new Error('Failed to fetch products data');
          return res.json();
        }),
        fetch(`${baseUrl}?type=transactions&${params}`).then(async res => {
          if (!res.ok) throw new Error('Failed to fetch transactions data');
          return res.json();
        }),
      ]);

      // Transformasi monthlySales: ganti 'month' jadi 'date'
      const overview: OverviewData = {
        ...overviewRaw,
        dailySales: Array.isArray(overviewRaw.dailySales)
        ? overviewRaw.dailySales.map((item: any) => {
            if (!item.date) {
                console.warn('Invalid date in dailySales:', item);
                return { date: '', value: item.value ?? 0 };
            }
            const parsedDate = parseISO(item.date);
            if (!isValid(parsedDate)) {
                console.warn('Invalid parsed date in dailySales:', item.date);
                return { date: '', value: item.value ?? 0 };
            }
            return {
                date: format(parsedDate, 'yyyy-MM-dd'),
                value: item.value ?? 0,
            };
            })
        : [],
        monthlySales: Array.isArray(overviewRaw.monthlySales) 
            ? overviewRaw.monthlySales.map((item: any) => ({
                date: item.month,
                value: item.value,
                }))
            : [],
      };
      

      setReportData({ overview, products, transactions });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const refetch = () => {
    fetchReportData();
  };

  return {
    reportData,
    loading,
    error,
    refetch,
  };
};

// Utility functions for formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'SELESAI': return 'text-green-600 bg-green-100';
    case 'PENDING': return 'text-yellow-600 bg-yellow-100';
    case 'DIBAYAR': return 'text-blue-600 bg-blue-100';
    case 'DIMASAK': return 'text-orange-600 bg-orange-100';
    case 'DIKIRIM': return 'text-purple-600 bg-purple-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'SELESAI': return 'Selesai';
    case 'PENDING': return 'Pending';
    case 'DIBAYAR': return 'Dibayar';
    case 'DIMASAK': return 'Dimasak';
    case 'DIKIRIM': return 'Dikirim';
    default: return status;
  }
};
