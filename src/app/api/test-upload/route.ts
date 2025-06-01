import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("Test upload API called");
    console.log("Headers:", Object.fromEntries(request.headers.entries()));
    
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fruitId = formData.get("fruitId") as string | null;
    
    console.log("File:", file?.name, "Size:", file?.size, "Type:", file?.type);
    console.log("Fruit ID:", fruitId);
    
    return NextResponse.json({
      message: "Test upload successful",
      file: file ? {
        name: file.name,
        size: file.size,
        type: file.type
      } : null,
      fruitId,
      env: {
        hasCloudinaryName: !!process.env.CLOUDINARY_CLOUD_NAME,
        hasCloudinaryKey: !!process.env.CLOUDINARY_API_KEY,
        hasCloudinarySecret: !!process.env.CLOUDINARY_API_SECRET,
      }
    });
  } catch (error) {
    console.error("Test upload error:", error);
    return NextResponse.json(
      { error: `Test upload failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Test upload API is working",
    timestamp: new Date().toISOString(),
    env: {
      hasCloudinaryName: !!process.env.CLOUDINARY_CLOUD_NAME,
      hasCloudinaryKey: !!process.env.CLOUDINARY_API_KEY,
      hasCloudinarySecret: !!process.env.CLOUDINARY_API_SECRET,
    }
  });
}