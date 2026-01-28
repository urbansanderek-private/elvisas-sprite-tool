import { useState } from 'react';
import { useProjectStore } from '../store/projectStore';

/**
 * AnimationCreator Component
 *
 * Form for creating new figures and animations within a project.
 * Requires a current figure to create animations.
 */
export default function AnimationCreator() {
  const { createFigure, createAnimation, selectAnimation, currentProject, currentFigure } = useProjectStore();
  const [figureName, setFigureName] = useState('');
  const [animationName, setAnimationName] = useState('');
  const [frameCount, setFrameCount] = useState(8);

  const handleCreateFigure = (e: React.FormEvent) => {
    e.preventDefault();
    if (figureName.trim()) {
      createFigure(figureName.trim());
      setFigureName('');
    }
  };

  const handleCreateAnimation = (e: React.FormEvent) => {
    e.preventDefault();
    if (animationName.trim() && frameCount > 0 && currentFigure) {
      createAnimation(animationName.trim(), frameCount);
      setAnimationName('');
      setFrameCount(8);
    }
  };

  if (!currentProject) return null;

  return (
    <div className="space-y-6">
      {/* Create Figure Section */}
      {!currentFigure && (
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-3">Create Figure</h3>
          <p className="text-sm text-slate-600 mb-4">First, create a figure to organize your animations.</p>
          <form onSubmit={handleCreateFigure} className="flex gap-2">
            <input
              type="text"
              value={figureName}
              onChange={(e) => setFigureName(e.target.value)}
              placeholder="e.g., Hero, Enemy, NPC"
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!figureName.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Create Figure
            </button>
          </form>
        </div>
      )}

      {/* Create Animation Section */}
      {currentFigure && (
        <div>
          <h3 className="text-lg font-medium text-slate-800 mb-3">Create Animation</h3>
          <form onSubmit={handleCreateAnimation} className="space-y-4">
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
          {currentFigure.animations.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-600 mb-3">Animations in {currentFigure.name}:</h3>
              <div className="flex flex-wrap gap-2">
                {currentFigure.animations.map((anim) => (
                  <button
                    key={anim.id}
                    onClick={() => selectAnimation(anim.id)}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-colors"
                  >
                    {anim.name} ({anim.frameCount} frames)
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
