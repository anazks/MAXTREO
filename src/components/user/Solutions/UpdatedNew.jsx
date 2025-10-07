import React, { useState, useEffect } from 'react';

export default function SystemCarousel() {
  const [currentSystem, setCurrentSystem] = useState(0);

  const systems = [
    {
      title: "GAMING\nSYSTEMS",
      images: [
        "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d3?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&auto=format&fit=crop"
      ],
      triangleImage: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop"
    },
    {
      title: "WORKSTATION\nSYSTEMS",
      images: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=800&auto=format&fit=crop"
      ],
      triangleImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop"
    },
    {
      title: "HOME\nPC SYSTEMS",
      images: [
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d3?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=800&auto=format&fit=crop"
      ],
      triangleImage: "https://images.unsplash.com/photo-1587202372775-e229f172b9d3?w=800&auto=format&fit=crop"
    },
    {
      title: "ENTERPRISE\nSYSTEMS",
      images: [
        "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=800&auto=format&fit=crop"
      ],
      triangleImage: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop"
    },
    {
      title: "NETWORKING\n& SERVERS",
      images: [
        "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop"
      ],
      triangleImage: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=800&auto=format&fit=crop"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSystem(prev => (prev + 1) % systems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentData = systems[currentSystem];

  return (
    <div className="container">
      <div className="banner">
        <div className="systemName">
          <h1 style={{ whiteSpace: 'pre-line' }}>{currentData.title}</h1>
        </div>
        <div className="pannels">
          {currentData.images.map((image, index) => (
            <div 
              key={index}
              className="pannel" 
              style={{ 
                backgroundImage: `url(${image})`,
                animationDelay: `${index * 0.1}s`
              }} 
            />
          ))}
          
          {/* Triangle panel with background image */}
          <div 
            className="triangle-pannel"
            style={{ 
              backgroundImage: `url(${currentData.triangleImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </div>
      </div>

      {/* Progress indicators */}
      <div className="progress-indicators">
        {systems.map((_, index) => (
          <div 
            key={index}
            className={`indicator ${index === currentSystem ? 'active' : ''}`}
            onClick={() => setCurrentSystem(index)}
          />
        ))}
      </div>
      <div className="bottomBanner">

      </div>
      <style jsx>{`
      .bottomBanner{
          width:90%;
          margin-top:2%;
          border-radius:20px;
          background-color:gray;
          height:230px;
         
      }
        /* Container full screen */
        .container {
          width: 100vw;
          height: 100vh;
          background-color:white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* Main banner layout */
        .banner {
          width: 90%;
          height: 300px;
          border-radius: 20px;
          display: flex;
          margin-top:70px;
          overflow: visible;
          position: relative;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          background-color:black;
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Left-side text */
        .systemName {
          width: 50%;
          height: 100%;
          
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Arial Black', sans-serif;
          font-size: 36px;
          font-weight: bold;
          padding-left: 20px;
          line-height: 1.2;
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        /* Right-side pannels container */
        .pannels {
          width: 60%;
          height: 100%;
          display: flex;
          gap: 20px;
          padding-left: 20px;
         
          align-items: flex-end;
          overflow: visible;
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
          position: relative;
        }

        /* Individual parallelogram image panel */
        .pannel {
          width: 130px;
          height: 100%;
          background-size: cover;
          background-position: center;
          transform: skewX(-25deg);
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: skewX(-27deg) translateY(50px); 
          }
          to { 
            opacity: 1; 
            transform: skewX(-27deg) translateY(0); 
          }
        }

        /* Hover effect that extends height upward without lifting */
        .pannel:hover {
          height: 120%;
          z-index: 10;
          box-shadow: 0 8px 25px rgba(0,0,0,0.4);
          filter: brightness(1.1);
        }

        /* Triangle panel with background image */
        .triangle-pannel {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 100px;
          height: 150px;
          background-size: cover;
          background-position: center;
          clip-path: polygon(100% 0%, 100% 100%, 0% 100%);
          border-bottom-right-radius: 20px;
          transition: all 0.3s ease;
          z-index: 1;
        }

        .triangle-pannel:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
          z-index: 10;
        }

        /* Progress indicators */
        .progress-indicators {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background-color: white;
          transform: scale(1.2);
        }

        .indicator:hover {
          background-color: rgba(255, 255, 255, 0.7);
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .banner {
            width: 95%;
            height: 250px;
          }
          
          .systemName {
            font-size: 24px;
          }
          
          .pannel {
            width: 80px;
          }
          
          .triangle-pannel {
            width: 70px;
            height: 100px;
          }
        }
      `}</style>
    </div>
  );
}