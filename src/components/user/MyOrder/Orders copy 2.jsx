import React, { useState, useEffect } from "react";
import { getMyOrder } from "../../../Services/userApi";

import {
  Package,
  Truck,
  Check,
  ShoppingBag,
  X,
  AlertCircle,
  ChevronRight,
  Map,
  Calendar,
  DollarSign,
  CreditCard,
  Eye,
  Moon,
  Sun,
} from "lucide-react";
import Loader from "../../../Loader/Loader";
import { useAuth } from "../../../Context/UserContext";
export default function Orders() {
  const { token, setToken, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  // Determine what to display for the profile image
  const renderProfileImage = () => {
    if (user.profile_picture) {
      return (
        <img
          src={user.profile_picture}
          alt="Profile"
          className="w-full h-full object-cover rounded-lg"
        />
      );
    } else if (user.profile_picture_url) {
      return (
        <img
          src={user.profile_picture_url}
          alt="Profile"
          className="w-full h-full object-cover rounded-lg"
        />
      );
    } else {
      // Display first letter of first name if no profile picture is available
      return (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg text-3xl font-bold">
          {user.first_name ? user.first_name.charAt(0) : "U"}
        </div>
      );
    }
  };

  // Check for user's preferred color scheme on component mount
  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const savedMode = localStorage.getItem("darkMode");

    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
    } else {
      setDarkMode(prefersDarkMode);
    }
  }, []);

  // Update document with dark mode class and save preference
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMyOrder();
      if (response && response.data) {
        setOrders(response.data);
        // Select first order by default if available
        if (response.data.length > 0) {
          setSelectedOrder(response.data[0].id);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || "Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      DELIVERED: {
        icon: <Check size={18} />,
        label: "Delivered",
        color: "text-green-600",
        bgColor: "bg-green-100",
        stepCompleted: 4,
      },
      SHIPPED: {
        icon: <Truck size={18} />,
        label: "Shipped",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        stepCompleted: 3,
      },
      PROCESSING: {
        icon: <Package size={18} />,
        label: "Processing",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        stepCompleted: 1,
      },
      PAID: {
        icon: <DollarSign size={18} />,
        label: "Paid",
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        stepCompleted: 2,
      },
      CANCELED: {
        icon: <X size={18} />,
        label: "Canceled",
        color: "text-red-600",
        bgColor: "bg-red-100",
        stepCompleted: -1,
      },
      PENDING: {
        icon: <AlertCircle size={18} />,
        label: "Pending",
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        stepCompleted: 0,
      },
    };

    return statusMap[status?.toUpperCase()] || statusMap.PENDING;
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter(
          (order) =>
            order.order_status?.toLowerCase() === filterStatus.toLowerCase()
        );

  // Get currently selected order
  const currentOrder = orders.find((order) => order.id === selectedOrder);

  // Loading and error states
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-screen p-6 ${
          darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}
      >
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Unable to Load Orders</h2>
        <p className="text-center mb-4">{error}</p>
        <button
          onClick={fetchMyOrders}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-screen p-6 ${
          darkMode ? "bg-gray-900 text-white " : "bg-white text-gray-800"
        }`}
      >
        <ShoppingBag size={48} className="text-gray-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">No Orders Found</h2>
        <p className="text-center mb-6">
          You haven't placed any orders yet. Browse our products and start
          shopping!
        </p>
        <button
          onClick={() => (window.location.href = "/products")}
          className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-white to-emerald-500" style={{fontFamily: "'Rajdhani', sans-serif"}}>
      <div
      className="mx-auto rounded-3xl bg-white p-4 flex items-start"
      style={{ width: "90%", marginBottom:"20px", marginTop:"80px" }}
    >
      {/* Left side - Profile Image */}
      <div className="w-24 h-24 overflow-hidden rounded-lg border border-gray-300 mr-4">
        
        {
          user.profile_picture_url ?
          <>
            {renderProfileImage()}
          </> : ''
        }
      </div>
      
      {/* Right side - User Details */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold mb-1">
          {user.first_name} {user.last_name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-1">
          {user.email}
        </p>
        
        <p className="text-sm text-gray-600 mb-3">
          {user.phone_number}
        </p>
        
        {/* My Products link with red gradient */}
        <div className="text-right">
          <a 
            href="/my-products" 
            className="inline-block font-medium text-white px-4 py-1 rounded-md"
            style={{
              background: "linear-gradient(to right, #ff416c, #ff4b2b)"
            }}
          >
            My Products
          </a>
        </div>
      </div>
    </div>
      <div
        className={`flex  flex-col lg:flex-row h-full min-h-screen ${
          darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
        }`}
        style={{
          width: "90%",
          margin: "auto",
          gap: "10px",
          background: "none",
        }}
      >
        {/* Left panel - Orders list */}
        <div
          className={`w-full lg:w-1/3 border-r ${
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          } overflow-auto`}
          style={{
            border: "1.5px solid black",
            borderRadius: "20px",
            maxHeight: "800px",
            overflow: "scroll",
          }}
        >
          <div className="p-4 sticky top-0 z-10 border-b shadow-sm flex justify-between items-center bg-inherit">
            <h1 className="text-xl font-bold">My Orders</h1>
            <div className="flex items-center space-x-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`text-sm rounded-md border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } py-1 px-2`}
              >
                <option value="all">All Orders</option>
                <option value="delivered">Delivered</option>
                <option value="shipped">Shipped</option>
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="canceled">Canceled</option>
              </select>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  darkMode
                    ? "bg-gray-700 text-yellow-400"
                    : "bg-gray-100 text-gray-700"
                }`}
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredOrders.length === 0 ? (
              <div
                className={`p-6 text-center ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <p>No orders match the selected filter.</p>
                <button
                  onClick={() => setFilterStatus("all")}
                  className="mt-2 text-pink-600 hover:text-pink-700"
                >
                  Show All Orders
                </button>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.order_status);
                const isSelected = selectedOrder === order.id;

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order.id)}
                    className={`p-4 cursor-pointer transition-colors flex items-center justify-between 
                    ${
                      isSelected
                        ? darkMode
                          ? "bg-blue-900/30"
                          : "bg-blue-50"
                        : darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-50"
                    }
                    ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${statusConfig.bgColor} ${statusConfig.color}`}
                      >
                       ₹
                      </div>
                      <div>
                        <div className="font-medium">
                          #{order.invoice_number}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right mr-3">
                        <div className="font-medium">
                          ₹. {order.total_price}
                        </div>
                        <div
                          className={`text-sm ${statusConfig.color} font-medium`}
                        >
                          {order.order_status}
                        </div>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`${
                          isSelected ? "opacity-100" : "opacity-0"
                        } ${darkMode ? "text-white" : "text-gray-800"}`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right panel - Order details */}
        {currentOrder && (
          <div
            className="w-full lg:w-2/3 overflow-auto"
            style={{ border: "1.5px solid black", borderRadius: "20px" }}
          >
            <div
              className={`sticky top-0 z-10 ${
                darkMode ? "bg-gray-900" : "bg-white"
              } shadow-sm p-6 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">
                  Order #{currentOrder.invoice_number}
                </h2>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getStatusConfig(currentOrder.order_status).bgColor
                  } ${getStatusConfig(currentOrder.order_status).color}`}
                >
                  {currentOrder.order_status}
                </div>
              </div>
              <div className="text-sm mt-1">
                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  Order ID:{" "}
                </span>
                <span>{currentOrder.payment_order_id}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span className={darkMode ? "text-gray-400" : "text-gray-500"}>
                  Placed on:{" "}
                </span>
                <span>{formatDate(currentOrder.created_at)}</span>
              </div>
            </div>

            {/* Order Tracking Status */}
            <div
              className={`p-6 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } mb-4 shadow-sm`}
            >
              <h3 className="font-medium mb-6">Order Status</h3>
              <div className="relative">
                {/* Progress line */}
                <div className="absolute left-6 top-0 w-0.5 h-full bg-gray-200 -ml-px"></div>

                {/* Status steps */}
                <div className="space-y-8">
                  {[
                    {
                      key: "placed",
                      label: "Order Placed",
                      description: "Order Ready for Shipping",
                      completed:
                        getStatusConfig(currentOrder.order_status)
                          .stepCompleted >= 0,
                    },
                    {
                      key: "processing",
                      label: "Order Processing",
                      description: "Order is being processed",
                      completed:
                        getStatusConfig(currentOrder.order_status)
                          .stepCompleted >= 1,
                    },
                    {
                      key: "shipped",
                      label: "Order Shipped",
                      description: "In Transit to Destination",
                      completed:
                        getStatusConfig(currentOrder.order_status)
                          .stepCompleted >= 2,
                    },
                    {
                      key: "outForDelivery",
                      label: "Out for Delivery",
                      description: "Order out for final delivery",
                      completed:
                        getStatusConfig(currentOrder.order_status)
                          .stepCompleted >= 3,
                    },
                    {
                      key: "delivered",
                      label: "Order Delivered",
                      description: "Successfully delivered",
                      completed:
                        getStatusConfig(currentOrder.order_status)
                          .stepCompleted >= 4,
                    },
                  ].map((step, index) => (
                    <div key={step.key} className="flex items-start">
                      <div
                        className={`relative flex items-center justify-center w-12 h-12 rounded-full shrink-0
                      ${
                        step.completed
                          ? "bg-pink-600 text-white border-2 border-pink-600"
                          : `${
                              darkMode ? "bg-gray-700" : "bg-gray-100"
                            } text-gray-400`
                      }`}
                      >
                        {index === 0 && <ShoppingBag size={18} />}
                        {index === 1 && <Package size={18} />}
                        {index === 2 && <Truck size={18} />}
                        {index === 3 && <Map size={18} />}
                        {index === 4 && <Check size={18} />}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-medium">{step.label}</h4>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {step.description}
                        </p>
                        {currentOrder.id && step.key === "placed" && (
                          <p className="text-sm text-gray-500 mt-1">
                            Order ID: {currentOrder.payment_order_id}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div
              className={`p-6 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } mb-4 shadow-sm`}
            >
              <h3 className="font-medium mb-4">Items in Your Order</h3>
              <div className="space-y-4">
                {currentOrder.items && currentOrder.items.length > 0 ? (
                  currentOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center p-4 rounded-lg ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <div className="w-16 h-16 rounded bg-white flex-shrink-0 overflow-hidden">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/placeholder-image.png";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                            <Package size={24} />
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="font-medium">{item.product_name}</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Price: ₹. {item.price}
                          </span>
                          <span
                            className={`text-sm ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          ₹. {item.total_price}
                        </div>
                        {item.product_discount &&
                          parseFloat(item.product_discount) > 0 && (
                            <div className="text-sm text-green-600">
                              Discount: Rs. {item.product_discount}
                            </div>
                          )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    className={`text-center p-4 ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No items available for this order.
                  </div>
                )}
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
              {/* Shipping Details */}
              <div
                className={`p-4 rounded-lg shadow-sm ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="font-medium mb-3 flex items-center">
                  <Truck size={18} className="mr-2" />
                  Shipping Details
                </h3>
                {currentOrder.delivery_address_details ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-1">
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Recipient:
                      </span>
                      <span className="text-sm col-span-2">
                        {currentOrder.delivery_address_details
                          .delivery_person_name || "Not specified"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Address:
                      </span>
                      <span className="text-sm col-span-2">
                        {currentOrder.delivery_address_details.address ||
                          "Not specified"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        City:
                      </span>
                      <span className="text-sm col-span-2">
                        {currentOrder.delivery_address_details.district ||
                          "Not specified"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        State:
                      </span>
                      <span className="text-sm col-span-2">
                        {currentOrder.delivery_address_details.state ||
                          "Not specified"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Postal Code:
                      </span>
                      <span className="text-sm col-span-2">
                        {currentOrder.delivery_address_details.postal_code ||
                          "Not specified"}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <span
                        className={`text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Phone:
                      </span>
                      <span className="text-sm col-span-2">
                        {currentOrder.delivery_address_details.phone_number ||
                          "Not specified"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No shipping details available.
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div
                className={`p-4 rounded-lg shadow-sm ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="font-medium mb-3 flex items-center">
                  <CreditCard size={18} className="mr-2" />
                  Payment Information
                </h3>
                <div className="space-y-2 mb-6">
                  <div className="grid grid-cols-3 gap-1">
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Method:
                    </span>
                    <span className="text-sm col-span-2">
                      {currentOrder.payment_method || "Not specified"}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Status:
                    </span>
                    <span
                      className={`text-sm font-medium px-2 py-0.5 rounded-full col-span-2 inline-block w-fit
                    ${
                      currentOrder.payment_status === "SUCCESS"
                        ? "bg-green-100 text-green-800"
                        : currentOrder.payment_status === "FAILED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                    >
                      {currentOrder.payment_status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Order ID:
                    </span>
                    <span className="text-sm col-span-2">
                      {currentOrder.payment_order_id || "Not available"}
                    </span>
                  </div>
                </div>

                {/* Order Summary */}
                <h4 className="font-medium mb-2">Order Summary</h4>
                <div
                  className={`p-3 rounded-md ${
                    darkMode ? "bg-gray-700" : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between py-1">
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Subtotal:
                    </span>
                    <span className="text-sm">
                      Rs. {currentOrder.price_before_tax || "0.00"}
                    </span>
                  </div>
                  {currentOrder.total_discount &&
                    parseFloat(currentOrder.total_discount) !== 0 && (
                      <div className="flex justify-between py-1">
                        <span
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Discount:
                        </span>
                        <span className="text-sm text-green-600">
                          Rs.{" "}
                          {Math.abs(
                            parseFloat(currentOrder.total_discount)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                  <div className="flex justify-between py-1">
                    <span
                      className={`text-sm ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Tax:
                    </span>
                    <span className="text-sm">
                      Rs. {currentOrder.total_tax || "0.00"}
                    </span>
                  </div>
                  <div className="border-t mt-1 pt-1 flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-medium">
                      Rs. {currentOrder.total_price || "0.00"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
