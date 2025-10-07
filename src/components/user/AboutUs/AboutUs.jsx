import React from "react";
import { IoArrowForwardCircleSharp } from "react-icons/io5";
import "./about.css";
import About from "./About";

function AboutUs() {
  return (
    <div className="w-[95%] mx-auto  md:my-16 min-h-[90vh] bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col md:flex-row justify-between items-center">
      {/* Left Section */}
      <div className="w-full md:w-[48%] text-black mb-10 md:mb-0">
        <h1 className="text-3xl md:text-4xl font-normal leading-tight text-center md:text-left font-['Radio_Canada']">
          About Us
        </h1>
        
        <div className="mt-8">
          <h1 className="text-2xl md:text-3xl font-normal font-['Radio_Canada']">
            Why We Stand Out
          </h1>
          <span className="font-['Raleway'] text-base md:text-lg font-semibold text-[#E7013C] block my-2">
            For Gamers by Gamers
          </span>
          <p className="font-['Raleway'] text-base md:text-lg font-normal leading-7 text-justify">
            We specialize in creating high-performance custom PCs tailored to
            your needs. Our team of experts ensures top-quality components and
            exceptional craftsmanship to deliver the ultimate gaming and
            workstation experience.
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-5 py-3 my-6 bg-black text-white rounded-full text-sm transition-all duration-300 ease-in-out hover:bg-[#E7013C] hover:scale-105">
          <IoArrowForwardCircleSharp className="text-2xl" />
          <span className="text-base font-bold">Team Neo Tokyo</span>
        </button>
        
        <div className="mt-6">
          <h1 className="text-2xl md:text-3xl font-normal font-['Radio_Canada']">
            The Tech Mission & Core
          </h1>
          <p className="font-['Raleway'] text-base md:text-lg font-normal leading-7 text-justify mt-3">
            At our company, we pride ourselves on providing personalized
            service, expert advice, and after-sales support. With our team of
            experienced professionals, we ensure that every custom PC we build
            meets the unique needs and preferences of our customers. Whether
            you're a gamer, a content creator, or a professional in need of a
            powerful workstation, we have the expertise to deliver the perfect
            solution.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full sm:w-4/5 md:w-[45%] h-80 md:h-auto rounded-lg flex items-center justify-center">
        <div
          className="h-64 sm:h-72 md:h-80 lg:h-96 w-full rounded-tl-[150px] rounded-br-[150px] bg-cover bg-center"
          style={{
            clipPath: "polygon(0% 45%, 36% 0%, 100% 0%, 100% 74%, 67% 100%, 0% 99%)",
            backgroundImage: "url('../../../Images/coffyWith.png')"
          }}
        ></div>
      </div>
    </div>
  );
}

export default AboutUs;