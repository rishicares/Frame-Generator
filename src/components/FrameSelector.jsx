import PropTypes from 'prop-types';

const FrameSelector = ({ onFrameSelect, selectedFrame }) => {
  const frames = [
    { id: 1, name: 'Classic', image: '/src/assets/frames/classic-frame.svg' },
    { id: 2, name: 'Modern', image: '/src/assets/frames/modern-frame.svg' },
    { id: 3, name: 'Minimal', image: '/src/assets/frames/minimal-frame.svg' },
    // Add more frames as needed
  ];

  return (
    <div className="grid grid-cols-3 gap-4 sm:flex sm:gap-6">
      {frames.map((frame) => (
        <button
          key={frame.id}
          onClick={() => onFrameSelect(frame)}
          className={`group relative flex-shrink-0 w-24 aspect-square rounded-lg border-2 ${
            selectedFrame?.id === frame.id
              ? 'border-purple-600 ring-2 ring-purple-100'
              : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50/50'
          } overflow-hidden focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all`}
        >
          <img
            src={frame.image}
            alt={frame.name}
            className="w-full h-full object-contain p-2"
          />
          <div className={`absolute inset-x-0 bottom-0 py-1.5 px-2 text-xs font-medium text-center ${
            selectedFrame?.id === frame.id
              ? 'bg-purple-600 text-white'
              : 'bg-white/90 text-gray-700 group-hover:bg-purple-50/90 group-hover:text-purple-700'
          } transition-colors`}>
            {frame.name}
          </div>
        </button>
      ))}
    </div>
  );
};

FrameSelector.propTypes = {
  onFrameSelect: PropTypes.func.isRequired,
  selectedFrame: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
  }),
};

export default FrameSelector;
