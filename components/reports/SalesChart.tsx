'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from 'recharts';

type DailySalesData = {
  date: string;
  value: number;
};

interface SalesChartProps {
  data: DailySalesData[];
}

const formatCurrency = (value: number): string => {
  return `Rp${value.toLocaleString()}`;
};

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="w-full h-[550px] bg-white rounded-xl p-4 shadow">
      <h2 className="text-lg font-semibold mb-4">Grafik Penjualan Harian</h2>
      <div style={{width: '100%', height:450}}>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart data={data} >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => formatCurrency(value)} />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="value"
              position="top"
              formatter={(value: number) => formatCurrency(value)}
              style={{ fontSize: 12, fill: '#2563eb', fontWeight: 'bold' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
