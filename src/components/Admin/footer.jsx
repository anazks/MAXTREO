import React from 'react';

const NeoTokyoFooter = () => {
  return (
    <footer className="bg-pink-600 text-white py-4">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold">
          © {new Date().getFullYear()} Neo Tokyo - Developed by 
          <span> Byteboot Techno Solutions Pvt Ltd</span>
        </p>
      </div>
    </footer>
  );
};

export default NeoTokyoFooter;