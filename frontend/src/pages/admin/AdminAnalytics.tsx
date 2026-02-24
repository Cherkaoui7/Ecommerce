import { useCallback, useEffect, useState } from 'react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import httpClient from '../../api/httpClient';
import { getApiErrorMessage } from '../../utils/apiError';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardOverview {
  total_sales: number;
  total_orders: number;
  total_customers: number;
  active_products: number;
  new_customers: number;
  recent_orders: number;
  recent_revenue: number;
  conversion_rate: number;
  average_order_value: number;
  low_stock_alerts: number;
}

interface ChartSeries {
  labels: string[];
  values: number[];
}

interface DashboardData {
  period: 'week' | 'month' | 'year';
  overview: DashboardOverview;
  charts: {
    revenue: ChartSeries;
    top_products: ChartSeries;
    status_distribution: ChartSeries;
  };
  recent_orders_list: Array<{
    id: number;
    total: string | number;
    status: string;
    created_at: string;
  }>;
}

interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pending',
    paid: 'Paid',
    processing: 'Processing',
    shipped: 'Shipped',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  return labels[status] || status;
};

export default function AdminAnalytics() {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await httpClient.get<DashboardResponse>('/analytics/dashboard', {
        params: { period },
      });

      setStats(response.data.data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to load analytics.'));
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error || !stats) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error || 'Analytics data is unavailable.'}
        </div>
      </div>
    );
  }

  const revenueData = {
    labels: stats.charts.revenue.labels,
    datasets: [
      {
        label: 'Revenue (EUR)',
        data: stats.charts.revenue.values,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.35,
      },
    ],
  };

  const topProductsData = {
    labels: stats.charts.top_products.labels,
    datasets: [
      {
        label: 'Units Sold',
        data: stats.charts.top_products.values,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(14, 165, 233, 0.8)',
        ],
      },
    ],
  };

  const statusData = {
    labels: stats.charts.status_distribution.labels.map(statusLabel),
    datasets: [
      {
        data: stats.charts.status_distribution.values,
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(107, 114, 128, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Performance and sales indicators</p>
        </div>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as 'week' | 'month' | 'year')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
        >
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
          <option value="year">Last 12 months</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {stats.overview.total_sales.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Orders</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats.overview.total_orders}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Order Value</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {stats.overview.average_order_value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Products</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats.overview.active_products}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h3>
          <Line data={revenueData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Products</h3>
          <Bar data={topProductsData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Status Distribution</h3>
          <Pie data={statusData} options={{ responsive: true, maintainAspectRatio: true }} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats.recent_orders_list.map((order) => (
              <div key={order.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className="font-bold text-primary-600">
                  {parseFloat(String(order.total)).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}