import React from 'react';

const ImageEditor = ({
  containerRef,
  canvasRef,
  image,
  isDragging,
  zoom,
  rotation,
  handleDragOver,
  handleDrop,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleImageUpload,
}) => {
  return (
    <div className="border-b border-gray-100">
      <div 
        ref={containerRef}
        className="relative overflow-hidden flex items-center justify-center bg-gray-50"
        style={{ height: '500px' }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!image && (
          <div className="text-center px-6 w-full max-w-md mx-auto">
            <svg className="mx-auto h-20 w-20 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-6 text-xl font-semibold text-gray-800">Drop Image Here</h3>
            <p className="mt-2 text-base text-gray-600 mb-8">
              Drag and drop or click below to select a file
            </p>
            <label htmlFor="file-upload" className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none cursor-pointer transition-colors">
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Image
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
              />
            </label>
          </div>
        )}
        
        {image && (
          <>
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="max-w-full max-h-full object-contain rounded-lg"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            />
            <div className="absolute left-4 top-4 text-xs font-semibold px-3 py-1 rounded-full bg-black bg-opacity-75 text-white">
              {Math.round(zoom * 100)}% • {Math.round(rotation)}°
            </div>
          </>
        )}
        
        {image && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-sm px-4 py-2 rounded-lg font-medium">
            Drag to position • Scroll to zoom • Drag edge to rotate
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;
