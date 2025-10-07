import React from 'react';
import person1 from '../../../Images/persons/Ajay.png';
import person2 from '../../../Images/persons/RoneyThomas.png';
import person3 from '../../../Images/persons/Julien.png';
import { FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

function PriorityOne() {
  const team = [
    {
      name: 'Ajay Joy',
      position: 'CHIEF EXECUTIVE OFFICER',
      image: person1,
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'mailto:ajay@priorityone.com',
      },
      specialty: 'Strategic Leadership',
    },
    {
      name: 'Roney Thomas',
      position: 'CHIEF TECHNOLOGICAL OFFICER',
      image: person2,
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'mailto:roney@priorityone.com',
      },
      specialty: 'Cloud Infrastructure',
    },
    {
      name: 'Julian Prasad',
      position: 'RESEARCH & DEVELOPMENT HEAD',
      image: person3,
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'mailto:julian@priorityone.com',
      },
      specialty: 'Machine Learning',
    },
  ];

  return (
    <div 
      className="w-full min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6"
      style={{
        fontFamily: "'Rajdhani', sans-serif",
      }}
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Priority <span className="text-gray-800">One</span> by Neo Tokyo
          </h1>
          <div className="w-24 h-1 bg-black mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto">
            For those who demand the absolute best we have to offer
          </p>
        </header>

        {/* Desktop Layout */}
        <div className="hidden md:flex justify-center items-start gap-6 lg:gap-8">
          {team.map((member, index) => (
            <div 
              className="flex-1 max-w-xs flex flex-col items-center text-center"
              key={index}
            >
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-gray-200 mb-6">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-sm text-gray-700 mb-2">{member.position}</p>
                <div className="text-xs font-medium text-gray-500 tracking-wide py-1">
                  {member.specialty}
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <a 
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
                  aria-label={`${member.name}'s LinkedIn`}
                >
                  <FaLinkedin />
                </a>
                <a 
                  href={member.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
                  aria-label={`${member.name}'s Twitter`}
                >
                  <FaTwitter />
                </a>
                <a 
                  href={member.social.email}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
                  aria-label={`Email ${member.name}`}
                >
                  <FaEnvelope />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout with Horizontal Scrolling */}
        <div className="md:hidden w-full">
          <div className="flex overflow-x-auto pb-8 gap-6 px-2" style={{ scrollbarWidth: 'thin' }}>
            {team.map((member, index) => (
              <div 
                className="flex-shrink-0 w-64 flex flex-col items-center text-center"
                key={index}
              >
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 mb-6">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-gray-700 mb-2">{member.position}</p>
                  {/* <div className="text-xs font-medium text-gray-500 tracking-wide py-1">
                    {member.specialty}
                  </div> */}
                </div>
                {/* <div className="flex justify-center gap-3">
                  <a 
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
                    aria-label={`${member.name}'s LinkedIn`}
                  >
                    <FaLinkedin />
                  </a>
                  <a 
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
                    aria-label={`${member.name}'s Twitter`}
                  >
                    <FaTwitter />
                  </a>
                  <a 
                    href={member.social.email}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
                    aria-label={`Email ${member.name}`}
                  >
                    <FaEnvelope />
                  </a>
                </div> */}
              </div>
            ))}
          </div>
          
          {/* Scroll indicator */}
          <div className="flex justify-center mt-4">
            <div className="flex gap-1">
              {team.map((_, index) => (
                <div key={index} className="w-2 h-2 bg-gray-300 rounded-full"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Custom scrollbar styles */}
        <style jsx>{`
          .overflow-x-auto::-webkit-scrollbar {
            height: 6px;
          }
          .overflow-x-auto::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .overflow-x-auto::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          .overflow-x-auto::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `}</style>
      </div>
    </div>
  );
}

export default PriorityOne;