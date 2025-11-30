import React from "react";

const Hero = () => {
  return (
    <section className="pt-28 pb-20 bg-gradient-to-b from-blue-50 to-white text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6">
          Store, Manage & Access Your Files Seamlessly
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Your personal cloud file system built for speed, privacy, and simplicity.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Get Started
          </button>
          <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
