"use client";

import { useState } from "react";
import FruitImageUpload from "@/components/FruitImageUpload";

export default function FruitImageUploadExample() {
  const [fruitId, setFruitId] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUploadSuccess = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    setSuccess("Image uploaded successfully!");
    setError(null);
  };

  const handleUploadError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Fruit Image Upload Example</h1>

      <div className="mb-6">
        <label htmlFor="fruitId" className="block text-sm font-medium mb-2">
          Fruit ID
        </label>
        <input
          type="text"
          id="fruitId"
          value={fruitId}
          onChange={(e) => setFruitId(e.target.value)}
          placeholder="Enter the fruit ID"
          className="w-full p-2 border rounded-md"
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter the ID of an existing fruit to upload an image for it
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}

      {fruitId && (
        <div className="border p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
          <FruitImageUpload
            fruitId={fruitId}
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
            currentImageUrl={uploadedImageUrl || undefined}
          />
        </div>
      )}

      {uploadedImageUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Uploaded Image URL</h2>
          <div className="p-3 bg-gray-100 rounded-md overflow-x-auto">
            <code>{uploadedImageUrl}</code>
          </div>
        </div>
      )}
    </div>
  );
}