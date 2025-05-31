import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

export async function POST(request: NextRequest) {
  try {
    // Check if the request has the correct content type
    if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Request must be multipart/form-data" },
        { status: 400 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    //console.log(formData);
    const file = formData.get("file") as File | null;
    const fruitId = formData.get("fruitId") as string | null;

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

    // Convert the file to buffer
    const buffer = await file.arrayBuffer();
    const stream = Readable.from(Buffer.from(buffer));

    // Upload to Cloudinary
    return new Promise<Response>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "fruit-images",
          public_id: `fruit_${fruitId}`,
          overwrite: true,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            resolve(
              NextResponse.json(
                { error: "Failed to upload image" },
                { status: 500 }
              )
            );
          } else {
            resolve(
              NextResponse.json(
                {
                  message: "Image uploaded successfully",
                  imageUrl: result?.secure_url,
                  publicId: result?.public_id,
                },
                { status: 200 }
              )
            );
          }
        }
      );

      // Pipe the file buffer to the upload stream
      stream.pipe(uploadStream);
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to process image upload" },
      { status: 500 }
    );
  }
}
