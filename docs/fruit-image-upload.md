# Fruit Image Upload to Cloudinary

This document explains how to use the fruit image upload functionality in the Nutra-Mitra application.

## Overview

The application allows uploading images for fruits to Cloudinary and associating them with fruit records in the database. The implementation consists of:

1. API endpoints for handling image uploads and updating fruit records
2. A utility function for client-side image upload
3. A reusable React component for the upload UI

## API Endpoints

### 1. `/api/fruits/upload-image` (POST)

Uploads an image to Cloudinary.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `file`: The image file to upload
  - `fruitId`: The ID of the fruit to associate with the image

**Response:**
```json
{
  "message": "Image uploaded successfully",
  "imageUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/fruit-images/fruit_123456789",
  "publicId": "fruit-images/fruit_123456789"
}
```

### 2. `/api/fruits/update-image` (PUT)

Updates a fruit record with an image URL.

**Request:**
- Content-Type: `application/json`
- Body:
```json
{
  "fruitId": "123456789",
  "imageUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/fruit-images/fruit_123456789"
}
```

**Response:**
```json
{
  "message": "Fruit image updated successfully",
  "fruit": {
    "_id": "123456789",
    "name": "Apple",
    "category": "fruit",
    "imageUrl": "https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/fruit-images/fruit_123456789",
    // other fruit properties
  }
}
```

## Client-Side Usage

### Using the Utility Function

```typescript
import { uploadFruitImage } from "@/lib/uploadFruitImage";

// In your component or event handler
const handleImageUpload = async (file: File, fruitId: string) => {
  const result = await uploadFruitImage(file, fruitId);
  
  if (result.success) {
    console.log("Image uploaded successfully:", result.data.imageUrl);
  } else {
    console.error("Upload failed:", result.error);
  }
};
```

### Using the FruitImageUpload Component

```tsx
import FruitImageUpload from "@/components/FruitImageUpload";

export default function FruitDetail({ fruit }) {
  const handleUploadSuccess = (imageUrl: string) => {
    console.log("Image uploaded:", imageUrl);
    // Update your UI or state as needed
  };

  const handleUploadError = (error: string) => {
    console.error("Upload error:", error);
    // Show error message to user
  };

  return (
    <div>
      <h1>{fruit.name}</h1>
      
      <FruitImageUpload
        fruitId={fruit._id}
        onUploadSuccess={handleUploadSuccess}
        onUploadError={handleUploadError}
        currentImageUrl={fruit.imageUrl}
      />
      
      {/* Rest of your component */}
    </div>
  );
}
```

## Example Page

An example implementation is available at `/examples/fruit-image-upload` in the application. This page demonstrates how to use the `FruitImageUpload` component and handle the upload process.

## Environment Variables

Make sure the following environment variables are set in your `.env.local` file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Limitations and Considerations

- The current implementation supports JPG, JPEG, and PNG image formats
- Images are resized to a maximum of 500x500 pixels to optimize storage and loading times
- Each fruit can have only one image; uploading a new image will replace the existing one