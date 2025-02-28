import React, { useState, useRef, useEffect } from 'react';

// Sample frames - Replace with your actual frames
const sampleFrames = [
  { id: 1, name: "Classic Black", image: "/frames/frame1.png" },
  { id: 2, name: "Golden Edge", image: "/frames/frame2.png" },
  { id: 3, name: "Wooden Rustic", image: "/frames/frame3.png" },
  { id: 4, name: "Modern White", image: "/frames/frame4.png" },
  { id: 5, name: "Ornate Vintage", image: "/frames/frame5.png" }
];

const App = () => {
  // State for image and transformations
  const [image, setImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isRotating, setIsRotating] = useState(false);
  const [rotationStart, setRotationStart] = useState(0);
  
  // Frame selection
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [frameImage, setFrameImage] = useState(null);
  const [availableFrames, setAvailableFrames] = useState([]);
  const [loadingFrames, setLoadingFrames] = useState(true);
  
  // Canvas state
  const [finalImage, setFinalImage] = useState(null);
  
  // Refs
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const frameImageRef = useRef(null);
  const containerRef = useRef(null);

  // Check which frames are available
  useEffect(() => {
    const loadFrames = async () => {
      setLoadingFrames(true);
      
      // Try to load each frame and track which ones successfully load
      const availableFramesList = [];
      
      for (const frame of sampleFrames) {
        try {
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
              availableFramesList.push({
                ...frame,
                imageObject: img
              });
              resolve();
            };
            img.onerror = () => {
              console.warn(`Frame "${frame.name}" failed to load from: ${frame.image}`);
              reject();
            };
            img.src = frame.image;
          });
        } catch (error) {
          // Frame failed to load, don't add it to available frames
          continue;
        }
      }
      
      setAvailableFrames(availableFramesList);
      setLoadingFrames(false);
    };
    
    loadFrames();
  }, []);

  // Select a frame
  const handleFrameSelect = (frame) => {
    setSelectedFrame(frame);
    
    // Use the pre-loaded frame image
    if (frame && frame.imageObject) {
      frameImageRef.current = frame.imageObject;
      setFrameImage(frame.image);
      drawCanvas();
    } else {
      setFrameImage(null);
      frameImageRef.current = null;
      drawCanvas();
    }
  };

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
          setImage(event.target.result);
          setZoom(1);
          setPan({ x: 0, y: 0 });
          setRotation(0);
          setFinalImage(null);
          drawCanvas();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag and drop file upload
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      const file = e.dataTransfer.files[0];
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            imageRef.current = img;
            setImage(event.target.result);
            setZoom(1);
            setPan({ x: 0, y: 0 });
            setRotation(0);
            setFinalImage(null);
            drawCanvas();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Draw the canvas with the image and frame
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    // Calculate dimensions
    const containerWidth = canvas.width;
    const containerHeight = canvas.height;
    
    // Clear canvas with light gray background
    ctx.fillStyle = "#f8f0fc"; // Light purple background
    ctx.fillRect(0, 0, containerWidth, containerHeight);
    
    // Define drawable area
    const drawableWidth = containerWidth;
    const drawableHeight = containerHeight;
    
    // Save the context state for transformations
    ctx.save();
    
    // Create a clipping path to ensure the image stays within the canvas
    ctx.beginPath();
    ctx.rect(0, 0, containerWidth, containerHeight);
    ctx.clip();
    
    // Translate to center of drawable area
    ctx.translate(drawableWidth / 2, drawableHeight / 2);
    
    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Calculate base scale factor to fill the frame
    let baseScaleFactor;
    if (img.width / img.height > drawableWidth / drawableHeight) {
      baseScaleFactor = drawableHeight / img.height;
    } else {
      baseScaleFactor = drawableWidth / img.width;
    }
    
    // Apply zoom factor on top of base scale
    const scaleFactor = baseScaleFactor * zoom;
    
    // Apply pan offset with constraints
    ctx.translate(pan.x, pan.y);
    
    // Draw the image centered
    const scaledWidth = img.width * scaleFactor;
    const scaledHeight = img.height * scaleFactor;
    
    ctx.drawImage(
      img,
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );
    
    // Restore the context state
    ctx.restore();
    
    // Draw the frame on top if one is selected
    if (frameImageRef.current) {
      ctx.drawImage(frameImageRef.current, 0, 0, containerWidth, containerHeight);
    }
  };

  // Generate the final image
  const generateFinalImage = () => {
    if (!imageRef.current || !selectedFrame) return;
    
    // Use the current canvas as the final image
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Save the current canvas state as the final image
    setFinalImage(canvas.toDataURL('image/png'));
  };

  // Handle mouse events for direct manipulation
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if rotation handle was clicked
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const distFromCenter = Math.sqrt(
      Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
    );
    
    if (distFromCenter > Math.min(canvas.width, canvas.height) / 2 - 30) {
      setIsRotating(true);
      setRotationStart(
        Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI)
      );
    } else {
      setIsDragging(true);
      setDragStart({ x: mouseX, y: mouseY });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging && !isRotating) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (isRotating) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const currentAngle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
      const newRotation = (rotation + (currentAngle - rotationStart)) % 360;
      setRotation(newRotation);
      setRotationStart(currentAngle);
    } else if (isDragging && imageRef.current) {
      // Calculate drag distance
      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;
      
      // Calculate the new pan position
      const newPanX = pan.x + deltaX;
      const newPanY = pan.y + deltaY;
      
      // Calculate constraints to keep the image within the canvas
      const img = imageRef.current;
      const containerWidth = canvas.width;
      const containerHeight = canvas.height;
      
      // Calculate base scale factor to fill the frame
      let baseScaleFactor;
      if (img.width / img.height > containerWidth / containerHeight) {
        baseScaleFactor = containerHeight / img.height;
      } else {
        baseScaleFactor = containerWidth / img.width;
      }
      
      // Calculate actual image dimensions on canvas considering zoom
      const scaleFactor = baseScaleFactor * zoom;
      const scaledWidth = img.width * scaleFactor;
      const scaledHeight = img.height * scaleFactor;
      
      // Calculate max pan distances that keep the image within the visible area
      const maxPanX = (scaledWidth - containerWidth) / 2;
      const maxPanY = (scaledHeight - containerHeight) / 2;
      
      // Apply constraints - allow some flexibility for smaller images
      const constrainedPanX = Math.max(-maxPanX * 1.2, Math.min(maxPanX * 1.2, newPanX));
      const constrainedPanY = Math.max(-maxPanY * 1.2, Math.min(maxPanY * 1.2, newPanY));
      
      // Update pan position with constraints
      setPan({
        x: constrainedPanX,
        y: constrainedPanY
      });
      
      setDragStart({ x: mouseX, y: mouseY });
    }
    
    drawCanvas();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsRotating(false);
  };

  // Handle mouse wheel for zoom adjustment
  const handleWheel = (e) => {
    e.preventDefault();
    
    if (!image) return;
    
    // Calculate the zoom factor
    const zoomDelta = e.deltaY > 0 ? -0.1 : 0.1;
    // Minimum zoom now set to 1 (100%) instead of 0.5
    const newZoom = Math.max(1, Math.min(5, zoom + zoomDelta));
    
    // Update zoom
    setZoom(newZoom);
    
    // When zooming, check if current pan is out of bounds with new zoom and correct it
    if (imageRef.current) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const img = imageRef.current;
      const containerWidth = canvas.width;
      const containerHeight = canvas.height;
      
      // Calculate base scale factor
      let baseScaleFactor;
      if (img.width / img.height > containerWidth / containerHeight) {
        baseScaleFactor = containerHeight / img.height;
      } else {
        baseScaleFactor = containerWidth / img.width;
      }
      
      // Calculate max pan distances with new zoom
      const scaleFactor = baseScaleFactor * newZoom;
      const scaledWidth = img.width * scaleFactor;
      const scaledHeight = img.height * scaleFactor;
      
      const maxPanX = Math.max(0, (scaledWidth - containerWidth) / 2);
      const maxPanY = Math.max(0, (scaledHeight - containerHeight) / 2);
      
      // Keep pan within bounds for new zoom level
      setPan({
        x: Math.max(-maxPanX, Math.min(maxPanX, pan.x)),
        y: Math.max(-maxPanY, Math.min(maxPanY, pan.y))
      });
    }
    
    drawCanvas();
  };

  // Download the final image
  const downloadImage = () => {
    if (finalImage) {
      const link = document.createElement('a');
      link.download = 'framed-image.png';
      link.href = finalImage;
      link.click();
    }
  };

  // Create a new image
  const createNewImage = () => {
    setFinalImage(null);
    setSelectedFrame(null);
    setFrameImage(null);
    setImage(null);
    setPan({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    frameImageRef.current = null;
    imageRef.current = null;
  };

  // Redraw canvas when dependencies change
  useEffect(() => {
    drawCanvas();
  }, [image, rotation, zoom, pan, frameImage]);

  // Add event listeners for wheel event
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleWheelEvent = (e) => handleWheel(e);
    
    canvas.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheelEvent);
    };
  }, [zoom, image]);

  return (
    <div className="min-h-screen flex flex-col font-['Urbanist',sans-serif] bg-white">
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <header className="bg-white py-4 sticky top-0 z-10 border-b border-gray-100">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Frame Generator</h1>
          </div>
          
          <a 
            href="https://github.com/your-username/frame-generator" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-gray-600 hover:text-purple-600 transition-colors font-medium"
          >
            <span className="sr-only">GitHub</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      {!image && !finalImage && (
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
      )}

      {/* Main content */}
      <main className="flex-grow container mx-auto px-6 py-8">
        {finalImage ? (
          /* Result view */
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Your Framed Image</h2>
              <p className="mt-2 text-lg text-gray-600">Ready to share with the world</p>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-10">
              <div className="p-6 sm:p-8">
                <div className="aspect-square max-w-2xl mx-auto mb-8 relative">
                  <img 
                    src={finalImage} 
                    alt="Final Framed Image" 
                    className="w-full h-full object-contain rounded-lg border border-gray-200"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={downloadImage}
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none transition-all"
                  >
                    <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Image
                  </button>
                  
                  <button 
                    onClick={createNewImage}
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all"
                  >
                    <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create New Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {!image && (
              <div className="text-center max-w-4xl mx-auto mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload an Image to Get Started</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Create stunning framed images for social media, websites, or personal use
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Frame selection panel */}
              <div className="col-span-1 order-2 lg:order-1">
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
              </div>

              {/* Canvas and controls */}
              <div className="col-span-1 lg:col-span-3 order-1 lg:order-2">
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-8">
                  {/* Image preview area */}
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
                  
                  {/* Controls */}
                  {image && (
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
                  )}
                </div>
              </div>
            </div>

            {/* Features section */}
            {!image && (
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
            )}
          </div>
        )}
      </main>

      {/* Footer */}
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
    </div>
  );
};

export default App;
