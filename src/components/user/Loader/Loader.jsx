import React, { useEffect, useState } from 'react';
import neoTokyoLogo from '../../../Images/LoginWith/neo_tokyo-logo.png';

export default function SimpleLoader() {
  const [dots, setDots] = useState('');
  
  // Animate the dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center h-64">
      <div className="relative">
        {/* Spinning border */}
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500" />
        
        {/* Non-spinning logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Using an imported image reference */}
          <img 
            src={neoTokyoLogo}
            alt="Neo Tokyo Logo" 
            className="h-16 w-16 object-contain"
          />
        </div>
      </div>
    </div>
  );
}