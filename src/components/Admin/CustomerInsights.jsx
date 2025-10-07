import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { Search, Filter, SortAsc, SortDesc, RefreshCw, Users, DollarSign, ShoppingCart, TrendingUp, Calendar, CreditCard } from 'lucide-react';
import {getCustomerAnalytics,getCustomerInsights,refreshCustomerInsights} from '../../Services/Products'
import { useNavigate } from "react-router-dom";
import  Sidebar  from "./Sidebar";
import NeoTokyoFooter from './footer'
const CustomerInsights = () => {
  const [customers, setCustomers] = useState([]);
  const [insights, setInsights] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('total_spent');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const navigate = useNavigate();

  // Mock data - replace with your actual API calls
//   const mockCustomers = [
//     {
//       id: 4,
//       user_email: "anazks10@gmail.com",
//       user_name: "Admin k",
//       total_orders: 21,
//       total_spent: "234207.05",
//       average_order_value: "11152.72",
//       first_purchase_date: "2025-04-03T16:44:15.280338+05:30",
//       last_purchase_date: "2025-06-02T19:19:52.818003+05:30",
//       purchase_frequency_days: 3,
//       return_rate: 0,
//       is_active: true,
//       preferred_payment_method: "netbanking",
//       days_since_last_order: 6
//     },
//     {
//       id: 1,
//       user_email: "gopinath.pramod@gmail.com",
//       user_name: "Pramod Gopinath",
//       total_orders: 13,
//       total_spent: "216309.71",
//       average_order_value: "16639.21",
//       first_purchase_date: "2025-04-30T20:22:16.597867+05:30",
//       last_purchase_date: "2025-06-09T09:39:43.378412+05:30",
//       purchase_frequency_days: 3.25,
//       return_rate: 0,
//       is_active: true,
//       preferred_payment_method: "upi",
//       days_since_last_order: 0
//     },
//     {
//       id: 20,
//       user_email: "nihal.techworks@gmail.com",
//       user_name: "Nihal A None",
//       total_orders: 1,
//       total_spent: "36700.00",
//       average_order_value: "36700.00",
//       first_purchase_date: "2025-05-26T20:29:41.620501+05:30",
//       last_purchase_date: "2025-05-26T20:29:41.620501+05:30",
//       purchase_frequency_days: 0,
//       return_rate: 0,
//       is_active: true,
//       preferred_payment_method: "netbanking",
//       days_since_last_order: 13
//     },
//     {
//       id: 10,
//       user_email: "anushava740@gmail.com",
//       user_name: "Anusha V A None",
//       total_orders: 2,
//       total_spent: "24790.03",
//       average_order_value: "12395.02",
//       first_purchase_date: "2025-05-13T12:31:57.583806+05:30",
//       last_purchase_date: "2025-05-21T19:23:36.963015+05:30",
//       purchase_frequency_days: 8,
//       return_rate: 0,
//       is_active: true,
//       preferred_payment_method: "upi",
//       days_since_last_order: 18
//     },
//     {
//       id: 2,
//       user_email: "nihalonline24@gmail.com",
//       user_name: "Nihal A",
//       total_orders: 2,
//       total_spent: "23969.69",
//       average_order_value: "11984.84",
//       first_purchase_date: "2025-05-04T13:52:28.064391+05:30",
//       last_purchase_date: "2025-05-20T09:23:45.526945+05:30",
//       purchase_frequency_days: 15,
//       return_rate: 0,
//       is_active: true,
//       preferred_payment_method: "netbanking",
//       days_since_last_order: 20
//     }
//   ];

//   const mockInsights = {
//     average_order_value: "13482.10",
//     active_customers_count: 9,
//     inactive_customers_count: 12,
//     most_loyal_customers: [
//       {
//         id: 4,
//         name: "Admin k",
//         email: "anazks10@gmail.com",
//         order_count: 21
//       },
//       {
//         id: 1,
//         name: "Pramod Gopinath",
//         email: "gopinath.pramod@gmail.com",
//         order_count: 13
//       },
//       {
//         id: 10,
//         name: "Anusha V A None",
//         email: "anushava740@gmail.com",
//         order_count: 2
//       },
//       {
//         id: 2,
//         name: "Nihal A",
//         email: "nihalonline24@gmail.com",
//         order_count: 2
//       }
//     ],
//     top_customers_by_revenue: [
//       {
//         id: 4,
//         name: "Admin k",
//         email: "anazks10@gmail.com",
//         total_spent: 234207.05
//       },
//       {
//         id: 1,
//         name: "Pramod Gopinath",
//         email: "gopinath.pramod@gmail.com",
//         total_spent: 216309.71
//       },
//       {
//         id: 20,
//         name: "Nihal A None",
//         email: "nihal.techworks@gmail.com",
//         total_spent: 36700
//       },
//       {
//         id: 10,
//         name: "Anusha V A None",
//         email: "anushava740@gmail.com",
//         total_spent: 24790.03
//       }
//     ],
//     least_spending_customers: [
//       {
//         id: 7,
//         name: "anaz",
//         email: "anazksunil24@gmail.com",
//         total_spent: 3913.38
//       },
//       {
//         id: 17,
//         name: "anaz ksunil k",
//         email: "anazksunil2@gmail.com",
//         total_spent: 3939.38
//       },
//       {
//         id: 14,
//         name: "Nikhil Tn None",
//         email: "nikhil.tn007@gmail.com",
//         total_spent: 16101
//       },
//       {
//         id: 21,
//         name: "Retro Hub None",
//         email: "retrohubmusic@gmail.com",
//         total_spent: 19800
//       }
//     ],
//     age_group_analysis: [
//       {
//         age_group: "18-24",
//         customer_count: 1,
//         total_revenue: 234207.05,
//         average_order_value: 11152.72,
//         most_popular_product: {
//           id: 10,
//           name: "New PC Pharaoh RL500",
//           count: 6
//         }
//       },
//       {
//         age_group: "25-34",
//         customer_count: 5,
//         total_revenue: 240279.4,
//         average_order_value: 16018.63,
//         most_popular_product: {
//           id: 13,
//           name: "Neoo PC Pharaoh RL500",
//           count: 7
//         }
//       }
//     ],
//     average_purchase_frequency: 7.3125,
//     customer_churn_rate: 0,
//     return_rate: 0
//   };

  // Simulate API calls
  const fetchCustomerAnalytics = async () => {
    setLoading(true);
    try {
      // Replace with actual API call: await fetch('/analytics/customer-analytics/')
      const analytics = await getCustomerAnalytics();
    //   await new Promise(resolve => setTimeout(resolve, 1000));
      setCustomers(analytics.data);
    } catch (error) {
      console.error('Error fetching customer analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      // Replace with actual API call: await fetch('/analytics/insights/')
      const Insights = await getCustomerInsights()
      setInsights(Insights.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    }
  };

  const refreshAnalytics = async () => {
    setRefreshing(true);
    try {
      await refreshCustomerInsights()
    //   await new Promise(resolve => setTimeout(resolve, 2000));
      await fetchCustomerAnalytics();
      await fetchInsights();
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomerAnalytics();
    fetchInsights();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      refreshAnalytics();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  // Filter and sort customers
  const filteredAndSortedCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.user_email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'active' && customer.is_active) ||
                           (statusFilter === 'inactive' && !customer.is_active);
      const matchesPayment = paymentFilter === 'all' || customer.preferred_payment_method === paymentFilter;
      
      return matchesSearch && matchesStatus && matchesPayment;
    })
    .sort((a, b) => {
      const aValue = parseFloat(a[sortField]) || 0;
      const bValue = parseFloat(b[sortField]) || 0;
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  // Chart data
  const topCustomersData = insights.top_customers_by_revenue?.slice(0, 5).map(customer => ({
    name: customer.name.split(' ')[0],
    revenue: customer.total_spent,
    orders: customer.order_count || 0
  })) || [];

  const loyalCustomersData = insights.most_loyal_customers?.slice(0, 5).map(customer => ({
    name: customer.name.split(' ')[0],
    orders: customer.order_count,
    email: customer.email
  })) || [];

  const leastSpendingData = insights.least_spending_customers?.slice(0, 4).map(customer => ({
    name: customer.name.split(' ')[0],
    spent: customer.total_spent,
    email: customer.email
  })) || [];

  const ageGroupData = insights.age_group_analysis?.map(group => ({
    age_group: group.age_group,
    customers: group.customer_count,
    revenue: group.total_revenue,
    avg_order: group.average_order_value
  })) || [];

  const paymentMethodData = [
    { name: 'UPI', value: customers.filter(c => c.preferred_payment_method === 'upi').length, color: '#EC4899' },
    { name: 'Net Banking', value: customers.filter(c => c.preferred_payment_method === 'netbanking').length, color: '#1F2937' },
    { name: 'Others', value: customers.filter(c => !c.preferred_payment_method).length, color: '#6B7280' }
  ];

  const customerStatusData = [
    { name: 'Active', value: insights.active_customers_count || 0, color: '#EC4899' },
    { name: 'Inactive', value: insights.inactive_customers_count || 0, color: '#1F2937' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="animate-spin h-12 w-12 text-pink-600 mx-auto mb-4" />
            <p className="text-xl font-semibold text-gray-700">Loading Customer Analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <Sidebar/>
    <div className="flex h-screen w-full bg-gray-100" style={{ fontFamily: 'Rajdhani, sans-serif', marginTop:"70px" }}>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-lg border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-10">
              <h1 className="ml-4 text-2xl font-bold text-gray-800">
                Customer Analytics
              </h1>

              <button
                onClick={() => navigate("/admin/dashboard")}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition duration-300"
              >
                Dashboard
              </button>

              <button
                onClick={() => navigate("/admin/businessinsights")}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition duration-300"
              >
                Business Insights
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshAnalytics}
                disabled={refreshing}
                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 hover:from-pink-600 hover:to-pink-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                </div>
                <Users className="h-8 w-8 text-pink-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Customers</p>
                  <p className="text-2xl font-bold text-green-600">{insights.active_customers_count}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(parseFloat(insights.average_order_value || 0))}</p>
                </div>
                <DollarSign className="h-8 w-8 text-pink-600" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Purchase Frequency</p>
                  <p className="text-2xl font-bold text-gray-900">{insights.average_purchase_frequency?.toFixed(1)} days</p>
                </div>
                <Calendar className="h-8 w-8 text-pink-600" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top Customers by Revenue */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Customers by Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topCustomersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `₹${(value/1000)}K`} />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                  <Bar dataKey="revenue" fill="#EC4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Most Loyal Customers */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Most Loyal Customers</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={loyalCustomersData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Orders']} />
                  <Bar dataKey="orders" fill="#1F2937" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Additional Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Payment Methods Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Age Group Analysis */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Age Group Analysis</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageGroupData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age_group" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `₹${(value/1000)}K`} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'customers' ? value : formatCurrency(value), 
                      name === 'customers' ? 'Customers' : 'Revenue'
                    ]} 
                  />
                  <Bar yAxisId="left" dataKey="customers" fill="#EC4899" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="revenue" fill="#1F2937" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Insights Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Most Loyal Customers List */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 text-pink-600 mr-2" />
                Most Loyal Customers
              </h3>
              <div className="space-y-3">
                {insights.most_loyal_customers?.slice(0, 5).map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-pink-600">{customer.order_count}</p>
                      <p className="text-xs text-gray-500">orders</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Revenue Customers */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 text-green-600 mr-2" />
                Top Revenue Customers
              </h3>
              <div className="space-y-3">
                {insights.top_customers_by_revenue?.slice(0, 5).map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-sm">{formatCurrency(customer.total_spent)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Least Spending Customers */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-orange-600 mr-2 transform rotate-180" />
                Opportunity Customers
              </h3>
              <div className="space-y-3">
                {insights.least_spending_customers?.slice(0, 5).map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600 text-sm">{formatCurrency(customer.total_spent)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h3 className="text-lg font-semibold text-gray-800">Customer Details</h3>
                
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search customers..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                  >
                    <option value="all">All Payments</option>
                    <option value="upi">UPI</option>
                    <option value="netbanking">Net Banking</option>
                  </select>
                  
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    value={`${sortField}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortField(field);
                      setSortOrder(order);
                    }}
                  >
                    <option value="total_spent-desc">Revenue (High to Low)</option>
                    <option value="total_spent-asc">Revenue (Low to High)</option>
                    <option value="total_orders-desc">Orders (High to Low)</option>
                    <option value="total_orders-asc">Orders (Low to High)</option>
                    <option value="days_since_last_order-asc">Recent Activity</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{customer.user_name}</div>
                          <div className="text-sm text-gray-500">{customer.user_email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.total_orders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(parseFloat(customer.total_spent))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(parseFloat(customer.average_order_value))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {customer.last_purchase_date ? formatDate(customer.last_purchase_date) : 'Never'}
                        {customer.days_since_last_order !== null && (
                          <div className="text-xs text-gray-500">{customer.days_since_last_order} days ago</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {customer.preferred_payment_method || 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {customer.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NeoTokyoFooter/>
    </>
  );
};

export default CustomerInsights;