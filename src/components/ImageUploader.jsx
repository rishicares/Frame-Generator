// ImageUploader.jsx
import { useCallback, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';

const ImageUploader = ({ onImageUpload }) => {
    const [image, setImage] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        maxSize: 5 * 1024 * 1024,
        multiple: false
    });

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url) =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (error) => reject(error));
            image.src = url;
        });

    const getCroppedImg = async () => {
        try {
            const img = await createImage(image);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            ctx.drawImage(
                img,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            const croppedImage = canvas.toDataURL('image/jpeg');
            onImageUpload(croppedImage);
            setShowCropper(false);
            setImage(null);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Upload Your Photo</h2>

                <div
                    {...getRootProps()}
                    className={`
                        border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
                        ${isDragActive
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                        }
                    `}
                >
                    <input {...getInputProps()} />
                    <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm font-medium text-gray-700">
                            {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            or click to select from your computer
                        </p>
                    </div>
                </div>

                {fileRejections.length > 0 && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                        {fileRejections[0].errors[0].message}
                    </div>
                )}

                <p className="text-xs text-gray-500 text-center">
                    Supported formats: JPG, PNG (max 5MB)
                </p>
            </div>

            {/* Crop Modal */}
            {showCropper && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-white rounded-2xl w-[90vw] max-w-4xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-xl font-semibold text-gray-900">
                                Crop Your Image
                            </h3>
                            <button
                                onClick={() => {
                                    setShowCropper(false);
                                    setImage(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="relative flex-1 min-h-[60vh]">
                            <Cropper
                                image={image}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <div className="p-4 border-t bg-gray-50">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="text-sm font-medium text-gray-700">Zoom</span>
                                <Slider
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    onChange={(e, zoom) => setZoom(zoom)}
                                    className="flex-1"
                                    sx={{
                                        color: '#2563eb',
                                        '& .MuiSlider-thumb': {
                                            backgroundColor: '#2563eb',
                                        },
                                        '& .MuiSlider-track': {
                                            backgroundColor: '#2563eb',
                                        },
                                    }}
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setShowCropper(false);
                                        setImage(null);
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={getCroppedImg}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

ImageUploader.propTypes = {
    onImageUpload: PropTypes.func.isRequired
};

export default ImageUploader;