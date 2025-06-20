import Fruit from "@/models/fruit.model";
import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import mongoose from "mongoose";

export async function PUT(request: Request) {
  try {
    console.log("Update image API called");
    await dbConnection();
    
    const body = await request.json();
    console.log("Update image request body:", body);
    
    // Validate required fields
    if (!body.fruitId || !body.image) {
      return NextResponse.json(
        { error: "Fruit ID and image URL are required" },
        { status: 400 }
      );
    }
    
    // Validate fruitId format
    if (!mongoose.Types.ObjectId.isValid(body.fruitId)) {
      return NextResponse.json(
        { error: "Invalid fruit ID format" },
        { status: 400 }
      );
    }
    
    // Update fruit with image URL
    console.log("Updating fruit with ID:", body.fruitId);
    console.log("Setting image to:", body.image);
    
    const updatedFruit = await Fruit.findByIdAndUpdate(
      body.fruitId,
      { image: body.image },
      { new: true }
    );
    
    console.log("Updated fruit:", updatedFruit);
    
    if (!updatedFruit) {
      return NextResponse.json(
        { error: "Fruit not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { 
        message: "Fruit image updated successfully", 
        fruit: updatedFruit 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Error updating fruit image:", error);
    
    return NextResponse.json(
      { error: "Failed to update fruit image" },
      { status: 500 }
    );
  }
}