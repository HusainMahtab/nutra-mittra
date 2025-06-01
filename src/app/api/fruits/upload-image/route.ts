import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// Configure the API route for file uploads
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    console.log("Upload image API called");
    
    // Check environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Missing Cloudinary environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get the form data - remove strict content-type check for production compatibility
    const formData = await request.formData();
    console.log("Form data received");
    
    const file = formData.get("file") as File | null;
    const fruitId = formData.get("fruitId") as string | null;

    console.log("File:", file?.name, "Size:", file?.size);
    console.log("Fruit ID:", fruitId);

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    if (!fruitId) {
      return NextResponse.json(
        { error: "Fruit ID is required" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Convert the file to buffer
    const buffer = await file.arrayBuffer();
    const base64String = Buffer.from(buffer).toString('base64');
    const dataURI = `data:${file.type};base64,${base64String}`;

    console.log("Starting Cloudinary upload");

    // Upload to Cloudinary using base64 (better for serverless)
    try {
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "fruit-images",
        public_id: `fruit_${fruitId}`,
        overwrite: true,
        resource_type: "image",
        transformation: [
          { width: 800, height: 800, crop: "limit" },
          { quality: "auto" }
        ]
      });

      console.log("Cloudinary upload successful:", result.secure_url);
      
      return NextResponse.json(
        {
          message: "Image uploaded successfully",
          imageUrl: result.secure_url,
          publicId: result.public_id,
        },
        { status: 200 }
      );
    } catch (cloudinaryError) {
      console.error("Cloudinary upload error:", cloudinaryError);
      return NextResponse.json(
        { error: `Failed to upload image: ${cloudinaryError instanceof Error ? cloudinaryError.message : 'Unknown Cloudinary error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: `Failed to process image upload: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// Add OPTIONS method for CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
