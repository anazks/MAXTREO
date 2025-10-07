import React, { useState, useEffect } from "react";

export default function GamingSingleView() {
  const [displayText, setDisplayText] = useState("GAMING R1");
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = ["GAMING PC", "WORK STATION", "HOME PC","ENTERPRISE","NETWORKING & SERVERS"];
  const [activeTriangle, setActiveTriangle] = useState(0);
  const [hoveredTriangle, setHoveredTriangle] = useState(null);

  // Mock images for demonstration
  const triangleImages = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
    "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/08a99464328709.5ace76da9e4fe.png",
    "https://pics.craiyon.com/2023-06-22/d7e43b853d9642f4b3e99fe5124ddeea.webp",
    "https://cdna.artstation.com/p/assets/images/images/033/802/500/medium/fabrizio-fioretti-neotokyo.jpg?1614061752",
    "https://wallpaperaccess.com/full/491883.jpg",
  ];

  const edenContent = [
    {
      title: "PROJECT EDEN",
      description:
        "AT Project Eden, we believe in creating a space that's uniquely yours. From personalized styling to climate control, IoT automation to immersive gaming, and a home theater experience, we've carefully chosen every element to guarantee your pleasure and comfort.",
    },
    {
      title: "VR GAMING",
      description:
        "IMMERSE in ultimate gaming with state-of-the-art hardware, RGB lighting, and ergonomic design for intense sessions.",
    },
    {
      title: "LFG DISPLAY",
      description:
        "ELEVATE your business with scalable solutions featuring military-grade security and 24/7 support.",
    },
    {
      title: "SIM RACING",
      description:
        "TRANSFORM your living space with intelligent automation, voice control, and seamless integration of all your devices.",
    },
    {
      title: "GAMING",
      description:
        "UNLEASH your creativity with powerful workstations optimized for design, video editing, and content creation.",
    },
    {
      title: "WORK STATION",
      description:
        "EMPOWER learning with interactive tools, collaborative platforms, and resources for students of all ages.",
    },
  ];

  // Typing effect
  useEffect(() => {
    const fullText = phrases[currentPhrase];
    let currentIndex = 0;
    let isDeleting = false;
    let timer;

    const typeEffect = () => {
      const current = fullText.substring(0, currentIndex);
      setDisplayText(current);

      const typingSpeed = isDeleting ? 75 : 150;

      if (!isDeleting && currentIndex === fullText.length) {
        setTimeout(() => {
          isDeleting = true;
          timer = setTimeout(typeEffect, 1000);
        }, 1500);
      } else if (isDeleting && currentIndex === 0) {
        isDeleting = false;
        setCurrentPhrase((prev) => (prev + 1) % phrases.length);
        timer = setTimeout(typeEffect, 500);
      } else {
        currentIndex = isDeleting ? currentIndex - 1 : currentIndex + 1;
        timer = setTimeout(typeEffect, typingSpeed);
      }
    };

    timer = setTimeout(typeEffect, 100);
    return () => clearTimeout(timer);
  }, [currentPhrase]);

  const handleTriangleClick = (index) => {
    setActiveTriangle(index);
  };

  const handleTriangleHover = (index) => {
    setHoveredTriangle(index);
  };

  const handleTriangleLeave = () => {
    setHoveredTriangle(null);
  };

  return (
    <div className="w-full min-h-screen bg-white overflow-x-hidden">
      <div className="flex flex-col w-full max-w-6xl mx-auto px-4 py-4 min-h-screen">
        {/* Header section */}
        <div className="text-center mb-4 pt-4 md:pt-8">
          <div className="items-center justify-center">
            <h1 
              className="text-gray-600 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-wide" 
              style={{letterSpacing:"4px", fontSize:"clamp(16px, 4vw, 30px)"}}
            >
              <span 
                className="text-pink-600 font-bold mr-1" 
                style={{fontFamily:"monospace", letterSpacing:"-.5px", fontSize:"clamp(24px, 6vw, 40px)"}}
              >
                <sup>''</sup>
              </span>
              DOESN'T HAVE TO BE A BOX 
            </h1> 
            
            <h1 
              className="text-gray-600 text-base sm:text-lg md:text-xl lg:text-2xl font-semibold tracking-wide block" 
              style={{letterSpacing:"4px", fontSize:"clamp(16px, 4vw, 30px)"}}
            >
              IN A CORNER. IT CAN BE A ...
            </h1>
          </div>

          <div className="my-4">
            <h2 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-600" 
              style={{letterSpacing:"clamp(2px, 1vw, 6px)"}}
            >
              {displayText}
              <span className="inline-block w-1 h-6 sm:h-8 bg-black ml-1 animate-pulse"></span>
            </h2>
          </div>

          <p className="text-gray-500 text-xs sm:text-sm px-2" style={{letterSpacing:"1px"}}>
            Built with latest in PC hardware, highest quality components and
            backed by lifetime support
          </p>
          <div className="w-full max-w-2xl mx-auto h-1 bg-pink-600 mt-2"></div>
        </div>

        {/* Middle content section */}
        <div className="flex flex-col md:flex-row gap-4 mb-4 flex-grow" style={{display:"flex",alignItems:'center',justifyContent:'center'}}>
          {/* Left side text - centered */}
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="text-center w-full max-w-xs">
              <div style={{letterSpacing:"clamp(2px, 1vw, 6px)"}}>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">NEW</h2> 
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
                  <span className="text-pink-600">EXP</span>ERIENCES
                </h2>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                  BEGINS HERE
                </h2>
                <p className="text-gray-600 mt-2 text-sm">Endless Possibilities</p>
              </div>
            </div>
          </div>

          {/* Right side triangles - centered and larger */}
          <div className="w-full md:w-2/3 px-2 min-h-0 flex justify-center">
            <div className="relative w-full max-w-2xl" style={{marginLeft:"50px"}}> 
              <svg viewBox="0 0 700 250" className="w-full h-auto">
                <defs>
                  {/* Clip paths for each triangle - increased size by 10px */}
                  <clipPath id="triangle1">
                    <polygon points="50,40 110,160 -10,160" />
                  </clipPath>
                  <clipPath id="triangle2">
                    <polygon points="140,40 200,160 80,160" />
                  </clipPath>
                  <clipPath id="triangle3">
                    <polygon points="230,40 290,160 170,160" />
                  </clipPath>
                  <clipPath id="triangle4">
                    <polygon points="320,40 380,160 260,160" />
                  </clipPath>
                  <clipPath id="triangle5">
                    <polygon points="410,40 470,160 350,160" />
                  </clipPath>
                  <clipPath id="triangle6">
                    <polygon points="500,40 560,160 440,160" />
                  </clipPath>
                

                  {/* Glow effect for active triangle */}
                  <filter
                    id="glow"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite
                      in="SourceGraphic"
                      in2="blur"
                      operator="over"
                    />
                  </filter>
                </defs>

                {/* Background images for each triangle - increased size */}
                {triangleImages.map((image, index) => (
                  <image
                    key={index}
                    href={image}
                    clipPath={`url(#triangle${index + 1})`}
                    x={index * 90 - 10}
                    y="40"
                    width="120"
                    height="120"
                    preserveAspectRatio="xMidYMid slice"
                    style={{
                      transform: `rotate(-10deg) ${hoveredTriangle === index ? 'scale(1.1)' : 'scale(1)'}`,
                      transformOrigin: `${50 + index * 90}px 100px`,
                      transition: 'transform 0.3s ease'
                    }}
                  />
                ))}

                {/* Transparent clickable triangles with hover effects */}
                <g>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <polygon
                      key={index}
                      points={`${50 + index * 90},40 ${110 + index * 90},160 ${-10 + index * 90},160`}
                      fill="transparent"
                      stroke={
                        activeTriangle === index
                          ? "white"
                          : "rgba(255,255,255,0.3)"
                      }
                      strokeWidth={activeTriangle === index ? "3" : "1"}
                      filter={activeTriangle === index ? "url(#glow)" : ""}
                      onClick={() => handleTriangleClick(index)}
                      onMouseEnter={() => handleTriangleHover(index)}
                      onMouseLeave={handleTriangleLeave}
                      style={{ 
                        cursor: "pointer",
                        transform: `rotate(-10deg) ${hoveredTriangle === index ? 'scale(1.1)' : 'scale(1)'}`,
                        transformOrigin: `${50 + index * 90}px 100px`,
                        transition: 'transform 0.3s ease'
                      }}
                    />
                  ))}
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Project Eden section */}
        <div className="bg-gray-100 rounded-lg flex flex-col md:flex-row shadow-md mt-2 mb-4 min-h-0 flex-shrink-0">
          <div className="md:w-1/4 bg-gray-200 p-3 md:p-4 flex items-center justify-center flex-shrink-0">
            <div className="text-center">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2">
                <div className="absolute top-0 left-1 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500"></div>
                <div className="absolute bottom-0 right-1 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500"></div>
              </div>
              <h3 className="uppercase text-xs font-bold tracking-wider">
                {edenContent[activeTriangle].title}
              </h3>
            </div>
          </div>
          <div className="md:w-3/4 p-3 md:p-4 flex items-center">
            <p className="text-gray-800 text-xs sm:text-sm leading-relaxed">
              <span className="text-pink-600 font-bold">
                {edenContent[activeTriangle].title.split(" ")[0]}
              </span>{" "}
              {edenContent[activeTriangle].description}
            </p>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </div>
  );
}