import { useProjectStore } from '../store/projectStore';
import FrameCell from './FrameCell';

/**
 * FrameGrid Component
 *
 * Displays a responsive grid of frame cells for the current animation.
 * Each cell allows the user to upload, edit, and process an image.
 */
export default function FrameGrid() {
  const { currentAnimation } = useProjectStore();

  if (!currentAnimation) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {currentAnimation.frames.map((frame, index) => (
        <FrameCell key={frame.id} frame={frame} frameNumber={index + 1} />
      ))}
    </div>
  );
}
