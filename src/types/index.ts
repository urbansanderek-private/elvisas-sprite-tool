/**
 * Type definitions for the Sprite Tool application
 */

// Represents a single frame in an animation
export interface Frame {
  id: string;
  imageData: string | null; // Base64 encoded image data
  originalFile?: File;
  processed: boolean;
}

// Represents an animation (a collection of frames)
export interface Animation {
  id: string;
  name: string;
  frameCount: number;
  frames: Frame[];
  fps: number; // Frames per second for preview
  outputSize: number; // Output size in pixels (64, 128, 256, etc.)
}

// Represents a project (can contain multiple animations/figures)
export interface Project {
  id: string;
  name: string;
  created: string;
  lastModified: string;
  animations: Animation[];
}

// Export metadata structure
export interface ExportMetadata {
  animationName: string;
  frameCount: number;
  fps: number;
  outputSize: number;
  exported: string;
}
