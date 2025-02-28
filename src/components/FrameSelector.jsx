import React from 'react';

const FrameSelector = ({ 
  availableFrames, 
  loadingFrames, 
  selectedFrame, 
  handleFrameSelect 
}) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 sticky top-24">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50">
        <h3 className="text-xl font-semibold text-gray-900">Select a Frame</h3>
      </div>
      
      <div className="px-4 py-5">
        {loadingFrames ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-r-2 border-purple-500"></div>
          </div>
        ) : availableFrames.length === 0 ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-red-800">No frames available</h3>
                <p className="mt-1 text-sm text-red-700">
                  Check that frame images exist in the /frames directory.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {availableFrames.map((frame) => (
              <div
                key={frame.id}
                onClick={() => handleFrameSelect(frame)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                  selectedFrame && selectedFrame.id === frame.id
                    ? 'bg-purple-50 border border-purple-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex-shrink-0 h-16 w-16 bg-gray-50 rounded-lg flex items-center justify-center mr-3 border border-gray-200">
                  <img
                    src={frame.image}
                    alt={frame.name}
                    className="max-h-14 max-w-14 object-contain"
                  />
                </div>
                <p className="text-base font-medium text-gray-900">{frame.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FrameSelector;
