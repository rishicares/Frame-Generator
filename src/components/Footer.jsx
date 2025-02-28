import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-12 bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-gray-700 font-medium">
              © {new Date().getFullYear()} Frame Generator. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 transform rotate-2 font-bold">
            #MakeImagesMatter
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
