import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Animation, ExportMetadata } from '../types';

/**
 * Export Utilities
 *
 * Handles exporting animations as ZIP files with metadata.
 */

/**
 * Export animation as ZIP file
 * Contains all frames as PNG files plus metadata JSON
 */
export async function exportAnimationAsZip(
  animation: Animation,
  figureName: string
): Promise<void> {
  try {
    const zip = new JSZip();

    // Get all processed frames
    const frames = animation.frames.filter(frame => frame.imageData);

    if (frames.length === 0) {
      throw new Error('No frames to export. Please add at least one image.');
    }

    // Create metadata
    const metadata: ExportMetadata = {
      figureName,
      animationName: animation.name,
      frameCount: frames.length,
      fps: animation.fps,
      outputSize: animation.outputSize,
      exported: new Date().toISOString(),
    };

    // Add metadata JSON file
    zip.file('metadata.json', JSON.stringify(metadata, null, 2));

    // Add each frame as PNG
    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      if (frame.imageData) {
        // Extract base64 data (remove data:image/png;base64, prefix)
        const base64Data = frame.imageData.split(',')[1];
        const frameNumber = String(i + 1).padStart(2, '0');
        const filename = `${animation.name}_${frameNumber}.png`;
        zip.file(filename, base64Data, { base64: true });
      }
    }

    // Generate ZIP file
    const blob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    // Save file
    const zipFilename = `${figureName}_${animation.name}.zip`;
    saveAs(blob, zipFilename);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

/**
 * Export all animations for a figure as separate ZIP files
 */
export async function exportAllAnimations(
  animations: Animation[],
  figureName: string,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const animationsWithFrames = animations.filter(
    anim => anim.frames.some(frame => frame.imageData)
  );

  if (animationsWithFrames.length === 0) {
    throw new Error('No animations with frames to export.');
  }

  for (let i = 0; i < animationsWithFrames.length; i++) {
    const animation = animationsWithFrames[i];
    onProgress?.(i + 1, animationsWithFrames.length);
    await exportAnimationAsZip(animation, figureName);

    // Add small delay between downloads to avoid browser blocking
    if (i < animationsWithFrames.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

/**
 * Create a preview GIF from animation frames (optional future enhancement)
 * For now, we export as PNG sequence which is more flexible for game development
 */
export function getExportInfo(animation: Animation): {
  frameCount: number;
  estimatedSize: string;
  hasFrames: boolean;
} {
  const frames = animation.frames.filter(frame => frame.imageData);
  const frameCount = frames.length;

  // Rough estimation: PNG frame ~50-200 KB each depending on complexity
  const avgFrameSize = 100; // KB
  const estimatedSizeKB = frameCount * avgFrameSize;
  const estimatedSize =
    estimatedSizeKB > 1024
      ? `${(estimatedSizeKB / 1024).toFixed(1)} MB`
      : `${estimatedSizeKB} KB`;

  return {
    frameCount,
    estimatedSize,
    hasFrames: frameCount > 0,
  };
}
