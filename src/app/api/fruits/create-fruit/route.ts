import Fruit from "@/models/fruit.model";
import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";

export async function POST(request: Request) {
  try {
    await dbConnection();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: "Name and category are required fields" },
        { status: 400 }
      );
    }
    
    // Validate category enum
    if (body.category !== "fruit" && body.category !== "vegetable") {
      return NextResponse.json(
        { error: "Category must be either 'fruit' or 'vegetable'" },
        { status: 400 }
      );
    }
    
    // Ensure minerals is an object if provided
    if (body.minerals === undefined || Object.keys(body.minerals).length === 0) {
      body.minerals = {}; // Default empty object if not provided
    }
    
    // Handle image URL if provided
    if (body.image && typeof body.image !== 'string') {
      return NextResponse.json(
        { error: "Image must be a valid URL string" },
        { status: 400 }
      );
    }
    
    // Create new fruit
    const newFruit = await Fruit.create(body);
    
    return NextResponse.json(
      { 
        message: "Fruit created successfully", 
        fruit: newFruit,
        note: "To upload an image for this fruit, use the /api/fruits/upload-image endpoint with the fruit ID"
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Error creating fruit:", error);
    
    // Handle duplicate key error
    if (error instanceof Error && error.message.includes('duplicate key error')) {
      return NextResponse.json(
        { error: "A fruit with this name already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create fruit" },
      { status: 500 }
    );
  }
}