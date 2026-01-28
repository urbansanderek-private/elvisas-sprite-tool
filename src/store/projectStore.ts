import { create } from 'zustand';
import { Project, Figure, Animation, Frame } from '../types';

/**
 * Zustand store for managing project state
 * Hierarchy: Project → Figures → Animations → Frames
 */
interface ProjectStore {
  // Current state
  currentProject: Project | null;
  currentFigure: Figure | null;
  currentAnimation: Animation | null;

  // Project actions
  createProject: (name: string) => void;
  loadProject: (project: Project) => void;
  updateProject: (updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;

  // Figure actions
  createFigure: (name: string) => void;
  selectFigure: (figureId: string) => void;
  updateFigure: (figureId: string, updates: Partial<Figure>) => void;
  deleteFigure: (figureId: string) => void;

  // Animation actions
  createAnimation: (name: string, frameCount: number) => void;
  selectAnimation: (animationId: string) => void;
  updateAnimation: (animationId: string, updates: Partial<Animation>) => void;
  deleteAnimation: (animationId: string) => void;

  // Frame actions
  updateFrame: (frameId: string, imageData: string) => void;
  removeFrame: (frameId: string) => void;
  addFrame: () => void;
  deleteFrame: (frameId: string) => void;

  // Helper methods
  saveToLocalStorage: () => void;
  loadFromLocalStorage: (projectId: string) => void;
  getAllProjects: () => Project[];
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  currentProject: null,
  currentFigure: null,
  currentAnimation: null,

  // ===== PROJECT ACTIONS =====
  createProject: (name: string) => {
    const project: Project = {
      id: `project-${Date.now()}`,
      name,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      figures: [],
    };
    set({ currentProject: project, currentFigure: null, currentAnimation: null });
    get().saveToLocalStorage();
  },

  loadProject: (project: Project) => {
    set({ currentProject: project, currentFigure: null, currentAnimation: null });
  },

  updateProject: (updates: Partial<Project>) => {
    const { currentProject } = get();
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      ...updates,
      lastModified: new Date().toISOString(),
    };
    set({ currentProject: updatedProject });
    get().saveToLocalStorage();
  },

  deleteProject: (projectId: string) => {
    try {
      const projects = JSON.parse(localStorage.getItem('elvisas-sprite-projects') || '[]');
      const filtered = projects.filter((p: Project) => p.id !== projectId);
      localStorage.setItem('elvisas-sprite-projects', JSON.stringify(filtered));

      const { currentProject } = get();
      if (currentProject?.id === projectId) {
        set({ currentProject: null, currentFigure: null, currentAnimation: null });
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  },

  // ===== FIGURE ACTIONS =====
  createFigure: (name: string) => {
    const { currentProject } = get();
    if (!currentProject) return;

    const figure: Figure = {
      id: `figure-${Date.now()}`,
      name,
      animations: [],
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    const updatedProject = {
      ...currentProject,
      figures: [...currentProject.figures, figure],
      lastModified: new Date().toISOString(),
    };

    set({ currentProject: updatedProject, currentFigure: figure, currentAnimation: null });
    get().saveToLocalStorage();
  },

  selectFigure: (figureId: string) => {
    const { currentProject } = get();
    if (!currentProject) return;

    const figure = currentProject.figures.find(f => f.id === figureId);
    if (figure) {
      set({ currentFigure: figure, currentAnimation: null });
    }
  },

  updateFigure: (figureId: string, updates: Partial<Figure>) => {
    const { currentProject, currentFigure } = get();
    if (!currentProject) return;

    const updatedFigures = currentProject.figures.map(fig =>
      fig.id === figureId ? { ...fig, ...updates, lastModified: new Date().toISOString() } : fig
    );

    const updatedProject = {
      ...currentProject,
      figures: updatedFigures,
      lastModified: new Date().toISOString(),
    };

    const updatedCurrentFigure = currentFigure?.id === figureId
      ? { ...currentFigure, ...updates, lastModified: new Date().toISOString() }
      : currentFigure;

    set({ currentProject: updatedProject, currentFigure: updatedCurrentFigure });
    get().saveToLocalStorage();
  },

  deleteFigure: (figureId: string) => {
    const { currentProject, currentFigure } = get();
    if (!currentProject) return;

    const updatedFigures = currentProject.figures.filter(f => f.id !== figureId);
    const updatedProject = {
      ...currentProject,
      figures: updatedFigures,
      lastModified: new Date().toISOString(),
    };

    const updatedCurrentFigure = currentFigure?.id === figureId ? null : currentFigure;
    const updatedCurrentAnimation = currentFigure?.id === figureId ? null : get().currentAnimation;

    set({
      currentProject: updatedProject,
      currentFigure: updatedCurrentFigure,
      currentAnimation: updatedCurrentAnimation
    });
    get().saveToLocalStorage();
  },

  // ===== ANIMATION ACTIONS =====
  createAnimation: (name: string, frameCount: number) => {
    const { currentProject, currentFigure } = get();
    if (!currentProject || !currentFigure) return;

    const frames: Frame[] = Array.from({ length: frameCount }, (_, i) => ({
      id: `frame-${Date.now()}-${i}`,
      imageData: null,
      processed: false,
    }));

    const animation: Animation = {
      id: `animation-${Date.now()}`,
      name,
      frameCount,
      frames,
      fps: 12,
      outputSize: 128,
    };

    const updatedAnimations = [...currentFigure.animations, animation];
    get().updateFigure(currentFigure.id, { animations: updatedAnimations });
    set({ currentAnimation: animation });
  },

  selectAnimation: (animationId: string) => {
    const { currentFigure } = get();
    if (!currentFigure) return;

    const animation = currentFigure.animations.find(a => a.id === animationId);
    if (animation) {
      set({ currentAnimation: animation });
    }
  },

  updateAnimation: (animationId: string, updates: Partial<Animation>) => {
    const { currentProject, currentFigure, currentAnimation } = get();
    if (!currentProject || !currentFigure) return;

    const updatedAnimations = currentFigure.animations.map(anim =>
      anim.id === animationId ? { ...anim, ...updates } : anim
    );

    get().updateFigure(currentFigure.id, { animations: updatedAnimations });

    const updatedCurrentAnimation = currentAnimation?.id === animationId
      ? { ...currentAnimation, ...updates }
      : currentAnimation;

    set({ currentAnimation: updatedCurrentAnimation });
  },

  deleteAnimation: (animationId: string) => {
    const { currentProject, currentFigure, currentAnimation } = get();
    if (!currentProject || !currentFigure) return;

    const updatedAnimations = currentFigure.animations.filter(a => a.id !== animationId);
    get().updateFigure(currentFigure.id, { animations: updatedAnimations });

    const updatedCurrentAnimation = currentAnimation?.id === animationId ? null : currentAnimation;
    set({ currentAnimation: updatedCurrentAnimation });
  },

  // ===== FRAME ACTIONS =====
  updateFrame: (frameId: string, imageData: string) => {
    const { currentAnimation } = get();
    if (!currentAnimation) return;

    const updatedFrames = currentAnimation.frames.map(frame =>
      frame.id === frameId ? { ...frame, imageData, processed: true } : frame
    );

    get().updateAnimation(currentAnimation.id, { frames: updatedFrames });
  },

  removeFrame: (frameId: string) => {
    const { currentAnimation } = get();
    if (!currentAnimation) return;

    const updatedFrames = currentAnimation.frames.map(frame =>
      frame.id === frameId ? { ...frame, imageData: null, processed: false } : frame
    );

    get().updateAnimation(currentAnimation.id, { frames: updatedFrames });
  },

  addFrame: () => {
    const { currentAnimation } = get();
    if (!currentAnimation) return;

    const newFrame: Frame = {
      id: `frame-${Date.now()}`,
      imageData: null,
      processed: false,
    };

    const updatedFrames = [...currentAnimation.frames, newFrame];
    const updatedFrameCount = updatedFrames.length;

    get().updateAnimation(currentAnimation.id, {
      frames: updatedFrames,
      frameCount: updatedFrameCount,
    });
  },

  deleteFrame: (frameId: string) => {
    const { currentAnimation } = get();
    if (!currentAnimation) return;

    // Don't allow deleting if only one frame left
    if (currentAnimation.frames.length <= 1) {
      alert('Cannot delete the last frame. Animation must have at least 1 frame.');
      return;
    }

    const updatedFrames = currentAnimation.frames.filter(frame => frame.id !== frameId);
    const updatedFrameCount = updatedFrames.length;

    get().updateAnimation(currentAnimation.id, {
      frames: updatedFrames,
      frameCount: updatedFrameCount,
    });
  },

  // ===== HELPER METHODS =====
  saveToLocalStorage: () => {
    const { currentProject } = get();
    if (!currentProject) return;

    try {
      const projects = JSON.parse(localStorage.getItem('elvisas-sprite-projects') || '[]');
      const existingIndex = projects.findIndex((p: Project) => p.id === currentProject.id);

      if (existingIndex >= 0) {
        projects[existingIndex] = currentProject;
      } else {
        projects.push(currentProject);
      }

      localStorage.setItem('elvisas-sprite-projects', JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  loadFromLocalStorage: (projectId: string) => {
    try {
      const projects = JSON.parse(localStorage.getItem('elvisas-sprite-projects') || '[]');
      const project = projects.find((p: Project) => p.id === projectId);

      if (project) {
        set({ currentProject: project, currentFigure: null, currentAnimation: null });
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  },

  getAllProjects: () => {
    try {
      return JSON.parse(localStorage.getItem('elvisas-sprite-projects') || '[]');
    } catch (error) {
      console.error('Failed to get projects:', error);
      return [];
    }
  },
}));
