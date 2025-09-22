import React from 'react'
import Navbar from '../../Layout/Navbar'
import Hero from '../../Layout/Hero'
import FlashSale from '../../Layout/FlashSale'
import About from '../../Layout/About'
import Services from '../../Layout/Services'
import Projects from '../../Layout/Projects'
import Gallery from '../../Layout/Gallery'
import Visionary from '../../Layout/Visionary'
import Testimonials from '../../Layout/Testimonials'
import Footer from '../../Layout/Footer'
import CategoryComponent from '../../Layout/Categories'

function HomePage() {
  return (
    <>
     <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FlashSale />
      <CategoryComponent/>
      <About />
      <Services />
      <Projects />
      <Gallery />
      <Visionary />
      <Testimonials />
      <Footer />
    </div>
    </>
  )
}

export default HomePage