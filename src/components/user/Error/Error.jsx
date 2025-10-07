import React, { useState, useEffect } from 'react';
import ModernNavbar from '../NavBar/NavBar';
import NeoFooter from '../Footer/Footer';

const ErrorPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);
  const [rocketLaunched, setRocketLaunched] = useState(false);
  const [exhaustParticles, setExhaustParticles] = useState([]);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
    
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);

    // Launch rocket after 2 seconds
    const launchTimer = setTimeout(() => {
      setRocketLaunched(true);
      
      // Generate exhaust particles
      const generateExhaustParticles = () => {
        const newExhaust = Array.from({ length: 15 }, (_, i) => ({
          id: Date.now() + i,
          x: 50 + (Math.random() - 0.5) * 10,
          y: 100,
          size: Math.random() * 6 + 4,
          opacity: Math.random() * 0.8 + 0.2,
          duration: Math.random() * 1 + 0.5
        }));
        setExhaustParticles(prev => [...prev, ...newExhaust]);
      };

      // Generate exhaust particles continuously for 3 seconds
      const exhaustInterval = setInterval(generateExhaustParticles, 100);
      setTimeout(() => clearInterval(exhaustInterval), 3000);
    }, 2000);

    return () => clearTimeout(launchTimer);
  }, []);

  const handleRetry = () => {
    window.location.href = '/'; // Navigate to home
    window.location.reload(); // Optional: force refresh
  };

  return (
        <>
            <ModernNavbar/>
                <div style={styles.container}>
      {/* Animated background particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            ...styles.particle,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* Rocket */}
      <div style={{
        ...styles.rocket,
        transform: rocketLaunched ? 'translateY(-120vh) rotate(-5deg)' : 'translateY(0) rotate(0deg)',
        opacity: rocketLaunched ? 0 : 1
      }}>
        🚀
      </div>

      {/* Rocket Trail */}
      {rocketLaunched && (
        <div style={styles.rocketTrail} />
      )}

      {/* Exhaust Particles */}
      {exhaustParticles.map(exhaust => (
        <div
          key={exhaust.id}
          style={{
            ...styles.exhaustParticle,
            left: `${exhaust.x}%`,
            bottom: `${exhaust.y}%`,
            width: `${exhaust.size}px`,
            height: `${exhaust.size}px`,
            opacity: exhaust.opacity,
            animationDuration: `${exhaust.duration}s`
          }}
        />
      ))}

      {/* Stars that appear after rocket launches */}
      {rocketLaunched && (
        <>
          <div style={{...styles.star, top: '10%', left: '20%', animationDelay: '0.5s'}}>⭐</div>
          <div style={{...styles.star, top: '15%', right: '25%', animationDelay: '1s'}}>✨</div>
          <div style={{...styles.star, top: '25%', left: '15%', animationDelay: '1.5s'}}>⭐</div>
          <div style={{...styles.star, top: '20%', right: '30%', animationDelay: '2s'}}>✨</div>
          <div style={{...styles.star, top: '30%', left: '25%', animationDelay: '2.5s'}}>⭐</div>
        </>
      )}
      
      {/* Gradient overlay */}
      <div style={styles.gradientOverlay} />
      
      <div style={{
        ...styles.content,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)',
        opacity: isVisible ? 1 : 0
      }}>
        {/* Animated error code */}
        <div style={styles.errorCodeContainer}>
          <div style={styles.errorCode}>
            <span style={styles.errorDigit}>5</span>
            <span style={{...styles.errorDigit, animationDelay: '0.1s'}}>0</span>
            <span style={{...styles.errorDigit, animationDelay: '0.2s'}}>0</span>
          </div>
          <div style={styles.errorGlow} />
        </div>
        
        {/* Animated title */}
        <h1 style={styles.title}>
          <span style={styles.titleWord}>Oops!</span>
          <span style={{...styles.titleWord, animationDelay: '0.3s'}}>Something</span>
          <span style={{...styles.titleWord, animationDelay: '0.4s'}}>went</span>
          <span style={{...styles.titleWord, animationDelay: '0.5s'}}>wrong</span>
        </h1>
        
        {/* Message with typewriter effect */}
        <p style={styles.message}>
          We're sorry, but we're having some technical difficulties. 
          Please try again later.
        </p>
        
        {/* Animated button */}
        <button 
          style={styles.button} 
          onClick={handleRetry}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
            e.target.style.boxShadow = '0 8px 25px rgba(220, 53, 69, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.2)';
          }}
        >
          <span style={styles.buttonIcon}>🏠</span>
          Go Back Home
        </button>
        
        {/* Support section */}
        <div style={styles.support}>
          Need help? 
          <a 
            href="mailto:support@example.com" 
            style={styles.link}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.textShadow = '0 2px 8px rgba(0, 123, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.textShadow = 'none';
            }}
          >
            Contact support
          </a>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slideUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        @keyframes rocketLaunch {
          0% { 
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          50% { 
            transform: translateY(-60vh) rotate(-2deg);
            opacity: 1;
          }
          100% { 
            transform: translateY(-120vh) rotate(-5deg);
            opacity: 0;
          }
        }

        @keyframes exhaustFade {
          0% { 
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-30px) scale(1.5);
            opacity: 0.4;
          }
          100% { 
            transform: translateY(-60px) scale(2);
            opacity: 0;
          }
        }

        @keyframes starTwinkle {
          0%, 100% { 
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
          }
        }

        @keyframes trailFade {
          0% { 
            opacity: 0;
            height: 0;
          }
          20% { 
            opacity: 1;
            height: 200px;
          }
          100% { 
            opacity: 0;
            height: 800px;
          }
        }
      `}</style>
    </div>
        </>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: 'hidden'
  },
  rocket: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '60px',
    zIndex: 20,
    transition: 'all 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
  },
  rocketTrail: {
    position: 'absolute',
    bottom: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '4px',
    background: 'linear-gradient(to top, rgba(255,165,0,0.8), rgba(255,69,0,0.6), rgba(255,255,255,0.2))',
    borderRadius: '2px',
    animation: 'trailFade 3s ease-out',
    zIndex: 15
  },
  exhaustParticle: {
    position: 'absolute',
    background: 'radial-gradient(circle, #ff6b35 0%, #ff8c42 50%, transparent 100%)',
    borderRadius: '50%',
    animation: 'exhaustFade forwards',
    pointerEvents: 'none',
    zIndex: 10
  },
  star: {
    position: 'absolute',
    fontSize: '20px',
    animation: 'starTwinkle 2s ease-in-out',
    pointerEvents: 'none',
    zIndex: 25
  },
  particle: {
    position: 'absolute',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    animation: 'float infinite ease-in-out',
    pointerEvents: 'none'
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%)',
    pointerEvents: 'none'
  },
  content: {
    position: 'relative',
    textAlign: 'center',
    maxWidth: '600px',
    padding: '60px 40px',
    borderRadius: '20px',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 10
  },
  errorCodeContainer: {
    position: 'relative',
    marginBottom: '30px'
  },
  errorCode: {
    fontSize: '96px',
    fontWeight: '900',
    color: '#dc3545',
    marginBottom: '20px',
    textShadow: '0 4px 8px rgba(220, 53, 69, 0.3)',
    letterSpacing: '8px'
  },
  errorDigit: {
    display: 'inline-block',
    animation: 'bounce 2s infinite',
    marginRight: '4px'
  },
  errorGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '100px',
    background: 'radial-gradient(circle, rgba(220, 53, 69, 0.2) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'glow 2s infinite'
  },
  title: {
    fontSize: '28px',
    color: '#2c3e50',
    marginBottom: '20px',
    fontWeight: '700',
    lineHeight: '1.2'
  },
  titleWord: {
    display: 'inline-block',
    marginRight: '12px',
    animation: 'slideUp 0.8s ease-out forwards',
    opacity: 0
  },
  message: {
    fontSize: '18px',
    color: '#6c757d',
    marginBottom: '40px',
    lineHeight: '1.6',
    maxWidth: '400px',
    margin: '0 auto 40px auto',
    animation: 'slideUp 1s ease-out 0.6s forwards',
    opacity: 0
  },
  button: {
    background: 'linear-gradient(45deg, #dc3545, #e74c3c)',
    color: 'white',
    border: 'none',
    padding: '16px 32px',
    fontSize: '18px',
    borderRadius: '50px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    marginBottom: '30px',
    boxShadow: '0 4px 15px rgba(220, 53, 69, 0.2)',
    fontWeight: '600',
    letterSpacing: '0.5px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    animation: 'slideUp 1s ease-out 0.8s forwards',
    opacity: 0,
    position: 'relative',
    overflow: 'hidden'
  },
  buttonIcon: {
    fontSize: '16px',
    animation: 'pulse 2s infinite'
  },
  support: {
    fontSize: '16px',
    color: '#6c757d',
    animation: 'slideUp 1s ease-out 1s forwards',
    opacity: 0
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: '600',
    marginLeft: '8px',
    transition: 'all 0.3s ease',
    borderBottom: '2px solid transparent',
    paddingBottom: '2px'
  }
};

export default ErrorPage;