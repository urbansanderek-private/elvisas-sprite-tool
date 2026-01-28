import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { Project } from '../types';

/**
 * ProjectSelector Component
 *
 * Allows users to create new projects or load existing ones from localStorage.
 * Displays a list of all saved projects with basic metadata.
 */
interface ProjectSelectorProps {
  onProjectSelected?: () => void;
}

export default function ProjectSelector({ onProjectSelected }: ProjectSelectorProps) {
  const { createProject, loadProject } = useProjectStore();
  const [projectName, setProjectName] = useState('');
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);

  // Load saved projects from localStorage on mount
  useEffect(() => {
    try {
      const projects = JSON.parse(localStorage.getItem('elvisas-sprite-projects') || '[]');
      setSavedProjects(projects);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  }, []);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      createProject(projectName.trim());
      setProjectName('');
      onProjectSelected?.();
    }
  };

  const handleLoadProject = (project: Project) => {
    loadProject(project);
    onProjectSelected?.();
  };

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        const projects = JSON.parse(localStorage.getItem('elvisas-sprite-projects') || '[]');
        const filtered = projects.filter((p: Project) => p.id !== projectId);
        localStorage.setItem('elvisas-sprite-projects', JSON.stringify(filtered));
        setSavedProjects(filtered);
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Projects</h2>

      {/* Create New Project Form */}
      <form onSubmit={handleCreateProject} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!projectName.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            Create New Project
          </button>
        </div>
      </form>

      {/* Saved Projects List */}
      {savedProjects.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-600 mb-3">Saved Projects</h3>
          {savedProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleLoadProject(project)}
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-medium text-slate-800">{project.name}</h4>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                  <span>{project.figures.length} figure{project.figures.length !== 1 ? 's' : ''}</span>
                  <span>•</span>
                  <span>Modified: {new Date(project.lastModified).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={(e) => handleDeleteProject(project.id, e)}
                className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete project"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500">
          <p>No saved projects yet. Create your first project to get started!</p>
        </div>
      )}
    </div>
  );
}
