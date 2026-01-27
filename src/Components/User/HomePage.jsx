import React from 'react';
import Navbar from '../../Layout/Navbar';
import Hero from '../../Layout/Hero';
import Footer from '../../Layout/Footer';
import CategoryComponent from '../../Layout/Categories';
import Services from '../../Layout/Services';
import OurProjects from '../../Layout/Projects'
import WhyChooseUs from '../../Layout/WhyChooseUs';
import Testimonials from '../../Layout/Testimonials';
import FAQ from '../../Layout/Faq';
import FeaturedProducts from '../../Layout/FeaturedProducts';

export default function HomePage() {
  return (
    <div className="bg-white">
      <Hero />
      
      <CategoryComponent />
      
      <Services />
      
      <OurProjects />
      
      <WhyChooseUs />
      
      <Testimonials />
      
      <FAQ />
      
      <FeaturedProducts />
      
      <Footer />
    </div>
  );
}