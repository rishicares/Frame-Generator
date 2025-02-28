import React from 'react';

const ControlPanel = ({
  image,
  zoom,
  rotation,
  setZoom,
  setRotation,
  setPan,
  generateFinalImage,
  selectedFrame,
  availableFrames,
  loadingFrames
}) => {
  if (!image) return null;

  return (
    <div className="px-6 py-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="zoom" className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Zoom</span>
            <span className="text-sm font-medium text-purple-600">{Math.round(zoom * 100)}%</span>
          </label>
          <div className="mt-1 flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
            <button
              type="button"
              onClick={() => setZoom(Math.max(1, zoom - 0.1))}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <input
              type="range"
              id="zoom"
              name="zoom"
              min="1"
              max="5"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 mx-3 accent-purple-600"
            />
            <button
              type="button"
              onClick={() => setZoom(Math.min(5, zoom + 0.1))}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="rotation" className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Rotation</span>
            <span className="text-sm font-medium text-purple-600">{Math.round(rotation)}°</span>
          </label>
          <div className="mt-1 flex items-center bg-gray-50 rounded-lg border border-gray-200 p-1">
            <button
              type="button"
              onClick={() => setRotation((rotation - 90 + 360) % 360)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <input
              type="range"
              id="rotation"
              name="rotation"
              min="0"
              max="359"
              value={rotation}
              onChange={(e) => setRotation(parseInt(e.target.value))}
              className="flex-1 mx-3 accent-purple-600"
            />
            <button
              type="button"
              onClick={() => setRotation((rotation + 90) % 360)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={() => {
            setPan({ x: 0, y: 0 });
            setZoom(1);
            setRotation(0);
          }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all"
        >
          <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Position
        </button>
        
        <button
          type="button"
          onClick={generateFinalImage}
          disabled={!selectedFrame}
          className={`inline-flex items-center px-6 py-3 text-base font-medium rounded-lg transition-colors ${
            selectedFrame 
              ? 'text-white bg-purple-600 hover:bg-purple-700 focus:outline-none' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Generate Framed Image
        </button>
      </div>

      {/* Warnings */}
      {!selectedFrame && availableFrames.length > 0 && (
        <div className="mt-6 rounded-lg bg-yellow-50 p-4 border border-yellow-200">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-yellow-400 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium text-yellow-700">
              Please select a frame from the options to continue.
            </p>
          </div>
        </div>
      )}

      {!loadingFrames && availableFrames.length === 0 && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 border border-red-200">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-400 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-red-800">No frames available</h3>
              <p className="mt-1 text-sm text-red-700">
                You cannot generate an image without a frame.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlPanel;
