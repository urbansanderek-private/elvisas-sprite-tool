import { useState, useRef } from 'react';
import { Frame } from '../types';
import { useProjectStore } from '../store/projectStore';
import ImageEditor from './ImageEditor';
import { removeImageBackground, validateImageFile } from '../utils/imageProcessing';

/**
 * FrameCell Component
 *
 * Represents a single frame in the animation grid.
 * Handles file upload, image editing, and background removal.
 */
interface FrameCellProps {
  frame: Frame;
  frameNumber: number;
}

export default function FrameCell({ frame, frameNumber }: FrameCellProps) {
  const { updateFrame, removeFrame, deleteFrame, currentAnimation } = useProjectStore();
  const [isDragging, setIsDragging] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgRemovalProgress, setBgRemovalProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const outputSize = currentAnimation?.outputSize || 128;

  const handleFileSelect = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      // Open editor for new images
      setEditingImage(imageData);
      setShowEditor(true);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (frame.imageData) {
      setEditingImage(frame.imageData);
      setShowEditor(true);
    }
  };

  const handleSaveEdit = (processedImageData: string) => {
    updateFrame(frame.id, processedImageData);
    setShowEditor(false);
    setEditingImage(null);
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setEditingImage(null);
  };

  const handleRemoveBackground = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!frame.imageData) return;

    setIsRemovingBg(true);
    setBgRemovalProgress('Initializing...');

    try {
      const result = await removeImageBackground(frame.imageData, setBgRemovalProgress);
      updateFrame(frame.id, result);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to remove background');
    } finally {
      setIsRemovingBg(false);
      setBgRemovalProgress('');
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Clear this frame image?')) {
      removeFrame(frame.id);
    }
  };

  const handleDeleteFrame = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this frame from the animation? This will reduce the frame count.')) {
      deleteFrame(frame.id);
    }
  };

  return (
    <>
      <div className="relative">
        {/* Frame Number Label */}
        <div className="absolute -top-2 -left-2 z-10 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
          {frameNumber}
        </div>

        {/* Processing Indicator */}
        {isRemovingBg && (
          <div className="absolute -top-2 -right-2 z-10 bg-purple-600 text-white text-xs px-2 py-1 rounded-full shadow-md animate-pulse">
            AI
          </div>
        )}

        {/* Frame Cell */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !frame.imageData && !isRemovingBg && fileInputRef.current?.click()}
          className={`
            relative aspect-square border-2 border-dashed rounded-lg overflow-hidden cursor-pointer
            transition-all
            ${isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 'border-slate-300'}
            ${!frame.imageData ? 'hover:border-blue-400 hover:bg-slate-50' : ''}
            ${isRemovingBg ? 'pointer-events-none opacity-75' : ''}
          `}
        >
          {frame.imageData ? (
            <>
              {/* Image Preview with Checkerboard Background */}
              <div className="absolute inset-0 bg-slate-100" style={{
                backgroundImage: 'linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)',
                backgroundSize: '10px 10px',
                backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
              }} />
              <img
                src={frame.imageData}
                alt={`Frame ${frameNumber}`}
                className="relative w-full h-full object-contain"
              />

              {/* Action Buttons Overlay */}
              {!isRemovingBg && (
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all flex items-center justify-center gap-1 opacity-0 hover:opacity-100 flex-wrap p-2">
                  <button
                    onClick={handleEdit}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-50 transition-colors"
                    title="Edit image (crop, rotate, zoom)"
                  >
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleRemoveBackground}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-purple-50 transition-colors"
                    title="Remove background (AI)"
                  >
                    <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-slate-100 transition-colors"
                    title="Replace image"
                  >
                    <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </button>
                  <button
                    onClick={handleRemove}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-yellow-50 transition-colors"
                    title="Clear image (keep frame)"
                  >
                    <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <button
                    onClick={handleDeleteFrame}
                    className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                    title="Delete frame from animation"
                  >
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Background Removal Progress */}
              {isRemovingBg && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-xs">{bgRemovalProgress}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-slate-400">
              <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs text-center">Drop image or click</span>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Image Editor Modal */}
      {showEditor && editingImage && (
        <ImageEditor
          imageData={editingImage}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          outputSize={outputSize}
        />
      )}
    </>
  );
}
