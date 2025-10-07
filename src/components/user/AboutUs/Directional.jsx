import { ArrowRight, ArrowUpRight } from "lucide-react";
import directional1 from "../../../Images/diractional1.png"
import directional2 from "../../../Images/Diractional2.png"

export default function DirectionalSection() {
  return (
    <div className="max-w-6xl mx-auto p-4" >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Text content and small image */}
        <div className="flex-1 space-y-10">
          {/* Text content section */}
          <div className="space-y-4 mb-8">
            <h1 className="text-4xl font-bold">Directional</h1>
            <h3 className="text-xl font-medium text-pink-600">AI and ML Tech</h3>
            <p className="text-gray-800">
              We specialize in creating high-performance custom PCs tailored to your needs. 
              Our team of experts ensures top-quality components and exceptional craftsmanship 
              to deliver the ultimate gaming and workstation experience.
            </p>
            
            <div className="pt-4">
              <button  className="flex items-center bg-black text-white rounded-full py-2 px-6"
                onClick={() => window.location.href = '/support'}>
                <span className="mr-2">Support</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          
          {/* Small image container */}
          <div className="rounded-3xl overflow-hidden border border-gray-200 w-full">
            <div className="relative">
              {/* Diagonal cut shape using clip-path */}
              <div className="w-full aspect-video p-3" style={{
                clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)",
                // background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0))"
              }}>
                <img 
                  src={directional1} 
                  alt="Tech component closeup" 
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Large image */}
        <div className="flex-1">
          <div className="rounded-3xl overflow-hidden border border-gray-200 p-3">
            <div className="relative">
              {/* Full image with overlay text */}
              <div className="w-full h-full aspect-square">
                <img 
                  src={directional2} 
                  alt="Desktop workspace with laptop, coffee and tech gadgets" 
                  className="object-cover w-full h-full"
                />
                
                {/* Overlay text */}
                <div className="absolute top-8 right-8 text-white text-3xl font-medium">
                  Future
                </div>
                
                {/* Bottom right circular button */}
                <div className="absolute bottom-6 right-6">
                  <button className="flex items-center justify-center bg-white rounded-full w-12 h-12 shadow-md">
                    <ArrowUpRight size={20} />
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