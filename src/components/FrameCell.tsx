import { useState, useRef } from 'react';
import { Frame } from '../types';
import { useProjectStore } from '../store/projectStore';

/**
 * FrameCell Component
 *
 * Represents a single frame in the animation grid.
 * Handles file upload via drag-and-drop or file selection.
 * This is a placeholder implementation - full editor and background removal will be added next.
 */
interface FrameCellProps {
  frame: Frame;
  frameNumber: number;
}

export default function FrameCell({ frame, frameNumber }: FrameCellProps) {
  const { updateFrame, removeFrame } = useProjectStore();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
      alert('Please upload a PNG or JPG image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      updateFrame(frame.id, imageData);
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

  const handleRemove = () => {
    if (window.confirm('Remove this frame image?')) {
      removeFrame(frame.id);
    }
  };

  return (
    <div className="relative">
      {/* Frame Number Label */}
      <div className="absolute -top-2 -left-2 z-10 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
        {frameNumber}
      </div>

      {/* Frame Cell */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !frame.imageData && fileInputRef.current?.click()}
        className={`
          relative aspect-square border-2 border-dashed rounded-lg overflow-hidden cursor-pointer
          transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50 scale-105' : 'border-slate-300'}
          ${!frame.imageData ? 'hover:border-blue-400 hover:bg-slate-50' : ''}
        `}
      >
        {frame.imageData ? (
          <>
            {/* Image Preview */}
            <img
              src={frame.imageData}
              alt={`Frame ${frameNumber}`}
              className="w-full h-full object-contain bg-slate-100"
            />

            {/* Action Buttons Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
                title="Remove image"
              >
                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
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
  );
}
