import React from 'react';
import { 
  FaWhatsapp, 
  FaInstagram,
  FaArrowUp
} from "react-icons/fa";
import { 
  SlSocialFacebook 
} from "react-icons/sl";
import { 
  FiMail, 
  FiPhone,
  FiMapPin
} from "react-icons/fi";
import { BsShieldLock } from "react-icons/bs";

function MobileFooter() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-black text-white p-6 font-sans" style={{width: '100%',borderRadius:"30px"}}>
      {/* Company Info Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">NEO TOKYO</h2>
        <p className="text-gray-400 mb-4">Building Experiences Since 20s</p>
        <p className="text-gray-300">Creating next-gen PC solutions</p>
      </div>

      {/* Contact Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">Contact Us</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <FiPhone className="mr-3 text-gray-400" />
            <a href="tel:+917920938981" className="text-gray-300 hover:text-white">+91 7920938981</a>
          </div>
          <div className="flex items-center">
            <FiMail className="mr-3 text-gray-400" />
            <a href="mailto:support@neotokyo.in" className="text-gray-300 hover:text-white">support@neotokyo.in</a>
          </div>
          <div className="flex items-start">
            <FiMapPin className="mr-3 mt-1 text-gray-400" />
            <div>
              <p className="text-gray-300">Floor no. 2, Koroth Arcade,</p>
              <p className="text-gray-300">Vennala High School Rd,</p>
              <p className="text-gray-300">opposite to V-Guard, Vennala,</p>
              <p className="text-gray-300">Kochi, Kerala 682028</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Company */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-white">About</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">FAQ's</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Blog</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
          </ul>
        </div>

        {/* Store */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">Store</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-white">PC's</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Peripherals</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Gear</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Accessories</a></li>
          </ul>
        </div>

        {/* Solutions */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">Solutions</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-white">Home PC's</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Gaming PC's</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Workstations</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Enterprise</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Cookie Policy</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Terms</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Returns</a></li>
          </ul>
        </div>
      </div>

      {/* Social Media */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Connect With Us</h3>
        <div className="flex space-x-4">
          <a 
            href="https://wa.me/917920938981" 
            className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition"
            aria-label="WhatsApp"
          >
            <FaWhatsapp className="text-xl" />
          </a>
          <a 
            href="https://facebook.com" 
            className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition"
            aria-label="Facebook"
          >
            <SlSocialFacebook className="text-xl" />
          </a>
          <a 
            href="https://instagram.com" 
            className="bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition"
            aria-label="Instagram"
          >
            <FaInstagram className="text-xl" />
          </a>
        </div>
      </div>

      {/* Back to Top */}
      <button 
        onClick={scrollToTop}
        className="flex items-center justify-center w-full py-3 bg-gray-800 rounded-lg mb-6 hover:bg-gray-700 transition"
      >
        <span className="mr-2">Back to Top</span>
        <FaArrowUp />
      </button>

      {/* Copyright */}
      <div className="flex flex-col items-center pt-4 border-t border-gray-800">
        <div className="flex items-center mb-2">
          <BsShieldLock className="mr-2" />
          <span className="text-sm text-gray-400">Secure Payments</span>
        </div>
        <p className="text-sm text-gray-500">© {new Date().getFullYear()} Neo Tokyo. All rights reserved.</p>
      </div>
    </div>
  );
}

export default MobileFooter;