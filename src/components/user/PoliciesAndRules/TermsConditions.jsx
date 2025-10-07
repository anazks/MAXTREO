import { ArrowRight } from "lucide-react";
import Navbar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";

export default function TermsConditions() {
  return (
    <>
      <Navbar />
      <div
        className="flex flex-col p-4 gap-6 max-w-6xl mx-auto"
        style={{ marginTop: "90px", marginBottom: "50px" }}
      >
        <div>
          <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Acceptance of Terms</h2>
            <h3 className="text-xl font-medium text-pink-600">
              Agreement to Our Terms
            </h3>
            <p className="text-gray-800">
              By accessing and using Neo Tokyo's website and services, you
              accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service. These terms apply to all visitors, users,
              and others who access or use our service.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Products & Services</h2>
            <p className="text-gray-800">
              Neo Tokyo specializes in custom PC builds and solutions, as well
              as selling other brand products. All product descriptions,
              specifications, and images are provided for informational
              purposes. We reserve the right to modify product specifications,
              pricing, and availability without prior notice. Custom PC builds
              are subject to component availability and may require additional
              lead time.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Payment Terms</h2>
            <p className="text-gray-800">
              We accept multiple payment methods including Razorpay online
              payments, cash on delivery, and direct bank transfers. Payment
              must be completed before order processing for online and bank
              transfer orders. For cash on delivery orders, payment is due upon
              receipt of goods. All prices are in Indian Rupees and include
              applicable taxes unless otherwise specified.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Order Processing & Delivery</h2>
            <p className="text-gray-800">
              Orders are processed within 1-3 business days after payment
              confirmation. Custom PC builds may require additional time based
              on component availability and complexity. Delivery times vary by
              location and shipping method selected. We are not responsible for
              delays caused by factors beyond our control, including but not
              limited to natural disasters, shipping carrier delays, or customs
              processing.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold">User Accounts</h2>
            <p className="text-gray-800">
              When you create an account with us, including through Google
              login, you must provide accurate and complete information. You are
              responsible for safeguarding your account credentials and for all
              activities that occur under your account. You agree to notify us
              immediately of any unauthorized use of your account or any other
              breach of security.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Intellectual Property</h2>
            <p className="text-gray-800">
              The content, features, and functionality of our website are owned
              by Neo Tokyo and are protected by copyright, trademark, and other
              intellectual property laws. You may not reproduce, distribute,
              modify, or create derivative works of our content without our
              express written permission.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Limitation of Liability</h2>
            <p className="text-gray-800">
              Neo Tokyo shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from your use of our service. Our
              total liability shall not exceed the amount paid by you for the
              specific product or service.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Governing Law</h2>
            <p className="text-gray-800">
              These terms shall be governed by and construed in accordance with
              the laws of India. Any disputes arising from these terms or your
              use of our service shall be subject to the exclusive jurisdiction
              of the courts in Kerala, India.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Contact Information</h2>
            <p className="text-gray-800">
              For questions about these Terms and Conditions, please contact us
              at:
              <br />
              <strong>Neo Tokyo</strong>
              <br />
              Floor no. 2, Koroth Arcade, Vennala High School Rd., opposite to
              V-Guard, Vennala, Kochi, Kerala 682028
              <br />
              New Age Buildings: Mofussil Bus Stand Building, Mavoor Rd,
              Arayidathupalam, Kozhikode, Kerala 673004
            </p>
          </div>

          <p className="text-sm text-gray-600 mt-8">
            Last updated: June 2025. We reserve the right to modify these terms
            at any time. Changes will be effective immediately upon posting.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
