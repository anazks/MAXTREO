import React, { useState, useEffect } from 'react';
import AdminSideBar from '../../components/Admin/Sidebar';

function Home({ children }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        // Auto-expand sidebar on larger screens
        setIsSidebarExpanded(false);
      } else {
        // Auto-collapse sidebar on mobile
        setIsSidebarExpanded(false);
      }
    };

    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100 font-rajdhani">
      <AdminSideBar isExpanded={isSidebarExpanded} toggleSidebar={toggleSidebar} />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${
        isSidebarExpanded ? 
          'ml-16 md:ml-64' : // Expanded: 64 on desktop, 16 on mobile
          'ml-16 md:ml-20'    // Collapsed: 20 on desktop, 16 on mobile
      }`}>
        <main className="p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Home;