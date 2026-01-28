import { removeBackground, Config } from '@imgly/background-removal';

/**
 * Image Processing Utilities
 *
 * Handles background removal and image processing tasks.
 * Uses @imgly/background-removal for AI-powered background removal.
 */

let isModelLoaded = false;

/**
 * Remove background from an image using AI
 * The model (~20-40 MB) loads on first use and is cached.
 */
export async function removeImageBackground(
  imageData: string,
  onProgress?: (progress: string) => void
): Promise<string> {
  try {
    if (!isModelLoaded) {
      onProgress?.('Loading AI model (first time only, ~30 MB)...');
    }

    onProgress?.('Removing background...');

    const config: Config = {
      progress: (_key, current, total) => {
        const percent = Math.round((current / total) * 100);
        onProgress?.(`Processing: ${percent}%`);
      },
    };

    // Convert data URL to Blob
    const blob = await fetch(imageData).then(r => r.blob());

    // Remove background
    const result = await removeBackground(blob, config);

    // Convert result to data URL
    const url = URL.createObjectURL(result);
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    ctx.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    isModelLoaded = true;
    onProgress?.('Background removed successfully!');

    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Background removal failed:', error);
    throw new Error('Failed to remove background. Please try again.');
  }
}

/**
 * Crop image to square (centered crop)
 */
export function cropToSquare(imageData: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const size = Math.min(img.width, img.height);
      const x = (img.width - size) / 2;
      const y = (img.height - size) / 2;

      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageData;
  });
}

/**
 * Resize image to specified dimensions
 */
export function resizeImage(imageData: string, width: number, height: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Use high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageData;
  });
}

/**
 * Process image: crop to square and resize to specified dimensions
 */
export async function processImage(
  imageData: string,
  outputSize: number
): Promise<string> {
  const squared = await cropToSquare(imageData);
  const resized = await resizeImage(squared, outputSize, outputSize);
  return resized;
}

/**
 * Helper function to load an image
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
    return {
      valid: false,
      error: 'Please upload a PNG or JPG image',
    };
  }

  // Check file size (max 10 MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image is too large. Maximum size is 10 MB',
    };
  }

  return { valid: true };
}
