import React, { useState, useEffect, useRef } from 'react';
import NavBar from '../../components/user/NavBar/NavBar';
import Alert from '../../components/user/Alert/Alert';

function SimpleRaceGame() {
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [carPosition, setCarPosition] = useState(50);
  const [obstacles, setObstacles] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(2);
  const [message, setMessage] = useState("Ready to race?");
  const gameAreaRef = useRef(null);
  
  // Start game
  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setCarPosition(50);
    setObstacles([]);
    setGameSpeed(2);
    setMessage("Go! Avoid obstacles!");
  };
  
  // Generate obstacles
  useEffect(() => {
    if (!gameActive) return;
    
    const interval = setInterval(() => {
      // Create new obstacle
      if (Math.random() > 0.7) {
        const newObstacle = {
          id: Date.now(),
          left: Math.floor(Math.random() * 70) + 15, // position between 15-85%
          top: -10, // start above the screen
          width: Math.floor(Math.random() * 20) + 10 // width between 10-30%
        };
        setObstacles(prev => [...prev, newObstacle]);
      }
      
      // Increase game speed over time
      if (Math.random() > 0.95) {
        setGameSpeed(prev => Math.min(prev + 0.5, 10));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameActive]);
  
  // Move obstacles and detect collisions
  useEffect(() => {
    if (!gameActive) return;
    
    const interval = setInterval(() => {
      setObstacles(prevObstacles => {
        const updatedObstacles = prevObstacles
          .map(obstacle => ({
            ...obstacle,
            top: obstacle.top + gameSpeed
          }))
          .filter(obstacle => {
            // Check for collisions with the car
            if (obstacle.top > 70 && obstacle.top < 90) {
              const obstacleLeft = obstacle.left;
              const obstacleRight = obstacle.left + obstacle.width;
              const carLeft = carPosition - 5;
              const carRight = carPosition + 5;
              
              // Check if car and obstacle overlap
              if (carRight > obstacleLeft && carLeft < obstacleRight) {
                // Collision! End game
                setGameActive(false);
                setMessage(`Game Over! Final Score: ${score}`);
                return false;
              }
            }
            
            // Remove obstacles that go off screen
            if (obstacle.top > 100) {
              // Score point for passing obstacle
              setScore(prevScore => prevScore + 1);
              return false;
            }
            
            return true;
          });
          
        return updatedObstacles;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [gameActive, carPosition, gameSpeed, score]);
  
  // Control car with arrow keys
  useEffect(() => {
    if (!gameActive) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setCarPosition(prev => Math.max(10, prev - 5));
      } else if (e.key === 'ArrowRight') {
        setCarPosition(prev => Math.min(90, prev + 5));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameActive]);
  
  // Handle touch/click for mobile controls
  const handleAreaClick = (e) => {
    if (!gameActive) return;
    
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;
    
    const rect = gameArea.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const areaWidth = rect.width;
    
    // Click on left side moves left, right side moves right
    if (clickX < areaWidth / 2) {
      setCarPosition(prev => Math.max(10, prev - 10));
    } else {
      setCarPosition(prev => Math.min(90, prev + 10));
    }
  };
  
  // Update message based on score
  useEffect(() => {
    if (!gameActive) return;
    
    if (score > 30) {
      setMessage("Expert driver! Keep going!");
    } else if (score > 20) {
      setMessage("Amazing skills! Don't crash now!");
    } else if (score > 10) {
      setMessage("Good job! Keep avoiding obstacles!");
    }
  }, [score, gameActive]);
  
  return (
    <div className="game-container">
        <NavBar/>

      <Alert/>
      {!gameActive ? (
        <div className="start-screen">
          <h1>Road Racer</h1>
          <p>Avoid obstacles and survive as long as possible!</p>
          <p>Use arrow keys or tap left/right to steer</p>
          <button className="start-button" onClick={startGame}>Start Race</button>
          <p className="score-display">High Score: {score}</p>
        </div>
      ) : (
        <div 
          className="game-area" 
          ref={gameAreaRef}
          onClick={handleAreaClick}
        >
          {/* Road */}
          <div className="road">
            {/* Road lines */}
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="road-line"
                style={{
                  top: `${(i * 25) % 100}%`,
                  animationDuration: `${3 - gameSpeed/5}s`
                }}
              />
            ))}
            
            {/* Car */}
            <div 
              className="car"
              style={{
                left: `${carPosition}%`
              }}
            />
            
            {/* Obstacles */}
            {obstacles.map(obstacle => (
              <div 
                key={obstacle.id} 
                className="obstacle"
                style={{
                  left: `${obstacle.left}%`,
                  top: `${obstacle.top}%`,
                  width: `${obstacle.width}%`
                }}
              />
            ))}
          </div>
          
          {/* Game info */}
          <div className="game-info">
            <div className="score">Score: {score}</div>
            <div className="message">{message}</div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .game-container {
          width: 100%;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #333;
          font-family: Arial, sans-serif;
        }
        
        .start-screen {
          background-color: #222;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
          color: white;
          max-width: 80%;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        
        .start-screen h1 {
          color: #f44336;
          font-size: 2.5rem;
          margin-bottom: 20px;
        }
        
        .start-button {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 12px 30px;
          font-size: 1.2rem;
          border-radius: 30px;
          cursor: pointer;
          margin: 20px 0;
          transition: all 0.2s;
        }
        
        .start-button:hover {
          background-color: #d32f2f;
          transform: scale(1.05);
        }
        
        .game-area {
          width: 100%;
          max-width: 500px;
          height: 80vh;
          position: relative;
          overflow: hidden;
          background-color: #1a1a1a;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        
        .road {
          width: 100%;
          height: 100%;
          background-color: #444;
          position: relative;
          overflow: hidden;
        }
        
        .road-line {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 50px;
          background-color: white;
          animation: moveDown linear infinite;
        }
        
        @keyframes moveDown {
          0% { top: -10%; }
          100% { top: 100%; }
        }
        
        .car {
          position: absolute;
          bottom: 10%;
          width: 10%;
          height: 15%;
          background-color: #f44336;
          border-radius: 8px 8px 2px 2px;
          transform: translateX(-50%);
          z-index: 10;
        }
        
        .car:before, .car:after {
          content: '';
          position: absolute;
          width: 25%;
          height: 20%;
          background-color: #333;
          border-radius: 50%;
        }
        
        .car:before {
          bottom: -5%;
          left: 10%;
        }
        
        .car:after {
          bottom: -5%;
          right: 10%;
        }
        
        .obstacle {
          position: absolute;
          height: 20px;
          background-color: #ffeb3b;
          z-index: 5;
        }
        
        .game-info {
          position: absolute;
          top: 10px;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          box-sizing: border-box;
        }
        
        .score {
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 8px 15px;
          border-radius: 20px;
          font-size: 1.2rem;
        }
        
        .message {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 10px 20px;
          border-radius: 20px;
          font-size: 1rem;
          white-space: nowrap;
        }
      `}</style>
    </div>
  );
}

export default SimpleRaceGame;