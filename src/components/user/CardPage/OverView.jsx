import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Check,
  ChevronRight,
  PlusCircle,
  X,
} from "lucide-react";
import {
  AddDelievryAddress,
  getMyDeliveryAddress,
  getMyCart,
  getMyPrimaryAddress,
  CreateOrder,
} from "../../../Services/userApi";
import BaseURL from "../../../Static/Static";
import RenderRazorpay from "../RazorPay/RenderRazorpay";

function Overview() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState({ items: [], total_price: 0 });
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [displayRazorpay, setDisplayRazorpay] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
   
  const [newAddress, setNewAddress] = useState({
    delivery_person_name: "",
    phone_number: "",
    district: "",
    state: "",
    country: "",
    zip_code: "",
    address: "",
    is_primary: false,
    errors: {},
  });

  // Calculate order totals
  const subtotal = orders.total_price || 0;
  const shipping = 0;
  const tax = 0;
  const total = subtotal;
  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  // Fetch addresses on component mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await getMyDeliveryAddress();
        setAddresses(response.data);
        if (response.data.length > 0) {
          const primaryAddress =
            response.data.find((addr) => addr.is_primary) || response.data[0];
          setSelectedAddressId(primaryAddress.id);
        }
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch addresses"
        );
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await getMyCart();
        setOrders(response.data || { items: [], total_price: 0 });
      } catch (err) {
        console.error(err);
        alert("Error fetching orders");
      }
    };

    fetchOrders();
    fetchAddresses();
  }, []);

  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: type === "checkbox" ? checked : value,
      errors: {
        ...newAddress.errors,
        [name]: undefined,
      },
    });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!newAddress.delivery_person_name.trim()) {
      errors.delivery_person_name = "Name is required";
      isValid = false;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!newAddress.phone_number.trim()) {
      errors.phone_number = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(newAddress.phone_number)) {
      errors.phone_number = "Enter a valid phone number";
      isValid = false;
    }

    if (!newAddress.address.trim()) {
      errors.address = "Address is required";
      isValid = false;
    } else if (newAddress.address.trim().length < 10) {
      errors.address = "Address should be at least 10 characters";
      isValid = false;
    }

    if (!newAddress.district.trim()) {
      errors.district = "District is required";
      isValid = false;
    }

    if (!newAddress.state.trim()) {
      errors.state = "State is required";
      isValid = false;
    }

    if (!newAddress.country.trim()) {
      errors.country = "Country is required";
      isValid = false;
    }

    const zipRegex = /^[0-9]{5,10}$/;
    if (!newAddress.zip_code.trim()) {
      errors.zip_code = "Zip code is required";
      isValid = false;
    } else if (!zipRegex.test(newAddress.zip_code)) {
      errors.zip_code = "Enter a valid zip code";
      isValid = false;
    }

    setNewAddress((prev) => ({
      ...prev,
      errors,
    }));

    return isValid;
  };

  const handleAddNewAddress = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      const { errors, ...addressData } = newAddress;
      const response = await AddDelievryAddress(addressData);
      const newAddressObj = response.data;

      let updatedAddresses = [...addresses];
      if (newAddressObj.is_primary) {
        updatedAddresses = updatedAddresses.map((addr) => ({
          ...addr,
          is_primary: false,
        }));
      }

      setAddresses([...updatedAddresses, newAddressObj]);
      setSelectedAddressId(newAddressObj.id);

      setNewAddress({
        delivery_person_name: "",
        phone_number: "",
        district: "",
        state: "",
        country: "",
        zip_code: "",
        address: "",
        is_primary: false,
        errors: {},
      });

      setShowAddressModal(false);
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Failed to add address"
      );
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      setIsProcessingPayment(true);
      setLoading(true)
      let getPrimaryAddress = await getMyPrimaryAddress();
      let order = await CreateOrder(selectedAddressId);
      let newData = order;

      setOrderDetails(newData);
      setDisplayRazorpay(true);
      setLoading(false)
    } catch (error) {
      console.error("Error creating order:", error);
      setIsProcessingPayment(false);
      setLoading(false)
    }finally{
        setLoading(false)
    }
  };

  // Handle Razorpay completion
  useEffect(() => {
    if (!displayRazorpay && isProcessingPayment) {
      // Razorpay has closed, reset processing state
      setIsProcessingPayment(false);
    }
  }, [displayRazorpay, isProcessingPayment]);

  if (loading && addresses.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-white">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Rajdhani', sans-serif" }}>
      {displayRazorpay && orderDetails && (
        <RenderRazorpay
          orderDetails={orderDetails}
          setDisplayRazorpay={setDisplayRazorpay}
          onClose={() => setIsProcessingPayment(false)}
        />
      )}

      {/* Payment Processing Loader */}
      {isProcessingPayment && !displayRazorpay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center relative max-w-sm w-full">
            <button
              onClick={() => setIsProcessingPayment(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors"
              aria-label="Close payment processing"
            >
              <X size={18} />
            </button>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4 mt-2"></div>
            <p className="text-lg font-bold text-gray-800 uppercase text-center">
              Processing Payment...
            </p>
            <p className="text-sm text-gray-600 mt-1 text-center">
              Please wait while we prepare your payment
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4 md:p-6 bg-white">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-wide">
            Order Overview
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
            {/* Address Section */}
            <div className="bg-white rounded-lg p-6 border border-black-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <MapPin className="text-red-600 mr-2" size={20} />
                  <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                    Shipping Address
                  </h2>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-green-600 hover:text-blue-800 text-sm font-bold flex items-center transition-colors uppercase"
                  disabled={loading}
                >
                  <PlusCircle size={16} className="mr-1" /> Add New
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No addresses found</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-green-700 uppercase font-medium"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddressId === address.id
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-green-200 hover:border-green-300"
                      }`}
                      onClick={() => handleAddressSelect(address.id)}
                    >
                      <div className="flex justify-between mb-2">
                        <div className="font-bold text-gray-800 uppercase">
                          {address.delivery_person_name}
                        </div>
                        {address.is_primary && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded uppercase font-bold">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 text-sm space-y-1">
                        <p>{address.address}</p>
                        <p>
                          {address.district}, {address.state} {address.zip_code}
                        </p>
                        <p>{address.country}</p>
                        <p className="pt-1 font-medium">
                          Phone: {address.phone_number}
                        </p>
                      </div>
                      <div className="flex justify-between mt-3 pt-3 border-t border-gray-200">
                        <button className="text-blue-600 hover:text-blue-800 text-sm transition-colors">
                          Edit
                        </button>
                        {selectedAddressId === address.id && (
                          <div className="flex items-center text-green-600 text-sm font-bold">
                            <Check size={16} className="mr-1" /> Selected
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Orders Section */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center mb-4">
                <ShoppingBag className="text-red-600 mr-2" size={20} />
                <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wider">
                  Selected Items
                </h2>
              </div>

              <div className="divide-y divide-gray-200">
                {orders.items && orders.items.length > 0 ? (
                  orders.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-4 flex flex-col sm:flex-row justify-between"
                    >
                      <div className="flex items-center mb-2 sm:mb-0">
                        <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center mr-4 overflow-hidden">
                          {item.primary_image &&
                          item.primary_image.length > 0 ? (
                            <img
                              src={BaseURL + item.primary_image[0].image}
                              alt={item.name}
                              className="object-cover h-full w-full"
                            />
                          ) : (
                            <ShoppingBag size={24} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 uppercase">
                            {item.product_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:w-1/4">
                        <span className="font-bold text-gray-900">
                          ₹{item.price || 0}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No items in your cart
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:w-1/3">
            <div className="sticky top-6 space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 uppercase tracking-wider">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 uppercase">
                      Subtotal ({orders.items?.length || 0} items)
                    </span>
                    <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 uppercase">Shipping</span>
                    <span className="font-bold">₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 uppercase">Tax</span>
                    <span className="font-bold">₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-gray-900 uppercase">Total</span>
                      <span className="text-green-600">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handleCreateOrder}
                className={`w-full bg-red-600 text-white py-3 px-6 rounded-lg font-bold uppercase tracking-wider flex items-center justify-center transition-colors shadow-md ${
                  !selectedAddressId || orders.items?.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-red-700 hover:shadow-lg"
                }`}
                disabled={
                  !selectedAddressId ||
                  orders.items?.length === 0 ||
                  loading ||
                  isProcessingPayment
                }
              >
                {loading ? (
                  <>
                    <span className="mr-2">Processing...</span>
                    <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Payment</span>
                    <ChevronRight size={20} className="ml-2" />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500">
                By proceeding, you agree to our Terms of Service and Privacy
                Policy
              </p>

              {/* Order Status */}
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">
                  Order Status
                </h3>
                <div className="flex justify-between items-center">
                  {["Cart", "Shipping", "Review", "Payment"].map(
                    (step, index) => (
                      <React.Fragment key={step}>
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              index < 3 ? "bg-black" : "bg-gray-200"
                            }`}
                          >
                            {index < 3 ? (
                              <Check size={16} className="text-white" />
                            ) : (
                              <CreditCard size={16} className="text-gray-500" />
                            )}
                          </div>
                          <span
                            className={`text-xs mt-1 ${
                              index < 3
                                ? "text-dark font-bold"
                                : "text-gray-600"
                            } uppercase`}
                          >
                            {step}
                          </span>
                        </div>
                        {index < 3 && (
                          <div className="h-1 w-4 bg-blue-200"></div>
                        )}
                      </React.Fragment>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Address Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-screen overflow-y-auto relative">
              {/* Header with Close Button Inside */}
              <div className="flex justify-between items-center p-6 border-b relative">
                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">
                  Add New Address
                </h3>
                <button
                  onClick={() => {
                    setShowAddressModal(false);
                    setNewAddress((prev) => ({
                      ...prev,
                      errors: {},
                    }));
                  }}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
                  disabled={loading}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleAddNewAddress}
                className="p-6 space-y-4"
                noValidate
              >
                {/* Delivery Person Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="delivery_person_name"
                    value={newAddress.delivery_person_name}
                    onChange={handleInputChange}
                    onBlur={() => validateForm()}
                    className={`w-full border ${
                      newAddress.errors?.delivery_person_name
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase`}
                    placeholder="FULL NAME"
                    required
                    disabled={loading}
                  />
                  {newAddress.errors?.delivery_person_name && (
                    <p className="mt-1 text-xs text-red-600 uppercase">
                      {newAddress.errors.delivery_person_name}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={newAddress.phone_number}
                    onChange={handleInputChange}
                    onBlur={() => validateForm()}
                    className={`w-full border ${
                      newAddress.errors?.phone_number
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="PHONE NUMBER"
                    required
                    disabled={loading}
                  />
                  {newAddress.errors?.phone_number && (
                    <p className="mt-1 text-xs text-red-600 uppercase">
                      {newAddress.errors.phone_number}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">
                    Address*
                  </label>
                  <textarea
                    name="address"
                    value={newAddress.address}
                    onChange={handleInputChange}
                    onBlur={() => validateForm()}
                    className={`w-full border ${
                      newAddress.errors?.address
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase`}
                    placeholder="FULL ADDRESS"
                    required
                    rows={3}
                    disabled={loading}
                  />
                  {newAddress.errors?.address && (
                    <p className="mt-1 text-xs text-red-600 uppercase">
                      {newAddress.errors.address}
                    </p>
                  )}
                </div>

                {/* District and State */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">
                      District*
                    </label>
                    <input
                      type="text"
                      name="district"
                      value={newAddress.district}
                      onChange={handleInputChange}
                      onBlur={() => validateForm()}
                      className={`w-full border ${
                        newAddress.errors?.district
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase`}
                      placeholder="DISTRICT"
                      required
                      disabled={loading}
                    />
                    {newAddress.errors?.district && (
                      <p className="mt-1 text-xs text-red-600 uppercase">
                        {newAddress.errors.district}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">
                      State*
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={newAddress.state}
                      onChange={handleInputChange}
                      onBlur={() => validateForm()}
                      className={`w-full border ${
                        newAddress.errors?.state
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase`}
                      placeholder="STATE"
                      required
                      disabled={loading}
                    />
                    {newAddress.errors?.state && (
                      <p className="mt-1 text-xs text-red-600 uppercase">
                        {newAddress.errors.state}
                      </p>
                    )}
                  </div>
                </div>

                {/* Zip Code and Country */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">
                      Zip Code*
                    </label>
                    <input
                      type="text"
                      name="zip_code"
                      value={newAddress.zip_code}
                      onChange={handleInputChange}
                      onBlur={() => validateForm()}
                      className={`w-full border ${
                        newAddress.errors?.zip_code
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="ZIP CODE"
                      required
                      disabled={loading}
                    />
                    {newAddress.errors?.zip_code && (
                      <p className="mt-1 text-xs text-red-600 uppercase">
                        {newAddress.errors.zip_code}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1 uppercase">
                      Country*
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={newAddress.country}
                      onChange={handleInputChange}
                      onBlur={() => validateForm()}
                      className={`w-full border ${
                        newAddress.errors?.country
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase`}
                      placeholder="COUNTRY"
                      required
                      disabled={loading}
                    />
                    {newAddress.errors?.country && (
                      <p className="mt-1 text-xs text-red-600 uppercase">
                        {newAddress.errors.country}
                      </p>
                    )}
                  </div>
                </div>

                {/* Primary Address Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_primary"
                    name="is_primary"
                    checked={newAddress.is_primary}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label
                    htmlFor="is_primary"
                    className="ml-2 block text-sm text-gray-700 font-bold uppercase"
                  >
                    Set as primary address
                  </label>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressModal(false);
                      setNewAddress((prev) => ({
                        ...prev,
                        errors: {},
                      }));
                    }}
                    className="mr-3 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 uppercase"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-bold text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 uppercase"
                    disabled={
                      loading ||
                      Object.values(newAddress.errors || {}).some(
                        (error) => error
                      )
                    }
                  >
                    {loading ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Overview;