import React, { useState, useEffect } from 'react';
import { XCircle, AlertTriangle } from 'lucide-react';

export default function PaymentFailedModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [animation, setAnimation] = useState('');
  
  // Show the modal and animations after a short delay when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      setAnimation('animate-in');
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => {
    setAnimation('animate-out');
    setTimeout(() => {
      setIsOpen(false);
      if (typeof window !== 'undefined') {
        window.location.href = "/products"; // Redirect back to checkout
      }
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-out {
          animation: fadeOut 0.5s ease-in forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(20px); }
        }
        .animate-error {
          animation: shake 0.5s ease-in-out, pulse 1s 0.5s ease-in-out;
        }
      `}</style>
      
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden relative ${animation}`}
      >
        {/* Error icon */}
        <div className="flex justify-center pt-8">
          <div className="bg-red-100 rounded-full p-3 animate-error">
            <XCircle className="w-16 h-16 text-red-600" strokeWidth={1.5} />
          </div>
        </div>
        
        {/* Warning icons */}
        <div className="absolute top-8 left-8 text-yellow-500">
          <AlertTriangle size={24} />
        </div>
        <div className="absolute top-8 right-8 text-yellow-500">
          <AlertTriangle size={24} />
        </div>
        
        {/* Error rings animation */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-32 h-32 rounded-full border-4 border-red-300 opacity-0" style={{ animation: 'ring-expand 2s ease-out infinite' }}></div>
          <div className="w-32 h-32 rounded-full border-4 border-red-400 opacity-0" style={{ animation: 'ring-expand 2s ease-out 0.5s infinite' }}></div>
        </div>
        
        {/* Content */}
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-700">Payment Failed!</h2>
          
          <div className="mb-6 bg-red-50 p-4 rounded-lg border border-red-100">
            <p className="mb-2 text-gray-700">
              We couldn't process your payment. Please try again.
            </p>
            <p className="text-gray-600 text-sm">
              If the problem persists, contact your bank or try a different payment method.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={closeModal}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Try Again
            </button>
            <button
              onClick={() => window.location.href = "/contact"}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Need Help?
            </button>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes ring-expand {
            0% { transform: scale(0.5); opacity: 0.7; }
            100% { transform: scale(2); opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}