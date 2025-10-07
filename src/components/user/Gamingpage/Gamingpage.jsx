import { useState, useEffect, useRef } from 'react';

// Import images
import gameImg from '../../../Images/Valorant Game - Clove asset.jpg';
import GameImg2 from '../../../Images/game2.png';
import GameImg3 from '../../../Images/game3.png';
import GameImg4 from '../../../Images/gane4.png';
import pro1 from '../../../Images/pro1.jpg';
import pro2 from '../../../Images/LoginWith/Loginbg.jpg';
import pro3 from '../../../Images/pro3.jpg';
import pro4 from '../../../Images/pro4.jpg';

export default function GamingPage() {
  const gamingImages = [gameImg, GameImg2, GameImg3, GameImg4];
  const proImages = [pro1, pro2, pro3, pro4];
  
  const [isGaming, setIsGaming] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const autoplayTimerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const gamingSpecs = [
    { title: "RTX Gaming", icon: "🎮", desc: "Ultimate gaming performance" },
    { title: "AMD Powered", icon: "⚡", desc: "High-end processing" },
    { title: "Pro Graphics", icon: "🖥️", desc: "Immersive visual experience" },
    { title: "16GB RAM", icon: "💾", desc: "Smooth multitasking" },
    { title: "VR Ready", icon: "🥽", desc: "Ultimate immersion" },
      { title: "16GB RAM", icon: "💾", desc: "Smooth multitasking" },
    { title: "VR Ready", icon: "🥽", desc: "Ultimate immersion" },
      { title: "16GB RAM", icon: "💾", desc: "Smooth multitasking" },
    { title: "VR Ready", icon: "🥽", desc: "Ultimate immersion" }
  ];

  const proSpecs = [
    { title: "Intel Core i9", icon: "💻", desc: "Professional grade CPU" },
    { title: "32GB DDR5", icon: "🧠", desc: "Workstation performance" },
    { title: "CAD Ready", icon: "📐", desc: "3D Modeling optimized" },
    { title: "4TB Storage", icon: "💽", desc: "Massive file capacity" },
    { title: "Multi-Display", icon: "🖥️", desc: "Productivity enhancement" },
    { title: "CAD Ready", icon: "📐", desc: "3D Modeling optimized" },
    { title: "4TB Storage", icon: "💽", desc: "Massive file capacity" },
    { title: "Multi-Display", icon: "🖥️", desc: "Productivity enhancement" }
  ];

  const toggleSystemType = () => {
    setIsGaming(prev => !prev);
    setActiveImageIndex(0);
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const nextImage = () => {
    setActiveImageIndex(prev => (prev + 1) % (isGaming ? gamingImages.length : proImages.length));
  };

  const prevImage = () => {
    setActiveImageIndex(prev => (prev - 1 + (isGaming ? gamingImages.length : proImages.length)) % (isGaming ? gamingImages.length : proImages.length));
  };

  const startAutoplay = () => {
    if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    autoplayTimerRef.current = setInterval(() => {
      nextImage();
    }, 3000);
  };

  const stopAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoplay) setIsGaming(prev => !prev);
    }, 8000);

    return () => clearInterval(interval);
  }, [isAutoplay]);

  useEffect(() => {
    if (isAutoplay) {
      startAutoplay();
    }
    return () => stopAutoplay();
  }, [isGaming, isAutoplay, activeImageIndex]);

  const currentImages = isGaming ? gamingImages : proImages;
  const currentSpecs = isGaming ? gamingSpecs : proSpecs;

  return (
    <div className={`w-full mx-auto p-3 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl flex flex-col font-sans relative overflow-hidden transition-all duration-300`} 
        style={{
        width: "98vw", 
        height: "95vh",
        borderRadius: "30px"}}>
      
      {/* System Toggle - Fixed at top */}
      <div className="flex justify-center gap-2 mb-3 w-full z-10 flex-wrap">
        <button 
          className={`py-2 px-4 border-none rounded-full text-sm ${isGaming ? 'bg-gray-900 text-white shadow-lg transform -translate-y-1' : `${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-800'}`} font-semibold cursor-pointer transition-all duration-300 flex items-center gap-1 hover:bg-gray-800 hover:text-white`}
          onClick={() => setIsGaming(true)}
        >
          <span className="text-sm">🎮</span> Gaming Systems
        </button>
        <button 
          className={`py-2 px-4 border-none rounded-full text-sm ${!isGaming ? 'bg-gray-900 text-white shadow-lg transform -translate-y-1' : `${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-800'}`} font-semibold cursor-pointer transition-all duration-300 flex items-center gap-1 hover:bg-gray-800 hover:text-white`}
          onClick={() => setIsGaming(false)}
        >
          <span className="text-sm">💻</span> Professional Systems
        </button>
        
        {/* Theme Toggle */}
        {/* <button 
          className={`ml-2 py-2 px-4 border-none rounded-full text-sm ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'} font-semibold cursor-pointer transition-all duration-300 flex items-center gap-1 hover:bg-gray-800 hover:text-white`}
          onClick={toggleTheme}
        >
          <span className="text-sm">{isDarkMode ? '☀️' : '🌙'}</span> {isDarkMode ? 'Light' : 'Dark'}
        </button> */}
      </div>

      {/* Main Content Area - Takes remaining space */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Banner First Row - Takes more space */}
        <div 
          className={`w-full rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-900'} flex flex-col justify-between items-center p-3 relative overflow-hidden mb-3`}
          style={{
            backgroundImage: "linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
            height: '40%',
            minHeight: '250px'
          }}
        >
          {/* Heading */}
          <div className="w-full flex flex-col justify-center items-center relative z-2 p-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-2 text-center">
              {isGaming ? "GAMING SYSTEMS" : "PROFESSIONAL SYSTEMS"}
            </h1>
            <p className="text-xs md:text-sm lg:text-base text-gray-300 mb-3 text-center">
              {isGaming 
                ? "Built for ultimate gaming performance"
                : "Designed for professional workloads"
              }
            </p>
            <button 
              className={`py-1 px-4 border-none rounded-full ${isGaming ? 'bg-blue-500 hover:bg-blue-600' : 'bg-orange-500 hover:bg-orange-600'} text-white font-semibold text-xs sm:text-sm cursor-pointer transition-all duration-300 flex items-center gap-1 shadow-lg transform hover:scale-105`}
            >
              <span className="text-xs sm:text-sm">🛒</span> Explore Now
            </button>
          </div>

          {/* Image Carousel - Takes more space */}
          <div className="w-full h-3/5 relative z-2 flex items-center justify-center">
            <button 
              className="absolute top-1/2 -translate-y-1/2 left-1 w-8 h-8 rounded-full bg-black bg-opacity-50 border-none text-white text-sm flex items-center justify-center cursor-pointer z-10 transition-all duration-300 hover:bg-opacity-70"
              onClick={prevImage}
            >
              ❮
            </button>
            
            <div className="w-full h-full relative overflow-hidden">
              <div
                className="w-full h-full relative overflow-hidden rounded-lg shadow-xl transition-all duration-300 hover:transform hover:scale-[1.02]"
                onMouseEnter={() => setIsAutoplay(false)}
                onMouseLeave={() => setIsAutoplay(true)}
              >
                <img 
                  src={currentImages[activeImageIndex]}
                  alt={isGaming ? `Gaming System ${activeImageIndex + 1}` : `Professional System ${activeImageIndex + 1}`}
                  className="w-full h-full object-cover rounded-lg transition-all duration-600 hover:scale-105"
                  style={{ objectPosition: 'center top' }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent text-white text-xs font-medium opacity-0 translate-y-5 transition-all duration-300 flex items-center gap-1 rounded-b-lg hover:opacity-100 hover:translate-y-0">
                  <span className="text-xs">ℹ️</span> Learn More
                </div>
              </div>
            </div>
            
            <button 
              className="absolute top-1/2 -translate-y-1/2 right-1 w-8 h-8 rounded-full bg-black bg-opacity-50 border-none text-white text-sm flex items-center justify-center cursor-pointer z-10 transition-all duration-300 hover:bg-opacity-70"
              onClick={nextImage}
            >
              ❯
            </button>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mb-2">
          {currentImages.map((_, index) => (
            <button 
              key={index} 
              className={`w-2 h-2 rounded-full border-none ${activeImageIndex === index ? isGaming ? 'bg-blue-500 transform scale-125' : 'bg-orange-500 transform scale-125' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} cursor-pointer transition-all duration-300`}
              onClick={() => setActiveImageIndex(index)}
            />
          ))}
        </div>

        {/* Featured Banner */}
        <div className={`w-full rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} p-3 mb-3 flex items-center justify-between`}>
          <div className="flex items-center">
            <span className="text-lg mr-2">{isGaming ? '🏆' : '⭐'}</span>
            <span className="text-sm font-medium">{isGaming ? 'Featured Gaming Build' : 'Featured Workstation'}</span>
          </div>
          <button className={`text-xs py-1 px-3 rounded-full ${isGaming ? 'bg-blue-500 hover:bg-blue-600' : 'bg-orange-500 hover:bg-orange-600'} text-white`}>
            View Details
          </button>
        </div>

        {/* Mobile Scrollable Specs Row */}
        <div className={`w-full relative ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg mb-3 p-2 flex-1 min-h-[120px]`}>
          {/* Scroll Controls for Mobile - Only visible on small screens */}
          <div className="flex justify-between absolute top-1/2 -translate-y-1/2 left-0 right-0 z-10 sm:hidden">
            <button 
              onClick={scrollLeft}
              className="w-6 h-6 ml-1 rounded-full bg-black bg-opacity-40 border-none text-white flex items-center justify-center"
            >
              ❮
            </button>
            <button 
              onClick={scrollRight}
              className="w-6 h-6 mr-1 rounded-full bg-black bg-opacity-40 border-none text-white flex items-center justify-center"
            >
              ❯
            </button>
          </div>
          
          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-2 py-2 px-1 w-full h-full items-stretch"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {currentSpecs.map((spec, index) => (
              <div 
                key={index} 
                className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg flex-shrink-0 flex flex-col items-center justify-center p-3 transition-all duration-300 shadow-sm hover:shadow-lg text-center snap-start w-36`}
              >
                <div className={`text-2xl mb-2 ${isGaming ? 'text-blue-500' : 'text-orange-500'}`}>
                  {spec.icon}
                </div>
                <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} transition-colors duration-300`}>{spec.title}</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-tight transition-colors duration-300`}>{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Larger Screen Grid Layout - Hidden on mobile, visible on larger screens */}
        <div 
          className={`w-full rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} hidden md:flex justify-center items-center p-4 shadow-md transition-all duration-300 mb-3`}
          style={{height: '20%'}}
        >
          <div className="w-full h-full grid grid-cols-5 gap-3">
            {currentSpecs.map((spec, index) => (
              <div 
                key={index} 
                className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-lg flex flex-col items-center justify-center p-3 transition-all duration-300 shadow-sm hover:transform hover:-translate-y-1 hover:shadow-lg text-center h-full`}
              >
                <div className={`text-2xl mb-2 ${isGaming ? 'text-blue-500' : 'text-orange-500'}`}>
                  {spec.icon}
                </div>
                <h3 className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'} transition-colors duration-300`}>{spec.title}</h3>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed transition-colors duration-300`}>{spec.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center mt-auto pt-2">
          <button className={`text-xs py-1 px-3 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-300`}>
            Support
          </button>
          <div className="flex gap-2">
            <button className={`w-8 h-8 flex items-center justify-center rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-300`}>
              📱
            </button>
            <button className={`w-8 h-8 flex items-center justify-center rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-300`}>
              📧
            </button>
            <button className={`w-8 h-8 flex items-center justify-center rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-300`}>
              ⚙️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}