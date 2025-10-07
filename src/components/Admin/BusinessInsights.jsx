import { useEffect, React, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Clock,
  Calendar,
  TrendingUp,
  DollarSign,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getOrderTimings } from "../../Services/Products";
import Sidebar from "./Sidebar";
import NeoTokyoFooter from "./footer";

function CustomerInsights() {
  const [orderTimings, setOrderTimings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderTimings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getOrderTimings();

      console.log(response.data, "data from response");

      // Check if response.data exists and has the required structure
      if (response?.data && 
          response.data.hourly_distribution && 
          response.data.daily_distribution) {
        setOrderTimings(response.data);
      } else {
        console.warn("API response missing required data structure:", response?.data);
        setError("Invalid data structure received from API");
        setOrderTimings({});
      }
    } catch (error) {
      console.error("Error fetching timing analytics:", error);
      setError(error.message || "Failed to fetch order timings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderTimings();
  }, []);

  const apiData = orderTimings;
  const navigate = useNavigate();

  // Helper function to convert 24-hour to 12-hour format
  const formatHour = (hour) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    if (hour < 12) return `${hour} AM`;
    return `${hour - 12} PM`;
  };

  // Check if data is available before transforming
  const hasValidData = apiData.hourly_distribution && 
                      apiData.daily_distribution && 
                      apiData.hourly_revenue && 
                      apiData.daily_revenue;

  // Transform data for charts with safety checks
  const hourlyData = hasValidData ? 
    apiData.hourly_distribution.map((count, hour) => ({
      hour: formatHour(hour),
      hour24: hour,
      orders: count,
      revenue: apiData.hourly_revenue[hour] || 0,
    })) : [];

  const dayNames = [
    "Monday",
    "Tuesday", 
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const dailyData = hasValidData ?
    apiData.daily_distribution.map((count, index) => ({
      day: dayNames[index],
      orders: count,
      revenue: apiData.daily_revenue[index] || 0,
    })) : [];

  // Calculate totals with safety checks
  const totalOrders = hasValidData ? 
    apiData.hourly_distribution.reduce((a, b) => a + b, 0) : 0;
  const totalRevenue = hasValidData ? 
    apiData.hourly_revenue.reduce((a, b) => a + b, 0) : 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Peak performance data with safety checks
  const peakData = hasValidData && apiData.peak_hour !== undefined ? [
    {
      name: "Peak Hour",
      value: apiData.hourly_distribution[apiData.peak_hour] || 0,
      color: "#db2777",
    },
    {
      name: "Other Hours", 
      value: Math.max(0, totalOrders - (apiData.hourly_distribution[apiData.peak_hour] || 0)),
      color: "#1f2937",
    },
  ] : [];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === "revenue"
                ? `Revenue: ${formatCurrency(entry.value)}`
                : `Orders: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div
        className="flex h-screen bg-gray-100"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="animate-spin h-12 w-12 text-pink-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-700">
              Loading Order Analytics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex h-screen bg-gray-100"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-100 p-4 rounded-lg mb-4">
              <p className="text-red-800 font-semibold">Error loading data:</p>
              <p className="text-red-600">{error}</p>
            </div>
            <button
              onClick={fetchOrderTimings}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasValidData) {
    return (
      <div
        className="flex h-screen bg-gray-100"
        style={{ fontFamily: "Rajdhani, sans-serif" }}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-yellow-100 p-4 rounded-lg mb-4">
              <p className="text-yellow-800 font-semibold">No data available</p>
              <p className="text-yellow-600">The API returned no timing data to display</p>
            </div>
            <button
              onClick={fetchOrderTimings}
              className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div
        className="flex h-screen bg-gray-100"
        style={{ fontFamily: "Rajdhani, sans-serif", marginTop: "70px" }}
      >
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-lg border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-10">
                <h1 className="ml-4 text-2xl font-bold text-gray-800">
                  Order Timing Analytics
                </h1>

                <button
                  onClick={() => navigate("/admin/customerinsights")}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition duration-300"
                >
                  Customer Insights
                </button>

                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition duration-300"
                >
                  Dashboard
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-xl font-medium">
                  Last 30 Days
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Total Orders
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {totalOrders}
                    </p>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-full">
                    <Calendar className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency(totalRevenue)}
                    </p>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Peak Hour
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {apiData.peak_hour !== undefined ? formatHour(apiData.peak_hour) : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-full">
                    <Clock className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-600">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      Peak Day
                    </p>
                    <p className="text-2xl font-bold text-gray-800">
                      {apiData.peak_day_name || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-full">
                    <TrendingUp className="w-6 h-6 text-pink-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Hourly Orders Distribution */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    Hourly Order Distribution
                  </h3>
                  <div className="bg-pink-100 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-pink-600" />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 12 }}
                      interval={1}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="orders"
                      fill="#db2777"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Orders Distribution */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    Daily Order Distribution
                  </h3>
                  <div className="bg-pink-100 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-pink-600" />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="orders"
                      fill="#1f2937"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Hourly Revenue */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    Hourly Revenue Trend
                  </h3>
                  <div className="bg-pink-100 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-pink-600" />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 12 }}
                      interval={1}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#db2777"
                      strokeWidth={3}
                      dot={{ fill: "#db2777", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Daily Revenue */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    Daily Revenue Distribution
                  </h3>
                  <div className="bg-pink-100 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-pink-600" />
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="revenue"
                      fill="#db2777"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Peak Hour Performance */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Peak Hour Performance
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={peakData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {peakData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Peak at {apiData.peak_hour !== undefined ? formatHour(apiData.peak_hour) : 'N/A'}
                  </p>
                  <p className="text-xl font-bold text-pink-600">
                    {apiData.peak_hour !== undefined && apiData.hourly_distribution 
                      ? apiData.hourly_distribution[apiData.peak_hour] 
                      : 0} orders
                  </p>
                </div>
              </div>

              {/* Business Insights */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Business Insights
                </h3>
                <div className="space-y-4">
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-pink-800">
                      Average Order Value
                    </p>
                    <p className="text-xl font-bold text-pink-600">
                      {formatCurrency(avgOrderValue)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-800">
                      Busiest Day
                    </p>
                    <p className="text-xl font-bold text-gray-600">
                      {apiData.peak_day_name || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-pink-800">
                      Daily Average
                    </p>
                    <p className="text-xl font-bold text-pink-600">
                      {Math.round(totalOrders / 7)} orders
                    </p>
                  </div>
                </div>
              </div>

              {/* Top Performance Hours */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Top Performance Hours
                </h3>
                <div className="space-y-3">
                  {hourlyData
                    .sort((a, b) => b.orders - a.orders)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-bold text-pink-600">
                              {index + 1}
                            </span>
                          </div>
                          <span className="font-medium text-gray-800">
                            {item.hour}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">
                            {item.orders} orders
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatCurrency(item.revenue)}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NeoTokyoFooter />
    </>
  );
}

export default CustomerInsights;