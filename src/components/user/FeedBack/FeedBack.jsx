import { useState, useEffect } from "react";

export default function FeedbackComponent() {
  const [counter, setCounter] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      text: "Neo Tokyo delivered a gaming system that exceeded all my expectations. The attention to detail and build quality is outstanding.",
      author: "Alex Chen",
      role: "Professional Gamer"
    },
    {
      text: "As a content creator, I needed a powerful workstation that could handle demanding tasks. Neo Tokyo built me the perfect system.",
      author: "Sarah Johnson",
      role: "Digital Artist"
    },
    {
      text: "The enterprise solution Neo Tokyo designed for our startup has been flawless. Their technical support is second to none.",
      author: "Michael Torres",
      role: "Tech Entrepreneur"
    }
  ];

  useEffect(() => {
    const visibilityTimer = setTimeout(() => setIsVisible(true), 300);
    
    const counterInterval = setInterval(() => {
      setCounter(prev => prev < 1000 ? prev + 20 : 1000);
    }, 30);

    const testimonialInterval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      clearTimeout(visibilityTimer);
      clearInterval(counterInterval);
      clearInterval(testimonialInterval);
    };
  }, [testimonials.length]);

  return (
    <div className={`feedback-wrapper ${isVisible ? 'feedback-visible' : ''}`} style={{width: '100%',height: '100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div className="feedback-container">
        <div className="feedback-left-section">
          <h1 className="feedback-main-title">
            Don't Just Take Our Word, Listen to Our Customers
          </h1>
          
          <div className="feedback-red-line"></div>
           <h2 style={{fontSize:'1.5rem'}}>Neo Tokyo In Numbers</h2>
          <div className="feedback-stats-section">
            {/* <h2 className="feedback-subtitle">Neo Tokyo In Numbers</h2> */}
            
            <div className="feedback-counter-box">
              <div className="feedback-counter">
                {counter}<span className="feedback-plus">+</span>
              </div>
              <span className="feedback-counter-label">Completed Builds</span>
            </div>
            
            <div className="feedback-additional-stats">
              <div className="feedback-stat-item">50+ Business Entities</div>
              <div className="feedback-stat-item">500+ Active Customers</div>
            </div>
          </div>
        </div>
        
        <div className="feedback-right-section">
          <div className="feedback-content-box">
            <div className="testimonial-container">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className={`testimonial ${activeTestimonial === index ? 'active' : ''}`}
                >
                  <div className="testimonial-text">"{testimonial.text}"</div>
                  <div className="testimonial-author">{testimonial.author}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
              ))}
            </div>
            <div className="testimonial-indicators">
              {testimonials.map((_, index) => (
                <span 
                  key={index} 
                  className={`indicator ${activeTestimonial === index ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&family=Poppins:wght@300;400;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .feedback-wrapper {
          width: 100%;
          padding: 60px 0;
          background-color: white;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
          margin: 0;
          top: 0;
        }
        
        .feedback-visible {
          opacity: 1;
          transform: translateY(0);
        }
        
        .feedback-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 60px;
        }
        
        .feedback-left-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: translateX(-20px);
          transition: opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s;
        }
        
        .feedback-visible .feedback-left-section {
          opacity: 1;
          transform: translateX(0);
        }
        
        .feedback-main-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 2.8rem;
          font-weight: 700;
          line-height: 1.2;
          color: #222;
          margin-bottom: 1.5rem;
          max-width: 600px;
          margin-top: 0;
        }
        
        .feedback-red-line {
          width: 120px;
          height: 4px;
          background-color: #ff0055;
          margin: 1rem 0 2rem 0;
          transform: scaleX(0);
          transform-origin: left;
          animation: expandLine 1.2s ease forwards;
          animation-delay: 0.8s;
        }
        
        @keyframes expandLine {
          to { transform: scaleX(1); }
        }
        
        .feedback-subtitle {
          font-family: 'Poppins', sans-serif;
          font-size: 1.6rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: #333;
          opacity: 0;
          animation: fadeIn 1s ease forwards;
          animation-delay: 1s;
        }
        
        @keyframes fadeIn { to { opacity: 1; } }
        
        .feedback-counter-box {
          margin-bottom: 1.5rem;
        }
        
        .feedback-counter {
          font-family: 'Montserrat', sans-serif;
          font-size: 4rem;
          font-weight: 700;
          color: #222;
          display: flex;
          align-items: center;
        }
        
        .feedback-plus {
          font-size: 3rem;
          margin-left: 5px;
          color: #ff0055;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          50% { transform: scale(1.1); }
        }
        
        .feedback-counter-label {
          display: block;
          font-family: 'Poppins', sans-serif;
          font-size: 1.2rem;
          color: #555;
          margin-top: 0.5rem;
        }
        
        .feedback-additional-stats {
          display: flex;
          gap: 20px;
          margin-top: 0;
        }
        
        .feedback-stat-item {
          padding: 14px 24px;
          background-color: #222;
          color: white;
          font-family: 'Poppins', sans-serif;
          font-size: 1.1rem;
          font-weight: 500;
          border-radius: 8px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          opacity: 0;
          animation: slideIn 0.5s ease forwards;
          animation-delay: 1.5s;
          white-space: nowrap;
          cursor: pointer;
        }
        
        .feedback-stat-item:nth-child(2) {
          animation-delay: 1.7s;
        }
        
        .feedback-stat-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          background-color: #ff0055;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .feedback-right-section {
          flex: 1;
          min-width: 300px;
          height: 500px;
          opacity: 0;
          transform: translateX(20px);
          animation: fadeInRight 1s ease forwards;
          animation-delay: 1s;
        }
        
        @keyframes fadeInRight {
          to { opacity: 1; transform: translateX(0); }
        }
        
        .feedback-content-box {
          width: 100%;
          height: 100%;
          background-color: #f5f5f5;
          border-radius: 16px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
          transition: transform 0.5s ease, box-shadow 0.5s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }
        
        .feedback-content-box:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }
        
        .feedback-content-box::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #ff0055, #ff6b6b);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s ease;
        }
        
        .feedback-content-box:hover::after {
          transform: scaleX(1);
        }
        
        .testimonial-container {
          width: 100%;
          position: relative;
          height: 100%;
        }
        
        .testimonial {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 20px;
          opacity: 0;
          transform: translateX(50px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .testimonial.active {
          opacity: 1;
          transform: translateX(0);
        }
        
        .testimonial-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.4rem;
          line-height: 1.7;
          color: #333;
          margin-bottom: 25px;
          max-width: 600px;
        }
        
        .testimonial-author {
          font-family: 'Poppins', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #222;
        }
        
        .testimonial-role {
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          color: #666;
          margin-top: 5px;
        }
        
        .testimonial-indicators {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 20px;
        }
        
        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #ddd;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        
        .indicator.active {
          background-color: #ff0055;
          transform: scale(1.2);
        }
        
        /* Responsive Design */
        @media screen and (max-width: 1200px) {
          .feedback-container {
            padding: 0 30px;
            gap: 40px;
          }
          
          .feedback-main-title {
            font-size: 2.4rem;
          }
          
          .testimonial-text {
            font-size: 1.2rem;
          }
        }
        
        @media screen and (max-width: 992px) {
          .feedback-container {
            flex-direction: column;
            padding: 0 25px;
            gap: 40px;
            align-items: center;
            overflow-x: hidden;
          }
          
          .feedback-left-section {
            width: 100%;
            max-width: 700px;
            text-align: center;
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
          
          .feedback-right-section {
            width: 100%;
            max-width: 700px;
            height: 400px;
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
          
          .feedback-red-line {
            margin: 1rem auto 2rem auto;
          }
          
          .feedback-additional-stats {
            justify-content: center;
            margin-top: 1rem;
          }
        }
        
        @media screen and (max-width: 768px) {
          .feedback-wrapper {
            padding: 0;
            overflow-x: hidden;
            margin: 0;
            top: 0;
          }
          
          .feedback-container {
            gap: 30px;
            overflow-x: hidden;
            width: 100%;
            padding-top: 0;
            margin-top: 0;
          }
          
          .feedback-main-title {
            font-size: 2rem;
          }
          
          .feedback-subtitle {
            font-size: 1.4rem;
          }
          
          .feedback-counter-box {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .feedback-right-section {
            display: none; /* Hide testimonials on mobile */
          }
          
          .feedback-additional-stats {
            flex-direction: column;
            gap: 15px;
            align-items: center;
            width: 100%;
            overflow: visible;
          }
          
          .feedback-stat-item {
            width: 100%;
            max-width: 300px;
            padding: 14px 20px;
            font-size: 1rem;
            text-align: center;
            white-space: normal;
          }
        }
        
        @media screen and (max-width: 576px) {
          .feedback-container {
            padding: 0 20px;
            overflow-x: hidden;
            margin-top: 20%;
          }
          
          .feedback-wrapper {
            padding: 0;
            overflow-x: hidden;
            margin: 0;
            top: 0;
          }
          
          .feedback-main-title {
            font-size: 1.8rem;
          }
          
          .feedback-counter {
            font-size: 3.2rem;
          }
          
          .feedback-plus {
            font-size: 2.5rem;
          }
          
          .feedback-stat-item {
            max-width: 280px;
            padding: 12px 18px;
            font-size: 0.95rem;
            white-space: normal;
          }
        }
        
        @media screen and (max-width: 400px) {
          .feedback-main-title {
            font-size: 1.6rem;
          }
          
          .feedback-counter {
            font-size: 2.8rem;
          }
          
          .feedback-plus {
            font-size: 2.2rem;
          }
          
          .feedback-stat-item {
            max-width: 100%;
            padding: 12px 16px;
            font-size: 0.9rem;
            white-space: normal;
          }
        }
      `}</style>
    </div>
  );
}