// FrameGenerator.jsx
import { useState, useEffect, useCallback } from 'react';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon,
} from 'react-share';
import ImageUploader from './ImageUploader';
import FrameSelector from './FrameSelector';
import { Download, Share2 } from 'lucide-react';

const FrameGenerator = () => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedFrame, setSelectedFrame] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateCompositeImage = useCallback(() => {
        if (!uploadedImage || !selectedFrame) return;

        setIsGenerating(true);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        Promise.all([
            createImageBitmap(dataURLToBlob(uploadedImage)),
            fetch(selectedFrame.image).then(r => r.blob()).then(createImageBitmap)
        ]).then(([userImg, frameImg]) => {
            canvas.width = userImg.width;
            canvas.height = userImg.height;

            ctx.drawImage(userImg, 0, 0);
            ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);

            const imageUrl = canvas.toDataURL('image/png');
            setGeneratedImage(imageUrl);
            setIsGenerating(false);
        }).catch(() => {
            setIsGenerating(false);
        });
    }, [uploadedImage, selectedFrame]);

    useEffect(() => {
        generateCompositeImage();
    }, [generateCompositeImage]);

    const dataURLToBlob = (dataURL) => {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    const getShareConfig = useCallback(() => ({
        url: window.location.href,
        title: 'Check out my team profile picture! 🎉',
        description: `Supporting ${selectedFrame?.name || 'my team'} with this awesome profile picture!`,
        hashtags: ['FrameGenerator', selectedFrame?.name?.replace(/\s+/g, '')].filter(Boolean),
        quote: `Supporting ${selectedFrame?.name || 'my team'} with this awesome profile picture! 🎉`,
        source: window.location.href,
    }), [selectedFrame]);

    // Function to handle direct file sharing
    const handleShare = async () => {
        if (!generatedImage) return;

        try {
            const blob = dataURLToBlob(generatedImage);
            const file = new File([blob], 'team-profile.png', { type: 'image/png' });

            if (navigator.share) {
                await navigator.share({
                    title: getShareConfig().title,
                    text: getShareConfig().description,
                    files: [file]
                });
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Create Your Team Profile
                        </h1>
                        <p className="text-lg text-gray-600">
                            Show your team spirit with a custom frame
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <ImageUploader onImageUpload={setUploadedImage} />
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <FrameSelector
                                    onFrameSelect={setSelectedFrame}
                                    selectedFrame={selectedFrame}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
                                    {generatedImage && (
                                        <div className="flex gap-3">
                                            <a
                                                href={generatedImage}
                                                download="team-profile.png"
                                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
                                            >
                                                <Download className="h-4 w-4" />
                                                Download
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border">
                                    {isGenerating ? (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                                        </div>
                                    ) : generatedImage ? (
                                        <img
                                            src={generatedImage}
                                            alt="Generated Profile"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : uploadedImage ? (
                                        <img
                                            src={uploadedImage}
                                            alt="Original"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-400">
                                            Upload an image to get started
                                        </div>
                                    )}
                                </div>

                                {generatedImage && (
                                    <div className="mt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Share2 className="h-4 w-4 text-gray-600" />
                                            <h3 className="text-lg font-medium text-gray-900">Share your profile</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {/* Native Share Button */}
                                            {navigator.share && (
                                                <button
                                                    onClick={handleShare}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                                                >
                                                    <Share2 className="h-5 w-5" />
                                                    Share
                                                </button>
                                            )}

                                            {/* Fallback social share buttons */}
                                            <FacebookShareButton
                                                url={window.location.href}
                                                quote={getShareConfig().quote}
                                                hashtag={`#${getShareConfig().hashtags[0]}`}
                                            >
                                                <div className="px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                                                    <FacebookIcon size={24} round />
                                                    Facebook
                                                </div>
                                            </FacebookShareButton>
                                            <TwitterShareButton
                                                url={window.location.href}
                                                title={getShareConfig().title}
                                                hashtags={getShareConfig().hashtags}
                                                via="FrameGenerator"
                                            >
                                                <div className="px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                                                    <TwitterIcon size={24} round />
                                                    Twitter
                                                </div>
                                            </TwitterShareButton>
                                            <WhatsappShareButton
                                                url={window.location.href}
                                                title={getShareConfig().title}
                                                separator=" - "
                                            >
                                                <div className="px-4 py-2 bg-[#25D366] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                                                    <WhatsappIcon size={24} round />
                                                    WhatsApp
                                                </div>
                                            </WhatsappShareButton>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FrameGenerator;