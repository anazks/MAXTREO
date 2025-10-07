import React from 'react'
import Brands from './Brands'
import BannerImage from '../../../Images/nv4.png';

function Banner() {
  return (
    <div className="w-full min-h-screen flex justify-center items-center p-2 sm:p-4 md:p-6 lg:p-8 bg-gray-50"
    style={{
        width:"97vw", 
        height:"97vh", 
        
        fontFamily: "'Rajdhani', sans-serif",
        borderRadius: "30px",
      }}
    >
      <div className="max-w-6xl w-full flex flex-col items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        <div className="bg-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-lg md:rounded-xl lg:rounded-2xl shadow-lg w-full max-w-5xl flex justify-center items-center">
          <a 
            href="/nvidia" 
            
            rel="noopener noreferrer"
            className="block w-full cursor-pointer"
          >
            <img 
              src={BannerImage} 
              alt="Banner - Click to visit NVIDIA" 
              className="w-full h-auto max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] lg:max-h-[70vh] rounded-md md:rounded-lg lg:rounded-xl object-contain hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          </a>
        </div>
        <div className="w-full">
          <Brands/>
        </div>
      </div>
    </div>
  )
}

export default Banner