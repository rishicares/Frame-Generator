import React from 'react';

const Hero = () => {
  return (
    <div className="bg-purple-600 text-white py-16 mb-8">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Frame Generator
          </h2>
          <p className="text-xl md:text-2xl font-light mb-8 text-purple-100">
            Create beautiful framed images in seconds.
            <br />Upload, adjust, and add a frame to make your images stand out.
          </p>
          <p className="font-bold text-purple-200 text-lg mb-4">
            #MakeImagesMatter
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
