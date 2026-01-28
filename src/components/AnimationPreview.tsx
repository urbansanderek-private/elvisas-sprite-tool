import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../store/projectStore';

/**
 * AnimationPreview Component
 *
 * Displays a looping preview of the animation using HTML5 Canvas.
 * Shows FPS controls and current frame information.
 */
export default function AnimationPreview() {
  const { currentAnimation, updateAnimation } = useProjectStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!currentAnimation || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frames = currentAnimation.frames.filter(f => f.imageData);
    if (frames.length === 0) {
      // Clear canvas if no frames
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const frameDelay = 1000 / currentAnimation.fps;

    const animate = (timestamp: number) => {
      if (!isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (timestamp - lastFrameTimeRef.current >= frameDelay) {
        lastFrameTimeRef.current = timestamp;

        const frame = frames[currentFrame % frames.length];
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw checkerboard pattern for transparency
          const checkSize = 10;
          for (let y = 0; y < canvas.height; y += checkSize) {
            for (let x = 0; x < canvas.width; x += checkSize) {
              ctx.fillStyle = (x / checkSize + y / checkSize) % 2 === 0 ? '#e2e8f0' : '#cbd5e1';
              ctx.fillRect(x, y, checkSize, checkSize);
            }
          }

          // Draw image centered
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };
        img.src = frame.imageData!;

        setCurrentFrame((prev) => (prev + 1) % frames.length);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [currentAnimation, isPlaying, currentFrame]);

  if (!currentAnimation) return null;

  const framesWithData = currentAnimation.frames.filter(f => f.imageData);

  return (
    <div className="space-y-4">
      {/* Canvas Preview */}
      <div className="flex justify-center">
        <div className="relative inline-block">
          <canvas
            ref={canvasRef}
            width={256}
            height={256}
            className="border-2 border-slate-300 rounded-lg shadow-lg bg-white"
          />
          {framesWithData.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-slate-400 text-sm">No frames to preview</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Play/Pause */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={framesWithData.length === 0}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* FPS Control */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">FPS:</label>
          <input
            type="number"
            value={currentAnimation.fps}
            onChange={(e) => updateAnimation(currentAnimation.id, { fps: Math.max(1, Math.min(60, parseInt(e.target.value) || 12)) })}
            min="1"
            max="60"
            className="w-16 px-2 py-1 border border-slate-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Frame Info */}
        <div className="text-sm text-slate-600">
          Frame {currentFrame + 1} / {framesWithData.length || currentAnimation.frameCount}
        </div>
      </div>

      {/* Output Size Control */}
      <div className="flex items-center justify-center gap-2">
        <label className="text-sm font-medium text-slate-700">Output Size:</label>
        <select
          value={currentAnimation.outputSize}
          onChange={(e) => updateAnimation(currentAnimation.id, { outputSize: parseInt(e.target.value) })}
          className="px-3 py-1 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={64}>64x64</option>
          <option value={128}>128x128</option>
          <option value={256}>256x256</option>
          <option value={512}>512x512</option>
        </select>
      </div>
    </div>
  );
}
