'use client';

import React, { useState, useRef } from 'react';
import { Image, Loader2 } from 'lucide-react';
import FallbackImage from '../ui/FallbackImage';

interface ServiceImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helpText?: string;
}

export default function ServiceImageUploader({ 
  value, 
  onChange, 
  label = "Image", 
  helpText = "Upload an image or provide a URL. Images are stored in the services-media bucket."
}: ServiceImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create form data for the upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload the image using our services API route
      const response = await fetch('/api/services/upload-media', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setUploadError(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* URL Input */}
        <div>
          <input
            type="text"
            value={value}
            onChange={handleUrlChange}
            placeholder="Enter image URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">{helpText}</p>
        </div>
        
        {/* Upload Button */}
        <div className="flex items-start space-x-2">
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={isUploading}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium flex items-center"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Image className="h-4 w-4 mr-2" />
                Upload Image
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      
      {/* Preview */}
      {value && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
            <FallbackImage
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              fill={true}
            />
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {uploadError && (
        <p className="text-sm text-red-600 mt-1">{uploadError}</p>
      )}
    </div>
  );
}
