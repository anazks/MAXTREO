import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModernNavbar from '../NavBar/NavBar';
import ProductFooter from '../Footer/ProductFooter';

// Professional system images
const WorkstationImage = 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&h=600&fit=crop&crop=center';
const EnterpriseImage = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop&crop=center';
const ScientificImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop&crop=center';
const CustomImage = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center';

// Gaming system images
const EsportsImage = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop&crop=center';
const StreamingImage = 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=600&fit=crop&crop=center';
const VRImage = 'https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=800&h=600&fit=crop&crop=center';
const ConsoleImage = 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop&crop=center';

const logos = [
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg',
    'https://upload.wikimedia.org/wikipedia/commons/4/4f/Adobe_Premiere_Pro_Logo.svg',
    'https://upload.wikimedia.org/wikipedia/commons/0/0c/Blender_logo_no_text.svg',
    'https://upload.wikimedia.org/wikipedia/commons/c/c4/Unity_2021.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
    'https://upload.wikimedia.org/wikipedia/commons/2/21/Matlab_Logo.png',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unrealengine/unrealengine-original.svg',
    'https://upload.wikimedia.org/wikipedia/commons/d/d3/OBS_Studio_Logo.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
];

function Solutions() {
  const [activeSystem, setActiveSystem] = useState('professional');
  const [isMobile, setIsMobile] = useState(false);
  const [logoRotation, setLogoRotation] = useState(0);
  const [logoAnimation, setLogoAnimation] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    let intervalId, logoRotationId, logoAnimationId;
    
    if (!isMobile) {
      intervalId = setInterval(() => {
        setActiveSystem(prev => prev === 'professional' ? 'gaming' : 'professional');
      }, 5000);
      
      logoRotationId = setInterval(() => {
        setLogoRotation(prev => prev + 0.5);
      }, 50);
    } else {
      // Mobile logo animation
      logoAnimationId = setInterval(() => {
        setLogoAnimation(prev => prev + 1);
      }, 100);
    }
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (intervalId) clearInterval(intervalId);
      if (logoRotationId) clearInterval(logoRotationId);
      if (logoAnimationId) clearInterval(logoAnimationId);
    };
  }, [isMobile]);

  const systemsData = {
    professional: [
      {
        id: 'workstation',
        name: 'WORKSTATION',
        image: WorkstationImage,
        description: 'High-performance workstations for professional users',
        subtext: 'Optimized for content creation, 3D rendering, and video editing'
      },
      {
        id: 'enterprise',
        name: 'ENTERPRISE',
        image: EnterpriseImage,
        description: 'Scalable infrastructure for business applications',
        subtext: 'Reliable servers and networking solutions for any scale operation'
      },
      {
        id: 'scientific',
        name: 'SCIENTIFIC',
        image: ScientificImage,
        description: 'Computing solutions for research and analysis',
        subtext: 'High-performance computing for complex simulations and data processing'
      },
      {
        id: 'custom',
        name: 'CUSTOM',
        image: CustomImage,
        description: 'Tailored solutions for specialized needs',
        subtext: 'Bespoke configurations designed to your exact specifications'
      }
    ],
    gaming: [
      {
        id: 'esports',
        name: 'ESPORTS',
        image: EsportsImage,
        description: 'Competition-ready systems with ultra-low latency',
        subtext: 'Preferred by professional gamers worldwide'
      },
      {
        id: 'streaming',
        name: 'STREAMING',
        image: StreamingImage,
        description: 'Optimized for gaming and content creation',
        subtext: 'Multi-task without compromising performance'
      },
      {
        id: 'vr',
        name: 'VR READY',
        image: VRImage,
        description: 'Immersive virtual reality experiences',
        subtext: 'High-performance systems for smooth VR gaming'
      },
      {
        id: 'console',
        name: 'CONSOLE+',
        image: ConsoleImage,
        description: 'The power of PC with console convenience',
        subtext: 'Plug-and-play systems for the living room'
      }
    ]
  };

  const activeContent = {
    professional: {
      title: "PROFESSIONAL",
      subtitle: "SYSTEMS",
      description: "Expertly crafted computing solutions for every need",
      bgColor: "bg-gradient-to-br from-slate-900 to-gray-800",
      mobileBg: "bg-gradient-to-br from-slate-900 via-blue-900 to-gray-800"
    },
    gaming: {
      title: "GAMING",
      subtitle: "SYSTEMS",
      description: "Cutting-edge performance for the ultimate gaming experience",
      bgColor: "bg-gradient-to-br from-purple-900 to-blue-800",
      mobileBg: "bg-gradient-to-br from-purple-900 via-pink-800 to-blue-800"
    }
  };

  // Enhanced Mobile/Tablet Layout
  if (isMobile) {
    return (
      <>   
        <div className="w-full bg-gray-50 flex flex-col overflow-hidden" 
          style={{
            width:"97vw", 
            height:"97vh", 
            backgroundColor: "yellow",
            fontFamily: "'Rajdhani', sans-serif",
            borderRadius: '30px',
          }}>
          {/* Hero Banner Section */}
          <div className={`flex-none h-64 relative overflow-hidden ${activeContent[activeSystem].mobileBg} transition-all duration-1000`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"></div>
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-transparent transform skew-x-12"></div>
            </div>
            
            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              {/* Top Section */}
              <div>
                <h1 className="text-white mb-2">
                  <div className="text-3xl font-black leading-none">{activeContent[activeSystem].title}</div>
                  <div className="text-3xl font-black leading-none text-gray-300">{activeContent[activeSystem].subtitle}</div>
                </h1>
                <p className="text-gray-200 text-sm max-w-xs leading-relaxed">
                  {activeContent[activeSystem].description}
                </p>
              </div>

              {/* System Toggle Buttons */}
              <div className="flex gap-3">
                <button
                  className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 flex-1 backdrop-blur-sm ${
                    activeSystem === 'professional' 
                      ? 'bg-white/20 text-white border-2 border-white/30 shadow-lg transform scale-105' 
                      : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white'
                  }`}
                  onClick={() => setActiveSystem('professional')}
                >
                  Professional
                </button>
                <button
                  className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 flex-1 backdrop-blur-sm ${
                    activeSystem === 'gaming' 
                      ? 'bg-white/20 text-white border-2 border-white/30 shadow-lg transform scale-105' 
                      : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white'
                  }`}
                  onClick={() => setActiveSystem('gaming')}
                >
                  Gaming
                </button>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm animate-pulse"></div>
            <div className="absolute bottom-20 right-8 w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm animate-bounce"></div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Systems Section */}
            <div className="flex-1 flex flex-col min-h-0 bg-white">
              <div className="flex-none px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Our Systems</h2>
                <p className="text-gray-600 text-sm">Choose your perfect setup</p>
              </div>
              
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <div className="grid grid-cols-1 gap-4">
                  {systemsData[activeSystem].map((system, index) => (
                    <div 
                      key={system.id} 
                      className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-gray-200"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: 'fadeInUp 0.6s ease-out forwards'
                      }}
                    >
                      <div 
                        className="h-32 bg-cover bg-center relative overflow-hidden"
                        style={{ backgroundImage: `url(${system.image})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-bold text-lg group-hover:text-xl transition-all duration-300 transform group-hover:translate-y-[-2px]">
                            {system.name}
                          </h3>
                        </div>
                        
                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-br from-white to-gray-50 group-hover:from-gray-50 group-hover:to-white transition-all duration-300">
                        <p className="text-gray-800 font-semibold mb-2 text-sm group-hover:text-gray-900 transition-colors">
                          {system.description}
                        </p>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {system.subtext}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Apps Section */}
            <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
              <div className="flex-none px-4 py-3 bg-gradient-to-r from-white via-indigo-50 to-purple-50 border-b border-indigo-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Machine for every app
                </h2>
                <p className="text-gray-600 text-sm">High-performance desktops for every program</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {/* Animated Logo Grid */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                  {logos.slice(0, 16).map((logo, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-3 relative overflow-hidden group"
                      style={{
                        animationDelay: `${i * 50}ms`,
                        transform: `translateY(${Math.sin(logoAnimation * 0.02 + i) * 3}px) rotate(${Math.sin(logoAnimation * 0.01 + i) * 2}deg)`,
                        transition: 'transform 0.1s ease-out'
                      }}
                    >
                      {/* Background Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-purple-500/0 group-hover:from-blue-400/10 group-hover:to-purple-500/10 transition-all duration-300 rounded-xl"></div>
                      
                      <img
                        src={logo}
                        alt="app-logo"
                        className="w-8 h-8 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center text-white text-xs font-bold relative z-10">APP</div>';
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Enhanced CTA Section */}
                <div className="bg-gradient-to-r from-white via-indigo-50 to-purple-50 rounded-2xl p-6 text-center shadow-lg border border-indigo-100 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent transform rotate-45"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="font-bold text-gray-800 mb-3 text-lg">Ready to get started?</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      Discover the perfect system for your needs
                    </p>
                    <Link 
                      to="/store" 
                      className="inline-block bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-2xl font-bold hover:from-red-600 hover:to-pink-600 transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
                    >
                      Explore App Store →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Custom CSS for animations */}
          <style jsx>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      </>
    );
  }

  // Desktop Layout
  return (
    <>
      <ModernNavbar/>
      <br /><br /><br />
      <div className="w-full min-h-screen bg-white overflow-x-hidden" style={{
          width:"97vw", 
          height:"95vh", 
          fontFamily: "'Rajdhani', sans-serif",
          borderRadius: "30px"
        }}>
        {/* Desktop Carousel Section */}
        <div className="w-full overflow-visible py-6 lg:py-10">
          <div className="font-sans w-[95%] lg:w-[90%] mx-auto overflow-visible relative">
            <div className={`relative w-full h-[280px] lg:h-[350px] ${activeContent[activeSystem].bgColor} overflow-visible rounded-[20px] lg:rounded-[30px] mb-[60px] lg:mb-[100px] pt-[40px] lg:pt-[80px] transition-all duration-1000`}>
              {/* Banner Content */}
              <div className="absolute top-0 left-0 p-4 lg:p-8 z-10">
                <h1 className="flex flex-col text-white m-0 leading-none">
                  <span className="text-3xl lg:text-5xl font-black transition-all duration-500">
                    {activeContent[activeSystem].title}
                  </span>
                  <span className="text-3xl lg:text-5xl text-gray-400 font-black transition-all duration-500">
                    {activeContent[activeSystem].subtitle}
                  </span>
                </h1>
                <p className="text-gray-300 mt-2 lg:mt-4 max-w-md text-sm lg:text-lg">
                  {activeContent[activeSystem].description}
                </p>
                
                {/* System Type Indicator */}
                <div className="flex space-x-2 lg:space-x-3 mt-3 lg:mt-6">
                  <div 
                    className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full cursor-pointer transition-all duration-300 ${
                      activeSystem === 'professional' ? 'bg-white scale-125 shadow-lg' : 'bg-gray-500 hover:bg-gray-400'
                    }`}
                    onClick={() => setActiveSystem('professional')}
                  ></div>
                  <div 
                    className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full cursor-pointer transition-all duration-300 ${
                      activeSystem === 'gaming' ? 'bg-white scale-125 shadow-lg' : 'bg-gray-500 hover:bg-gray-400'
                    }`}
                    onClick={() => setActiveSystem('gaming')}
                  ></div>
                </div>
              </div>
              
              {/* Desktop System Panels */}
              <div className="absolute bottom-0 right-0 h-[200px] lg:h-[300px] w-[75%] lg:w-[70%] flex skew-x-[-8deg] lg:skew-x-[-10deg] overflow-visible items-end gap-1 lg:gap-2">
                {systemsData[activeSystem].map((system, index) => (
                  <div 
                    key={system.id}
                    className="flex-1 h-full relative overflow-hidden bg-cover bg-center transition-all duration-700 ease-out shadow-lg cursor-pointer hover:h-[250px] lg:hover:h-[380px] hover:scale-105 hover:z-20 group"
                    style={{ 
                      backgroundImage: `url(${system.image})`,
                      transitionDelay: `${index * 100}ms`
                    }}
                  >
                    <div className="absolute w-full h-full flex items-end p-3 lg:p-6 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300">
                      <div className="w-full transform skew-x-[8deg] lg:skew-x-[10deg]">
                        <span className="text-white font-bold text-sm lg:text-xl opacity-90 group-hover:opacity-100 group-hover:text-lg lg:group-hover:text-2xl transition-all duration-300 block mb-1 lg:mb-2">
                          {system.name}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <p className="text-white text-xs lg:text-sm mb-1">
                            {system.description}
                          </p>
                          <p className="text-gray-300 text-xs">
                            {system.subtext}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop Apps Section */}
        <div className="w-[95%] lg:w-[90%] h-[280px] lg:h-[350px] bg-white mx-auto my-3 lg:my-5 rounded-[20px] lg:rounded-[30px] relative flex items-center justify-between px-4 lg:px-8 overflow-hidden shadow-lg">
          {/* Left Side */}
          <div className="w-1/2 text-black space-y-2 lg:space-y-4 z-10">
            <h1 className="text-2xl lg:text-4xl font-bold text-gray-900">Machine for every app</h1>
            <p className="text-sm lg:text-lg text-gray-600 leading-relaxed">
              We make high-performance desktops for every program and application.
            </p>
            <Link to="/store" className="inline-block text-red-500 underline font-semibold hover:text-red-600 transition-colors text-sm lg:text-base">
              Explore App Store →
            </Link>
          </div>

          {/* Right Side - Animated Spiral logos */}
          <div className="w-1/2 h-full relative flex items-center justify-center overflow-hidden">
            {/* Central Logo */}
            <div className="absolute z-20 w-12 h-12 lg:w-20 lg:h-20 bg-white rounded-full flex items-center justify-center shadow-xl border-2 lg:border-4 border-gray-100">
              <div className="w-8 h-8 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm lg:text-xl">PC</span>
              </div>
            </div>
            
            {/* Spiral Container */}
            <div 
              className="relative w-[240px] h-[240px] lg:w-[320px] lg:h-[320px] transition-transform duration-75 ease-linear"
              style={{ transform: `rotate(${logoRotation}deg)` }}
            >
              {logos.map((logo, i) => {
                const layer = Math.floor(i / 7);
                const posInLayer = i % 7;
                const angle = (posInLayer / 7) * 2 * Math.PI + (layer * 0.4);
                const baseRadius = 50 + (layer * 30);
                const radius = baseRadius + Math.sin(logoRotation * 0.02 + i) * 8;
                
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                
                const opacity = Math.max(0.4, 1 - (layer * 0.15));
                
                return (
                  <div
                    key={i}
                    className="absolute w-8 h-8 lg:w-12 lg:h-12 bg-white rounded-lg lg:rounded-xl shadow-md lg:shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-125 hover:shadow-xl hover:z-10 border border-gray-100"
                    style={{
                      top: `calc(50% + ${y}px - 16px)`,
                      left: `calc(50% + ${x}px - 16px)`,
                      opacity: opacity,
                      transform: `rotate(-${logoRotation}deg) scale(${0.9 + Math.sin(logoRotation * 0.01 + i) * 0.1})`,
                    }}
                  >
                    <img
                      src={logo}
                      alt="app-logo"
                      className="w-5 h-5 lg:w-8 lg:h-8 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">APP</div>';
                      }}
                    />
                  </div>
                );
              })}
            </div>
            
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-purple-500/5 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </div>
        </div>
      </div>
      <ProductFooter/>
    </>
  );
}

export default Solutions;