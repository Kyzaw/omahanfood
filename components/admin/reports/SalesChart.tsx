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
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return `${value.toLocaleString()}`;
};

const formatTooltipCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${day}/${month}`;
};

export function SalesChart({ data }: SalesChartProps) {
  // Format data with shortened dates
  const formattedData = data.map(item => ({
    ...item,
    date: formatDate(item.date),
  }));

  return (
    <div className="w-full">
      {/* Mobile View */}
      <div className="block md:hidden">
        <div style={{ width: '100%', height: '280px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={formattedData} 
              margin={{ top: 15, right: 10, left: 0, bottom: 5 }}
              barCategoryGap="25%"
            >
              <defs>
                <linearGradient id="mobileBars" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.7} />
                </linearGradient>
                <filter id="mobileShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.2"/>
                </filter>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="2 4" 
                stroke="#e2e8f0" 
                strokeOpacity={0.6}
                horizontal={true}
                vertical={false}
              />
              
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: '500' }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />
              
              <YAxis 
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: '500' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCurrency}
                width={45}
                tickMargin={8}
              />
              
              <Tooltip 
                formatter={(value: number) => [formatTooltipCurrency(value), 'Sales']}
                labelStyle={{ 
                  color: '#1e293b', 
                  fontWeight: '700',
                  fontSize: '13px',
                  marginBottom: '4px'
                }}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  backdropFilter: 'blur(10px)',
                  fontSize: '12px'
                }}
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
              />
              
              <Bar 
                dataKey="value" 
                fill="url(#mobileBars)"
                radius={[6, 6, 0, 0]}
                maxBarSize={35}
                filter="url(#mobileShadow)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <div style={{ width: '100%', height: '700px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={formattedData} 
              margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
              barCategoryGap="20%"
            >
              <defs>
                <linearGradient id="desktopBars" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                  <stop offset="30%" stopColor="#8b5cf6" stopOpacity={0.9} />
                  <stop offset="70%" stopColor="#a855f7" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#c084fc" stopOpacity={0.7} />
                </linearGradient>
                <linearGradient id="desktopBarsHover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                  <stop offset="30%" stopColor="#7c3aed" stopOpacity={0.95} />
                  <stop offset="70%" stopColor="#9333ea" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.85} />
                </linearGradient>
                <filter id="desktopShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#6366f1" floodOpacity="0.25"/>
                </filter>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="2 6" 
                stroke="#e2e8f0" 
                strokeOpacity={0.4}
                horizontal={true}
                vertical={false}
              />
              
              <XAxis
                dataKey="date"
                tick={{ 
                  fontSize: 12, 
                  fill: '#64748b', 
                  fontWeight: '600' 
                }}
                axisLine={false}
                tickLine={false}
                tickMargin={12}
              />
              
              <YAxis 
                tick={{ 
                  fontSize: 12, 
                  fill: '#64748b', 
                  fontWeight: '600' 
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCurrency}
                width={70}
                tickMargin={10}
              />
              
              <Tooltip 
                formatter={(value: number) => [formatTooltipCurrency(value), 'Daily Sales']}
                labelStyle={{ 
                  color: '#1e293b', 
                  fontWeight: '700',
                  fontSize: '14px',
                  marginBottom: '6px'
                }}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  border: 'none',
                  borderRadius: '16px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(20px)',
                  fontSize: '13px',
                  padding: '12px 16px'
                }}
                cursor={{ fill: 'rgba(99, 102, 241, 0.08)', radius: 4 }}
              />
              
              <Bar 
                dataKey="value" 
                fill="url(#desktopBars)"
                radius={[8, 8, 0, 0]}
                maxBarSize={50}
                filter="url(#desktopShadow)"
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={formatCurrency}
                  style={{ 
                    fontSize: 11, 
                    fill: '#475569', 
                    fontWeight: '700',
                    textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
                  }}
                  offset={8}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Summary for Mobile */}
      <div className="mt-4 md:hidden">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
            <div className="text-xs text-slate-600">Highest</div>
            <div className="text-sm font-semibold text-slate-900">
              Rp {Math.max(...data.map(d => d.value)).toLocaleString('id-ID')}
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
            <div className="text-xs text-slate-600">Average</div>
            <div className="text-sm font-semibold text-slate-900">
              Rp {Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length).toLocaleString('id-ID')}
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 border border-slate-200">
            <div className="text-xs text-slate-600">Total Days</div>
            <div className="text-sm font-semibold text-slate-900">
              {data.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}