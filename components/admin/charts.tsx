'use client'

import React from 'react';

interface LineChartProps {
  data: { month: string; leads: number }[];
  title: string;
}

export function LineChart({ data, title }: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.leads));
  const chartHeight = 200;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="relative">
        <svg width="100%" height={chartHeight} className="overflow-visible">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <line
              key={i}
              x1="0"
              y1={chartHeight * ratio}
              x2="100%"
              y2={chartHeight * ratio}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Chart line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            points={data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = chartHeight - (point.leads / maxValue) * chartHeight;
              return `${x}%,${y}`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const safeLeads = point.leads || 0;
            const safeMaxValue = maxValue || 1;
            const y = chartHeight - (safeLeads / safeMaxValue) * chartHeight;
            const safeY = isNaN(y) ? chartHeight : y;
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={safeY}
                r="4"
                fill="#3b82f6"
                className="hover:r-6 transition-all"
              />
            );
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          {data.map((point, index) => (
            <span key={index}>{point.month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

interface BarChartProps {
  data: { category: string; leads: number }[];
  title: string;
}

export function BarChart({ data, title }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.leads));
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm text-gray-600 truncate">
              {item.category}
            </div>
            <div className="flex-1 mx-3">
              <div className="bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(item.leads / maxValue) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-8 text-sm font-medium text-gray-900">
              {item.leads}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: { category: string; count: number }[];
  title: string;
}

export function DonutChart({ data, title }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ];
  
  let cumulativePercentage = 0;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="200" height="200" className="transform -rotate-90">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="20"
            />
            {data.map((item, index) => {
              const percentage = (item.count / total) * 100;
              const strokeDasharray = `${percentage * 5.02} 502`;
              const strokeDashoffset = -cumulativePercentage * 5.02;
              cumulativePercentage += percentage;
              
              return (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={colors[index % colors.length]}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
        
        <div className="ml-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-600 truncate">
                {item.category} ({item.count})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

export function KPICard({ title, value, change, trend, icon }: KPICardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${getTrendColor()}`}>
              <span className="mr-1">{getTrendIcon()}</span>
              {change}
            </p>
          )}
        </div>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
