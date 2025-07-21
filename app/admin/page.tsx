'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/layout';
import { KPICard, LineChart, BarChart, DonutChart } from '@/components/admin/charts';
import { 
  BarChart3, 
  Users, 
  ListChecks, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Activity,
  Building2
} from 'lucide-react';

interface DashboardData {
  kpis: {
    totalLeads: number;
    leadsThisMonth: number;
    leadsGrowth: number;
    totalServices: number;
    activeServices: number;
    servicesThisMonth: number;
    totalVendors: number;
    vendorsThisMonth: number;
    avgServicePrice: number;
  };
  charts: {
    monthlyLeadsTrend: { month: string; leads: number }[];
    topCategories: { category: string; leads: number }[];
    serviceDistribution: { category: string; count: number }[];
  };
  recentActivity: {
    id: string;
    created_at: string;
    service_name: string;
  }[];
  alerts: {
    type: string;
    title: string;
    message: string;
    count: number;
  }[];
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard/analytics');
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
          setError(null);
        } else {
          setError('Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Network error while fetching dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !dashboardData) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'No data available'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const { kpis, charts, recentActivity, alerts } = dashboardData;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Platform overview and analytics</p>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <h3 className="text-sm font-medium text-yellow-800">Alerts</h3>
            </div>
            <div className="mt-2 space-y-1">
              {alerts.map((alert, index) => (
                <p key={index} className="text-sm text-yellow-700">
                  <strong>{alert.title}:</strong> {alert.message}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Leads"
            value={kpis.totalLeads}
            change={`${kpis.leadsThisMonth} this month`}
            trend={kpis.leadsGrowth > 0 ? 'up' : kpis.leadsGrowth < 0 ? 'down' : 'neutral'}
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <KPICard
            title="Active Services"
            value={kpis.activeServices}
            change={`${kpis.servicesThisMonth} new this month`}
            trend="up"
            icon={<ListChecks className="h-6 w-6" />}
          />
          <KPICard
            title="Total Vendors"
            value={kpis.totalVendors}
            change={`${kpis.vendorsThisMonth} new this month`}
            trend="up"
            icon={<Building2 className="h-6 w-6" />}
          />
          <KPICard
            title="Avg Service Price"
            value={`$${kpis.avgServicePrice}`}
            change="Average pricing"
            trend="neutral"
            icon={<DollarSign className="h-6 w-6" />}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LineChart
            data={charts.monthlyLeadsTrend}
            title="Monthly Leads Trend"
          />
          <BarChart
            data={charts.topCategories}
            title="Top Categories by Leads"
          />
        </div>

        {/* Second Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DonutChart
            data={charts.serviceDistribution}
            title="Service Distribution"
          />
          
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Lead Activity</h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          New lead for {activity.service_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Activity className="h-4 w-4 text-gray-400" />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent activity</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{kpis.totalServices}</div>
              <div className="text-sm text-gray-600">Total Services</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{kpis.leadsThisMonth}</div>
              <div className="text-sm text-gray-600">Leads This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{kpis.leadsGrowth > 0 ? '+' : ''}{kpis.leadsGrowth}%</div>
              <div className="text-sm text-gray-600">Growth Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{charts.topCategories.length}</div>
              <div className="text-sm text-gray-600">Active Categories</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
