/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { uploadImageViaAPI, deleteImageViaAPI, isImageKitUrl } from '@/lib/imagekit';

interface ImageUploadProps {
  onImageUploaded: (imageData: { url: string; altText: string }) => void;
  onImageDeleted?: (deletedImageUrl: string) => void;
  currentImageUrl?: string;
  currentAltText?: string;
  className?: string;
  articleId?: string; // For tracking images per article
}

export default function ImageUploadWithImageKit({ 
  onImageUploaded, 
  onImageDeleted,
  currentImageUrl, 
  currentAltText = '',
  className = '',
  articleId
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(currentImageUrl || null);
  const [altText, setAltText] = useState(currentAltText);
  const [dragActive, setDragActive] = useState(false);
  const [imageFileId, setImageFileId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when props change (for edit mode)
  useEffect(() => {
    if (currentImageUrl !== imageUrl) {
      setImageUrl(currentImageUrl || null);
    }
    if (currentAltText !== altText) {
      setAltText(currentAltText || '');
    }
  }, [currentImageUrl, currentAltText, imageUrl, altText]);

  const handleFileSelect = (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 10MB.');
      return;
    }

    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // If there's an existing image, we'll track it for potential deletion
      const oldImageUrl = imageUrl;
      const oldFileId = imageFileId;

      // Simulate progress (since we can't get real progress from fetch)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const uploadResult = await uploadImageViaAPI(file, articleId);

      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log('✅ Image uploaded to ImageKit:', uploadResult);

      // Update state with new image data
      setImageUrl(uploadResult.url);
      setImageFileId(uploadResult.fileId);
      
      // Call parent callback
      onImageUploaded({
        url: uploadResult.url,
        altText: altText || uploadResult.name
      });

      // Delete old image if it exists and is different from the new one
      if (oldImageUrl && oldImageUrl !== uploadResult.url && isImageKitUrl(oldImageUrl) && oldFileId) {
        try {
          await deleteImageViaAPI(oldFileId, oldImageUrl);
          console.log('✅ Old image deleted from ImageKit:', oldImageUrl);
        } catch (deleteError) {
          console.warn('Failed to delete old image:', deleteError);
          // Don't fail the upload if old image deletion fails
        }
      }

      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);

    } catch (error: unknown) {
      console.error('❌ ImageKit upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = async () => {
    const imageToDelete = imageUrl;
    const fileIdToDelete = imageFileId;
    
    setImageUrl(null);
    setAltText('');
    setImageFileId(null);
    onImageUploaded({ url: '', altText: '' });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Delete from ImageKit if it's an ImageKit URL
    if (imageToDelete && isImageKitUrl(imageToDelete) && fileIdToDelete) {
      try {
        await deleteImageViaAPI(fileIdToDelete, imageToDelete);
        console.log('✅ Image deleted from ImageKit:', imageToDelete);
        
        if (onImageDeleted) {
          onImageDeleted(imageToDelete);
        }
      } catch (deleteError) {
        console.error('❌ Failed to delete image from ImageKit:', deleteError);
        // Still remove from UI even if delete fails
      }
    }
  };

  const handleAltTextChange = (newAltText: string) => {
    setAltText(newAltText);
    if (imageUrl) {
      onImageUploaded({ url: imageUrl, altText: newAltText });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {!imageUrl && (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${dragActive 
              ? 'border-orange-400 bg-orange-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${isUploading ? 'pointer-events-none' : 'cursor-pointer'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-orange-600 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Uploading to ImageKit...</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Drop an image here, or <span className="text-orange-600">browse</span>
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WebP, or GIF up to 10MB
                </p>
                <p className="text-xs text-green-600 mt-1">
                  ✨ Images will be optimized with ImageKit
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview */}
      {imageUrl && (
        <div className="space-y-3">
          <div className="relative">
            <img
              src={imageUrl}
              alt={altText || 'Featured image'}
              className="w-full h-48 object-cover rounded-lg border"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
            {isImageKitUrl(imageUrl) && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                ✨ ImageKit
              </div>
            )}
          </div>

          {/* Alt Text Input */}
          <div>
            <label htmlFor="altText" className="block text-sm font-medium text-gray-700 mb-1">
              Alt Text (for accessibility)
            </label>
            <input
              id="altText"
              type="text"
              value={altText}
              onChange={(e) => handleAltTextChange(e.target.value)}
              placeholder="Describe the image for screen readers..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Good alt text improves accessibility and SEO
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* ImageKit Info */}
      {imageUrl && isImageKitUrl(imageUrl) && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-sm text-green-700">
              Image optimized and served via ImageKit CDN
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
