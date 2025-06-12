/**
 * ImageKit.io Integration Utilities
 * Handles image upload, deletion, and management with ImageKit.io
 */

import ImageKit from 'imagekit';

// Lazy initialization for server-side ImageKit instance
let _imagekit: ImageKit | null = null;

/**
 * Get ImageKit instance (server-side only)
 * This ensures the private key is only used server-side
 */
export const getImageKitInstance = (): ImageKit => {
  if (!_imagekit) {
    // Validate environment variables
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      console.error('🚨 ImageKit Configuration Error:');
      console.error('  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY:', publicKey ? 'Set ✅' : 'Missing ❌');
      console.error('  IMAGEKIT_PRIVATE_KEY:', privateKey ? 'Set ✅' : 'Missing ❌');
      console.error('  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT:', urlEndpoint ? 'Set ✅' : 'Missing ❌');
      throw new Error('Missing required ImageKit environment variables. Please check your .env.local file.');
    }

    _imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });

    console.log('✅ ImageKit instance created successfully');
  }

  return _imagekit;
};

// Legacy export for backward compatibility (use getImageKitInstance() instead)
export const imagekit = {
  upload: (...args: Parameters<ImageKit['upload']>) => getImageKitInstance().upload(...args),
  deleteFile: (...args: Parameters<ImageKit['deleteFile']>) => getImageKitInstance().deleteFile(...args),
};

// Client-side configuration
export const imagekitConfig = {
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '',
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || '',
};

/**
 * Extract ImageKit file ID from URL
 */
export function extractFileIdFromUrl(url: string): string {
  // ImageKit URL format: https://ik.imagekit.io/demo/img/image.jpg
  // File ID is typically in the path after the endpoint
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    // Remove empty parts and get the filename
    const filename = pathParts[pathParts.length - 1];
    return filename.split('.')[0]; // Remove extension
  } catch {
    return url.split('/').pop()?.split('.')[0] || '';
  }
}

/**
 * Extract all ImageKit URLs from HTML content
 */
export function extractImageKitUrls(content: string): string[] {
  if (!content) return [];
  
  const regex = /https:\/\/ik\.imagekit\.io\/[^"'\s)]+/g;
  return content.match(regex) || [];
}

/**
 * Generate file name for article images
 */
export function generateArticleImageFileName(articleId?: string): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  const prefix = articleId ? `article-${articleId}` : 'article-new';
  return `${prefix}-${timestamp}-${randomId}`;
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedImageUrl(
  originalUrl: string, 
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'auto';
    crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max';
  } = {}
): string {
  try {
    const url = new URL(originalUrl);
    const params = new URLSearchParams();
    
    if (options.width) params.append('tr', `w-${options.width}`);
    if (options.height) params.append('tr', `h-${options.height}`);
    if (options.quality) params.append('tr', `q-${options.quality}`);
    if (options.format) params.append('tr', `f-${options.format}`);
    if (options.crop) params.append('tr', `c-${options.crop}`);
    
    if (params.toString()) {
      url.search = params.toString();
    }
    
    return url.toString();
  } catch {
    return originalUrl;
  }
}

/**
 * Upload image to ImageKit (server-side only)
 */
export async function uploadImageToImageKit(
  file: Buffer | string,
  fileName: string,
  folder: string = '/blog-articles/'
): Promise<{
  fileId: string;
  url: string;
  name: string;
  size: number;
  filePath: string;
}> {
  try {
    const imagekitInstance = getImageKitInstance();
    const uploadResult = await imagekitInstance.upload({
      file: file,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: true,
      tags: ['blog', 'article'],
    });

    return {
      fileId: uploadResult.fileId,
      url: uploadResult.url,
      name: uploadResult.name,
      size: uploadResult.size,
      filePath: uploadResult.filePath,
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw new Error('Failed to upload image to ImageKit');
  }
}

/**
 * Delete image from ImageKit (server-side only)
 */
export async function deleteImageFromImageKit(fileId: string): Promise<void> {
  try {
    const imagekitInstance = getImageKitInstance();
    await imagekitInstance.deleteFile(fileId);
  } catch (error) {
    console.error('ImageKit delete error:', error);
    throw new Error('Failed to delete image from ImageKit');
  }
}

/**
 * Client-side image upload to ImageKit via API route
 */
export async function uploadImageViaAPI(
  file: File,
  articleId?: string
): Promise<{
  fileId: string;
  url: string;
  name: string;
  size: number;
}> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (articleId) {
      formData.append('articleId', articleId);
    }

    const response = await fetch('/api/imagekit/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Image upload API error:', error);
    throw error;
  }
}

/**
 * Client-side image deletion via API route
 */
export async function deleteImageViaAPI(
  fileId: string,
  imageUrl: string
): Promise<void> {
  try {
    const response = await fetch('/api/imagekit/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId, imageUrl }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Delete failed');
    }
  } catch (error) {
    console.error('Image delete API error:', error);
    throw error;
  }
}

/**
 * Check if URL is an ImageKit URL
 */
export function isImageKitUrl(url: string): boolean {
  return url.includes('ik.imagekit.io');
}

/**
 * Get responsive image props for Next.js Image component
 */
export function getResponsiveImageProps(
  originalUrl: string,
  alt: string,
  sizes?: string
) {
  if (!isImageKitUrl(originalUrl)) {
    return { src: originalUrl, alt };
  }

  const baseSizes = sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
  
  return {
    src: getOptimizedImageUrl(originalUrl, { quality: 80, format: 'auto' }),
    alt,
    sizes: baseSizes,
    quality: 80,
  };
}

/**
 * Image transformation presets
 */
export const imagePresets = {
  thumbnail: { width: 150, height: 150, crop: 'force' as const, quality: 70 },
  cardImage: { width: 400, height: 250, crop: 'force' as const, quality: 80 },
  featuredImage: { width: 800, height: 450, crop: 'force' as const, quality: 85 },
  fullWidth: { width: 1200, quality: 85, format: 'auto' as const },
  heroImage: { width: 1920, height: 1080, crop: 'force' as const, quality: 90 },
};

/**
 * Get preset image URL
 */
export function getPresetImageUrl(
  originalUrl: string, 
  preset: keyof typeof imagePresets
): string {
  return getOptimizedImageUrl(originalUrl, imagePresets[preset]);
}
