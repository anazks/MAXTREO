import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import RenderRazorpay from "../RazorPay/RenderRazorpay";
import { MakeRepayment } from "../../../Services/userApi";

const OrderRepay = ({ orderId, orderAmount, onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayRazorpay, setDisplayRazorpay] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});

  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!orderId) {
      setError("Order ID is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await MakeRepayment(orderId);
      const { data } = response;
      console.log("Payment response:", data);
      setOrderDetails(data);

      setDisplayRazorpay(true);
    } catch (error) {
      setError("Payment failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setDisplayRazorpay(false);
    if (onSuccess) {
      onSuccess();
    } else {
      navigate("/myorders");
    }
  };

  const handlePaymentFailure = () => {
    setDisplayRazorpay(false);
    setError("Payment was not successful. Please try again.");
  };

  return (
    <>
      {/* Payment Gateway */}
      {displayRazorpay && (
        <RenderRazorpay
          orderDetails={orderDetails}
          setDisplayRazorpay={setDisplayRazorpay}
        />
      )}

      {/* Repayment Section */}
      <motion.div
        className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
              <span className="text-sm font-semibold text-amber-800">
                Payment Pending
              </span>
            </div>
            <p className="text-sm text-amber-700 mb-3">
              Your payment for this order is pending. Complete the payment to confirm your order.
            </p>
            {orderAmount && (
              <p className="text-sm font-medium text-amber-800">
                Amount: ₹ {orderAmount.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 ml-4">
            <motion.button
              className={`px-6 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green-600 hover:bg-green-700 text-white hover:shadow-md"
              }`}
              onClick={handlePayment}
              disabled={isLoading}
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Complete Payment"
              )}
            </motion.button>

            {onCancel && (
              <button
                className="px-6 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {error && (
          <motion.div
            className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <p className="text-sm text-red-600">{error}</p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
};

// Alternative compact button version for inline use
export const RepayButton = ({ orderId, orderAmount, className = "" }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [displayRazorpay, setDisplayRazorpay] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    amount: 0,
    currency: "INR",
    orderId: null,
    keyId: null,
    razorpayOrderId: null,
  });

  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      const response = await MakeRepayment(orderId);
      const { data } = response;

      setOrderDetails({
        razorpayOrderId: data.raz_order_id,
        currency: data.currency,
        amount: data.amount,
        keyId: data.key,
      });

      setDisplayRazorpay(true);
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {displayRazorpay && (
        <RenderRazorpay
          orderDetails={orderDetails}
          setDisplayRazorpay={setDisplayRazorpay}
          onSuccess={() => {
            setDisplayRazorpay(false);
            navigate("/myorders");
          }}
          onFailure={() => setDisplayRazorpay(false)}
        />
      )}

      <motion.button
        className={`px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md transition-colors ${className}`}
        onClick={handlePayment}
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isLoading ? (
          <div className="flex items-center">
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          "Pay Now"
        )}
      </motion.button>
    </>
  );
};

export default OrderRepay;