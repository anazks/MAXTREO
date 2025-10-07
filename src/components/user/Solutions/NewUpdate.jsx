import React, { useState } from 'react';
import ModernNavbar from '../NavBar/NavBar';
import NeoFooter from '../Footer/Footer';
import { 
  FaCamera, 
  FaMusic, 
  FaPaintBrush, 
  FaBuilding, 
  FaRobot, 
  FaVideo, 
  FaGamepad, 
  FaCode, 
  FaBriefcase, 
  FaBook 
} from 'react-icons/fa';
import { FiArrowDown } from 'react-icons/fi';
import { BsQuestionCircle } from 'react-icons/bs';
import { RiWhatsappFill } from 'react-icons/ri';

function ExplorePage() {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  const categories = [
    { id: 'photos', name: 'Photos', subtitle: 'Photoshop, Illustrator, Lightroom', icon: <FaCamera size={24} /> },
    { id: 'audio', name: 'Audio Production', subtitle: 'Pro Tools, Logic Pro, Ableton', icon: <FaMusic size={24} /> },
    { id: '3d', name: '3D Design Animation', subtitle: 'Maya, Blender, Cinema 4D', icon: <FaPaintBrush size={24} /> },
    { id: 'architecture', name: 'Architecture CAD, BIM', subtitle: 'AutoCAD, Revit, SketchUp', icon: <FaBuilding size={24} /> },
    { id: 'ai', name: 'AI & ML', subtitle: 'TensorFlow, PyTorch, Jupyter', icon: <FaRobot size={24} /> },
    { id: 'videos', name: 'Videos', subtitle: 'Premiere Pro, Final Cut, DaVinci', icon: <FaVideo size={24} /> },
    { id: 'gaming', name: 'Gaming', subtitle: 'Unity, Unreal Engine, Steam', icon: <FaGamepad size={24} /> },
    { id: 'development', name: 'Development', subtitle: 'VS Code, IntelliJ, Docker', icon: <FaCode size={24} /> },
    { id: 'business', name: 'Business', subtitle: 'Office 365, Slack, Zoom', icon: <FaBriefcase size={24} /> },
    { id: 'education', name: 'Education', subtitle: 'Zoom, Teams, Canvas', icon: <FaBook size={24} /> }
  ];

  const handleWhatsAppClick = () => {
    const phoneNumber = '+918111901609'.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <ModernNavbar/>
      <div className="min-h-screen" style={{marginTop: '70px'}}>
        {/* Header Section with pink gradient */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="text-center py-16 px-4 max-w-7xl mx-auto">
            <h1 className="text-6xl font-light text-pink-400 mb-4 tracking-widest">
              EXPLORE
            </h1>
            <p className="text-gray-600 text-lg mb-2">SOLUTIONS BASED ON</p>
            <p className="text-gray-600 text-lg mb-8">SOFTWARES YOU USE</p>
            
            {/* Down Arrow */}
            <div className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-full">
              <FiArrowDown className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Main Content with light grey background */}
        <div className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 pb-16 pt-12">
            {/* Category Grid - Added responsive background control */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
              <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
                Machines for all Apps
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`relative border-2 border-gray-200 rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-pink-300 ${
                      hoveredCategory === category.id 
                        ? 'bg-black text-white border-black' 
                        : 'bg-white hover:bg-gray-50'  // Always white background by default
                    }`}
                    onMouseEnter={() => setHoveredCategory(category.id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        <div className={`p-3 rounded-full ${
                          hoveredCategory === category.id 
                            ? 'bg-gray-800 text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {category.icon}
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                      <p className={`text-xs ${
                        hoveredCategory === category.id ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {category.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="text-center mt-16">
              <h3 className="text-3xl font-semibold text-gray-800 mb-2">
                We Solve Real Bottlenecks
              </h3>
              <p className="text-gray-600 mb-12">
                With Meticulously Planned Builds
              </p>
              
              {/* Help Section */}
              <div className="bg-gray-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between max-w-2xl mx-auto">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-white rounded-lg p-2 mr-4">
                    <BsQuestionCircle className="w-8 h-8 text-gray-600" />
                  </div>
                  <span className="text-gray-700 text-lg">
                    And if you need help, we are just a click away!
                  </span>
                </div>
                <button 
                  onClick={handleWhatsAppClick}
                  className="bg-green-500 text-white px-6 py-3 rounded-full flex items-center hover:bg-green-600 transition-colors"
                >
                  <RiWhatsappFill className="w-5 h-5 mr-2" />
                  Live Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <NeoFooter/> */}
    </>
  );
}

export default ExplorePage;