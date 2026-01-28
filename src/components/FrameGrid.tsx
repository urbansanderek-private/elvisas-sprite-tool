import { useProjectStore } from '../store/projectStore';
import FrameCell from './FrameCell';

/**
 * FrameGrid Component
 *
 * Displays a responsive grid of frame cells for the current animation.
 * Each cell allows the user to upload, edit, and process an image.
 */
export default function FrameGrid() {
  const { currentAnimation, addFrame } = useProjectStore();

  if (!currentAnimation) return null;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {currentAnimation.frames.map((frame, index) => (
          <FrameCell key={frame.id} frame={frame} frameNumber={index + 1} />
        ))}

        {/* Add Frame Button */}
        <button
          onClick={addFrame}
          className="aspect-square border-2 border-dashed border-slate-400 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-green-600"
          title="Add new frame"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs font-medium">Add Frame</span>
        </button>
      </div>

      <div className="mt-4 text-sm text-slate-500 text-center">
        {currentAnimation.frameCount} frame{currentAnimation.frameCount !== 1 ? 's' : ''} total
        • Hover over frames to edit, remove background, clear, or delete
      </div>
    </div>
  );
}
