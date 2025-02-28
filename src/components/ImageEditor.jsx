import { useState, useRef, useEffect } from 'react';

// Default frames data
const defaultFrames = [
  {
    id: 1,
    name: 'Frame 1',
    image: new URL('../assets/frames/frame1.png', import.meta.url).href
  },
  {
    id: 2,
    name: 'Frame 2',
    image: new URL('../assets/frames/frame2.png', import.meta.url).href
  }
];

const ImageEditor = () => {
  // State for image and transformations
  const [image, setImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isRotating, setIsRotating] = useState(false);
  const [rotationStart, setRotationStart] = useState(0);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [availableFrames, setAvailableFrames] = useState([]);
  const [loadingFrames, setLoadingFrames] = useState(true);

  // Refs
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const frameImageRef = useRef(null);

  // Load frames
  useEffect(() => {
    const loadFrames = async () => {
      try {
        // In a real app, this would be an API call
        // For now, we'll use our default frames
        setAvailableFrames(defaultFrames);
        setLoadingFrames(false);
      } catch (error) {
        console.error('Error loading frames:', error);
        setLoadingFrames(false);
      }
    };

    loadFrames();
  }, []);

  // Handle frame selection with proper image loading
  const handleFrameSelect = (frame) => {
    setSelectedFrame(frame);
    if (frame) {
      const img = new Image();
      img.onload = () => {
        frameImageRef.current = img;
        drawCanvas();
      };
      img.onerror = (error) => {
        console.error('Error loading frame image:', error);
        setSelectedFrame(null);
      };
      img.src = frame.image;
    } else {
      frameImageRef.current = null;
      drawCanvas();
    }
  };

  // Calculate pan boundaries based on current zoom and rotation
  const calculatePanBoundaries = () => {
    if (!imageRef.current || !canvasRef.current) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    const canvas = canvasRef.current;
    const img = imageRef.current;
    
    // Calculate scaled dimensions
    let baseScaleFactor;
    if (img.width / img.height > canvas.width / canvas.height) {
      baseScaleFactor = canvas.height / img.height;
    } else {
      baseScaleFactor = canvas.width / img.width;
    }
    
    const scaleFactor = baseScaleFactor * zoom;
    const scaledWidth = img.width * scaleFactor;
    const scaledHeight = img.height * scaleFactor;

    // Calculate maximum pan distance (half of the overflow)
    const maxPanX = Math.max(0, (scaledWidth - canvas.width) / 2);
    const maxPanY = Math.max(0, (scaledHeight - canvas.height) / 2);

    return {
      minX: -maxPanX,
      maxX: maxPanX,
      minY: -maxPanY,
      maxY: maxPanY
    };
  };

  // Constrain pan values within boundaries
  const constrainPan = (newPan) => {
    const bounds = calculatePanBoundaries();
    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, newPan.x)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, newPan.y))
    };
  };

  // Initialize canvas with proper dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Initial draw if image exists
    if (image) {
      drawCanvas();
    }
  }, [image]);

  // Draw the canvas with the image and frame
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure canvas dimensions are set
    if (canvas.width !== canvas.offsetWidth || canvas.height !== canvas.offsetHeight) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    
    const img = imageRef.current;
    
    // Calculate dimensions
    const containerWidth = canvas.width;
    const containerHeight = canvas.height;
    
    // Clear canvas with light gray background
    ctx.fillStyle = "#f8f0fc";
    ctx.fillRect(0, 0, containerWidth, containerHeight);
    
    // Define drawable area
    const drawableWidth = containerWidth;
    const drawableHeight = containerHeight;
    
    // Save the context state for image transformations
    ctx.save();
    
    // Create a clipping path for the image
    ctx.beginPath();
    ctx.rect(0, 0, containerWidth, containerHeight);
    ctx.clip();
    
    // Translate to center of drawable area for image transformations
    ctx.translate(drawableWidth / 2, drawableHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    
    // Calculate base scale factor to fill the frame
    let baseScaleFactor;
    if (img.width / img.height > drawableWidth / drawableHeight) {
      baseScaleFactor = drawableHeight / img.height;
    } else {
      baseScaleFactor = drawableWidth / img.width;
    }
    
    const scaleFactor = baseScaleFactor * zoom;
    ctx.translate(pan.x, pan.y);
    
    const scaledWidth = img.width * scaleFactor;
    const scaledHeight = img.height * scaleFactor;
    
    // Draw the image with transformations
    ctx.drawImage(
      img,
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );
    
    // Restore context to original state before drawing frame
    ctx.restore();

    // Draw the frame on top without any transformations
    if (frameImageRef.current) {
      ctx.drawImage(frameImageRef.current, 0, 0, containerWidth, containerHeight);
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
          drawCanvas();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas || !image) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
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
      const currentAngle =
        Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
      let newRotation = rotation + (currentAngle - rotationStart);
      
      const snapThreshold = 5;
      for (let angle = 0; angle <= 360; angle += 90) {
        if (Math.abs(newRotation % 360 - angle) < snapThreshold) {
          newRotation = angle;
          break;
        }
      }
      
      setRotation(newRotation);
      setRotationStart(currentAngle);
    } else if (isDragging) {
      const deltaX = mouseX - dragStart.x;
      const deltaY = mouseY - dragStart.y;
      
      setPan((prev) => {
        const newPan = {
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        };
        return constrainPan(newPan);
      });
      
      setDragStart({ x: mouseX, y: mouseY });
    }
    
    drawCanvas();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsRotating(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (!image) return;
    
    const zoomSpeed = 0.1;
    const delta = e.deltaY < 0 ? zoomSpeed : -zoomSpeed;
    const newZoom = Math.max(1, Math.min(5, zoom + delta)); // Changed minimum zoom to 1
    
    setZoom(newZoom);
    
    // Adjust pan when zooming to keep it within bounds
    setPan(prevPan => constrainPan(prevPan));
    
    drawCanvas();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheelEvent = (e) => handleWheel(e);
    canvas.addEventListener('wheel', handleWheelEvent);

    return () => {
      canvas.removeEventListener('wheel', handleWheelEvent);
    };
  }, [zoom, image]);

  useEffect(() => {
    if (image) {
      drawCanvas();
    }
  }, [image, rotation, zoom, pan]);

  const generateFinalImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'framed-image.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Main Editor Area with Background */}
      <div className="relative">
        {/* Background Elements */}
        <div className="absolute inset-0 -top-20 -bottom-20 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_50%,rgba(139,92,246,0.12)_0%,rgba(255,255,255,0)_100%)]" />
          <div className="absolute h-40 w-40 -left-20 top-1/2 -translate-y-1/2 bg-purple-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob" />
          <div className="absolute h-40 w-40 -right-20 top-1/2 -translate-y-1/2 bg-purple-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-blob animation-delay-2000" />
          </div>

        {/* Preview Container */}
        <div className="relative z-10 max-w-xl mx-auto w-full">
          <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100/50 backdrop-blur-sm bg-white/80">
            {image ? (
              <div className="relative aspect-square">
            <canvas
              ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                />
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center">
                <div className="text-center p-12">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-sm font-medium text-gray-900">No image selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Upload an image to get started</p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => document.getElementById('imageInput').click()}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L9 8m4-4v12" />
                      </svg>
                      Upload Image
                    </button>
                  </div>
                </div>
            </div>
        )}
          </div>
        </div>
      </div>
        
      {/* Toolbar - Only show when image is uploaded */}
        {image && (
        <div className="relative z-20 max-w-3xl mx-auto w-full space-y-4">
          {/* Main Toolbar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="grid grid-cols-[auto_1fr] gap-6">
              {/* Frame Selection */}
              <div className="relative border-r border-gray-200 pr-6">
                <div className="flex items-center gap-2">
                  {loadingFrames ? (
                    <div className="animate-pulse flex gap-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-12 w-12 bg-gray-100 rounded-lg" />
                      ))}
                    </div>
                  ) : (
                    availableFrames.map((frame) => (
                      <button
                        key={frame.id}
                        type="button"
                        onClick={() => handleFrameSelect(frame)}
                        className={`h-12 w-12 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedFrame?.id === frame.id
                            ? 'border-purple-600 ring-2 ring-purple-100'
                            : 'border-gray-200 hover:border-purple-200 active:border-purple-300'
                        }`}
                      >
                        <img
                          src={frame.image}
                          alt={frame.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="relative">
                {/* Zoom, Rotate, and Reset Controls */}
                <div className="grid grid-cols-[1fr_1fr_auto] gap-6">
                  {/* Zoom Controls */}
                  <div className="relative space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Zoom</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newZoom = Math.max(1, zoom - 0.1);
                            setZoom(newZoom);
                            drawCanvas();
                          }}
                          className="h-8 w-8 flex items-center justify-center rounded-lg border-2 border-gray-200 text-gray-600 hover:border-purple-200 hover:text-purple-600 active:border-purple-300 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <span className="text-sm font-medium w-14 text-center">{Math.round(zoom * 100)}%</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newZoom = Math.min(5, zoom + 0.1);
                            setZoom(newZoom);
                            drawCanvas();
                          }}
                          className="h-8 w-8 flex items-center justify-center rounded-lg border-2 border-gray-200 text-gray-600 hover:border-purple-200 hover:text-purple-600 active:border-purple-300 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      value={zoom}
                      onChange={(e) => {
                        setZoom(parseFloat(e.target.value));
                        drawCanvas();
                      }}
                      className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>

                  {/* Rotation Controls */}
                  <div className="relative space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Rotate</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newRotation = ((rotation - 90) % 360 + 360) % 360;
                            setRotation(newRotation);
                            drawCanvas();
                          }}
                          className="h-8 w-8 flex items-center justify-center rounded-lg border-2 border-gray-200 text-gray-600 hover:border-purple-200 hover:text-purple-600 active:border-purple-300 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                          </svg>
                        </button>
                        <span className="text-sm font-medium w-14 text-center">{Math.round(rotation)}°</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newRotation = ((rotation + 90) % 360 + 360) % 360;
                            setRotation(newRotation);
                            drawCanvas();
                          }}
                          className="h-8 w-8 flex items-center justify-center rounded-lg border-2 border-gray-200 text-gray-600 hover:border-purple-200 hover:text-purple-600 active:border-purple-300 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 100 12h3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="359"
                      value={rotation}
                      onChange={(e) => {
                        setRotation(parseInt(e.target.value));
                        drawCanvas();
                      }}
                      className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>

                  {/* Reset Button */}
                  <div className="relative flex items-start pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setPan({ x: 0, y: 0 });
                        setZoom(1);
                        setRotation(0);
                        drawCanvas();
                      }}
                      className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-purple-200 hover:text-purple-600 active:border-purple-300 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-sm font-medium">Reset All</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Ready to save?</span>
              {selectedFrame ? (
                <button
                  type="button"
                  onClick={generateFinalImage}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 transition-colors"
                >
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Image
                </button>
              ) : (
                <span className="text-sm text-gray-500">Select a frame to download your image</span>
        )}
      </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        id="imageInput"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
};

export default ImageEditor;
