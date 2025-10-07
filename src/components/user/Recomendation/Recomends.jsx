import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Recoments from '../../../Images/Recoments.png'
import Product from '../Products/ProductsList'
import IntelImage from '../../../Images/Storepage_logs/intel.jpg'
import AMDImage from '../../../Images/Storepage_logs/amd.png'
import NvidiaImage from '../../../Images/Storepage_logs/nvidia-logo-vert.png';
import SamsungImage from '../../../Images/Storepage_logs/samsug-removebg-preview.png'
import CoolerImage from '../../../Images/Storepage_logs/cooler-master-logo-png-transparent.png'
import CorsairImage from '../../../Images/Storepage_logs/corsair-2-logo-black-and-white.png'
import LogitechImage from '../../../Images/Storepage_logs/Logitech_logo.png'
import WesternDigitalImage from '../../../Images/Storepage_logs/Western_Digital_logo.png'

export default function NeoTokyoGaming() {
  return (
    <>
     <div className="flex items-center justify-center w-full bg-white p-4 " style={{
    marginTop: "60px",
    [`@media (min-width: 768px)`]: {
      marginTop: "200px"
    }
  }}>
      <div className="relative w-full h-96 sm:h-[500px] md:h-[600px] rounded-3xl overflow-hidden">
        {/* Background gradient and image */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900" >
          {/* Using placeholder for demo */}
          <img 
            src={Recoments}
            alt="NeoTokyo Gaming Background" 
            className="w-full h-full object-cover opacity-70"
          />
        </div>
        
        {/* Top box with title and recommendations */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4/5 sm:w-3/4 md:w-3/5 bg-white rounded-b-3xl flex flex-col sm:flex-row justify-between items-center px-3 sm:px-6 py-2 sm:py-0 h-auto sm:h-16 md:h-20" >

          <div className="text-center sm:text-left">
            <p className="text-lg sm:text-xl md:text-3xl font-medium text-black truncate">NeoTokyo</p>
            <span className="text-xs sm:text-sm md:text-lg text-black">Gaming Experiences</span>
          </div>
          <div className="mt-1 sm:mt-0">
            <span className="text-pink-600 text-xs sm:text-sm md:text-lg font-medium">Our Recommendations</span>
          </div>
        </div>
        
        {/* Middle box with shop button */}
        <div className="absolute bottom-20 md:bottom-24 right-4 md:right-8">
          <button className="flex items-center gap-2 bg-black text-white py-2 px-3 sm:px-4 md:py-3 md:px-6 rounded-full hover:bg-gray-800 transition">
            <span className="text-xs sm:text-sm md:text-base">Shop Now</span>
            <ArrowUpRight size={16} className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
        
        {/* Bottom box with rating and quality */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4/5 sm:w-3/4 md:w-3/5 bg-white rounded-t-3xl shadow-lg flex flex-col sm:flex-row items-center h-auto sm:h-16 md:h-20 py-2 sm:py-0">
          <div className="rating w-full sm:w-1/2 flex items-center justify-center gap-1 sm:gap-2">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-black">5.0</div>
            <div className="flex flex-col">
              <div className="flex">
                <span className="text-yellow-400 text-xs sm:text-sm">★</span>
                <span className="text-yellow-400 text-xs sm:text-sm">★</span>
                <span className="text-yellow-400 text-xs sm:text-sm">★</span>
                <span className="text-yellow-400 text-xs sm:text-sm">★</span>
                <span className="text-yellow-400 text-xs sm:text-sm">★</span>
              </div>
              <p className="text-xs text-black">121 Reviews</p>
            </div>
          </div>
          <div className="hidden sm:block border-r-2 border-black h-1/2"></div>
          <div className="quality w-full sm:w-1/2 flex items-center justify-center mt-1 sm:mt-0">
            <p className="text-xs sm:text-sm md:text-base font-medium text-black">Uncompromising Quality</p>
          </div>
        </div>
      </div>
    </div>
     {/* Powered By section - positioned below the main card */}
       
      <div className="w-90 max-w-5xl mt-6 flex items-center" style={{margin:"auto",marginBottom:"20px",justifyContent:"center", padding:"10px"}}>
        <div className="text-black font-medium mr-4">Powered By</div>
        <div className="h-6 border-r border-gray-400 mr-4"></div>
        <div className="flex items-center justify-start gap-6 " style={{flexWrap:"nowrap", overflow:"auto"}}>
          {/* Partner logos - using placeholder images */}
          <img src={IntelImage} alt="Intel" className="h-6 object-contain" />
          <img src={AMDImage} alt="AMD" className="h-6 object-contain" />
          <img src={NvidiaImage} alt="NVIDIA" className="h-6 object-contain" />
          <img src={SamsungImage} alt="Samsung" className="h-6 object-contain" />
          <img src={CoolerImage} alt="Cooler Master" className="h-6 object-contain" />
          <img src={CorsairImage} alt="Corsair" className="h-6 object-contain" />
          <img src={LogitechImage} alt="Logitech" className="h-6 object-contain" />
          <img src={WesternDigitalImage} alt="Western Digital" className="h-6 object-contain" />
        </div>
      </div>

      <Product/>
      </>
  );
}