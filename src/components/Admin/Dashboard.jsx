import React, { useState, useEffect } from "react";
import Axios from "../../Axios/Axios";
import Loader from "../../Loader/Loader";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaBars,
  FaTachometerAlt,
  FaBoxOpen,
  FaShoppingBag,
  FaUsers,
  FaCogs,
  FaSignOutAlt,
  FaMoneyBillWave,
  FaChartLine,
  FaShoppingCart,
  FaUserPlus,
  FaArrowUp,
  FaArrowDown,
  FaMinus,
  FaEye,
  FaCreditCard,
  FaTruck,
  FaTag,
} from "react-icons/fa";
import  Sidebar  from "./Sidebar";
import NeoTokyoFooter from './footer'

// Mock API data (in real app, this would come from your API)
const getDashboardSummery = async () => {
  try {
    let response = await Axios.get("/analytics/dashboard-summary/");
    console.log(response.data, "from dash board summery .....................");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// const mockApiData = {
//   "period_days": 30,
//   "current_period": {
//     "start_date": "2025-05-10",
//     "end_date": "2025-06-09"
//   },
//   "previous_period": {
//     "start_date": "2025-04-10",
//     "end_date": "2025-05-10"
//   },
//   "metrics": {
//     "revenue": {
//       "current": 560921.23,
//       "previous": 0,
//       "change_percentage": 100,
//       "trend": "up"
//     },
//     "orders": {
//       "current": 42,
//       "previous": 0,
//       "change_percentage": 100,
//       "trend": "up"
//     },
//     "average_order_value": {
//       "current": 13355.26738095238,
//       "previous": 0,
//       "change_percentage": 100,
//       "trend": "up"
//     },
//     "new_customers": {
//       "current": 10,
//       "previous": 8,
//       "change_percentage": 25,
//       "trend": "up"
//     }
//   },
//   "additional_stats": {
//     "total_customers": 21,
//     "active_products": 8,
//     "low_stock_products": 2
//   },
//   "charts": {
//     "daily_revenue": [
//       { "date": "2025-05-12", "revenue": 1969.69, "orders_count": 1 },
//       { "date": "2025-05-13", "revenue": 7878.76, "orders_count": 3 },
//       { "date": "2025-05-14", "revenue": 35301.21, "orders_count": 7 },
//       { "date": "2025-05-15", "revenue": 105005.66, "orders_count": 11 },
//       { "date": "2025-05-16", "revenue": 34000, "orders_count": 2 },
//       { "date": "2025-05-17", "revenue": 21678.18, "orders_count": 1 },
//       { "date": "2025-05-20", "revenue": 44000, "orders_count": 2 },
//       { "date": "2025-05-21", "revenue": 45640.68, "orders_count": 2 },
//       { "date": "2025-05-25", "revenue": 19800, "orders_count": 1 },
//       { "date": "2025-05-26", "revenue": 36700, "orders_count": 1 },
//       { "date": "2025-05-29", "revenue": 138136.04, "orders_count": 7 },
//       { "date": "2025-06-02", "revenue": 34910.01, "orders_count": 2 },
//       { "date": "2025-06-03", "revenue": 35901, "orders_count": 2 }
//     ],
//     "customer_growth": [
//       { "date": "2025-05-10", "new_customers": 4 },
//       { "date": "2025-05-12", "new_customers": 1 },
//       { "date": "2025-05-15", "new_customers": 2 },
//       { "date": "2025-05-20", "new_customers": 1 },
//       { "date": "2025-05-25", "new_customers": 1 },
//       { "date": "2025-05-26", "new_customers": 1 }
//     ],
//     "category_sales": [
//       { "category": "Pre Build PC", "revenue": 435974.08, "orders": 21, "quantity": 23 },
//       { "category": "ACCESSORIES", "revenue": 3500, "orders": 1, "quantity": 1 }
//     ],
//     "subcategory_sales": [
//       { "subcategory": "Desktop Computer", "revenue": 226600, "orders": 11, "quantity": 11 },
//       { "subcategory": "General", "revenue": 209374.08, "orders": 12, "quantity": 12 },
//       { "subcategory": "Keyboards", "revenue": 3500, "orders": 1, "quantity": 1 }
//     ],
//     "brand_sales": [
//       { "brand": "DELL", "revenue": 423974.08, "orders": 20, "quantity": 22 },
//       { "brand": "Acer", "revenue": 12000, "orders": 1, "quantity": 1 },
//       { "brand": "Lenovo", "revenue": 3500, "orders": 1, "quantity": 1 }
//     ],
//     "order_status": [
//       { "status": "PAID", "count": 42, "total_value": 560921.23 },
//       { "status": "PENDING", "count": 57, "total_value": 2347562.36 }
//     ],
//     "payment_status": [
//       { "status": "FAILED", "count": 15, "total_value": 70367.92 },
//       { "status": "PENDING", "count": 42, "total_value": 2277194.44 },
//       { "status": "SUCCESS", "count": 42, "total_value": 560921.23 }
//     ],
//     "payment_method_revenue": [
//       { "payment_method": "netbanking", "revenue": 398910.92, "order_count": 31 },
//       { "payment_method": "upi", "revenue": 142210.31, "order_count": 10 },
//       { "payment_method": "wallet", "revenue": 19800, "order_count": 1 }
//     ]
//   },
//   "top_products": [
//     { "id": 13, "name": "Neoo PC Pharaoh RL500", "total_sold": 11, "revenue": 226600 },
//     { "id": 10, "name": "New PC Pharaoh RL500", "total_sold": 8, "revenue": 150472.08 },
//     { "id": 18, "name": "ANT PC Pharaoh RL500", "total_sold": 2, "revenue": 32202 },
//     { "id": 17, "name": "ANT PC Pharaoh RL500", "total_sold": 1, "revenue": 14700 },
//     { "id": 26, "name": "Product 123", "total_sold": 1, "revenue": 12000 }
//   ]
// };

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null); // initially null
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // show loading until data comes
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardSummery();
        setDashboardData(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date for charts
  const formatChartDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Prepare chart data
  const dailyRevenueData = dashboardData.charts.daily_revenue.map((item) => ({
    date: formatChartDate(item.date),
    revenue: item.revenue,
    orders: item.orders_count,
  }));

  const customerGrowthData = dashboardData.charts.customer_growth.map(
    (item) => ({
      date: formatChartDate(item.date),
      customers: item.new_customers,
    })
  );

  // Color schemes
  const COLORS = ["#ec4899", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];
  const STATUS_COLORS = {
    PAID: "#10b981",
    PENDING: "#f59e0b",
    FAILED: "#ef4444",
    SUCCESS: "#10b981",
  };

  // Stat Card Component
  const StatCard = ({
    icon: Icon,
    title,
    value,
    change,
    trend,
    bgGradient,
  }) => {
    const getTrendIcon = () => {
      if (trend === "up") return <FaArrowUp className="text-green-400" />;
      if (trend === "down") return <FaArrowDown className="text-red-400" />;
      return <FaMinus className="text-gray-400" />;
    };

    const getTrendColor = () => {
      if (trend === "up") return "text-green-400";
      if (trend === "down") return "text-red-400";
      return "text-gray-400";
    };

    return (
      <div
        className={`bg-gradient-to-br ${bgGradient} p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-gray-100 text-sm font-medium opacity-80"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              {title}
            </p>
            <p
              className="text-2xl font-bold text-white mt-1"
              style={{ fontFamily: "Rajdhani, sans-serif" }}
            >
              {value}
            </p>
            <div className="flex items-center mt-2">
              {getTrendIcon()}
              <span className={`ml-1 text-sm font-medium ${getTrendColor()}`}>
                {change}%
              </span>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded-xl">
            <Icon className="text-2xl text-white" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
    <Sidebar/>
      <div
        className="flex h-screen bg-gray-100"
        style={{ fontFamily: "Rajdhani, sans-serif", marginTop: "70px" }}
      >
        {/* <Sidebar /> */}

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white shadow-lg border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-10">
                <h1 className="ml-4 text-2xl font-bold text-gray-800">
                  Dashboard Overview
                </h1>

                <button
                  onClick={() => navigate("/admin/customerinsights")}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition duration-300"
                >
                  Customer Insights
                </button>

                <button
                  onClick={() => navigate("/admin/businessinsights")}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition duration-300"
                >
                  Business Insights
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-xl font-medium">
                  {dashboardData.current_period.start_date} to{" "}
                  {dashboardData.current_period.end_date}
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={FaMoneyBillWave}
                title="Total Revenue"
                value={formatCurrency(dashboardData.metrics.revenue.current)}
                change={dashboardData.metrics.revenue.change_percentage}
                trend={dashboardData.metrics.revenue.trend}
                bgGradient="from-pink-500 to-pink-600"
              />
              <StatCard
                icon={FaShoppingCart}
                title="Total Orders"
                value={dashboardData.metrics.orders.current.toLocaleString()}
                change={dashboardData.metrics.orders.change_percentage}
                trend={dashboardData.metrics.orders.trend}
                bgGradient="from-purple-500 to-purple-600"
              />
              <StatCard
                icon={FaChartLine}
                title="Avg Order Value"
                value={formatCurrency(
                  dashboardData.metrics.average_order_value.current
                )}
                change={
                  dashboardData.metrics.average_order_value.change_percentage
                }
                trend={dashboardData.metrics.average_order_value.trend}
                bgGradient="from-cyan-500 to-cyan-600"
              />
              <StatCard
                icon={FaUserPlus}
                title="New Customers"
                value={dashboardData.metrics.new_customers.current.toLocaleString()}
                change={dashboardData.metrics.new_customers.change_percentage}
                trend={dashboardData.metrics.new_customers.trend}
                bgGradient="from-emerald-500 to-emerald-600"
              />
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Daily Revenue */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaChartLine className="mr-3 text-pink-600" />
                  Daily Revenue Trend
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyRevenueData}>
                      <defs>
                        <linearGradient
                          id="revenueGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#ec4899"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#ec4899"
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#ec4899"
                        strokeWidth={3}
                        fill="url(#revenueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Customer Growth */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaUsers className="mr-3 text-purple-600" />
                  Customer Growth
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={customerGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="customers"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 6 }}
                        activeDot={{ r: 8, fill: "#8b5cf6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Category Sales */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaTag className="mr-3 text-cyan-600" />
                  Sales by Category
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.charts.category_sales}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="revenue"
                        label={({ category, percent }) =>
                          `${category} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {dashboardData.charts.category_sales.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Brand Sales */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaBoxOpen className="mr-3 text-emerald-600" />
                  Top Brands
                </h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData.charts.brand_sales}
                      layout="horizontal"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis type="number" stroke="#64748b" fontSize={12} />
                      <YAxis
                        dataKey="brand"
                        type="category"
                        stroke="#64748b"
                        fontSize={12}
                        width={60}
                      />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar
                        dataKey="revenue"
                        fill="#10b981"
                        radius={[0, 8, 8, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaCreditCard className="mr-3 text-yellow-600" />
                  Payment Methods
                </h2>
                <div className="space-y-4">
                  {dashboardData.charts.payment_method_revenue.map(
                    (method, index) => (
                      <div
                        key={method.payment_method}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-3"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="font-medium text-gray-700 capitalize">
                            {method.payment_method}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800">
                            {formatCurrency(method.revenue)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {method.order_count} orders
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaBoxOpen className="mr-3 text-pink-600" />
                  Top Selling Products
                </h2>
                <div className="space-y-4">
                  {dashboardData.top_products.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {product.total_sold} units sold
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">
                          {formatCurrency(product.revenue)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaTruck className="mr-3 text-purple-600" />
                  Order Status Overview
                </h2>
                <div className="space-y-4">
                  {dashboardData.charts.order_status.map((status, index) => (
                    <div
                      key={status.status}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{
                            backgroundColor:
                              STATUS_COLORS[status.status] || "#6b7280",
                          }}
                        />
                        <span className="font-medium text-gray-700 capitalize">
                          {status.status.toLowerCase()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-800">
                          {status.count} orders
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(status.total_value)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Stats Bar */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm">Total Customers</p>
                    <p className="text-2xl font-bold">
                      {dashboardData.additional_stats.total_customers}
                    </p>
                  </div>
                  <FaUsers className="text-3xl text-pink-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Active Products</p>
                    <p className="text-2xl font-bold">
                      {dashboardData.additional_stats.active_products}
                    </p>
                  </div>
                  <FaBoxOpen className="text-3xl text-purple-200" />
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm">Low Stock Items</p>
                    <p className="text-2xl font-bold">
                      {dashboardData.additional_stats.low_stock_products}
                    </p>
                  </div>
                  <FaEye className="text-3xl text-red-200" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <NeoTokyoFooter/>
    </>
  );
};

export default Dashboard;
