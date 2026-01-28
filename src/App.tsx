import { useState } from 'react';
import { useProjectStore } from './store/projectStore';
import ProjectSelector from './components/ProjectSelector';
import AnimationCreator from './components/AnimationCreator';
import FrameGrid from './components/FrameGrid';
import AnimationPreview from './components/AnimationPreview';
import FigureAnimationsView from './components/FigureAnimationsView';

/**
 * Main Application Component
 *
 * This is the root component that orchestrates the entire sprite animation tool.
 * It manages the overall layout and conditional rendering based on project/animation state.
 */
function App() {
  const { currentProject, currentFigure, currentAnimation, selectFigure, selectAnimation } = useProjectStore();
  const [showProjectSelector, setShowProjectSelector] = useState(true);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showFigureDropdown, setShowFigureDropdown] = useState(false);
  const [showAnimationDropdown, setShowAnimationDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Elvisas Sprite Animation Tool
              </h1>
            </div>
            <button
              onClick={() => setShowProjectSelector(!showProjectSelector)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showProjectSelector ? 'Hide Projects' : 'Manage Projects'}
            </button>
          </div>

          {/* Navigation Bar */}
          {currentProject && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              {/* Project Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProjectDropdown(!showProjectDropdown);
                    setShowFigureDropdown(false);
                    setShowAnimationDropdown(false);
                  }}
                  className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                >
                  {currentProject.name}
                  <span className="ml-1">▼</span>
                </button>
                {showProjectDropdown && currentProject.figures.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                    <div className="p-2">
                      <div className="text-xs font-medium text-slate-500 px-2 py-1">Figures in {currentProject.name}</div>
                      {currentProject.figures.map((figure) => (
                        <button
                          key={figure.id}
                          onClick={() => {
                            selectFigure(figure.id);
                            setShowProjectDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded transition-colors"
                        >
                          {figure.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Separator */}
              {currentFigure && <span className="text-slate-400">›</span>}

              {/* Figure Dropdown */}
              {currentFigure && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowFigureDropdown(!showFigureDropdown);
                      setShowProjectDropdown(false);
                      setShowAnimationDropdown(false);
                    }}
                    className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                  >
                    {currentFigure.name}
                    <span className="ml-1">▼</span>
                  </button>
                  {showFigureDropdown && currentProject.figures.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                      <div className="p-2">
                        <div className="text-xs font-medium text-slate-500 px-2 py-1">Switch Figure</div>
                        {currentProject.figures.map((figure) => (
                          <button
                            key={figure.id}
                            onClick={() => {
                              selectFigure(figure.id);
                              setShowFigureDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-slate-50 rounded transition-colors ${
                              figure.id === currentFigure.id ? 'bg-purple-50 text-purple-700' : ''
                            }`}
                          >
                            {figure.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Separator */}
              {currentAnimation && <span className="text-slate-400">›</span>}

              {/* Animation Dropdown */}
              {currentAnimation && currentFigure && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowAnimationDropdown(!showAnimationDropdown);
                      setShowProjectDropdown(false);
                      setShowFigureDropdown(false);
                    }}
                    className="px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium"
                  >
                    {currentAnimation.name}
                    <span className="ml-1">▼</span>
                  </button>
                  {showAnimationDropdown && currentFigure.animations.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                      <div className="p-2">
                        <div className="text-xs font-medium text-slate-500 px-2 py-1">Switch Animation</div>
                        {currentFigure.animations.map((anim) => (
                          <button
                            key={anim.id}
                            onClick={() => {
                              selectAnimation(anim.id);
                              setShowAnimationDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-slate-50 rounded transition-colors ${
                              anim.id === currentAnimation.id ? 'bg-green-50 text-green-700' : ''
                            }`}
                          >
                            {anim.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
            {/* Figure and Animation Creator */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                {currentFigure ? 'Create Animation' : 'Create Figure'}
              </h2>
              <AnimationCreator />
            </div>

            {/* Current Animation Workspace */}
            {currentAnimation && currentFigure && (
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

            {/* Figure Animations Overview - Show all animations side-by-side */}
            {currentFigure && !currentAnimation && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <FigureAnimationsView
                  figure={currentFigure}
                  onSelectAnimation={selectAnimation}
                />
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
