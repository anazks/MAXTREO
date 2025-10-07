import React, { useState, useRef, useEffect } from "react";
import ModernNavbar from "../NavBar/NavBar";
import ProductFooter from "../Footer/ProductFooter";
import { useNavigate } from "react-router-dom";
import { AddTicket } from '../../../Services/userApi';
import Alert from '../../../components/user/Alert/Alert';

const Tickets = () => {
  const [formData, setFormData] = useState({
    product: null,
    product_name: "",
    product_serial_number: "",
    grievance: "",
    link: "",
    image: null,
    is_concluded: false
  });
  const [errors, setErrors] = useState({});
  const [rows, setRows] = useState([]);
  const [preview, setPreview] = useState(null);
  const textareaRef = useRef(null);
  const lineHeight = 24;
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [alert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // Update the dashed lines when grievance text changes
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const numberOfLines = Math.max(
        textarea.scrollHeight / lineHeight,
        7
      );
      setRows(Array(Math.ceil(numberOfLines)).fill(0));
    }
  }, [formData.grievance]);

  // Create a preview for the image
  useEffect(() => {
    if (!formData.image) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(formData.image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [formData.image]);

  const handleTicketResolution = () => {
    navigate("/ticketsresolved");
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert product to integer if it's the product field
    const processedValue = name === "product" ? 
      (value === "" ? null : parseInt(value)) : 
      value;
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFormData({ ...formData, image: null });
      return;
    }
    
    setFormData({
      ...formData,
      image: e.target.files[0]
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.grievance || formData.grievance.trim() === "") {
      newErrors.grievance = "Grievance is required";
    }
    
    // Validate product_name length if provided
    if (formData.product_name && formData.product_name.length > 255) {
      newErrors.product_name = "Product name must be less than 255 characters";
    }
    
    // Validate link length if provided
    if (formData.link && formData.link.length > 200) {
      newErrors.link = "Link must be less than 200 characters";
    }
    
    // Validate product_serial_number length if provided
    if (formData.product_serial_number && formData.product_serial_number.length > 100) {
      newErrors.product_serial_number = "Serial number must be less than 100 characters";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      // Prepare form data for API submission
      const submissionData = new FormData();
      if (formData.product !== null) {
        submissionData.append('product', formData.product);
      }
      if (formData.product_name) {
        submissionData.append('product_name', formData.product_name);
      }
      if (formData.product_serial_number) {
        submissionData.append('product_serial_number', formData.product_serial_number);
      }
      submissionData.append('grievance', formData.grievance);
      if (formData.link) {
        submissionData.append('link', formData.link);
      }
      submissionData.append('is_concluded', 'false');
      
      if (formData.image) {
        submissionData.append('image', formData.image);
      }

      const response = await AddTicket(submissionData);

      if (response.status === 201) {
        setAlert(true);
        setAlertMessage("Your Ticket has been uploaded");
      }

      const result = await response.json();
      console.log('Ticket submitted successfully:', result);
      
      navigate("/ticketsresolved");
    } catch (error) {
      console.error('Error submitting ticket:', error);
    }
  };
  
  return (
    <>
      <ModernNavbar />
      {alert && (
        <Alert
          type="success"
          message={alertMessage}
        />
      )}
      <div className="w-full bg-black p-3 md:p-5 rounded-xl" style={{marginTop:"70px"}}>
        <div className="flex flex-col md:flex-row justify-between gap-5 p-3 md:p-5" ref={containerRef}>
          {/* Left Column */}
          <div className="w-full md:w-1/2 transition-all duration-300">
            <div className="flex items-baseline text-white">
              <div className="mr-2">
                <h1 className="text-2xl md:text-3xl font-bold">
                  NT <br />
                  KO
                </h1>
              </div>
              <div>
                <span className="text-sm md:text-base">
                  Priority One By Neo Tokyo
                </span>
              </div>
            </div>
            
            <div className="text-white mt-10 md:mt-24 transition-all duration-300">
              <h6 className="font-mono mb-5 font-semibold">
                Recent tickets
              </h6>

              <div className="bg-gray-100 p-4 md:p-5 w-full md:w-4/5 rounded-b-2xl transition-all duration-300 hover:shadow-lg">
                <p className="font-mono mb-5 text-black">Grievance:</p>
                <p className="text-gray-400 overflow-hidden whitespace-normal break-words mb-5 border-b border-dashed border-gray-400 pb-5">
                  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                </p>

                <button
                  onClick={handleTicketResolution}
                  className="w-full p-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 text-white font-mono transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  View Resolved Tickets
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 transition-all duration-300">
            <div className="w-full">
              <div className="bg-gray-100 w-full md:w-4/5 mx-auto rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl">
                <div className="bg-gray-300 p-3 text-center">
                  <h4 className="font-mono tracking-widest font-bold">LIVE TICKET</h4>
                </div>

                <form onSubmit={handleSubmit} className="p-3 md:p-5" encType="multipart/form-data">
                  <span className="text-xs font-semibold text-black pl-2">2025/04/01 - 11:24 AM</span>
                  
                  <div className="p-3 md:p-5 border-b border-dashed border-gray-400">
                    <span className="text-2xl md:text-3xl font-black block mb-2">What Can We Help You With ///</span>
                    <p className="mb-4 text-sm md:text-base">Please describe your grievance in the space below</p>
                    
                    {/* Product (number) - integer, nullable */}
                    <div className="relative mt-5 group">
                      <input 
                        type="number" 
                        name="product" 
                        id="product"
                        value={formData.product || ""}
                        onChange={handleChange}
                        placeholder=" " 
                        className="w-full p-2 text-base border border-gray-800 rounded-lg outline-none bg-white focus:border-gray-100 transition-all duration-200"
                      />
                      <label 
                        htmlFor="product" 
                        className="absolute top-2 left-2 text-gray-700 text-xs transition-all duration-200 pointer-events-none group-focus-within:top-[-8px] group-focus-within:left-2 group-focus-within:text-xs group-focus-within:bg-white group-focus-within:px-1 group-focus-within:text-black"
                      >
                        Product ID (number, optional)
                      </label>
                    </div>
                    
                    {/* Product Name - string, maxLength: 255, nullable */}
                    <div className="relative mt-5 group">
                      <input 
                        type="text" 
                        name="product_name" 
                        id="product_name" 
                        value={formData.product_name}
                        onChange={handleChange}
                        maxLength="255"
                        placeholder=" " 
                        className="w-full p-2 text-base border border-gray-800 rounded-lg outline-none bg-white focus:border-gray-100 transition-all duration-200"
                      />
                      <label 
                        htmlFor="product_name" 
                        className="absolute top-2 left-2 text-gray-700 text-xs transition-all duration-200 pointer-events-none group-focus-within:top-[-8px] group-focus-within:left-2 group-focus-within:text-xs group-focus-within:bg-white group-focus-within:px-1 group-focus-within:text-black"
                      >
                        Product Name (optional, max 255 chars)
                      </label>
                      {errors.product_name && (
                        <p className="text-red-500 text-xs mt-1">{errors.product_name}</p>
                      )}
                    </div>
                    
                    {/* Product Serial Number - string, maxLength: 100, nullable */}
                    <div className="relative mt-5 group">
                      <input 
                        type="text" 
                        name="product_serial_number" 
                        id="product_serial_number" 
                        value={formData.product_serial_number}
                        onChange={handleChange}
                        maxLength="100"
                        placeholder=" " 
                        className="w-full p-2 text-base border border-gray-800 rounded-lg outline-none bg-white focus:border-gray-100 transition-all duration-200"
                      />
                      <label 
                        htmlFor="product_serial_number" 
                        className="absolute top-2 left-2 text-gray-700 text-xs transition-all duration-200 pointer-events-none group-focus-within:top-[-8px] group-focus-within:left-2 group-focus-within:text-xs group-focus-within:bg-white group-focus-within:px-1 group-focus-within:text-black"
                      >
                        Product Serial Number (optional, max 100 chars)
                      </label>
                      {errors.product_serial_number && (
                        <p className="text-red-500 text-xs mt-1">{errors.product_serial_number}</p>
                      )}
                    </div>

                    {/* Link - URI, maxLength: 200, nullable */}
                    <div className="relative mt-5 group">
                      <input 
                        type="url" 
                        name="link" 
                        id="link" 
                        value={formData.link}
                        onChange={handleChange}
                        maxLength="200"
                        placeholder=" " 
                        className="w-full p-2 text-base border border-gray-800 rounded-lg outline-none bg-white focus:border-gray-100 transition-all duration-200"
                      />
                      <label 
                        htmlFor="link" 
                        className="absolute top-2 left-2 text-gray-700 text-xs transition-all duration-200 pointer-events-none group-focus-within:top-[-8px] group-focus-within:left-2 group-focus-within:text-xs group-focus-within:bg-white group-focus-within:px-1 group-focus-within:text-black"
                      >
                        Related Link (optional, max 200 chars)
                      </label>
                      {errors.link && (
                        <p className="text-red-500 text-xs mt-1">{errors.link}</p>
                      )}
                    </div>

                    {/* Image upload section */}
                    <div className="mt-5">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="w-full p-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 text-white font-mono text-sm transition-colors duration-300"
                      >
                        {formData.image ? 'Change Image' : 'Upload Image (optional)'}
                      </button>
                      
                      {preview && (
                        <div className="mt-3">
                          <img 
                            src={preview} 
                            alt="Preview" 
                            className="max-h-40 max-w-full object-contain border border-gray-300 rounded"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({...formData, image: null})}
                            className="mt-2 text-red-500 text-sm hover:text-red-700"
                          >
                            Remove Image
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-right font-mono text-xs text-gray-500 tracking-tighter block mt-2">Ticket Id: {Math.floor(Math.random() * 10000000)}</span>
                  </div>

                  <div className="p-3 md:p-5">
                    <p className="font-mono mb-5 text-black">Grievance*:</p>
                    {errors.grievance && (
                      <p className="text-red-500 text-sm mb-2">{errors.grievance}</p>
                    )}

                    <div className="relative">
                      {/* Dashed lines container */}
                      <div className="absolute inset-0 pointer-events-none">
                        {rows.map((_, index) => (
                          <div
                            key={index}
                            className="border-b border-dashed border-gray-400"
                            style={{
                              height: `${lineHeight}px`,
                              marginTop: index === 0 ? "8px" : "0",
                            }}
                          />
                        ))}
                      </div>

                      {/* Actual textarea */}
                      <textarea
                        ref={textareaRef}
                        name="grievance"
                        value={formData.grievance}
                        onChange={handleChange}
                        className="w-full p-2 bg-transparent text-base resize-none outline-none"
                        style={{
                          lineHeight: `${lineHeight}px`,
                          backgroundColor: "rgba(255, 255, 255, 0.4)",
                        }}
                        rows={7}
                        placeholder="Start typing here (required)..."
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      className="w-full p-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-mono transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ProductFooter />
    </>
  );
};

export default Tickets;