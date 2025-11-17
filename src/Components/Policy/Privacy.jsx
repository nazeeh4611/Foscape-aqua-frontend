import React from 'react';
import { Truck,FileText ,Shield} from 'lucide-react';


import { RefreshCw } from 'lucide-react';
import { PolicyLayout, PolicySection, ContactInfo } from '../../Layout/PolicyLayout';

export const RefundPolicy = () => {
  return (
    <PolicyLayout
      icon={RefreshCw}
      title="Refund & Cancellation Policy"
      description="Learn about our refund and cancellation procedures"
    >
      <div className="space-y-8 text-slate-600">
        <PolicySection title="1. Cancellation Policy">
          <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-4">Service Appointments</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>24+ hours notice:</strong> Full refund or rescheduling available</li>
            <li><strong>12-24 hours notice:</strong> 50% cancellation fee applies</li>
            <li><strong>Less than 12 hours notice:</strong> No refund available</li>
            <li><strong>No-show:</strong> Full service fee charged</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-6">Installation Projects</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Before work begins:</strong> Full deposit refund minus 10% administrative fee</li>
            <li><strong>After work begins:</strong> Charges apply for work completed and materials ordered</li>
            <li><strong>Custom orders:</strong> Non-refundable once manufacturing/ordering begins</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-6">Maintenance Contracts</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>30-day notice required for cancellation</li>
            <li>Refund prorated based on remaining contract period</li>
            <li>No refund for monthly contracts canceled mid-cycle</li>
          </ul>
        </PolicySection>

        <PolicySection title="2. Refund Policy">
          <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-4">Products and Equipment</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Unused items:</strong> Full refund within 14 days of purchase with original packaging</li>
            <li><strong>Defective items:</strong> Replacement or full refund per manufacturer warranty</li>
            <li><strong>Used items:</strong> No refund unless defective</li>
            <li><strong>Custom/special orders:</strong> Non-refundable</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-6">Living Organisms (Fish, Plants)</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>7-day health guarantee from date of delivery</li>
            <li>Replacement or store credit for losses within guarantee period</li>
            <li>Requires water testing and photo documentation</li>
            <li>Guarantee void if care instructions not followed</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-6">Services</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Refunds considered if service quality standards not met</li>
            <li>Request must be made within 48 hours of service</li>
            <li>Partial refunds for partially completed work</li>
            <li>Full refund if service not performed as agreed</li>
          </ul>
        </PolicySection>

        <PolicySection title="3. Refund Process">
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact us at info@thefoscape.com with your order/service details</li>
            <li>Provide reason for refund request and supporting documentation</li>
            <li>Refund requests reviewed within 3-5 business days</li>
            <li>Approved refunds processed within 7-10 business days</li>
            <li>Refunds issued to original payment method</li>
          </ul>
        </PolicySection>

        <PolicySection title="4. Non-Refundable Items">
          <ul className="list-disc pl-6 space-y-2">
            <li>Consultation fees</li>
            <li>Design and planning services</li>
            <li>Custom-fabricated items</li>
            <li>Special-order products</li>
            <li>Services already rendered</li>
            <li>Travel charges for on-site visits</li>
          </ul>
        </PolicySection>

        <PolicySection title="5. Emergency Services">
          <p>Emergency service calls are non-refundable due to priority scheduling and immediate response requirements.</p>
        </PolicySection>

        <PolicySection title="6. Weather and Force Majeure">
          <p>Services canceled due to severe weather or circumstances beyond our control will be rescheduled at no additional cost. No refunds apply for rescheduling due to these reasons.</p>
        </PolicySection>

        <PolicySection title="7. Dispute Resolution">
          <p>If you are unsatisfied with a refund decision, please contact our customer service team to discuss resolution options. We are committed to fair and reasonable solutions.</p>
        </PolicySection>

        <PolicySection title="8. Contact for Refunds/Cancellations">
          <ContactInfo />
        </PolicySection>
      </div>
    </PolicyLayout>
  );
};


export const TermsConditions = () => {
  return (
    <PolicyLayout
      icon={FileText}
      title="Terms & Conditions"
      description="Understand the terms governing our services and your responsibilities"
    >
      <div className="space-y-8 text-slate-600">
        <PolicySection title="1. Acceptance of Terms">
          <p>By accessing or using Foscape Aquatics Living services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.</p>
        </PolicySection>

        <PolicySection title="2. Services Provided">
          <p className="mb-3">Foscape specializes in:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Residential and commercial aquarium design, installation, and maintenance</li>
            <li>Water garden and koi pond creation</li>
            <li>Fountain design and installation</li>
            <li>Swimming pool management and maintenance</li>
            <li>Lake management services</li>
            <li>Spa and water feature care</li>
          </ul>
        </PolicySection>

        <PolicySection title="3. Service Agreement">
          <p className="mb-3">When you engage our services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>A detailed quotation will be provided outlining scope, timeline, and costs</li>
            <li>Services begin upon acceptance of quotation and receipt of required deposit</li>
            <li>You agree to provide necessary access to your property for service delivery</li>
            <li>You are responsible for ensuring a safe working environment</li>
          </ul>
        </PolicySection>

        <PolicySection title="4. Payment Terms">
          <ul className="list-disc pl-6 space-y-2">
            <li>Payment terms will be specified in your service agreement</li>
            <li>Deposits may be required for large projects or custom installations</li>
            <li>Final payment is due upon project completion unless otherwise agreed</li>
            <li>Late payments may incur additional charges</li>
            <li>We accept various payment methods as specified in your invoice</li>
          </ul>
        </PolicySection>

        <PolicySection title="5. Customer Responsibilities">
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate information about your aquatic system requirements</li>
            <li>Follow maintenance guidelines provided by our team</li>
            <li>Notify us promptly of any issues or concerns</li>
            <li>Maintain adequate insurance for your property</li>
            <li>Ensure pets and children are supervised during service visits</li>
          </ul>
        </PolicySection>

        <PolicySection title="6. Warranties and Guarantees">
          <p className="mb-3">We stand behind our work:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Workmanship warranty as specified in your service agreement</li>
            <li>Equipment warranties per manufacturer specifications</li>
            <li>Living organisms (fish, plants) come with care guidelines; warranty terms apply as specified</li>
            <li>Warranties are void if maintenance recommendations are not followed</li>
          </ul>
        </PolicySection>

        <PolicySection title="7. Limitation of Liability">
          <p>Foscape Aquatics Living shall not be liable for indirect, incidental, or consequential damages arising from our services. Our liability is limited to the amount paid for the specific service in question.</p>
        </PolicySection>

        <PolicySection title="8. Intellectual Property">
          <p>All designs, plans, and creative work produced by Foscape remain our intellectual property unless explicitly transferred in writing. You may not reproduce or share our designs without permission.</p>
        </PolicySection>

        <PolicySection title="9. Modifications to Terms">
          <p>We reserve the right to modify these terms at any time. Changes will be posted on our website with an updated effective date. Continued use of our services constitutes acceptance of modified terms.</p>
        </PolicySection>

        <PolicySection title="10. Governing Law">
          <p>These terms are governed by the laws of India. Any disputes shall be resolved in the courts of South India.</p>
        </PolicySection>

        <PolicySection title="11. Contact Information">
          <ContactInfo />
        </PolicySection>
      </div>
    </PolicyLayout>
  );
};



export const PrivacyPolicy = () => {
  return (
    <PolicyLayout
      icon={Shield}
      title="Privacy Policy"
      description="Learn how we protect and handle your personal information"
    >
      <div className="space-y-8 text-slate-600">
        <PolicySection title="1. Information We Collect">
          <p className="mb-3">At Foscape Aquatics Living, we collect information to provide you with the best aquatic care services. The information we collect includes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, phone number, billing and shipping addresses when you contact us or place an order.</li>
            <li><strong>Service Information:</strong> Details about your aquarium, pool, water garden, or other aquatic systems to provide tailored services.</li>
            <li><strong>Payment Information:</strong> Credit card details or other payment information processed securely through our payment processors.</li>
            <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies when you visit our website.</li>
          </ul>
        </PolicySection>

        <PolicySection title="2. How We Use Your Information">
          <p className="mb-3">We use the collected information for the following purposes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and maintain our aquatic care services</li>
            <li>To process your orders and manage your account</li>
            <li>To communicate with you about services, appointments, and updates</li>
            <li>To send promotional materials and newsletters (with your consent)</li>
            <li>To improve our website and customer service experience</li>
            <li>To comply with legal obligations and protect our rights</li>
          </ul>
        </PolicySection>

        <PolicySection title="3. Information Sharing and Disclosure">
          <p className="mb-3">We respect your privacy and do not sell your personal information. We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Service Providers:</strong> Third-party vendors who help us operate our business (payment processors, shipping companies, etc.)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
        </PolicySection>

        <PolicySection title="4. Data Security">
          <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
        </PolicySection>

        <PolicySection title="5. Your Rights">
          <p className="mb-3">You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access, update, or delete your personal information</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent for data processing</li>
            <li>Request a copy of your data</li>
          </ul>
        </PolicySection>

        <PolicySection title="6. Cookies and Tracking">
          <p>We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookie settings through your browser preferences.</p>
        </PolicySection>

        <PolicySection title="7. Contact Us">
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <ContactInfo />
        </PolicySection>
      </div>
    </PolicyLayout>
  );
};

export const ShippingPolicy = () => {
  return (
    <PolicyLayout
      icon={Truck}
      title="Shipping & Delivery Policy"
      description="Information about our shipping methods, delivery times, and service areas"
    >
      <div className="space-y-8 text-slate-600">
        <PolicySection title="1. Service Areas">
          <p>Foscape Aquatics Living provides services and deliveries throughout South India. Specific service areas include major cities and surrounding regions. Contact us to confirm if we serve your location.</p>
        </PolicySection>

        <PolicySection title="2. Delivery Methods">
          <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-4">Products and Equipment</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Standard Delivery:</strong> 5-7 business days within South India</li>
            <li><strong>Express Delivery:</strong> 2-3 business days (additional charges apply)</li>
            <li><strong>Local Pickup:</strong> Available at our location by appointment</li>
            <li><strong>White Glove Service:</strong> Installation and setup included for major equipment</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-6">Living Organisms</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Next-day delivery for fish and plants to ensure health and safety</li>
            <li>Special packaging with oxygen and temperature control</li>
            <li>Delivery scheduled for early morning to avoid heat stress</li>
            <li>Signature required upon delivery</li>
          </ul>
        </PolicySection>

        <PolicySection title="3. Shipping Charges">
          <ul className="list-disc pl-6 space-y-2">
            <li>Calculated based on weight, dimensions, and delivery location</li>
            <li>Free shipping on orders above ₹10,000 (standard items only)</li>
            <li>Living organisms: Flat rate or calculated based on distance</li>
            <li>Large equipment: Custom quote provided</li>
            <li>Installation services: Travel charges may apply for remote locations</li>
          </ul>
        </PolicySection>

        <PolicySection title="4. Order Processing Time">
          <ul className="list-disc pl-6 space-y-2">
            <li>In-stock items: 1-2 business days processing</li>
            <li>Custom orders: 2-4 weeks depending on specifications</li>
            <li>Living organisms: Scheduled based on availability and weather conditions</li>
            <li>Large installations: Timeline provided in service agreement</li>
          </ul>
        </PolicySection>

        <PolicySection title="5. Delivery Scheduling">
          <p className="mb-3">For certain items and services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You will be contacted to schedule a convenient delivery window</li>
            <li>Someone must be present to receive the delivery</li>
            <li>Photo ID may be required for high-value items</li>
            <li>Inspection and sign-off required for living organisms</li>
          </ul>
        </PolicySection>

        <PolicySection title="6. Tracking Your Order">
          <ul className="list-disc pl-6 space-y-2">
            <li>Tracking information provided via email once shipped</li>
            <li>Real-time updates for living organism deliveries</li>
            <li>Contact our support team for order status inquiries</li>
          </ul>
        </PolicySection>

        <PolicySection title="7. Delivery Issues">
          <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-4">Damaged Items</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Inspect all packages upon delivery</li>
            <li>Note any visible damage on delivery receipt</li>
            <li>Report damage within 24 hours with photos</li>
            <li>Replacement or refund provided for damaged items</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-6">Lost or Missing Items</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact us immediately if package not received within expected timeframe</li>
            <li>We will initiate a trace with the carrier</li>
            <li>Replacement or refund provided if package confirmed lost</li>
          </ul>

          <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-6">Wrong Items Delivered</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Contact us within 48 hours of delivery</li>
            <li>Return shipping arranged at no cost to you</li>
            <li>Correct items shipped immediately</li>
          </ul>
        </PolicySection>

        <PolicySection title="8. Refused or Undeliverable Packages">
          <ul className="list-disc pl-6 space-y-2">
            <li>Packages refused or returned due to incorrect address may incur return shipping fees</li>
            <li>Provide accurate delivery information to avoid issues</li>
            <li>Update address before shipment if needed</li>
          </ul>
        </PolicySection>

        <PolicySection title="9. Weather and Delays">
          <p>Deliveries, especially of living organisms, may be delayed due to extreme weather conditions to ensure safe arrival. We will notify you of any weather-related delays and reschedule delivery accordingly.</p>
        </PolicySection>

        <PolicySection title="10. International Shipping">
          <p>Currently, we only ship within India. International shipping is not available at this time.</p>
        </PolicySection>

        <PolicySection title="11. Installation Services">
          <p className="mb-3">For items requiring professional installation:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Installation date scheduled after delivery</li>
            <li>Our technicians will contact you to arrange timing</li>
            <li>Access to installation site must be provided</li>
            <li>Water and electrical connections should be available as needed</li>
          </ul>
        </PolicySection>

        <PolicySection title="12. Contact for Shipping Inquiries">
          <ContactInfo />
        </PolicySection>
      </div>
    </PolicyLayout>
  );
};

