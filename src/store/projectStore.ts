import { create } from 'zustand';
import { Project, Animation, Frame } from '../types';

/**
 * Zustand store for managing project state
 * This centralized store handles all project, animation, and frame data
 */
interface ProjectStore {
  // Current state
  currentProject: Project | null;
  currentAnimation: Animation | null;

  // Actions
  createProject: (name: string) => void;
  loadProject: (project: Project) => void;
  updateProject: (updates: Partial<Project>) => void;

  createAnimation: (name: string, frameCount: number) => void;
  selectAnimation: (animationId: string) => void;
  updateAnimation: (animationId: string, updates: Partial<Animation>) => void;
  deleteAnimation: (animationId: string) => void;

  updateFrame: (frameId: string, imageData: string) => void;
  removeFrame: (frameId: string) => void;

  // Helper methods
  saveToLocalStorage: () => void;
  loadFromLocalStorage: (projectId: string) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  currentProject: null,
  currentAnimation: null,

  createProject: (name: string) => {
    const project: Project = {
      id: `project-${Date.now()}`,
      name,
      created: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      animations: [],
    };
    set({ currentProject: project });
    get().saveToLocalStorage();
  },

  loadProject: (project: Project) => {
    set({ currentProject: project, currentAnimation: null });
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

  createAnimation: (name: string, frameCount: number) => {
    const { currentProject } = get();
    if (!currentProject) return;

    // Create empty frames
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

    const updatedProject = {
      ...currentProject,
      animations: [...currentProject.animations, animation],
      lastModified: new Date().toISOString(),
    };

    set({ currentProject: updatedProject, currentAnimation: animation });
    get().saveToLocalStorage();
  },

  selectAnimation: (animationId: string) => {
    const { currentProject } = get();
    if (!currentProject) return;

    const animation = currentProject.animations.find(a => a.id === animationId);
    if (animation) {
      set({ currentAnimation: animation });
    }
  },

  updateAnimation: (animationId: string, updates: Partial<Animation>) => {
    const { currentProject, currentAnimation } = get();
    if (!currentProject) return;

    const updatedAnimations = currentProject.animations.map(anim =>
      anim.id === animationId ? { ...anim, ...updates } : anim
    );

    const updatedProject = {
      ...currentProject,
      animations: updatedAnimations,
      lastModified: new Date().toISOString(),
    };

    // Update current animation if it's the one being modified
    const updatedCurrentAnimation = currentAnimation?.id === animationId
      ? { ...currentAnimation, ...updates }
      : currentAnimation;

    set({ currentProject: updatedProject, currentAnimation: updatedCurrentAnimation });
    get().saveToLocalStorage();
  },

  deleteAnimation: (animationId: string) => {
    const { currentProject, currentAnimation } = get();
    if (!currentProject) return;

    const updatedAnimations = currentProject.animations.filter(a => a.id !== animationId);
    const updatedProject = {
      ...currentProject,
      animations: updatedAnimations,
      lastModified: new Date().toISOString(),
    };

    // Clear current animation if it's being deleted
    const updatedCurrentAnimation = currentAnimation?.id === animationId
      ? null
      : currentAnimation;

    set({ currentProject: updatedProject, currentAnimation: updatedCurrentAnimation });
    get().saveToLocalStorage();
  },

  updateFrame: (frameId: string, imageData: string) => {
    const { currentProject, currentAnimation } = get();
    if (!currentProject || !currentAnimation) return;

    const updatedFrames = currentAnimation.frames.map(frame =>
      frame.id === frameId ? { ...frame, imageData, processed: true } : frame
    );

    get().updateAnimation(currentAnimation.id, { frames: updatedFrames });
  },

  removeFrame: (frameId: string) => {
    const { currentProject, currentAnimation } = get();
    if (!currentProject || !currentAnimation) return;

    const updatedFrames = currentAnimation.frames.map(frame =>
      frame.id === frameId ? { ...frame, imageData: null, processed: false } : frame
    );

    get().updateAnimation(currentAnimation.id, { frames: updatedFrames });
  },

  saveToLocalStorage: () => {
    const { currentProject } = get();
    if (!currentProject) return;

    try {
      const projects = JSON.parse(localStorage.getItem('sprite-tool-projects') || '[]');
      const existingIndex = projects.findIndex((p: Project) => p.id === currentProject.id);

      if (existingIndex >= 0) {
        projects[existingIndex] = currentProject;
      } else {
        projects.push(currentProject);
      }

      localStorage.setItem('sprite-tool-projects', JSON.stringify(projects));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  loadFromLocalStorage: (projectId: string) => {
    try {
      const projects = JSON.parse(localStorage.getItem('sprite-tool-projects') || '[]');
      const project = projects.find((p: Project) => p.id === projectId);

      if (project) {
        set({ currentProject: project, currentAnimation: null });
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  },
}));
