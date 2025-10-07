import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Logo from '../../../Images/LoginWith/neo_tokyo-logo.png';
import NavBar from '../NavBar/NavBar';
import Footer from '../Footer/Footer';
import { Clock, Mail, Phone, MessageCircle, MapPin } from "lucide-react";

// Fix duplicate imports - keep only one instance
import { useAuth } from '../../../Context/UserContext';
import About from '../AboutUs/About';
import QualityStandards from '../AboutUs/Quality';
import DirectionalSection from '../AboutUs/Directional';

// Card components for stacking
const HeaderCard = () => (
  <motion.div 
    className="w-full max-w-6xl mx-auto mb-8 p-4"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: false, margin: "-100px" }}
    transition={{ duration: 0.6 }}
  >
    <h1 className="text-4xl">Embark on your <br /> Troubleshooting Journey</h1>
    <div className="h-1 bg-black w-full mt-2" style={{height:"10px", borderRadius:"5px",marginTop:"6px"}}></div>
  </motion.div>
);

// Card stack effect component
const StackedCard = ({ children, index = 0, total = 1 }) => {
  // Calculate staggered animations based on card position in stack
  const delay = index * 0.1;
  const offsetY = index * 10;
  const scale = 1 - (index * 0.02);
  const zIndex = total - index;

  return (
    <motion.div
      className="w-full rounded-2xl overflow-hidden"
      style={{ 
        zIndex,
        position: index === 0 ? "relative" : "absolute",
        top: `${offsetY}px`,
        left: 0,
        right: 0,
        opacity: 1 - (index * 0.2),
        transformOrigin: "center top"
      }}
      initial={{ opacity: 0, y: 100, scale: scale - 0.1 }}
      whileInView={{ opacity: 1 - (index * 0.2), y: offsetY, scale }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.7, delay }}
    >
      {children}
    </motion.div>
  );
};

const SupportContentCard = () => {
  const { token, setToken, user } = useAuth();

  return (
    <div className="relative w-full max-w-6xl mx-auto mb-16 pb-12">
      {/* Stack effect - creating shadow cards underneath */}
      <StackedCard index={2} total={3}>
        <div className="h-full w-full"></div>
      </StackedCard>
      
      <StackedCard index={1} total={3}>
        <div className="h-full w-full"></div>
      </StackedCard>
      
      {/* Main content card */}
      <StackedCard index={0} total={3}>
        <div className="flex flex-col md:flex-row " style={{gap:"30px"}}>
          {/* Left Section */}
          <div className="w-full md:w-7/12 p-8 bg-white" style={{border:"1.5px solid black",borderRadius:"20px",padding:"30px"}}>
            <h2 className="text-2xl font-semibold mb-6">Hi {
                  user ? user.name : ""}, How can we Help you?</h2>
            
            {/* Raise a Ticket Section */}
            <div className="border-b border-gray-300 pb-6 mb-6">
              <div className="flex flex-col mb-4">
                {
                  user ? (
                    <>
                      <div className="inline-block px-3 py-1 w-fit mb-2">
                        <span className="font-large font-semibold">Raise a Ticket</span>
                        <span className="text-blue-600 ml-2 underline cursor-pointer"><a href="/tickets">Click Here</a></span>
                      </div>
                      <div className="inline-block px-3 py-1 w-fit mb-2">
                        <span className="font-large font-semibold">View Live Tickets</span>
                        <span className="text-blue-600 ml-2 underline cursor-pointer"><a href="/ticketsresolved">Click Here</a></span>
                      </div>
                      {/* <div className="inline-block px-3 py-1 w-fit mb-2">
                        <span className="font-large font-semibold">Manage Tickets</span>
                        <span className="text-blue-600 ml-2 underline cursor-pointer"><a href="/manage-tickets">Click Here</a></span>
                      </div> */}
                    </>
                  ) : ''
                }
              </div>
            </div>
            
            {/* FAQ Section */}
            <div className="border-b border-gray-300 pb-6 mb-6">
              <h3 className="font-bold mb-4">FAQ's (Quick View)</h3>
              
              <div className="mb-4">
                <h4 className="font-semibold">How do I place an order for a custom-built PC?</h4>
                <p className="text-sm text-gray-700">
                  Placing an order is easy! Simply browse our selection of customizable PC configurations, 
                  choose the components that best suit your needs, and add them to your cart. Follow the 
                  checkout process to provide your shipping and payment information, and we'll take care 
                  of the rest.
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold">Can I customize the specifications of my PC before ordering?</h4>
                <p className="text-sm text-gray-700">
                  Yes, absolutely! We offer a wide range of component options for you to customize your 
                  PC according to your preferences and budget.
                </p>
              </div>
              
              <button className="text-blue-600 flex items-center text-sm">
                View More <span className="ml-1">+</span>
              </button>
            </div>
            
            {/* Queries Section */}
            <div className="border-b border-gray-300 pb-6 mb-6">
              <h3 className="font-bold mb-2">Queries</h3>
              <p className="text-sm">For Queries contact us at <a href="mailto:info@neotokyo.in" className="text-blue-600">info@neotokyo.in</a></p>
            </div>
            
            {/* Browse Help Topics */}
            <div>
              <h3 className="font-bold">Browse Help Topics</h3>
            </div>
          </div>
          
          {/* Right Section */}
          <div className="w-full md:w-5/12 p-8 bg-white" style={{border:"1.5px solid black",borderRadius:"20px",padding:"30px"}}>
            {/* Navigation Card */}
            <div className="bg-white rounded-lg p-6 shadow-md mb-6">
              <h3 className="font-bold mb-4 text-xl">Navigation</h3>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Reach Us</h4>
                <div className="flex items-start mb-4">
                  <div className="rounded-full p-3 mr-4">
                    <img src={Logo} alt="Logo.jpg" className="w-6 h-6" />
                  </div>
                  <div className="text-sm">
                    <p>Floor no. 2, Koroth Arcade,</p>
                    <p>Vennala High School Rd.,</p>
                    <p>opposite to V-Guard, Vennala,</p>
                    <p>Kochi, Kerala 682028</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="rounded-full p-3 mr-4">
                    <div className="rounded-full w-6 h-6">
                      <img src={Logo} alt="Logo.jpg" className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-sm">
                    <p>New Age Buildings: Mofussil Bus</p>
                    <p>Stand Building, New, 671803,</p>
                    <p>Mavoor Rd, Arayidathupalam,</p>
                    <p>Kozhikode, Kerala 673004</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Member Card */}
            {user && (
              <div className="bg-black text-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-3xl font-bold">
                    NT<br />KO
                  </div>
                  <div>
                    <div className="font-bold">Priority One</div>
                    <div className="text-xs uppercase tracking-widest">PREMIUM MEMBERSHIP</div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="text-xl font-medium">{user.name}</div>
                  <div className="text-yellow-400 text-xs">02/21/2024</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </StackedCard>
    </div>
  );
};

const FAQsCard = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto mb-16 pb-12">
      {/* Stack effect - creating shadow cards underneath */}
      <StackedCard index={2} total={3}>
        <div className="h-full w-full"></div>
      </StackedCard>
      
      <StackedCard index={1} total={3}>
        <div className="h-full w-full"></div>
      </StackedCard>
      
      {/* Main content card */}
      <StackedCard index={0} total={3}>
        <div className="p-8 bg-white">
          <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">How do I track my order?</h3>
              <p>You can track your order by logging into your account and navigating to the "Orders" section. Alternatively, you can use the tracking number provided in your confirmation email.</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">What is your return policy?</h3>
              <p>We offer a 30-day return policy for most items. Products must be in their original condition with all packaging and accessories. Some exclusions may apply for customized items.</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">How can I request a refund?</h3>
              <p>Refunds can be requested through your account dashboard or by contacting our support team. Once approved, refunds typically process within 3-5 business days to your original payment method.</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">Do you offer international shipping?</h3>
              <p>Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can see specific shipping information during checkout.</p>
            </div>
          </div>
        </div>
      </StackedCard>
    </div>
  );
};

const AboutCard = () => {
  return (
    <motion.div 
      className="w-full max-w-6xl mx-auto mb-16 pb-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      transition={{ duration: 0.7 }}
    >
      <About />
    </motion.div>
  );
};

const QualityCard = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto mb-16 pb-12">
      {/* Stack effect - creating shadow cards underneath */}
      <StackedCard index={2} total={3}>
        <div className="h-full w-full"></div>
      </StackedCard>
      
      <StackedCard index={1} total={3}>
        <div className="h-full w-full"></div>
      </StackedCard>
      
      {/* Main content card */}
      <StackedCard index={0} total={3}>
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6">Our Quality Standards</h2>
          <QualityStandards />
        </div>
      </StackedCard>
    </div>
  );
};

const ContactCard = () => {
  return (
    <div className="relative w-full max-w-6xl mx-auto mb-16 pb-12">
      {/* Stack effect - creating shadow cards underneath */}
      <StackedCard index={2} total={3}>
        <div className="h-full w-full bg-gray-800"></div>
      </StackedCard>
      
      <StackedCard index={1} total={3}>
        <div className="h-full w-full bg-gray-900"></div>
      </StackedCard>
      
      {/* Main content card */}
      <StackedCard index={0} total={3}>
        <div className="bg-black text-white p-10 rounded-2xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Get in <span className="text-pink-600">Touch</span>
            </h2>
            <p className="text-gray-300 text-lg">
              Ready to build your dream PC? Our team is here to help you every step of the way.
            </p>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Support Hours */}
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <div className="bg-pink-600 p-3 rounded-full mr-4">
                  <Clock size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">Support Hours</h3>
              </div>
              
              <div className="space-y-4 ml-16">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">Monday - Friday</span>
                  <span className="font-semibold text-pink-600">9AM - 8PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-300">Saturday</span>
                  <span className="font-semibold text-pink-600">10AM - 6PM</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300">Sunday</span>
                  <span className="font-semibold text-gray-500">Closed</span>
                </div>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-center mb-6">
                <div className="bg-pink-600 p-3 rounded-full mr-4">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold">Contact Methods</h3>
              </div>
              
              <div className="space-y-6 ml-16">
                <div className="flex items-center group hover:bg-gray-900 p-3 rounded-lg transition-colors">
                  <Mail size={20} className="text-pink-600 mr-4" />
                  <div>
                    <p className="text-gray-300 text-sm">Email</p>
                    <p className="font-semibold group-hover:text-pink-600 transition-colors">info@neotokyo.in</p>
                  </div>
                </div>
                
                <div className="flex items-center group hover:bg-gray-900 p-3 rounded-lg transition-colors">
                  <Phone size={20} className="text-pink-600 mr-4" />
                  <div>
                    <p className="text-gray-300 text-sm">Phone</p>
                    <p className="font-semibold group-hover:text-pink-600 transition-colors">+91 (800) 555-1234</p>
                  </div>
                </div>
                
                <div className="flex items-center group hover:bg-gray-900 p-3 rounded-lg transition-colors">
                  <MessageCircle size={20} className="text-pink-600 mr-4" />
                  <div>
                    <p className="text-gray-300 text-sm">Live Chat</p>
                    <p className="font-semibold group-hover:text-pink-600 transition-colors">Available during business hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-pink-600 to-pink-500 p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-2">Ready to Start Your Build?</h4>
              <p className="text-pink-100 mb-4">Join thousands of satisfied gamers who chose NeoTokyo for their custom PC builds.</p>
              <button className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors">
                Start Your Build
              </button>
            </div>
          </div>
        </div>
      </StackedCard>
    </div>
  );
};

// Live Chat Button Component
const LiveChatButton = () => (
  <div className="fixed top-20 right-8 z-50">
    <motion.button 
      className="bg-black text-white rounded-full py-3 px-8 flex items-center shadow-lg"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      whileHover={{ scale: 1.05 }}
    >
      <span className="mr-2">Live Chat</span>
      <span className="inline-block w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
        ↗
      </span>
    </motion.button>
  </div>
);

// Main component
function AboutPage() {
  const containerRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen bg-white"
      style={{width:"100%", margin:"auto", borderRadius:"30px", overflow: "hidden", position: "relative"}}
    >
      <NavBar />
      {/* <LiveChatButton /> */}
      
      {/* Background parallax effect */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full z-0 opacity-20"
        style={{
          backgroundImage: "linear-gradient(45deg, #e6fffa 0%, #ebf4ff 100%)",
          backgroundSize: "200% 200%",
          y: scrollY * 0.2,
        }}
      />
      
      <div className="pt-24 pb-16 relative z-10">
        <div className="px-4 space-y-12">
          {/* <HeaderCard /> */}
          
          <div className="space-y-24">
          
            <AboutCard />
            <QualityCard />
            <DirectionalSection />
            <ContactCard />
          </div>
        </div>
        
        <motion.div 
          className="mt-32"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
          <Footer />
        </motion.div>
      </div>
    </div>
  );
}

export default AboutPage;