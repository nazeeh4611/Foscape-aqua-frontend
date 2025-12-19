import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "John Smith",
      role: "Aquarium Enthusiast",
      content: "Excellent quality products and outstanding customer service. My fish are thriving!",
      rating: 5
    },
    {
      name: "Sarah Johnson",
      role: "Pet Store Owner",
      content: "Reliable supplier with consistent quality. Highly recommend for both personal and business needs.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "First-time Buyer",
      content: "Great experience from start to finish. The team helped me set up my first aquarium perfectly.",
      rating: 5
    }
  ];

  return (
    <div className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
            <Star className="w-4 h-4 text-blue-600" />
            <span className="text-blue-600 font-medium">Testimonials</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Read what our satisfied customers have to say about their experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <p className="text-slate-700 italic mb-6">"{testimonial.content}"</p>
              <div>
                <p className="font-bold text-slate-900">{testimonial.name}</p>
                <p className="text-slate-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;