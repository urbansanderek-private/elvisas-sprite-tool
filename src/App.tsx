import { useState } from 'react';
import { useProjectStore } from './store/projectStore';
import ProjectSelector from './components/ProjectSelector';
import AnimationCreator from './components/AnimationCreator';
import FrameGrid from './components/FrameGrid';
import AnimationPreview from './components/AnimationPreview';

/**
 * Main Application Component
 *
 * This is the root component that orchestrates the entire sprite animation tool.
 * It manages the overall layout and conditional rendering based on project/animation state.
 */
function App() {
  const { currentProject, currentAnimation } = useProjectStore();
  const [showProjectSelector, setShowProjectSelector] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Sprite Animation Tool
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                {currentProject ? currentProject.name : 'No project loaded'}
              </p>
            </div>
            <button
              onClick={() => setShowProjectSelector(!showProjectSelector)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showProjectSelector ? 'Hide Projects' : 'Manage Projects'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Selector - Show when no project or user toggles */}
        {(showProjectSelector || !currentProject) && (
          <div className="mb-8">
            <ProjectSelector onProjectSelected={() => setShowProjectSelector(false)} />
          </div>
        )}

        {/* Project Content */}
        {currentProject && (
          <div className="space-y-8">
            {/* Animation Creator */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Create Animation
              </h2>
              <AnimationCreator />
            </div>

            {/* Current Animation Workspace */}
            {currentAnimation && (
              <>
                {/* Animation Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-800">
                        {currentAnimation.name}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        {currentAnimation.frameCount} frames • {currentAnimation.fps} FPS • {currentAnimation.outputSize}x{currentAnimation.outputSize}px
                      </p>
                    </div>
                  </div>

                  {/* Frame Grid */}
                  <FrameGrid />
                </div>

                {/* Animation Preview */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">
                    Animation Preview
                  </h2>
                  <AnimationPreview />
                </div>
              </>
            )}

            {/* No Animation Selected State */}
            {!currentAnimation && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-slate-400"
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
                <h3 className="mt-2 text-sm font-medium text-slate-900">
                  No animation selected
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Create a new animation to get started
                </p>
              </div>
            )}
          </div>
        )}

        {/* No Project State */}
        {!currentProject && !showProjectSelector && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-slate-900">
              No project loaded
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Create a new project or load an existing one to get started
            </p>
            <button
              onClick={() => setShowProjectSelector(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Projects
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
