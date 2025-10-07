import { useState, useEffect } from 'react';

export default function NeoTokyo() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  
  useEffect(() => {
    // Initial expansion effect
    const expandTimer = setTimeout(() => {
      setIsExpanded(true);
    }, 500);
    
    // Start the endless possibilities animation after expansion
    const animationTimer = setTimeout(() => {
      setIsAnimated(true);
    }, 1500);
    
    return () => {
      clearTimeout(expandTimer);
      clearTimeout(animationTimer);
    };
  }, []);

  return (
    <div className="w-full h-screen relative flex items-center justify-center overflow-hidden px-4">
      {/* Main Neo Tokyo Text */}
      <div className="relative flex justify-center items-center">
        <h1 
          className={`text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold font-mono tracking-wider text-white 
            ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
            transition-all duration-1000 ease-out
             outline-none`}
        >
        
        </h1>
        
        {/* Tagline */}
        <div 
          className={`absolute -bottom-10 sm:-bottom-10 w-full text-center font-sans text-sm sm:text-base md:text-lg font-light tracking-wider sm:tracking-widest text-white
            ${isExpanded ? 'opacity-100' : 'opacity-0'}
            transition-opacity duration-1000 delay-500`}
        >
          
        </div>
      </div>
      
      {/* Endless Possibilities Text - Repositioned higher from bottom */}
      <div 
        className={`absolute bottom-16 sm:bottom-24 md:bottom-32 left-4 sm:left-8 font-serif text-sm sm:text-base md:text-lg text-white opacity-0
          ${isAnimated ? 'animate-pulse opacity-80' : ''}
          transition-opacity duration-1000`}
      >
       
      </div>
    </div>
  );
}