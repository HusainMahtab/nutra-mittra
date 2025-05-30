"use client";

import { useState, useRef, ChangeEvent } from "react";
import { uploadFruitImage } from "@/lib/uploadFruitImage";

interface FruitImageUploadProps {
  fruitId: string;
  onUploadSuccess?: (imageUrl: string) => void;
  onUploadError?: (error: string) => void;
  currentImageUrl?: string;
}

export default function FruitImageUpload({
  fruitId,
  onUploadSuccess,
  onUploadError,
  currentImageUrl,
}: FruitImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    setIsUploading(true);
    try {
      const result = await uploadFruitImage(file, fruitId);
      
      if (result.success && result.data) {
        onUploadSuccess?.(result.data.imageUrl);
      } else {
        onUploadError?.(result.error || "Upload failed");
      }
    } catch (error) {
      onUploadError?.(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {previewUrl ? (
        <div className="relative w-48 h-48 rounded-lg overflow-hidden">
          <img
            src={previewUrl}
            alt="Fruit preview"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-400">No image</span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/jpg"
        className="hidden"
      />

      <button
        type="button"
        onClick={triggerFileInput}
        disabled={isUploading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isUploading ? "Uploading..." : previewUrl ? "Change Image" : "Upload Image"}
      </button>
    </div>
  );
}