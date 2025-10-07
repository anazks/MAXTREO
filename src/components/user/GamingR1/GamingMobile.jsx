import React, { useState, useEffect } from 'react';

export default function GamingMobile() {
  const [displayText, setDisplayText] = useState("");
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = ["GAMING R1", "PROFESSIONAL SYSTEM", "ENTERPRISE SYSTEM"];
  const [activeTriangle, setActiveTriangle] = useState(0);
  
  const edenContent = [
    {
      title: "PROJECT EDEN",
      description: "<span class=\"highlight\">AT</span> Project Eden, we believe in creating a space that's uniquely yours. From personalized styling to climate control, IoT automation to immersive gaming, and a home theater experience, we've carefully chosen every element to guarantee your pleasure and comfort."
    },
    {
      title: "GAMING SUITE",
      description: "<span class=\"highlight\">IMMERSE</span> yourself in the ultimate gaming experience with our custom-built gaming suites. Featuring state-of-the-art hardware, personalized RGB lighting systems, and ergonomic design for maximum comfort during those intense gaming sessions."
    },
    {
      title: "ENTERPRISE HUB",
      description: "<span class=\"highlight\">ELEVATE</span> your business operations with our enterprise solutions. Designed for scalability and reliability, our systems feature military-grade security, seamless networking capabilities, and 24/7 technical support to keep your business running smoothly."
    }
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
    const edenSection = document.querySelector('.mobile-project-eden');
    if (edenSection) {
      edenSection.classList.add('content-change');
      setTimeout(() => {
        edenSection.classList.remove('content-change');
      }, 500);
    }
  };
  
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      margin: '0',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div className='gaming-mobile-container'>
          {/* Header section */}
          <header className="mobile-header">
            <div className="mobile-text-content">
              <h1 className="mobile-main-title">
                <span className="mobile-quote-marks">"</span>DOESN'T HAVE TO BE A BOX IN A CORNER. IT CAN BE A...<span className="mobile-quote-marks">"</span>
              </h1>
              
              <div className="mobile-typing-wrapper">
                <h2 className="mobile-typing-text">
                  {displayText}
                  <span className="mobile-cursor">|</span>
                </h2>
              </div>
              
              <p className="mobile-subheading">
                Built with latest in PC hardware, highest quality components and backed by lifetime support
              </p>
              
              <div className="mobile-divider"></div>
            </div>
          </header>

          {/* Main content section */}
          <div className="mobile-content-section" >
            {/* Staggered text */}
            <div className="mobile-text-box">
              <div className="mobile-staggered-content">
                <h2 className="mobile-staggered-text">NEW</h2>
                <h2 className="mobile-staggered-text">
                  <span className="mobile-highlight-text">EXP</span>ERIENCES
                </h2>
                <h2 className="mobile-staggered-text">BEGINS HERE</h2>
                <p className="mobile-possibilities-text">Endless Possibilities</p>
              </div>
            </div>
            
            {/* Triangle selector */}
            <div className="mobile-triangle-box">
              <div className="mobile-triangle-container">
                <h3 className="mobile-triangle-title">Select Your Experience</h3>
                
                <div className="mobile-triangle-options">
                  <div 
                    className={`mobile-triangle-option ${activeTriangle === 0 ? 'active' : ''}`}
                    onClick={() => handleTriangleClick(0)}
                  >
                    PROJECT EDEN
                  </div>
                  <div 
                    className={`mobile-triangle-option ${activeTriangle === 1 ? 'active' : ''}`}
                    onClick={() => handleTriangleClick(1)}
                  >
                    GAMING SUITE
                  </div>
                  <div 
                    className={`mobile-triangle-option ${activeTriangle === 2 ? 'active' : ''}`}
                    onClick={() => handleTriangleClick(2)}
                  >
                    ENTERPRISE HUB
                  </div>
                </div>
              </div>
            </div>

            {/* Project Eden section */}
            <div className="mobile-project-eden">
              <div className="mobile-eden-header">
                <div className="mobile-eden-circles">
                  <div className="mobile-circle mobile-blue-circle"></div>
                  <div className="mobile-circle mobile-purple-circle"></div>
                </div>
                <h3 className="mobile-eden-title">{edenContent[activeTriangle].title}</h3>
              </div>
              
              <div className="mobile-eden-content">
                <p 
                  className="mobile-eden-description"
                  dangerouslySetInnerHTML={{ __html: edenContent[activeTriangle].description }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Base Mobile Styles */
        .gaming-mobile-container {
          background-color: white;
          color: #333;
          font-family: 'Arial', sans-serif;
          width: 100%;
          max-width: 800px;
          margin: 0;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          overflow-x: hidden;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        /* Mobile Header Section */
        .mobile-header {
          padding: 0;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        
        .mobile-text-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        
        .mobile-main-title {
          color: #666;
          font-size: 0.9rem;
          font-weight: 600;
          margin: 0;
          text-transform: uppercase;
          line-height: 1.3;
          padding: 0 0.5rem;
        }
        
        .mobile-quote-marks {
          color: #ff0044;
          font-size: 1.2em;
          vertical-align: middle;
        }
        
        .mobile-typing-wrapper {
          min-height: 2.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0.5rem 0;
        }
        
        .mobile-typing-text {
          color: #000;
          font-size: 1.4rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: 1px;
        }
        
        .mobile-cursor {
          display: inline-block;
          margin-left: 2px;
          width: 2px;
          background-color: #000;
          animation: mobileBlink 1s infinite;
        }
        
        @keyframes mobileBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .mobile-subheading {
          font-size: 0.8rem;
          color: #888;
          margin: 0;
          padding: 0 1rem;
          text-align: center;
        }
        
        .mobile-divider {
          height: 2px;
          width: 80%;
          background-color: #ff0044;
          margin: 0.8rem auto;
        }
        
        /* Mobile Content Section - Perfectly centered with no gaps */
        .mobile-content-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          min-height: 0;
        }
        
        /* Mobile Text Box */
        .mobile-text-box {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 1rem;
          border-bottom: 2px solid #ff0044;
          width: 100%;
          max-width: 400px;
        }
        
        .mobile-staggered-content {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          align-items: center;
        }
        
        .mobile-staggered-text {
          font-size: 1.3rem;
          margin: 0;
          line-height: 1.1;
          font-weight: 700;
        }
        
        .mobile-highlight-text {
          color: #ff0044;
        }
        
        .mobile-possibilities-text {
          color: #666;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
        
        /* Mobile Triangle Box */
        .mobile-triangle-box {
          padding: 0.5rem 0;
          width: 100%;
          max-width: 400px;
        }
        
        .mobile-triangle-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
        }
        
        .mobile-triangle-title {
          font-size: 0.9rem;
          text-transform: uppercase;
          color: #333;
          margin: 0;
          text-align: center;
        }
        
        .mobile-triangle-options {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 0.5rem;
        }
        
        .mobile-triangle-option {
          padding: 0.8rem;
          background-color: #f0f0f0;
          border-radius: 8px;
          font-size: 0.8rem;
          text-align: center;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
        }
        
        .mobile-triangle-option.active {
          background-color: #f8f8f8;
          border-left: 3px solid #ff0044;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        /* Mobile Project Eden Section - Now centered */
        .mobile-project-eden {
          background-color: #f7f7f7;
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: opacity 0.3s ease;
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .mobile-project-eden.content-change {
          opacity: 0.5;
        }
        
        .mobile-eden-header {
          padding: 1rem;
          background-color: #f0f0f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.8rem;
        }
        
        .mobile-eden-circles {
          position: relative;
          width: 70px;
          height: 70px;
        }
        
        .mobile-circle {
          position: absolute;
          width: 45px;
          height: 45px;
          border-radius: 50%;
        }
        
        .mobile-blue-circle {
          background: linear-gradient(135deg, #0047ab, #6a5acd);
          top: 0;
          left: 5px;
        }
        
        .mobile-purple-circle {
          background: linear-gradient(135deg, #8a2be2, #da70d6);
          bottom: 0;
          right: 5px;
        }
        
        .mobile-eden-title {
          font-size: 1rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #333;
          margin: 0;
          text-align: center;
        }
        
        .mobile-eden-content {
          padding: 1rem;
          text-align: center;
        }
        
        .mobile-eden-description {
          font-size: 0.8rem;
          line-height: 1.5;
          margin: 0;
        }
        
        .highlight {
          color: #ff0044;
          font-weight: bold;
        }
        
        /* Enhanced responsive adjustments for 2560x1440 - with tight spacing */
        @media (min-width: 2560px) {
          .gaming-mobile-container {
            transform: scale(1.3);
            transform-origin: center center;
            max-width: 900px;
          }
          
          .mobile-content-section {
            gap: 1.2rem;
          }
          
          .mobile-text-box {
            padding: 1.2rem;
          }
          
          .mobile-triangle-box {
            padding: 0.8rem 0;
          }
          
          .mobile-project-eden {
            max-width: 600px;
          }
        }
        
        @media (min-width: 1920px) and (max-width: 2559px) {
          .gaming-mobile-container {
            transform: scale(1.1);
            transform-origin: center center;
          }
          
          .mobile-content-section {
            gap: 1.2rem;
          }
        }
        
        @media (max-width: 1440px) {
          .gaming-mobile-container {
            transform: scale(0.95);
            transform-origin: center center;
          }
        }
        
        @media (max-width: 1024px) {
          .gaming-mobile-container {
            transform: scale(0.9);
            transform-origin: center center;
          }
        }
        
        @media (max-width: 768px) {
          .gaming-mobile-container {
            transform: scale(1);
            max-width: 100%;
            margin: 0;
            padding: 0.5rem;
          }
          
          .mobile-content-section {
            gap: 0.8rem;
          }
        }
        
        /* Responsive adjustments for very small screens */
        @media (max-width: 320px) {
          .mobile-main-title {
            font-size: 0.8rem;
          }
          
          .mobile-typing-text {
            font-size: 1.2rem;
          }
          
          .mobile-staggered-text {
            font-size: 1.1rem;
          }
          
          .mobile-triangle-option {
            padding: 0.6rem;
            font-size: 0.75rem;
          }
          
          .mobile-eden-title {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}