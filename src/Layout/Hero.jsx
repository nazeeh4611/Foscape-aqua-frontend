import React from "react";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        src="/foscape.mp4"
      />

      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg">
          World-Class
          <span className="text-blue-400 block">Aquatic Care</span>
          Services
        </h1>
        <p className="mt-6 text-xl text-gray-200 leading-relaxed drop-shadow-md">
          Specializing in aquariums, pools, and water gardens. Transform your
          space with stunning aquatic environments.
        </p>
      </div>
    </section>
  );
};

export default Hero;
