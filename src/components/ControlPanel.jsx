import PropTypes from 'prop-types';

const ControlPanel = ({
  image,
  zoom,
  rotation,
  setZoom,
  setRotation,
  setPan,
  selectedFrame,
  availableFrames
}) => {
  if (!image) {
    return (
      <div className="p-4">
        <p className="text-sm text-gray-500 text-center">Upload an image to access controls</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Reset Button */}
      <button
        type="button"
        onClick={() => {
          setPan({ x: 0, y: 0 });
          setZoom(1);
          setRotation(0);
        }}
        className="w-full flex items-center justify-center p-2.5 text-sm font-medium rounded-xl border border-gray-200 text-gray-600 bg-white hover:bg-purple-50 hover:border-purple-200 hover:text-purple-600 transition-all"
      >
        <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Reset All
      </button>

      {/* Controls Group */}
      <div className="space-y-5">
        {/* Zoom Control */}
        <div className="p-3 bg-gray-50 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Zoom</span>
            </div>
            <span className="text-sm font-medium text-purple-600">{Math.round(zoom * 100)}%</span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-2 bg-white rounded-full appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        {/* Rotation Control */}
        <div className="p-3 bg-gray-50 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Rotation</span>
            </div>
            <span className="text-sm font-medium text-purple-600">{Math.round(rotation)}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="359"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="w-full h-2 bg-white rounded-full appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        {/* Quick Rotation Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setRotation(rotation === 180 ? 0 : 180)}
            className={`p-2 text-sm font-medium rounded-xl border transition-all ${
              Math.round(rotation) === 180
                ? 'border-purple-600 bg-purple-50 text-purple-600'
                : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50 text-gray-600 hover:text-purple-600'
            }`}
            title="Flip Vertical"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3L12 21M12 3L8 7M12 3L16 7M12 21L8 17M12 21L16 17" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={() => setRotation(0)}
            className={`p-2 text-sm font-medium rounded-xl border transition-all ${
              Math.round(rotation) === 0
                ? 'border-purple-600 bg-purple-50 text-purple-600'
                : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50 text-gray-600 hover:text-purple-600'
            }`}
            title="Reset Rotation"
          >
            0°
          </button>
          <button
            onClick={() => setRotation(rotation === 90 ? 270 : 90)}
            className={`p-2 text-sm font-medium rounded-xl border transition-all ${
              Math.round(rotation) === 90 || Math.round(rotation) === 270
                ? 'border-purple-600 bg-purple-50 text-purple-600'
                : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50 text-gray-600 hover:text-purple-600'
            }`}
            title="Flip Horizontal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12L21 12M3 12L7 8M3 12L7 16M21 12L17 8M21 12L17 16" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Warning */}
      {!selectedFrame && availableFrames.length > 0 && (
        <div className="rounded-xl bg-purple-50 p-3 border border-purple-100">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-purple-600 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-purple-700">
              Select a frame to save
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

ControlPanel.propTypes = {
  image: PropTypes.string,
  zoom: PropTypes.number.isRequired,
  rotation: PropTypes.number.isRequired,
  setZoom: PropTypes.func.isRequired,
  setRotation: PropTypes.func.isRequired,
  setPan: PropTypes.func.isRequired,
  selectedFrame: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
  }),
  availableFrames: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      image: PropTypes.string,
    })
  ).isRequired,
};

export default ControlPanel;
