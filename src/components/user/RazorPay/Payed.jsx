import { useState, useEffect } from 'react';
import { CheckCircle, PartyPopper } from 'lucide-react';

export default function OrderConfirmationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [animation, setAnimation] = useState('');
  const [confetti, setConfetti] = useState(false);
  
  // Show the modal and animations after a short delay when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      setAnimation('animate-in');
      setTimeout(() => setConfetti(true), 300);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const closeModal = () => {
    setAnimation('animate-out');
    setConfetti(false);
    setTimeout(() => {
      setIsOpen(false);
      // Instead of using navigate, you can handle this in your parent component
      if (typeof window !== 'undefined') {
        window.location.href = "/products";
      }
    }, 500);
  };

  if (!isOpen) return null;

  // Generate confetti elements
  const confettiElements = [];
  if (confetti) {
    for (let i = 0; i < 20; i++) {
      const left = `${Math.random() * 100}%`;
      const animDelay = `${Math.random() * 0.5}s`;
      const color = i % 3 === 0 ? 'bg-green-500' : i % 3 === 1 ? 'bg-green-300' : 'bg-yellow-300';
      
      confettiElements.push(
        <div 
          key={i}
          className={`absolute w-2 h-2 rounded-full ${color} opacity-80`}
          style={{
            left,
            top: '-10px',
            animation: 'fall 3s linear forwards',
            animationDelay: animDelay
          }}
        />
      );
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-10px) rotate(0deg); }
          100% { transform: translateY(500px) rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
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
        .animate-success {
          animation: pulse 1s ease-in-out;
        }
      `}</style>
      
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden relative ${animation}`}
      >
        {/* Confetti container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confettiElements}
        </div>
        
        {/* Success icon */}
        <div className="flex justify-center pt-8">
          <div className="bg-green-100 rounded-full p-3 animate-pulse">
            <CheckCircle className="w-16 h-16 text-green-600" strokeWidth={1.5} />
          </div>
        </div>
        
        {/* Party popper icons */}
        <div className="absolute top-8 left-8 text-yellow-500" style={{ animation: 'bounce 2s infinite' }}>
          <PartyPopper size={24} />
        </div>
        <div className="absolute top-8 right-8 text-yellow-500" style={{ animation: 'bounce 2s infinite', animationDelay: '0.2s' }}>
          <PartyPopper size={24} />
        </div>
        
        {/* Success rings animation */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-32 h-32 rounded-full border-4 border-green-300 opacity-0" style={{ animation: 'ring-expand 2s ease-out infinite' }}></div>
          <div className="w-32 h-32 rounded-full border-4 border-green-400 opacity-0" style={{ animation: 'ring-expand 2s ease-out 0.5s infinite' }}></div>
        </div>
        
        {/* Content */}
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold mb-4 text-green-700">Order Confirmed!</h2>
          
          <div className="mb-6 bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="mb-2 text-gray-700">
              Thank you for your order. NEO TOKYO will contact you soon.
            </p>
            <p className="text-gray-600 text-sm">
              You'll receive a confirmation email with your order details shortly.
            </p>
          </div>
          
          <button
            onClick={closeModal}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-8 rounded-lg transition-colors duration-300 flex items-center justify-center mx-auto"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Close
          </button>
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