import React from 'react';

const FeatureSection = () => {
  return (
    <div className="mt-16 max-w-5xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">Features</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="w-12 h-12 mb-4 rounded-md bg-purple-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Beautiful Frames</h4>
          <p className="text-gray-700">Choose from a variety of beautiful frames to enhance your images.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="w-12 h-12 mb-4 rounded-md bg-purple-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Easy Customization</h4>
          <p className="text-gray-700">Adjust position, rotation, and zoom to perfectly fit your image in any frame.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="w-12 h-12 mb-4 rounded-md bg-purple-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Instant Downloads</h4>
          <p className="text-gray-700">Download your framed images instantly for sharing on social media or printing.</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
