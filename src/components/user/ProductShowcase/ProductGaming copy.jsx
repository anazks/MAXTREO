import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import NavBar from '../NavBar/NavBar'
import Footer from '../Footer/ProductFooter'
import product_gaming from '../../../Images/product_gaming.png'

export default function GamingPCShowcase() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 relative overflow-hidden">
      <NavBar/>
      
      {/* Large Background Text - Below product content */}
      <div className="absolute left-0 right-0 overflow-hidden pointer-events-none z-0" style={{bottom:"50px"}} >
        <div className="text-[8rem] md:text-[12rem] lg:text-[16rem] xl:text-[20rem] font-black text-gray-200 opacity-15 text-center select-none" style={{marginBottom:"50px"}}>
          SPECTRE
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-80px)] relative z-10" style={{width:"90%", margin:"auto", marginBottom:"50px"}}>
        {/* Left Side Navigation */}
        <div className="hidden lg:flex flex-col justify-center items-center w-20 relative z-10">
          <div className="flex flex-col space-y-4 mb-8">
            <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
            <div className="w-3 h-3 border-2 border-white/50 rounded-full backdrop-blur-sm"></div>
            <div className="w-3 h-3 border-2 border-white/50 rounded-full backdrop-blur-sm"></div>
            <div className="w-3 h-3 border-2 border-white/50 rounded-full backdrop-blur-sm"></div>
          </div>
          
          {/* Vertical GAMING Text */}
          <div className="flex flex-col items-center space-y-2">
            {['G', 'A', 'M', 'I', 'N', 'G'].map((letter, index) => (
              <span 
                key={index} 
                className="text-4xl xl:text-5xl font-black text-gray-900 tracking-wider"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content Container */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 lg:px-8 xl:px-16 py-8 lg:py-16">
          
          {/* PC Image Section */}
          <div className="flex-1 flex justify-center items-center relative mb-8 lg:mb-0">
            <div 
              className="relative transform transition-all duration-700 ease-out"
              style={{
                transform: isHovered 
                  ? `scale(1.05) rotateY(${(mousePosition.x - 0.5) * 10}deg) rotateX(${(mousePosition.y - 0.5) * -10}deg)`
                  : 'scale(1) rotateY(0deg) rotateX(0deg)'
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseMove={handleMouseMove}
            >
              {/* Floating Base Ring */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-80 md:w-96 h-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-full opacity-40 blur-lg animate-pulse"></div>
              
              {/* PC Image */}
              <div className="relative w-64 md:w-80 lg:w-96 h-80 md:h-96 lg:h-[450px]">
                <img src={product_gaming} alt="Gaming PC" className="w-full h-full object-contain" />
              </div>

              {/* Ambient Glow */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-3xl opacity-20 -z-10 transition-all duration-700"
                style={{
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                  opacity: isHovered ? 0.4 : 0.2
                }}
              ></div>
            </div>
          </div>

          {/* Product Information */}
          <div className="flex-1 max-w-md lg:max-w-lg space-y-6 text-center lg:text-left">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 mb-4 lg:mb-6">
                The Spectre
              </h1>
              
              <div className="space-y-1 text-gray-800 text-sm md:text-base">
                <p>Intel Core i7 1400K - 5.0GHz Max Clock</p>
                <p>Nvidia RTX 4070Ti - 8GB DDR6 VRAM</p>
                <p>Corsair Vengeance DDR5 - 16GB</p>
                <p>Samsung 970 Evo Pro - 1TB</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <span className="text-xl md:text-2xl text-gray-600 line-through">₹2,77,990</span>
                <span className="text-3xl font-bold text-purple-600">₹2,57,990</span>
              </div>
              
              <button 
                className="flex-1 bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile GAMING text */}
      <div className="lg:hidden absolute top-1/2 left-4 transform -translate-y-1/2 -rotate-90 origin-center z-10">
        <span className="text-2xl md:text-3xl font-black text-gray-900 tracking-widest">GAMING</span>
      </div>
<div style={{marginBottom:"150px"}}></div>
      <Footer/>
    </div>
  );
}