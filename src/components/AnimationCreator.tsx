import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';

/**
 * AnimationCreator Component
 *
 * Form for creating new animations within a project.
 * Users specify the animation name and number of frames needed.
 */
export default function AnimationCreator() {
  const { createAnimation, currentProject } = useProjectStore();
  const [animationName, setAnimationName] = useState('');
  const [frameCount, setFrameCount] = useState(8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (animationName.trim() && frameCount > 0) {
      createAnimation(animationName.trim(), frameCount);
      setAnimationName('');
      setFrameCount(8);
    }
  };

  if (!currentProject) return null;

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Animation Name */}
          <div>
            <label htmlFor="animationName" className="block text-sm font-medium text-slate-700 mb-2">
              Animation Name
            </label>
            <input
              type="text"
              id="animationName"
              value={animationName}
              onChange={(e) => setAnimationName(e.target.value)}
              placeholder="e.g., walk_right, idle, jump"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Frame Count */}
          <div>
            <label htmlFor="frameCount" className="block text-sm font-medium text-slate-700 mb-2">
              Number of Frames
            </label>
            <input
              type="number"
              id="frameCount"
              value={frameCount}
              onChange={(e) => setFrameCount(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="60"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!animationName.trim()}
          className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          Create Animation
        </button>
      </form>

      {/* Existing Animations List */}
      {currentProject.animations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-600 mb-3">Animations in this project:</h3>
          <div className="flex flex-wrap gap-2">
            {currentProject.animations.map((anim) => (
              <button
                key={anim.id}
                onClick={() => useProjectStore.getState().selectAnimation(anim.id)}
                className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors"
              >
                {anim.name} ({anim.frameCount} frames)
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
