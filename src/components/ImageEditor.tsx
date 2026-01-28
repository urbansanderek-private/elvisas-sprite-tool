import { useEffect, useRef, useState } from 'react';
import Cropper from 'cropperjs';

/**
 * ImageEditor Component
 *
 * Advanced image editor using Cropper.js for:
 * - Zoom (mouse wheel, buttons)
 * - Pan (drag)
 * - Rotate (90° steps and free rotation)
 * - Crop to square
 * - Fine adjustments before final processing
 */
interface ImageEditorProps {
  imageData: string;
  onSave: (processedImageData: string) => void;
  onCancel: () => void;
  outputSize: number;
}

export default function ImageEditor({ imageData, onSave, onCancel, outputSize }: ImageEditorProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (imageRef.current && !cropperRef.current) {
      const cropper = new Cropper(imageRef.current, {
        aspectRatio: 1, // Square crop
        viewMode: 0, // Allow image to move freely for unlimited zoom out
        dragMode: 'move',
        autoCropArea: 0.5, // Smaller initial crop for better view of large images
        restore: false,
        guides: true,
        center: true,
        highlight: false,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
        background: true,
        zoomable: true,
        zoomOnWheel: true,
        wheelZoomRatio: 0.1,
        initialAspectRatio: 1,
        ready() {
          // Auto-fit large images (like scanned A4 at 300dpi)
          const imageData = cropper.getImageData();
          const containerData = cropper.getContainerData();

          // Calculate zoom needed to fit entire image in viewport
          const scaleX = containerData.width / imageData.naturalWidth;
          const scaleY = containerData.height / imageData.naturalHeight;
          const fitScale = Math.min(scaleX, scaleY) * 0.85; // 85% for padding

          // Only zoom if image is larger than viewport
          if (imageData.naturalWidth > containerData.width ||
              imageData.naturalHeight > containerData.height) {
            cropper.zoomTo(fitScale);
          }
        },
      } as any); // Cast to bypass TypeScript limitations on zoom options

      cropperRef.current = cropper;
    }

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
    };
  }, []);

  const handleZoomIn = () => {
    cropperRef.current?.zoom(0.1);
  };

  const handleZoomOut = () => {
    cropperRef.current?.zoom(-0.1);
  };

  const handleRotateLeft = () => {
    cropperRef.current?.rotate(-90);
    setRotation((prev) => prev - 90);
  };

  const handleRotateRight = () => {
    cropperRef.current?.rotate(90);
    setRotation((prev) => prev + 90);
  };

  const handleRotateFree = (degrees: number) => {
    if (cropperRef.current) {
      const currentRotation = rotation;
      const delta = degrees - currentRotation;
      cropperRef.current.rotate(delta);
      setRotation(degrees);
    }
  };

  const handleReset = () => {
    cropperRef.current?.reset();
    setRotation(0);
  };

  const handleFitToView = () => {
    if (!cropperRef.current) return;

    const imageData = cropperRef.current.getImageData();
    const containerData = cropperRef.current.getContainerData();

    // Calculate what ratio we need to fit the natural image in the container
    const targetRatioX = (containerData.width * 0.85) / imageData.naturalWidth;
    const targetRatioY = (containerData.height * 0.85) / imageData.naturalHeight;
    const targetRatio = Math.min(targetRatioX, targetRatioY);

    // Apply the zoom
    cropperRef.current.zoomTo(targetRatio);
  };

  const handleSave = () => {
    if (!cropperRef.current) return;

    setIsProcessing(true);

    try {
      // Get cropped canvas with specified output size
      const canvas = cropperRef.current.getCroppedCanvas({
        width: outputSize,
        height: outputSize,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });

      // Convert to data URL
      const processedImage = canvas.toDataURL('image/png');
      onSave(processedImage);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-800 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Edit Image</h2>
            <p className="text-sm text-slate-300 mt-1">
              Adjust position, zoom, and rotation. Image will be cropped to {outputSize}x{outputSize}px
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-300 hover:text-white transition-colors"
            title="Close"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Image Editor Area */}
        <div className="flex-1 overflow-auto p-6 bg-slate-100">
          <div className="max-w-2xl mx-auto">
            <img
              ref={imageRef}
              src={imageData}
              alt="Edit"
              style={{ maxWidth: '100%', display: 'block' }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border-t border-slate-200 p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700 w-20">Zoom:</span>
              <button
                onClick={handleZoomOut}
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
                title="Zoom Out"
              >
                −
              </button>
              <button
                onClick={handleZoomIn}
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={handleFitToView}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                title="Fit entire image to view"
              >
                Fit to View
              </button>
              <span className="text-xs text-slate-500 ml-2">or use mouse wheel</span>
            </div>

            {/* Rotation Controls */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-700 w-20">Rotate:</span>
              <button
                onClick={handleRotateLeft}
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
                title="Rotate Left 90°"
              >
                ↶ 90°
              </button>
              <button
                onClick={handleRotateRight}
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
                title="Rotate Right 90°"
              >
                ↷ 90°
              </button>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotation}
                onChange={(e) => handleRotateFree(parseInt(e.target.value))}
                className="flex-1 max-w-xs"
              />
              <span className="text-sm text-slate-600 w-12">{rotation}°</span>
            </div>

            {/* Reset and Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
              >
                Reset
              </button>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : 'Save & Apply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
