import { ArrowRight } from "lucide-react";
import  Navbar  from '../NavBar/NavBar'
import Footer from '../Footer/Footer'

export default function ReturnRefund() {
  return (
    <>
    <Navbar/>
    <div className="flex flex-col p-4 gap-6 max-w-6xl mx-auto" style={{marginTop:"90px",marginBottom:"50px"}}>
      <div>
        <h1 className="text-4xl font-bold mb-8">Return and Refund Policy</h1>
      </div>
      
      <div className="space-y-10">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Return Eligibility</h2>
          <h3 className="text-xl font-medium text-pink-600">30-Day Return Window</h3>
          <p className="text-gray-800">
            We accept returns within 30 days of delivery for most products. Items must be in 
            original condition, unused, and in original packaging with all accessories and 
            documentation. Custom-built PCs and personalized products may have different return 
            conditions due to their bespoke nature. Please contact us before initiating any return 
            to ensure eligibility.
          </p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Non-Returnable Items</h2>
          <p className="text-gray-800">
            Certain items cannot be returned, including: opened software, personalized or custom-built 
            products (unless defective), items damaged by misuse, and products that have been 
            modified or altered. Digital products and gift cards are also non-returnable. 
            Components that have been installed or used in a system may not be eligible for return 
            unless defective upon arrival.
          </p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Return Process</h2>
          <p className="text-gray-800">
            To initiate a return, contact our customer service team with your order number and 
            reason for return. We will provide you with a Return Merchandise Authorization (RMA) 
            number and return instructions. Items must be securely packaged and shipped to our 
            designated return address. Return shipping costs are the responsibility of the customer 
            unless the item is defective or we made an error.
          </p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Refund Processing</h2>
          <p className="text-gray-800">
            Refunds are processed within 5-7 business days after we receive and inspect the 
            returned item. Refunds will be issued to the original payment method used for purchase. 
            For Razorpay payments, refunds typically appear within 3-5 business days. Cash on 
            delivery refunds will be processed via bank transfer. Direct bank transfer refunds 
            will be credited to the same account within 2-3 business days.
          </p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Exchanges</h2>
          <p className="text-gray-800">
            We offer exchanges for defective items or if we sent the wrong product. If you need 
            to exchange an item for a different model or specification, this will be treated as 
            a return and new purchase. Price differences, if any, will be charged or refunded 
            accordingly. Custom PC exchanges are evaluated on a case-by-case basis.
          </p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Warranty Claims</h2>
          <p className="text-gray-800">
            Products covered under manufacturer warranty should be directed to the respective 
            manufacturer for warranty service. For Neo Tokyo custom builds, we provide our own 
            warranty terms as specified at the time of purchase. Warranty claims do not fall 
            under our standard return policy and are handled separately through our technical 
            support team.
          </p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Damaged or Defective Items</h2>
          <p className="text-gray-800">
            If you receive a damaged or defective item, please contact us immediately with photos 
            of the damage and packaging. We will arrange for replacement or repair at no cost to 
            you, including return shipping. For custom PCs, our technical team will diagnose the 
            issue and provide appropriate resolution, which may include on-site service for 
            local customers.
          </p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Cancellation Policy</h2>
          <p className="text-gray-800">
            Orders can be cancelled before shipping at no charge. Once an order has been shipped, 
            cancellation is not possible, and the standard return policy applies. Custom PC orders 
            may be cancelled before the build process begins. If components have been ordered or 
            the build has started, cancellation fees may apply to cover non-returnable components.
          </p>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-4xl font-bold">Contact for Returns</h2>
          <p className="text-gray-800">
            For all return and refund inquiries, please contact us at:
            <br />
            <strong>Neo Tokyo</strong>
            <br />
            Floor no. 2, Koroth Arcade, Vennala High School Rd., opposite to V-Guard, Vennala, Kochi, Kerala 682028
            <br />
            New Age Buildings: Mofussil Bus Stand Building, Mavoor Rd, Arayidathupalam, Kozhikode, Kerala 673004
          </p>
          
          <button className="flex items-center bg-black text-white rounded-full py-2 px-6 mt-6"
          onClick={() => window.location.href = '/contact'}
          >
            <span className="mr-2">Contact Support</span>
            <ArrowRight size={18} />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mt-8">
          Last updated: June 2025. This policy may be updated periodically. 
          Please review for any changes before making a return.
        </p>
      </div>
    </div>
    <Footer/>
    </>
  );
}