import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import UpdatedNew from './UpdatedNew';

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
    // 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/godot/godot-original.svg',
    // 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    // 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
];

// Bottom row data
const bottomRowData = [
  { id: 1, title: 'Performance', icon: '⚡' },
  { id: 2, title: 'Design', icon: '🎨' },
  { id: 3, title: 'Gaming', icon: '🎮' },
  { id: 4, title: 'Business', icon: '💼' },
  { id: 5, title: 'Creative', icon: '✨' },
  { id: 6, title: 'Security', icon: '🔒' },
  { id: 7, title: 'Support', icon: '🛠️' }
];

function Solutions() {
  const [activeSystem, setActiveSystem] = useState('professional');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [logoRotation, setLogoRotation] = useState(0);
  const [logoAnimation, setLogoAnimation] = useState(0);
  const [hoveredPanel, setHoveredPanel] = useState(null);
  const [hoveredBottomBox, setHoveredBottomBox] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkViewport();
    window.addEventListener('resize', checkViewport);

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
      window.removeEventListener('resize', checkViewport);
      if (intervalId) clearInterval(intervalId);
      if (logoRotationId) clearInterval(logoRotationId);
      if (logoAnimationId) clearInterval(logoAnimationId);
    };
  }, [isMobile]);

  // Effect to rotate images in mobile banner
  useEffect(() => {
    if (isMobile) {
      const intervalId = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % systemsData[activeSystem].length);
      }, 3000);
      return () => clearInterval(intervalId);
    }
  }, [isMobile, activeSystem]);

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
      mobileBg: "bg-gradient-to-br from-slate-900/80 via-blue-900/80 to-gray-800/80"
    },
    gaming: {
      title: "GAMING",
      subtitle: "SYSTEMS",
      description: "Cutting-edge performance for the ultimate gaming experience",
      bgColor: "bg-gradient-to-br from-purple-900 to-blue-800",
      mobileBg: "bg-gradient-to-br from-purple-900/80 via-pink-800/80 to-blue-800/80"
    }
  };

  // Bottom Row Component
  const BottomRow = () => (
    <div className="w-full mt-4 px-2">
      <div className="flex gap-2 md:gap-3 lg:gap-4 justify-center items-center">
        {bottomRowData.map((item, index) => (
          <div
            key={item.id}
            className={`
              flex-1 max-w-[120px] md:max-w-[140px] lg:max-w-[160px]
              bg-black text-white 
              rounded-lg md:rounded-xl lg:rounded-2xl 
              p-2 md:p-3 lg:p-4
              flex flex-col items-center justify-center
              cursor-pointer
              transition-all duration-300 ease-out
              hover:bg-gray-800 hover:scale-105 hover:shadow-xl
              transform hover:-translate-y-1
              group
              ${hoveredBottomBox === item.id ? 'bg-gray-800 scale-105 shadow-xl -translate-y-1' : ''}
            `}
            onMouseEnter={() => setHoveredBottomBox(item.id)}
            onMouseLeave={() => setHoveredBottomBox(null)}
            style={{
              minHeight: isMobile ? '60px' : isTablet ? '70px' : '80px',
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className={`
              text-lg md:text-xl lg:text-2xl mb-1 md:mb-2
              transition-all duration-300
              group-hover:scale-110 group-hover:rotate-12
            `}>
              {item.icon}
            </div>
            <span className={`
              text-xs md:text-sm lg:text-base font-semibold text-center
              transition-all duration-300
              group-hover:text-white
              ${hoveredBottomBox === item.id ? 'text-white' : 'text-gray-300'}
            `}>
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex flex-col">
        <div className="w-full h-[100vh] bg-gray-50 flex flex-col overflow-hidden" 
          style={{
            width:"100vw", 
            height:"100vh", 
            fontFamily: "'Rajdhani', sans-serif",
          }}>
          
          {/* Hero Banner Section with Images */}
          <div className="flex-none h-64 relative overflow-hidden transition-all duration-1000">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
              style={{
                backgroundImage: `url(${systemsData[activeSystem][currentImageIndex].image})`,
                opacity: 0.9
              }}
            ></div>
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 ${activeContent[activeSystem].mobileBg} transition-all duration-1000`}></div>
            
            {/* Content */}
            <div className="relative z-10 p-4 h-full flex flex-col justify-between">
              {/* Top Section */}
              <div>
                <h1 className="text-white mb-1">
                  <div className="text-2xl font-black leading-none">{activeContent[activeSystem].title}</div>
                  <div className="text-2xl font-black leading-none text-gray-300">{activeContent[activeSystem].subtitle}</div>
                </h1>
                <p className="text-gray-200 text-xs max-w-xs leading-relaxed">
                  {activeContent[activeSystem].description}
                </p>
              </div>

              {/* System Toggle Buttons */}
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 flex-1 backdrop-blur-sm ${
                    activeSystem === 'professional' 
                      ? 'bg-white/20 text-white border-2 border-white/30 shadow-lg transform scale-105' 
                      : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white'
                  }`}
                  onClick={() => setActiveSystem('professional')}
                >
                  Professional
                </button>
                <button
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 flex-1 backdrop-blur-sm ${
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
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Apps Section */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
              <div className="sticky top-0 z-10 px-4 py-3 bg-gradient-to-r from-white via-indigo-50 to-purple-50 border-b border-indigo-100">
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Machine for every app
                </h2>
                <p className="text-gray-600 text-sm">High-performance desktops for every program</p>
              </div>
              
              <div className="p-4">
                {/* Animated Logo Grid - 3 columns on mobile */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {logos.slice(0, 12).map((logo, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-white rounded-xl flex items-center justify-center border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 hover:rotate-3 relative overflow-hidden group"
                      style={{
                        transform: `translateY(${Math.sin(logoAnimation * 0.02 + i) * 3}px) rotate(${Math.sin(logoAnimation * 0.01 + i) * 2}deg)`,
                        transition: 'transform 0.1s ease-out'
                      }}
                    >
                      <img
                        src={logo}
                        alt="app-logo"
                        className="w-8 h-8 object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Enhanced CTA Section */}
                <div className="bg-gradient-to-r from-white via-indigo-50 to-purple-50 rounded-2xl p-6 text-center shadow-lg border border-indigo-100 relative overflow-hidden mb-4">
                  <div className="relative z-10">
                    <h3 className="font-bold text-gray-800 mb-3 text-lg">Ready to get started?</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      Discover the perfect system for your needs
                    </p>
                    <button className="inline-block text-red-500 underline font-semibold hover:text-red-600 transition-colors text-sm lg:text-base">
                      Explore App Store →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tablet Layout
  if (isTablet) {
    return (
      <div className="w-full min-h-screen bg-white">
        <div className="w-full h-[100vh] bg-white overflow-hidden" style={{
          fontFamily: "'Rajdhani', sans-serif",
        }}>
          {/* Hero Banner Section */}
          <div className={`w-full h-48 ${activeContent[activeSystem].bgColor} transition-all duration-1000 relative overflow-hidden`}>
            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              <div>
                <h1 className="text-white mb-2">
                  <div className="text-3xl font-black leading-none">{activeContent[activeSystem].title}</div>
                  <div className="text-3xl font-black leading-none text-gray-300">{activeContent[activeSystem].subtitle}</div>
                </h1>
                <p className="text-gray-200 text-sm max-w-md leading-relaxed mt-2">
                  {activeContent[activeSystem].description}
                </p>
              </div>

              {/* System Toggle Buttons */}
              <div className="flex gap-3">
                <button
                  className={`px-6 py-2 rounded-2xl font-bold text-sm transition-all duration-300 backdrop-blur-sm ${
                    activeSystem === 'professional' 
                      ? 'bg-white/20 text-white border-2 border-white/30 shadow-lg transform scale-105' 
                      : 'bg-white/10 text-gray-300 border border-white/20 hover:bg-white/20 hover:text-white'
                  }`}
                  onClick={() => setActiveSystem('professional')}
                >
                  Professional
                </button>
                <button
                  className={`px-6 py-2 rounded-2xl font-bold text-sm transition-all duration-300 backdrop-blur-sm ${
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
          </div>

          {/* Systems Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 mt-4">
            {systemsData[activeSystem].map((system, index) => (
              <div 
                key={system.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div 
                  className="h-32 bg-cover bg-center"
                  style={{ backgroundImage: `url(${system.image})` }}
                ></div>
                <div className="p-4">
                  <h3 className="text-gray-800 font-bold">{system.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{system.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom Row for Tablet */}
        <BottomRow />
      </div>
    );
  }

  // Desktop Layout
  return (
    <>
      <UpdatedNew/>
    </>
  );
}

export default Solutions;