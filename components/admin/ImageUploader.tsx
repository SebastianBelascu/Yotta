'use client';

import React, { useState, useRef } from 'react';
import { Image, Loader2 } from 'lucide-react';
import FallbackImage from '../ui/FallbackImage';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
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

      // Upload the image using our API route
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
    } catch (error: any) {
      console.error('Upload failed:', error);
      setUploadError(`${error.message || 'Failed to upload image'}. Please try again.`);
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/image.jpg"
        />
        <label
          htmlFor="file-upload"
          className={`px-4 py-2 bg-gray-100 border border-gray-300 border-l-0 rounded-r-md text-gray-600 hover:bg-gray-200 cursor-pointer flex items-center justify-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Image className="h-5 w-5" />}
        </label>
        <input
          id="file-upload"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={isUploading}
        />
      </div>

      {uploadError && (
        <p className="text-red-500 text-xs">{uploadError}</p>
      )}

      {value && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">Preview:</p>
          <FallbackImage
            src={value}
            alt="Featured image preview"
            className="h-32 object-cover rounded-md"
            width={200}
            height={128}
            fallbackSrc="https://via.placeholder.com/800x400?text=Invalid+Image+URL"
          />
        </div>
      )}
    </div>
  );
}
