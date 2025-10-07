import Footer from '../Footer/Footer';
import ModernNavbar from '../NavBar/NavBar';

export default function ShippingPolicy() {
  return (
    <>
      {/* <Navbar/> */}
      <ModernNavbar/>
      <div className="flex flex-col p-4 gap-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{marginTop:"90px", marginBottom:"50px", fontFamily: "'Rajdhani', sans-serif"}}>
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Shipping Policy</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Thank you for shopping with us. We deliver PCs, workstations, and accessories across India with reliable and secure shipping.</p>
        </div>
        
        <div className="space-y-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-3 rounded-lg mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Order Processing</h2>
            </div>
            <p className="text-gray-700 pl-10">
              All confirmed orders are processed within 1–3 business days from the date of payment confirmation.
              <br /><br />
              Custom-built PCs and workstations may require additional 2-5 business days for assembly and quality testing.
              <br /><br />
              Orders are not processed or shipped on Sundays or national holidays.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <div className="bg-green-100 p-3 rounded-lg mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shipping Coverage</h2>
            </div>
            <p className="text-gray-700 pl-10">
              We provide nationwide shipping coverage across India, including metro cities, tier-2 cities, and most tier-3 locations.
              <br /><br />
              Serviceable pincodes: All major cities including Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, and 25,000+ other locations.
              <br /><br />
              For remote areas or locations with limited courier access, our team will contact you within 24 hours to confirm delivery feasibility and arrange alternative solutions if needed.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <div className="bg-purple-100 p-3 rounded-lg mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Delivery Timelines</h2>
            </div>
            <p className="text-gray-700 pl-10">
              <strong>Metro Cities:</strong> 3-5 business days after dispatch
              <br />
              <strong>Tier-2 Cities:</strong> 5-7 business days after dispatch
              <br />
              <strong>Tier-3 Cities & Remote Areas:</strong> 7-10 business days after dispatch
              <br /><br />
              Express delivery options available for metro cities (1-2 business days) at additional cost.
              <br /><br />
              Delivery times may be extended during peak seasons (festivals, sales events) or due to unforeseen circumstances such as weather conditions, courier delays, or regional strikes.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <div className="bg-amber-100 p-3 rounded-lg mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Shipping Charges</h2>
            </div>
            <p className="text-gray-700 pl-10">
              <strong>Standard Shipping:</strong> ₹150-500 (varies by location and product weight)
              <br />
              <strong>Express Shipping:</strong> ₹300-800 (metro cities only)
              <br />
              <strong>Heavy Items (PCs/Workstations):</strong> ₹500-1,200 based on destination
              <br /><br />
              <strong>Free Shipping:</strong> Available on orders above ₹50,000 or during promotional campaigns.
              <br /><br />
              All shipping charges are calculated automatically at checkout and displayed before payment confirmation.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <div className="bg-indigo-100 p-3 rounded-lg mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Order Tracking</h2>
            </div>
            <p className="text-gray-700 pl-10">
              Real-time tracking available for all orders through SMS, email, and WhatsApp notifications.
              <br /><br />
              After dispatch, you'll receive a tracking ID and direct link to monitor your shipment's progress in real-time.
              <br /><br />
              Track your order anytime on our website using your order number or through our partner courier's tracking portal.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <div className="bg-orange-100 p-3 rounded-lg mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Packaging & Handling</h2>
            </div>
            <p className="text-gray-700 pl-10">
              All products are carefully packaged using protective materials including bubble wrap, foam inserts, and sturdy boxes.
              <br /><br />
              High-value electronics undergo additional quality checks and specialized packaging to prevent transit damage.
              <br /><br />
              Each package is sealed and labeled with fragile handling instructions for courier partners.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <div className="bg-red-100 p-3 rounded-lg mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Damaged / Defective Products</h2>
            </div>
            <p className="text-gray-700 pl-10">
              If you receive a damaged, defective, or incorrect product, please notify us immediately within 48 hours of delivery.
              <br /><br />
              <strong>Reporting Process:</strong>
              <br />• Take photos/videos of the damaged item and packaging
              <br />• Contact our support team with your order number
              <br />• Our team will arrange for inspection and immediate replacement or refund
              <br /><br />
              We provide hassle-free replacements for manufacturing defects covered under warranty terms.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <div className="bg-teal-100 p-3 rounded-lg mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Delivery Security</h2>
            </div>
            <p className="text-gray-700 pl-10">
              All high-value shipments require signature confirmation and valid ID verification at the time of delivery.
              <br /><br />
              For orders above ₹1,00,000, we provide insured shipping with additional security protocols.
              <br /><br />
              Delivery attempts will be made during business hours (9 AM - 8 PM). If no one is available, we'll reschedule delivery at your convenience.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <div className="bg-cyan-100 p-3 rounded-lg mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Special Handling</h2>
            </div>
            <p className="text-gray-700 pl-10">
              <strong>Fragile Electronics:</strong> Graphics cards, motherboards, and sensitive components receive extra protective packaging.
              <br /><br />
              <strong>Large Items:</strong> Complete PC systems and workstations are shipped via specialized logistics partners with white-glove delivery service.
              <br /><br />
              <strong>Installation Support:</strong> Optional on-site setup assistance available for complete systems in select cities.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start mb-4">
              <div className="bg-pink-100 p-3 rounded-lg mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Contact Support</h2>
            </div>
            <p className="text-gray-700 pl-10">
              Our shipping support team is available Monday to Saturday, 10 AM to 7 PM IST.
              <br /><br />
              <span className="flex items-center mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <strong>Email:</strong> shipping@neotokyo.in
              </span>
              <span className="flex items-center mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <strong>Phone:</strong> +91 (800) 555-1234
              </span>
              <span className="flex items-center mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <strong>WhatsApp:</strong> +91 98765 43210
              </span>
              <br />
              For urgent shipping queries, WhatsApp support provides faster response times.
            </p>
          </div>

          {/* <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Have Questions About Your Shipment?</h3>
              <p className="text-gray-700 mb-4">Our dedicated shipping support team is here to help with any queries about delivery, tracking, or special requirements.</p>
              <div className="flex justify-center space-x-4">
                <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-blue-600">📦 Real-time Tracking</span>
                <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-green-600">🚀 Express Delivery</span>
                <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-purple-600">🔒 Secure Shipping</span>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <Footer/>
    </>
  );
}