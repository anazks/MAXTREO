import React, { useState, useEffect, useMemo } from 'react';
import { AdminGetTickets, AdminUpdateTicketStatus } from '../../../Services/userApi'; // Added import for the update API

import Sidebar from '../Sidebar';
import NeoFooter from '../footer';


const Tickets = () => {
  // State management
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [conclusionText, setConclusionText] = useState('');

  // Fetch tickets function
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await AdminGetTickets();
      
      if (!response || !response.data) {
        throw new Error("Invalid response format");
      }
      
      setTickets(response.data);
      if (response.data.length > 0) {
        setSelectedTicket(response.data[0]);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError(err.message || "Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  // Notification timeout
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Reset conclusion text when selecting a new ticket
  useEffect(() => {
    setConclusionText('');
  }, [selectedTicket]);

  // Handle ticket selection
  const handleTicketSelect = (ticket) => {
    setSelectedTicket(ticket);
  };

  // Handle ticket status change
  const handleStatusChange = async (ticketId, isResolved) => {
    if (isResolved && !conclusionText.trim()) {
      setNotification({
        show: true,
        message: "Please enter a conclusion before resolving the ticket",
        type: "error"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Call the API to update ticket status
      const updateData = {
        ticketId,
        isResolved,
        selectedTicket,
        conclusion: isResolved ? conclusionText : null
      };
      
      const response = await AdminUpdateTicketStatus(updateData);
      
      // If API call successful, update the local state
      if (response && response.status==200) {
        // Update tickets list
        const updatedTickets = tickets.map(ticket => 
          ticket.ticket_id === ticketId 
            ? { 
                ...ticket, 
                is_concluded: isResolved,
                conclusion: isResolved ? conclusionText : ticket.conclusion,
                date_updated: new Date().toISOString()
              } 
            : ticket
        );
        
        setTickets(updatedTickets);
        
        // Update selected ticket if it's the one being modified
        if (selectedTicket?.ticket_id === ticketId) {
          setSelectedTicket(prev => ({
            ...prev,
            is_concluded: isResolved,
            conclusion: isResolved ? conclusionText : prev.conclusion,
            date_updated: new Date().toISOString()
          }));
        }
        
        setNotification({
          show: true,
          message: `Ticket ${isResolved ? 'resolved' : 'reopened'} successfully!`,
          type: "success"
        });

        // Clear conclusion text if resolving
        if (isResolved) {
          setConclusionText('');
        }
      } else {
        throw new Error(response?.message || "Update failed");
      }
    } catch (err) {
      console.error("Error updating ticket:", err);
      setNotification({
        show: true,
        message: err.message || "Failed to update ticket status. Please try again.",
        type: "error"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter and sort tickets
  const filteredTickets = useMemo(() => {
    return tickets
      .filter(ticket => {
        // Status filtering
        if (statusFilter === 'resolved' && !ticket.is_concluded) return false;
        if (statusFilter === 'pending' && ticket.is_concluded) return false;
        
        // Search term filtering
        if (searchTerm.trim() === '') return true;
        
        const term = searchTerm.toLowerCase();
        return (
          ticket.ticket_id.toLowerCase().includes(term) ||
          (ticket.user_email && ticket.user_email.toLowerCase().includes(term)) ||
          (ticket.product_name && ticket.product_name.toLowerCase().includes(term)) ||
          (ticket.product_serial_number && ticket.product_serial_number.toLowerCase().includes(term)) ||
          (ticket.grievance && ticket.grievance.toLowerCase().includes(term))
        );
      })
      .sort((a, b) => {
        let comparison = 0;
        
        if (sortBy === 'date') {
          comparison = new Date(b.date_updated) - new Date(a.date_updated);
        } else if (sortBy === 'product') {
          comparison = (a.product_name || '').localeCompare(b.product_name || '');
        } else if (sortBy === 'id') {
          comparison = a.ticket_id.localeCompare(b.ticket_id);
        } else if (sortBy === 'user') {
          comparison = (a.user_email || '').localeCompare(b.user_email || '');
        }
        
        return sortDirection === 'asc' ? comparison * -1 : comparison;
      });
  }, [tickets, searchTerm, statusFilter, sortBy, sortDirection]);

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSortClick = (field) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  return (

    <>
    <Sidebar/>
    <div className="flex flex-col min-h-screen bg-black" style={{marginTop:"60px"}}>
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === "success" ? "bg-green-500" : "bg-red-500"
        } text-white transition-all duration-300 transform`}>
          {notification.message}
        </div>
      )}
      
      <main className="flex-grow w-full p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="text-white text-4xl font-bold mr-4 font-['Rajdhani',_sans-serif] leading-none">
                <div>NT</div>
                <div>KO</div>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xl font-bold font-['Rajdhani',_sans-serif]">Admin Panel</span>
                <span className="text-white text-sm font-['Raleway',_sans-serif]">TICKET MANAGEMENT</span>
              </div>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 pl-10 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63a375]"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                  </svg>
                </div>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63a375]"
              >
                <option value="all">All Tickets</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Ticket List */}
            <div className="w-full lg:w-1/2">
              <div className="bg-gray-900 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white text-xl font-bold font-['Rajdhani',_sans-serif]">Tickets</h2>
                  <span className="text-gray-400 text-sm">
                    {filteredTickets.length} {filteredTickets.length === 1 ? 'ticket' : 'tickets'} found
                  </span>
                </div>
                
                {/* Sort Header */}
                <div className="grid grid-cols-12 gap-2 mb-3 text-xs font-['Rajdhani',_sans-serif] font-bold text-gray-400">
                  <button 
                    className="col-span-2 text-left hover:text-white flex items-center"
                    onClick={() => handleSortClick('id')}
                  >
                    ID {getSortIcon('id')}
                  </button>
                  <button 
                    className="col-span-3 text-left hover:text-white flex items-center"
                    onClick={() => handleSortClick('user')}
                  >
                    USER {getSortIcon('user')}
                  </button>
                  <button 
                    className="col-span-4 text-left hover:text-white flex items-center"
                    onClick={() => handleSortClick('product')}
                  >
                    PRODUCT {getSortIcon('product')}
                  </button>
                  <button 
                    className="col-span-3 text-left hover:text-white flex items-center"
                    onClick={() => handleSortClick('date')}
                  >
                    DATE {getSortIcon('date')}
                  </button>
                </div>
              </div>
              
              {/* Ticket Items */}
              <div className="h-[calc(100vh-300px)] overflow-y-auto pr-2 space-y-3">
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#63a375]"></div>
                    <span className="ml-3 text-white">Loading tickets...</span>
                  </div>
                ) : error ? (
                  <div className="bg-red-500/20 border border-red-500 text-white rounded-lg p-4 text-center">
                    {error}
                    <button 
                      onClick={fetchTickets}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Retry
                    </button>
                  </div>
                ) : filteredTickets.length === 0 ? (
                  <div className="bg-gray-800 rounded-xl p-6 text-center text-gray-400">
                    <p className="font-['Raleway',_sans-serif]">No tickets match your search criteria</p>
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <div 
                      key={ticket.ticket_id}
                      className={`bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg cursor-pointer transition-all duration-200 ${
                        selectedTicket?.ticket_id === ticket.ticket_id 
                          ? "ring-2 ring-[#63a375] transform scale-[1.02]" 
                          : "hover:bg-gray-700"
                      }`}
                      onClick={() => handleTicketSelect(ticket)}
                    >
                      <div className="grid grid-cols-12 gap-2 p-3">
                        <div className="col-span-2">
                          <div className={`text-xs font-mono py-1 px-2 rounded-lg text-center ${
                            ticket.is_concluded ? "bg-green-900/40 text-green-400" : "bg-yellow-900/40 text-yellow-400"
                          }`}>
                            {ticket.ticket_id}
                          </div>
                        </div>
                        
                        <div className="col-span-3">
                          <p className="text-xs text-gray-300 truncate">
                            {ticket.user_email}
                          </p>
                        </div>
                        
                        <div className="col-span-4">
                          <p className="text-xs font-bold text-white truncate">
                            {ticket.product_name}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            SN: {ticket.product_serial_number}
                          </p>
                        </div>
                        
                        <div className="col-span-3 text-right">
                          <p className="text-xs text-gray-300">
                            {formatDate(ticket.date_updated).split(',')[0]}
                          </p>
                          <div className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                            ticket.is_concluded 
                              ? "bg-green-900/40 text-green-400" 
                              : "bg-yellow-900/40 text-yellow-400"
                          }`}>
                            {ticket.is_concluded ? "Resolved" : "Pending"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Ticket Details */}
            <div className="w-full lg:w-1/2">
              {selectedTicket ? (
                <div className="bg-white rounded-xl shadow-lg transition-all duration-300 h-full">
                  <div className={`${
                    selectedTicket.is_concluded ? "bg-[#63a375]" : "bg-yellow-500"
                  } py-3 text-center rounded-t-xl text-white`}>
                    <h4 className="font-['Rajdhani',_sans-serif] text-black tracking-widest font-bold">
                      {selectedTicket.is_concluded ? "RESOLVED TICKET" : "PENDING TICKET"}
                    </h4>
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-2xl text-black font-bold font-['Rajdhani',_sans-serif]">
                        {selectedTicket.product_name}
                      </h2>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        selectedTicket.is_concluded 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {selectedTicket.is_concluded ? "RESOLVED" : "PENDING"}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4 font-['Raleway',_sans-serif]">
                      Ticket ID: {selectedTicket.ticket_id} | 
                      Last Updated: {formatDate(selectedTicket.date_updated)}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-bold mb-2 font-['Rajdhani',_sans-serif]">CUSTOMER</h3>
                        <p className="text-sm font-['Raleway',_sans-serif]">{selectedTicket.user_email}</p>
                        <p className="text-xs text-gray-500 mt-1 font-['Raleway',_sans-serif]">
                          Created: {formatDate(selectedTicket.date_created)}
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm font-bold mb-2 font-['Rajdhani',_sans-serif]">PRODUCT</h3>
                        <p className="text-sm font-['Raleway',_sans-serif]">{selectedTicket.product_name}</p>
                        <p className="text-xs text-gray-500 mt-1 font-['Raleway',_sans-serif]">
                          Serial: {selectedTicket.product_serial_number}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-bold mb-2 font-['Rajdhani',_sans-serif] text-black">GRIEVANCE</h3>
                      <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                        <p className="text-sm whitespace-pre-wrap font-['Raleway',_sans-serif] text-black">
                          {selectedTicket.grievance || "No grievance information provided."}
                        </p>
                      </div>
                    </div>

                    {/* Conclusion Input (only show for pending tickets) */}
                    {!selectedTicket.is_concluded && (
                      <div className="mb-6">
                        <h3 className="text-sm font-bold mb-2 font-['Rajdhani',_sans-serif] text-black">ADD CONCLUSION</h3>
                        <textarea
                          value={conclusionText}
                          onChange={(e) => setConclusionText(e.target.value)}
                          placeholder="Enter resolution details..."
                          className="w-full px-4 text-black py-2 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63a375] min-h-[100px]"
                        />
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-bold mb-2 font-['Rajdhani',_sans-serif] text-black">CONCLUSION</h3>
                      <div className="bg-gray-50 p-4 rounded-lg min-h-[100px]">
                        <p className="text-sm whitespace-pre-wrap font-['Raleway',_sans-serif]">
                          {selectedTicket.conclusion || "No conclusion has been provided yet."}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 justify-end">
                      {selectedTicket.is_concluded ? (
                        <button
                          className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Rajdhani',_sans-serif] font-bold"
                          onClick={() => handleStatusChange(selectedTicket.ticket_id, false)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "RE-OPEN TICKET"}
                        </button>
                      ) : (
                        <button
                          className="px-6 py-2 bg-[#63a375] text-white rounded-lg hover:bg-[#5a9369] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Rajdhani',_sans-serif] font-bold"
                          onClick={() => handleStatusChange(selectedTicket.ticket_id, true)}
                          disabled={isProcessing || !conclusionText.trim()}
                        >
                          {isProcessing ? "Processing..." : "MARK AS RESOLVED"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 text-center h-64 flex flex-col items-center justify-center">
                  <h3 className="text-xl font-bold mb-4 font-['Rajdhani',_sans-serif]">No Ticket Selected</h3>
                  <p className="text-gray-600 font-['Raleway',_sans-serif]">
                    {loading ? "Loading tickets..." : "Select a ticket from the list to view details"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
<NeoFooter/>
    </>

  );
};

export default Tickets;