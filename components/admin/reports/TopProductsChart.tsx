'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
    TooltipProps,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface Product {
    name: string;
    category: string;
    sold: number;
    revenue: number;
}

interface TopProductsChartProps {
    products: Product[];
}

const COLORS = [
    '#6366f1', // Indigo
    '#8b5cf6', // Purple  
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#84cc16', // Lime
    '#f97316'  // Orange
];

const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
        return `Rp ${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `Rp ${(value / 1000).toFixed(0)}K`;
    }
    return `Rp ${value.toLocaleString('id-ID')}`;
};

const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as Product;
        return (
            <div className="bg-white/95 backdrop-blur-sm p-4 border-none rounded-xl shadow-2xl">
                <p className="font-bold text-slate-900 text-sm mb-2">{data.name}</p>
                <div className="space-y-1">
                    <p className="text-sm text-slate-700 font-medium">
                        Category: <span className="text-slate-900">{data.category}</span>
                    </p>
                    <p className="text-sm text-slate-700">
                        Sold: <span className="font-semibold text-indigo-600">{data.sold.toLocaleString('id-ID')}</span> items
                    </p>
                    <p className="text-sm text-slate-700">
                        Revenue: <span className="font-semibold text-green-600">Rp {data.revenue.toLocaleString('id-ID')}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export function TopProductsChart({ products }: TopProductsChartProps) {
    const [metric, setMetric] = React.useState<'sold' | 'revenue'>('sold');

    const chartData = [...products]
        .sort((a, b) => b[metric] - a[metric])
        .slice(0, 8);

    return (
        <div className="w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                    <button
                        onClick={() => setMetric('sold')}
                        className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all duration-300 ${metric === 'sold'
                            ? 'bg-white text-indigo-600 shadow-md transform scale-105'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                            }`}
                    >
                        ITEMS SOLD
                    </button>
                    <button
                        onClick={() => setMetric('revenue')}
                        className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all duration-300 ${metric === 'revenue'
                            ? 'bg-white text-indigo-600 shadow-md transform scale-105'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                            }`}
                    >
                        REVENUE
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-500 tracking-wider">
                        TOP {chartData.length} ANALYTICS
                    </span>
                </div>
            </div>

            {chartData.length > 0 ? (
                <div className="h-[400px] md:h-[500px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
                        >
                            <defs>
                                <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
                                </filter>
                                {COLORS.map((color, index) => (
                                    <linearGradient key={`grad-${index}`} id={`grad-${index}`} x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor={color} stopOpacity={1} />
                                        <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                type="number"
                                hide
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={120}
                                tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.04)' }} />
                            <Bar
                                dataKey={metric}
                                radius={[0, 10, 10, 0]}
                                barSize={32}
                                filter="url(#barShadow)"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#grad-${index % COLORS.length})`}
                                    />
                                ))}
                                <LabelList
                                    dataKey={metric}
                                    position="right"
                                    style={{ fill: '#475569', fontSize: 11, fontWeight: 800 }}
                                    formatter={(value: number) => metric === 'revenue' ? formatCurrency(value) : `${value.toLocaleString('id-ID')} items`}
                                    offset={15}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <BarChart3 className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No analysis data available</p>
                </div>
            )}

            {/* Legend/Quick Stats */}
            {chartData.length > 0 && (
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {chartData.slice(0, 4).map((product, index) => (
                        <div key={index} className="group p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-4 h-4 rounded-lg shadow-sm group-hover:rotate-45 transition-transform duration-500"
                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-sm font-black text-slate-800 truncate">{product.name}</span>
                            </div>
                            <div className="space-y-3 pt-3 border-t border-slate-50">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Revenue</span>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                        {formatCurrency(product.revenue)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Sold</span>
                                    <span className="text-xs font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-md">
                                        {product.sold.toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
