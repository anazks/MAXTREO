import { ArrowRight } from "lucide-react";
import { useState } from "react";
import coffyWith from "../../../Images/coffyWith.png";


export default function About() {
  return (
    <div className="flex flex-col md:flex-row p-4 gap-6 max-w-6xl mx-auto">
      {/* Left section with text content */}
      <div className="flex-1 space-y-10">
        <div>
          <h1 className="text-4xl font-bold mb-8">About Us</h1>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Why we stand Out</h2>
          <h3 className="text-xl font-medium text-pink-600">For Gamers by Gamers</h3>
          <p className="text-gray-800">
            We specialize in creating high-performance custom PCs tailored to your needs. 
            Our team of experts ensures top-quality components and exceptional craftsmanship 
            to deliver the ultimate gaming and workstation experience.
          </p>
          
          <button className="flex items-center bg-black text-white rounded-full py-2 px-6 mt-6"
          onClick={() => window.location.href = '/team-neo'}
          >
            <span className="mr-2">Team NeoTokyo</span>
            <ArrowRight size={18} />
          </button>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">The Tech Mission & Core</h2>
          <p className="text-gray-800">
            At our company, we pride ourselves on providing personalized service, 
            expert advice, and after-sales support. With our team of experienced 
            professionals, we ensure that every custom PC we build meets the unique 
            needs and preferences of our customers. Whether you're a gamer, a content 
            creator, or a professional in need of a powerful workstation, we have the 
            expertise to deliver the perfect solution.
          </p>
        </div>
      </div>
      
      {/* Right section with the image */}
      <div className="flex-1">
        <div className="relative h-full w-full rounded-3xl overflow-hidden border border-gray-200">
          <div className="absolute inset-0 "></div>
          <div className="relative rounded-3xl overflow-hidden" style={{padding:"20px",border:"1.5px solid", background:"transparent"}}>
            <img 
                src={coffyWith} 
                alt="Person working on computer code" 
                className="object-cover w-full"
            />
            
          </div>
        </div>
      </div>
    </div>
  );
}