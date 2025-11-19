import React, { useEffect, useState } from "react";

const Hero = () => {
  const words = ["Aquatic Care", "Aquarium Services", "Water Garden Designs"];
  const [currentWord, setCurrentWord] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter Effect
  useEffect(() => {
    const current = words[wordIndex];
    let typingSpeed = isDeleting ? 50 : 120;

    const timeout = setTimeout(() => {
      setCurrentWord(
        isDeleting
          ? current.substring(0, charIndex - 1)
          : current.substring(0, charIndex + 1)
      );
      setCharIndex(isDeleting ? charIndex - 1 : charIndex + 1);

      // If complete word typed
      if (!isDeleting && charIndex === current.length) {
        setTimeout(() => setIsDeleting(true), 1200);
      }

      // When deleting is complete
      if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Optimized Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/load.jpeg"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://pub-6070c66a49144147b12828af75c69a0c.r2.dev/foscape.mp4" type="video/mp4" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fadeIn">
        <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-xl">
          World-Class
          <span className="text-blue-400 block h-16">
            {currentWord}
            <span className="border-r-2 border-white ml-1 animate-blink"></span>
          </span>
          Services
        </h1>

        <p className="mt-6 text-xl text-gray-200 leading-relaxed drop-shadow-lg">
          Specializing in aquariums, pools, and water gardens. Transform your
          space with stunning aquatic environments.
        </p>
      </div>
    </section>
  );
};

export default Hero;
