import React, { useState, useRef, useEffect, useMemo } from "react";
import ModernNavbar from "../NavBar/NavBar";
import ProductFooter from "../Footer/ProductFooter";
import { getmyTickets } from '../../../Services/userApi';

// API service function
const updateTicketGrievance = async (ticketId, payload) => {
  console.log("Sending update:", ticketId, payload);
  try {
    // Replace with actual API call when ready
    return { success: true };
  } catch (error) {
    console.error("Error updating ticket:", error);
    throw error;
  }
};

const TicketManagement = () => {
  // State management
  const [grievanceText, setGrievanceText] = useState("");
  const [activeTab, setActiveTab] = useState("COMPLAINTS");
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Refs
  const textareaRef = useRef(null);
  const lineHeight = 24;

  // Derived state
  const rows = useMemo(() => {
    if (!textareaRef.current) return Array(7).fill(0);
    const numberOfLines = Math.max(textareaRef.current.scrollHeight / lineHeight, 7);
    return Array(Math.ceil(numberOfLines)).fill(0);
  }, [grievanceText]);

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // Adjust textarea rows when text changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(textareaRef.current.scrollHeight, 7 * lineHeight)}px`;
    }
  }, [grievanceText]);

  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchTickets = async () => {
    try {
      const response = await getmyTickets();
      setTickets(response.data);
      if (response.data.length > 0) {
        setSelectedTicket(response.data[0]);
        setGrievanceText(response.data[0].grievance || "");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setNotification({
        show: true,
        message: "Failed to load tickets. Please try again.",
        type: "error"
      });
    }
  };

  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
    setGrievanceText(ticket.grievance || "");
    setActiveTab("COMPLAINTS"); // Reset to default tab
  };

  const submitGrievanceUpdate = async () => {
    if (!selectedTicket) return;

    setIsSubmitting(true);
    try {
      await updateTicketGrievance(selectedTicket.ticket_id, { grievance: grievanceText });
      setNotification({
        show: true,
        message: "Grievance updated successfully!",
        type: "success"
      });
      await fetchTickets(); // Refresh tickets after update
    } catch (error) {
      setNotification({
        show: true,
        message: "Failed to update grievance. Please try again.",
        type: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tab content components
  const tabContent = {
    COMPLAINTS: (
      <div className="space-y-2">
        <h3 className="text-sm font-bold font-['Rajdhani',_sans-serif]">Your Complaint</h3>
        <p className="text-xs sm:text-sm font-['Raleway',_sans-serif] leading-relaxed">
          {selectedTicket?.grievance || "No complaint content available."}
        </p>
      </div>
    ),
    DEVICE: (
      <div className="space-y-2">
        <h3 className="text-sm font-bold font-['Rajdhani',_sans-serif]">Device Information</h3>
        <div className="bg-white p-3 rounded shadow-sm">
          <p className="text-xs sm:text-sm font-['Raleway',_sans-serif] leading-relaxed">
            <span className="font-semibold">Product:</span> {selectedTicket?.product_name || "N/A"} <br />
            <span className="font-semibold">Serial:</span> {selectedTicket?.product_serial_number || "N/A"}
          </p>
        </div>
      </div>
    ),
    CONCLUSION: (
      <div className="space-y-2">
        <h3 className="text-sm font-bold font-['Rajdhani',_sans-serif]">Admin Response</h3>
        <p className="text-xs sm:text-sm font-['Raleway',_sans-serif] leading-relaxed">
          {selectedTicket?.conclusion || "We understand your concerns and our team is currently reviewing your complaint."}
        </p>
      </div>
    ),
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <ModernNavbar />
      
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white transition-all duration-300 transform`}>
          {notification.message}
        </div>
      )}
      
      <main className="flex-grow w-full p-4 sm:p-6 md:p-8" style={{marginTop:"100px"}}>
        <div className="max-w-7xl mx-auto">
          {/* Header with branding */}
          <div className="flex items-center mb-8">
            <div className="text-white text-4xl font-bold mr-4 font-['Rajdhani',_sans-serif] leading-none">
              <div>NT</div>
              <div>KO</div>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-xl font-bold font-['Rajdhani',_sans-serif]">Priority One</span>
              <span className="text-white text-sm font-['Raleway',_sans-serif]">PREMIUM MEMBERSHIP</span>
            </div>
          </div>

          {/* Main content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* LEFT SIDE - Ticket List */}
            <div className="w-full lg:w-2/5 space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              <h2 className="text-white text-xl font-bold font-['Rajdhani',_sans-serif] mb-4">Your Tickets</h2>
              
              {tickets.length === 0 ? (
                <div className="bg-gray-800 rounded-2xl p-6 text-center text-white">
                  <p className="font-['Raleway',_sans-serif]">No tickets found</p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div 
                    key={ticket.ticket_id}
                    className={`bg-[#63a375] rounded-2xl p-3 sm:p-4 overflow-hidden hover:shadow-lg cursor-pointer transition-all duration-200 ${
                      selectedTicket?.ticket_id === ticket.ticket_id 
                        ? "ring-2 ring-white transform scale-[1.02]" 
                        : "hover:opacity-90"
                    }`}
                    onClick={() => handleTicketSelect(ticket)}
                  >
                    <div className="flex flex-col sm:flex-row rounded-lg overflow-hidden h-full">
                      {/* Barcode Section */}
                      <div className="w-full sm:w-2/5 bg-[#4A5F53] border-r border-dashed border-black rounded-l-lg flex flex-col relative p-2">
                        <div className="h-28 flex items-center justify-center">
                          <div className="w-16 h-full transform -rotate-90 flex items-center">
                            <div className="w-full h-full bg-contain bg-no-repeat bg-center" 
                                 style={{ backgroundImage: `url('/api/placeholder/64/200')` }}>
                            </div>
                          </div>
                        </div>
                        <div className="transform rotate-90 origin-center absolute top-1/2 right-0 -mr-10 font-bold text-sm tracking-widest text-white font-['Rajdhani',_sans-serif]">
                          RESOLVED TICKET
                        </div>
                        <div className="absolute bottom-4 left-4 text-white text-2xl font-bold leading-none font-['Rajdhani',_sans-serif]">
                          <div>NT</div>
                          <div>KO</div>
                        </div>
                      </div>

                      {/* Ticket Info */}
                      <div className="w-full sm:w-3/5 bg-[#63a375] rounded-r-lg p-3">
                        <div className="bg-[#63a375] text-white py-2 text-center font-bold border-l border-dashed border-black font-['Rajdhani',_sans-serif]">
                        {ticket.is_concluded === false ? 'PENDING' : 'RESOLVED'}
                        </div>
                        <div className="mt-3">
                          <h3 className="text-sm font-bold text-white font-['Rajdhani',_sans-serif]">
                            {ticket.product_name || "N/A"}
                          </h3>
                          <p className="text-xs text-white font-['Raleway',_sans-serif]">
                            Serial: {ticket.product_serial_number || "N/A"}
                          </p>
                          <p className="text-xs text-white font-['Raleway',_sans-serif] mt-2">
                            {formatDate(ticket.date_updated)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* RIGHT SIDE - Ticket Details & Management */}
            <div className="w-full lg:w-3/5">
              {selectedTicket ? (
                <div className="bg-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
                  <div className="bg-gray-200 py-3 text-center rounded-t-2xl">
                    <h4 className="font-['Rajdhani',_sans-serif] text-base sm:text-lg tracking-widest font-bold">MANAGE TICKETS</h4>
                  </div>
                  
                  <div className="p-5">
                    <span className="text-xs font-semibold text-gray-600 font-['Raleway',_sans-serif]">
                      Last Updated: {formatDate(selectedTicket?.date_updated)}
                    </span>
                    
                    <div className="border-b border-dashed border-gray-400 py-4">
                      <h1 className="text-2xl sm:text-3xl font-bold mb-2 font-['Rajdhani',_sans-serif]">Times we helped you out ///</h1>
                      <p className="text-sm mb-6 font-['Raleway',_sans-serif]">Hope we were helpful and could resolve your issue entirely</p>

                      <div className="space-y-4 mb-2">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <input
                            type="text"
                            className="flex-grow p-2 border border-gray-300 rounded-lg text-sm bg-white font-['Raleway',_sans-serif]"
                            value={`PRODUCT ${selectedTicket?.product_name || "N/A"}`}
                            readOnly
                          />
                          <input
                            type="text"
                            className="flex-grow p-2 border border-gray-300 rounded-lg text-sm bg-gray-50 font-['Raleway',_sans-serif]"
                            value={`SERIAL CODE ${selectedTicket?.product_serial_number || "N/A"}`}
                            readOnly
                          />
                        </div>
                      </div>
                      
                      <span className="block text-right text-xs text-gray-500 font-['Courier_New',_monospace]">
                        Ticket Id: {selectedTicket?.ticket_id || "N/A"}
                      </span>
                    </div>

                    {/* Tab Navigation */}
                    <div className="py-4">
                      <div className="flex flex-wrap mb-4 gap-2">
                        {["COMPLAINTS", "DEVICE", "CONCLUSION"].map((tab) => (
                          <button
                            key={tab}
                            className={`py-2 px-4 text-center text-xs font-medium font-['Rajdhani',_sans-serif] transition-colors duration-200 ${
                              activeTab === tab 
                                ? "bg-[#63a375] text-white font-bold rounded-lg shadow-md" 
                                : "text-gray-800 hover:bg-gray-100 rounded-lg"
                            }`}
                            onClick={() => setActiveTab(tab)}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>
                      
                      {/* Tab Content */}
                      <div className="bg-gray-100 p-4 rounded-lg mb-6 min-h-[120px]">
                        {tabContent[activeTab]}
                      </div>

                      <div className="text-center mb-6">
                        <div className="bg-contain bg-no-repeat bg-center h-6 w-full" 
                             style={{ backgroundImage: `url('/api/placeholder/320/24')` }}>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center">
                  <h3 className="text-xl font-bold mb-4 font-['Rajdhani',_sans-serif]">No Ticket Selected</h3>
                  <p className="text-gray-600 font-['Raleway',_sans-serif]">
                    Please select a ticket from the list to view and manage details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ProductFooter />
    </div>
  );
};

export default TicketManagement;