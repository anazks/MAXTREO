
import Footer from '../Footer/Footer';
import ModernNavbar from '../NavBar/NavBar';

export default function ShippingPolicy() {
  return (
    <>
      <ModernNavbar/>
      <div className="flex flex-col p-4 gap-6 max-w-6xl mx-auto" style={{marginTop:"90px",marginBottom:"50px",fontFamily: "'Rajdhani', sans-serif",}}>
        <div>
          <h1 className="text-4xl font-bold mb-8">Shipping Policy</h1>
        </div>
        
        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Order Processing</h2>
            <p className="text-gray-800">
              All confirmed orders are processed within 2–4 business days.
              <br /><br />
              Orders are not shipped or delivered on Sundays or public holidays.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Shipping Coverage</h2>
            <p className="text-gray-800">
              We currently ship to all major cities and towns across India.
              <br /><br />
              For remote or out-of-service locations, our team will contact you to confirm availability before dispatch.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Delivery Timelines</h2>
            <p className="text-gray-800">
              Once shipped, orders are usually delivered within 5–10 business days, depending on the shipping address and courier service availability.
              <br /><br />
              Delivery delays may occasionally occur due to unforeseen circumstances (weather, strikes, courier delays, etc.).
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Shipping Charges</h2>
            <p className="text-gray-800">
              Standard shipping charges may apply and will be calculated at checkout.
              <br /><br />
              Free shipping may be offered for selected products or promotional offers (if applicable).
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Order Tracking</h2>
            <p className="text-gray-800">
              After dispatch, customers will receive an email/SMS with tracking details to monitor their shipment status.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Damaged / Defective Products</h2>
            <p className="text-gray-800">
              If you receive a product that is damaged or defective during transit, please notify us within 48 hours of delivery.
              <br /><br />
              Our team will arrange for a replacement or suitable resolution after verifying the issue.
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Contact Us</h2>
            <p className="text-gray-800">
              If you have any questions about shipping or delivery, please contact our support team:
              <br /><br />
              <strong>Email:</strong> info@neotokyo.in
              <br />
              <strong>Phone:</strong> +91 (800) 555-1234
            </p>
          </div>
          
          <p className="text-sm text-gray-600 mt-8">
            Thank you for shopping with us. We deliver PCs, workstations, and accessories across India.
          </p>
        </div>
      </div>
      <Footer/>
    </>
  );
}