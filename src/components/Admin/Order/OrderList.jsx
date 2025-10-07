import React, { useEffect, useState } from "react";
import {updateStatus} from '../../../Services/Settings'
import {
  FiPackage,
  FiUser,
  FiCreditCard,
  FiTruck,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
} from "react-icons/fi";
import { AllOrders } from "../../../Services/Order";
import Loader from '../../../Loader/Loader';

import Sidebar from '../Sidebar';
import NeoFooter from '../footer';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
   const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [filters, setFilters] = useState({
    paymentStatus: "ALL",
    deliveryStatus: "ALL",
    orderStatus: "ALL",
    dateRange: "ALL",
  });

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await AllOrders();
      setOrders(response.data);
      setFilteredOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filters and search to orders
  useEffect(() => {
    let result = [...orders];

    // Apply payment status filter
    if (filters.paymentStatus !== "ALL") {
      result = result.filter(
        (order) => order.payment_status === filters.paymentStatus
      );
    }

    // Apply order status filter
    if (filters.orderStatus !== "ALL") {
      result = result.filter(
        (order) => order.order_status === filters.orderStatus
      );
    }

    // Apply order status filter
    if (filters.deliveryStatus !== "ALL") {
      result = result.filter(
        (order) => order.delivery_status === filters.deliveryStatus
      );
    }

    // Apply date range filter
    if (filters.dateRange !== "ALL") {
      const today = new Date();
      const filterDate = new Date();

      switch (filters.dateRange) {
        case "TODAY":
          filterDate.setHours(0, 0, 0, 0);
          result = result.filter(
            (order) => new Date(order.created_at) >= filterDate
          );
          break;
        case "WEEK":
          filterDate.setDate(today.getDate() - 7);
          result = result.filter(
            (order) => new Date(order.created_at) >= filterDate
          );
          break;
        case "MONTH":
          filterDate.setMonth(today.getMonth() - 1);
          result = result.filter(
            (order) => new Date(order.created_at) >= filterDate
          );
          break;
        default:
          break;
      }
    }

    // Apply custom date range filter
    if (dateRange.startDate && dateRange.endDate) {
      const startDate = new Date(dateRange.startDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(dateRange.endDate);
      endDate.setHours(23, 59, 59, 999);

      result = result.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.invoice_number.toLowerCase().includes(query) ||
          order.user_name?.toLowerCase().includes(query) ||
          order.payment_order_id?.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [orders, filters, searchQuery]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Status badge component
  const StatusBadge = ({ status, type }) => {
    let bgColor, textColor, icon;

    if (type === "payment") {
      switch (status) {
        case "SUCCESS":
          bgColor = "bg-green-100";
          textColor = "text-green-800";
          icon = <FiCheckCircle className="mr-1" />;
          break;
        case "PENDING":
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-800";
          icon = <FiClock className="mr-1" />;
          break;
        case "FAILED":
          bgColor = "bg-red-100";
          textColor = "text-red-800";
          icon = <FiAlertCircle className="mr-1" />;
          break;
        default:
          bgColor = "bg-black-100";
          textColor = "text-black-800";
          icon = null;
      }
    } else if (type === "delivery") {
      switch (status) {
        case "SHIPPED":
          bgColor = "bg-green-100";
          textColor = "text-green-800";
          icon = <FiCheckCircle className="mr-1" />;
          break;
        case "IN_TRANSIT":
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-800";
          icon = <FiClock className="mr-1" />;
          break;
        case "DELIVERED":
          bgColor = "bg-green-100";
          textColor = "text-green-800";
          icon = <FiCheckCircle className="mr-1" />;
          break;
        case "CANCELLED":
          bgColor = "bg-red-100";
          textColor = "text-red-800";
          icon = <FiAlertCircle className="mr-1" />;
          break;
        case "RETURNED":
          bgColor = "bg-purple-100";
          textColor = "text-purple-800";
          icon = <FiAlertCircle className="mr-1" />;
          break;
        default:
          bgColor = "bg-yellow-100";
          textColor = "text-black";
          icon = null;
      }
    } else {
      switch (status) {
        case "PAID":
          bgColor = "bg-green-100";
          textColor = "text-green-800";
          icon = <FiCheckCircle className="mr-1" />;
          break;
        case "PENDING":
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-800";
          icon = <FiClock className="mr-1" />;
          break;
        case "FAILED":
          bgColor = "bg-red-100";
          textColor = "text-red-800";
          icon = <FiAlertCircle className="mr-1" />;
          break;
        default:
          bgColor = "bg-black-100";
          textColor = "text-black-800";
          icon = null;
      }
    }

    return (
      <span
        className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
      >
        {icon}
        {status}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  // Back to order list
  const backToOrderList = () => {
    setSelectedOrder(null);
  };

  // Update order status
  // const updateOrderStatus = async (status) => {
  //   try {
  //     setLoading(true);
  //     // Here you would typically call an API to update the order status
  //     // For now, we'll just update the local state
  //     const updatedOrder = {
  //       ...selectedOrder,
  //       delivery_status: status
  //     };
  //     setSelectedOrder(updatedOrder);
      
  //     // Update the orders list as well
  //     const updatedOrders = orders.map(order => 
  //       order.id === selectedOrder.id ? updatedOrder : order
  //     );
  //     setOrders(updatedOrders);
  //     setFilteredOrders(updatedOrders);
      
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error updating order status:", error);
  //     setError("Failed to update order status. Please try again.");
  //     setLoading(false);
  //   }
  // };
  // Update order status
const updateOrderStatus = async (status) => {
  try {
    setLoading(true);
    
    // Call the updateStatus service
    const response = await updateStatus(selectedOrder.id, status.toUpperCase());
    
    // Update the local state with the new status
    const updatedOrder = {
      ...selectedOrder,
      delivery_status: status.toUpperCase()
    };
    setSelectedOrder(updatedOrder);
    
    // Update the orders list as well
    const updatedOrders = orders.map(order => 
      order.id === selectedOrder.id ? updatedOrder : order
    );
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
    
    setLoading(false);
  } catch (error) {
    console.error("Error updating order status:", error);
    setError("Failed to update order status. Please try again.");
    setLoading(false);
  }
};

  if (loading) {
     return <Loader/>
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
        <button
          className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
          onClick={fetchOrders}
        >
          <FiRefreshCw className="mr-2" /> Retry
        </button>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="bg-dark rounded-lg shadow-lg p-6">
        <button
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
          onClick={backToOrderList}
        >
          <FiChevronLeft className="mr-1" /> Back to Orders
        </button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black-800">Order Details</h2>
          <div className="flex space-x-2">
            <div className="text-right">
              <span className="block text-sm text-black-500">Order #</span>
              <span className="font-bold">{selectedOrder.invoice_number}</span>
            </div>
            <div className="text-right">
              <span className="block text-sm text-black-500">Date</span>
              <span>{formatDate(selectedOrder.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Status Update Buttons */}
        <div className="mb-6 bg-dark-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Update Delivery Status</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateOrderStatus("ACCEPTED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedOrder.delivery_status === "ACCEPTED"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              Mark as Accepted
            </button>
            <button
              onClick={() => updateOrderStatus("PROCESSING")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedOrder.delivery_status === "PROCESSING"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              Mark as Processing
            </button>
            <button
              onClick={() => updateOrderStatus("SHIPPED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedOrder.delivery_status === "SHIPPED"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              Mark as Shipped
            </button>
            <button
              onClick={() => updateOrderStatus("DELIVERED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedOrder.delivery_status === "DELIVERED"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              Mark as Delivered
            </button>
            <button
              onClick={() => updateOrderStatus("CANCELLED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedOrder.delivery_status === "CANCELLED"
                  ? "bg-red-600 text-white"
                  : "bg-red-100 text-red-800 hover:bg-red-200"
              }`}
            >
              Mark as Cancelled
            </button>
            <button
              onClick={() => updateOrderStatus("RETURNED")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                selectedOrder.delivery_status === "RETURNED"
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-800 hover:bg-purple-200"
              }`}
            >
              Mark as Returned
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-black-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FiUser className="mr-2" /> Customer Information
            </h3>
            <p className="font-medium">{selectedOrder.user_name}</p>
            <p className="text-black-600">User ID: {selectedOrder.user}</p>
          </div>

          <div className="bg-black-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FiTruck className="mr-2" /> Delivery Information
            </h3>
            {selectedOrder.delivery_address_details ? (
              <>
                <p className="font-medium">
                  {selectedOrder.delivery_address_details.delivery_person_name}
                </p>
                <p>{selectedOrder.delivery_address_details.phone_number}</p>
                <p>{selectedOrder.delivery_address_details.address}</p>
                <p>
                  {selectedOrder.delivery_address_details.district},{" "}
                  {selectedOrder.delivery_address_details.state},{" "}
                  {selectedOrder.delivery_address_details.postal_code}
                </p>
                <p>{selectedOrder.delivery_address_details.country}</p>
              </>
            ) : (
              <p className="text-black-500 italic">
                No delivery address provided
              </p>
            )}
          </div>
        </div>

        <div className="mb-6 overflow-x-auto">
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            <FiPackage className="mr-2" /> Order Items
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-black-700 border border-black-200">
              <thead>
                <tr className="bg-black-100">
                  <th className="py-2 px-4 border-b text-left">Product</th>
                  <th className="py-2 px-4 border-b text-right">Price</th>
                  <th className="py-2 px-4 border-b text-right">Quantity</th>
                  <th className="py-2 px-4 border-b text-right">Discount</th>
                  <th className="py-2 px-4 border-b text-right">Tax</th>
                  <th className="py-2 px-4 border-b text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item) => (
                  <tr key={item.id} className="hover:bg-black">
                    <td className="py-3 px-4 border-b">
                      <div className="flex items-center">
                        {item.product_image && (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-12 h-12 mr-3 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-black-500">
                            ID: {item.product}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 border-b text-right">
                      Rs.{item.price}
                    </td>
                    <td className="py-3 px-4 border-b text-right">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 border-b text-right">
                      Rs.{item.product_discount}
                    </td>
                    <td className="py-3 px-4 border-b text-right">
                      Rs.{item.total_tax}
                    </td>
                    <td className="py-3 px-4 border-b text-right font-medium">
                      Rs.{item.price_after_tax}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-black-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <FiCreditCard className="mr-2" /> Payment Information
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <p className="text-black-600">Payment Status:</p>
              <div>
                <StatusBadge
                  status={selectedOrder.payment_status}
                  type="payment"
                />
              </div>

              <p className="text-black-600">Payment Method:</p>
              <p>{selectedOrder.payment_method || "N/A"}</p>

              <p className="text-black-600">Payment ID:</p>
              <p>{selectedOrder.payment_order_id || "N/A"}</p>

              <p className="text-black-600">Order Status:</p>
              <div>
                <StatusBadge status={selectedOrder.order_status} type="order" />
              </div>

              <p className="text-black-600">Delivery Status:</p>
              <div>
                <StatusBadge status={selectedOrder.delivery_status} type="deliveryStatus" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs.{selectedOrder.price_before_tax}</span>
              </div>
              <div className="flex justify-between">
                <span>Product Discount:</span>
                <span>-Rs.{selectedOrder.product_discount}</span>
              </div>
              <div className="flex justify-between">
                <span>Bill Discount:</span>
                <span>-Rs.{selectedOrder.bill_discount}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>Rs.{selectedOrder.total_tax}</span>
              </div>
              <div className="border-t pt-1 mt-1 flex justify-between font-bold">
                <span>Total:</span>
                <span>Rs.{selectedOrder.total_price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <Sidebar/>
    
    <div className="bg-dark rounded-lg shadow-lg p-6" style={{marginTop:"60px"}}>
      <h2 className="text-2xl font-bold text-black-800 mb-6">
        Order Management
      </h2>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row md:justify-between mb-6 space-y-4 md:space-y-0">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-black-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 border border-black-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search by order #, customer name"
            value={searchQuery}
            style={{ color: "black" }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Options */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 border border-black-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-black"
              value={filters.deliveryStatus}
              onChange={(e) =>
                handleFilterChange("deliveryStatus", e.target.value)
              }
              style={{ color: "black" }}
            >
              <option value="ALL">All Delivery Status</option>
              <option value="SHIPPED">Shipped</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="DELIVERED">Delivered</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="RETURNED">Returned</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiTruck className="text-black" />
            </div>
          </div>

          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 border border-black-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-black"
              value={filters.paymentStatus}
              onChange={(e) =>
                handleFilterChange("paymentStatus", e.target.value)
              }
              style={{ color: "black" }}
            >
              <option value="ALL">All Payment Status</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCreditCard className="text-black" />
            </div>
          </div>

          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 border border-black-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-black"
              value={filters.orderStatus}
              onChange={(e) =>
                handleFilterChange("orderStatus", e.target.value)
              }
              style={{ color: "black" }}
            >
              <option value="ALL">All Order Status</option>
              <option value="PENDING">Pending</option>
              <option value="PAID">Paid</option>
              <option value="FAILED">Failed</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPackage className="text-black" />
            </div>
          </div>

          <div className="relative">
            <select
              className="pl-10 pr-4 py-2 border border-black-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-black"
              value={filters.dateRange}
              onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              style={{ color: "black" }}
            >
              <option value="ALL">All Time</option>
              <option value="TODAY">Today</option>
              <option value="WEEK">Last 7 Days</option>
              <option value="MONTH">Last 30 Days</option>
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders Count and Refresh Button */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-black-600">
          Showing {currentOrders.length} of {filteredOrders.length} orders
        </p>
        <button
          className="flex items-center text-blue-600 hover:text-blue-800"
          onClick={fetchOrders}
        >
          <FiRefreshCw className="mr-1" /> Refresh
        </button>
      </div>

      {/* Orders Table */}
      {filteredOrders.length > 0 ? (
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800">
              <thead className="bg-gray-700">
                <tr className="bg-black-100">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Order Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Delivery Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-white">
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap  font-medium">
                      {order.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.user_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                      Rs. {order.total_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <StatusBadge
                          status={order.payment_status}
                          type="payment"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 ">
                      <div className="flex justify-center">
                        <StatusBadge status={order.order_status} type="order" />
                      </div>
                    </td>
                    <td className="py-3 px-4 ">
                      <div className="flex justify-center">
                        <StatusBadge
                          status={order.delivery_status}
                          type="delivery"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-1 px-3 rounded-full flex items-center justify-center mx-auto"
                        onClick={() => viewOrderDetails(order)}
                      >
                        <FiEye className="mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-8 text-center text-black-500">
          <FiPackage className="mx-auto text-4xl mb-2" />
          <p className="text-lg font-medium">No orders found</p>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div>
            <p className="text-sm text-black-600">
              Page {currentPage} of {totalPages}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center px-3 py-1 rounded ${
                currentPage === 1
                  ? "bg-black-100 text-black-400 cursor-not-allowed"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              <FiChevronLeft className="mr-1" /> Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`flex items-center px-3 py-1 rounded ${
                currentPage === totalPages
                  ? "bg-black-100 text-black-400 cursor-not-allowed"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              Next <FiChevronRight className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>

    <NeoFooter/>
    </>
  );
};

export default OrderList;