// FrameSelector.jsx
import { CheckCircle2 } from "lucide-react";
import PropTypes from "prop-types";

const frames = [
    {
        id: 1,
        name: "Frame 1",
        image: "/frames/frame1.png",
        description: "Frame to support your cause",
        color: "from-purple-600 to-blue-600",
    },
    {
        id: 2,
        name: "Frame 2",
        image: "/frames/frame2.png",
        description: "Frame to support your next cause",
        color: "from-red-600 to-orange-600",
    },
];

const FrameSelector = ({ onFrameSelect, selectedFrame }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
                Choose Your Team Frame
            </h2>
            <div className="grid grid-cols-2 gap-4">
                {frames.map((frame) => (
                    <div
                        key={frame.id}
                        onClick={() => onFrameSelect(frame)}
                        className="cursor-pointer group relative"
                    >
                        <div
                            className={`
              relative rounded-xl overflow-hidden transition-all duration-300
              ${selectedFrame?.id === frame.id
                                    ? "ring-2 ring-blue-600 ring-offset-2"
                                    : "hover:ring-2 hover:ring-gray-200"
                                }
            `}
                        >
                            <div className="aspect-video bg-gradient-to-br p-4 relative overflow-hidden">
                                <img
                                    src={frame.image}
                                    alt={frame.name}
                                    className="w-full h-full object-contain mix-blend-overlay"
                                />
                            </div>
                            <div className="p-3 bg-white">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{frame.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {frame.description}
                                        </p>
                                    </div>
                                    {selectedFrame?.id === frame.id && (
                                        <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

FrameSelector.propTypes = {
    onFrameSelect: PropTypes.func.isRequired,
    selectedFrame: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        image: PropTypes.string,
        description: PropTypes.string,
        color: PropTypes.string,
    }),
};

export default FrameSelector;
