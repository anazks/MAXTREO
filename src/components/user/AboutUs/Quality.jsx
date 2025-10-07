import { ArrowRight, ArrowUpRight } from "lucide-react";
import quality_img from "../../../Images/Quality.png";

export default function QualityStandards() {
  return (
    <div className="flex flex-col md:flex-row p-4 gap-6 max-w-6xl mx-auto" >
      {/* Left section with image */}
      <div className="flex-1">
        <div className="relative h-full w-full rounded-3xl overflow-hidden border border-gray-200">
          {/* Image container with custom shape */}
          <div className="relative h-full rounded-3xl overflow-hidden bg-white">
            {/* Diagonal cut shape using a pseudo-element and clip-path */}
            <div className="absolute inset-0 p-3" style={{
              clipPath: "polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)",
              // background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0))"
            }}>
              <img 
                src={quality_img}
                alt="Futuristic tech tunnel with red and blue lights" 
                className="object-cover w-full h-full"
              />
            </div>
            
            {/* Overlay text */}
            <div className="absolute top-8 left-8 text-white text-2xl font-medium z-10">
              MPG | Quality
            </div>
            
            {/* Bottom right circular button */}
            <div className="absolute bottom-6 right-6 z-10">
              <button className="flex items-center justify-center bg-white rounded-full w-12 h-12 shadow-md">
                <ArrowUpRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right section with text content */}
      <div className="flex-1 space-y-10 py-4">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Our Quality Standards</h1>
          <h3 className="text-xl font-medium text-pink-600">Minimum Performance Guarantee</h3>
          <p className="text-gray-800">
            We specialize in creating high-performance custom PCs tailored to your needs. 
            Our team of experts ensures top-quality components and exceptional craftsmanship 
            to deliver the ultimate gaming and workstation experience.
          </p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">The Community</h2>
          <p className="text-gray-800">
            At our company, we pride ourselves on providing personalized service, 
            expert advice, and after-sales support. With our team of experienced 
            professionals, we ensure that every custom PC we build meets the unique 
            needs and preferences of our customers. Whether you're a gamer, a content 
            creator, or a professional in need of a powerful workstation, we have the 
            expertise to deliver the perfect solution.
          </p>
          
          <div className="pt-4">
            <button className="flex items-center bg-black text-white rounded-full py-2 px-6">
              <span className="mr-2">Blog</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}