import { useEffect, useRef } from 'react';
import { Figure } from '../types';

/**
 * FigureAnimationsView Component
 *
 * Displays all animations for a figure side-by-side for visual comparison.
 * Useful for ensuring consistent style and look-and-feel across animations.
 */
interface FigureAnimationsViewProps {
  figure: Figure;
  onSelectAnimation: (animationId: string) => void;
}

interface AnimationPreviewProps {
  animation: any;
  onSelect: () => void;
}

function AnimationPreview({ animation, onSelect }: AnimationPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frames = animation.frames.filter((f: any) => f.imageData);
    if (frames.length === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw placeholder text
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No frames', canvas.width / 2, canvas.height / 2);
      return;
    }

    const frameDelay = 1000 / animation.fps;

    const animate = (timestamp: number) => {
      if (timestamp - lastFrameTimeRef.current >= frameDelay) {
        lastFrameTimeRef.current = timestamp;

        const frame = frames[currentFrameRef.current % frames.length];
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw checkerboard pattern for transparency
          const checkSize = 8;
          for (let y = 0; y < canvas.height; y += checkSize) {
            for (let x = 0; x < canvas.width; x += checkSize) {
              ctx.fillStyle = (x / checkSize + y / checkSize) % 2 === 0 ? '#f1f5f9' : '#e2e8f0';
              ctx.fillRect(x, y, checkSize, checkSize);
            }
          }

          // Draw image centered
          const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.9;
          const x = (canvas.width - img.width * scale) / 2;
          const y = (canvas.height - img.height * scale) / 2;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        };
        img.src = frame.imageData;

        currentFrameRef.current = (currentFrameRef.current + 1) % frames.length;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animation]);

  const framesWithData = animation.frames.filter((f: any) => f.imageData);
  const completionPercentage = Math.round((framesWithData.length / animation.frameCount) * 100);

  return (
    <div
      onClick={onSelect}
      className="bg-white border-2 border-slate-200 rounded-lg p-4 hover:border-blue-400 transition-all cursor-pointer hover:shadow-md"
    >
      {/* Canvas Preview */}
      <div className="flex justify-center mb-3">
        <canvas
          ref={canvasRef}
          width={128}
          height={128}
          className="border border-slate-200 rounded bg-slate-50"
        />
      </div>

      {/* Animation Info */}
      <div className="space-y-2">
        <h4 className="font-semibold text-slate-800 truncate" title={animation.name}>
          {animation.name}
        </h4>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>{animation.frameCount} frames</span>
          <span>{animation.fps} FPS</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <div
            className="bg-green-600 h-1.5 rounded-full transition-all"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <div className="text-xs text-slate-500 text-center">
          {completionPercentage}% complete ({framesWithData.length}/{animation.frameCount})
        </div>
      </div>
    </div>
  );
}

export default function FigureAnimationsView({ figure, onSelectAnimation }: FigureAnimationsViewProps) {
  if (figure.animations.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <svg
          className="mx-auto h-12 w-12 text-slate-400 mb-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
          />
        </svg>
        <p>No animations yet for {figure.name}</p>
        <p className="text-sm mt-1">Create animations to see them side-by-side here</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800">
          All Animations for {figure.name}
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Click any animation to edit it. Compare style and look-and-feel across animations.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {figure.animations.map((animation) => (
          <AnimationPreview
            key={animation.id}
            animation={animation}
            onSelect={() => onSelectAnimation(animation.id)}
          />
        ))}
      </div>
    </div>
  );
}
