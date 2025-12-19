import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const faqs = [
    {
      question: "What is your shipping policy?",
      answer: "We offer fast and secure shipping with temperature-controlled packaging to ensure your aquatic life arrives healthy and safe."
    },
    {
      question: "Do you offer a health guarantee?",
      answer: "Yes, all our products come with a comprehensive health guarantee. If there are any issues, please contact us within 24 hours of delivery."
    },
    {
      question: "How do I care for my new fish?",
      answer: "We provide detailed care instructions with every purchase. Our support team is also available 24/7 to answer any questions."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and secure online payment methods through Razorpay."
    },
    {
      question: "Can I return or exchange products?",
      answer: "Returns and exchanges are accepted within 7 days of delivery for equipment. Live aquatic life follows our health guarantee policy."
    }
  ];

  return (
    <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <span className="text-blue-600 font-medium">FAQ</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find answers to common questions about our products and services
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-slate-100 last:border-b-0">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-100 transition-colors duration-300"
              >
                <span className="text-lg font-semibold text-slate-900">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;