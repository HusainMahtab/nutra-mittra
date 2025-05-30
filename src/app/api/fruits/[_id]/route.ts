import Fruit from "@/models/fruit.model";
import { NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import mongoose from "mongoose";

// GET a single fruit by ID
export async function GET(
  request: Request,
  { params }: { params: { _id: string } }
) {
  try {
    await dbConnection();

    const fruitId = await params._id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(fruitId)) {
      return NextResponse.json(
        { error: "Invalid fruit ID format" },
        { status: 400 }
      );
    }

    const fruit = await Fruit.findById(fruitId);

    if (!fruit) {
      return NextResponse.json(
        { error: "Fruit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ fruit }, { status: 200 });
  } catch (error) {
    console.error("Error fetching fruit:", error);
    return NextResponse.json(
      { error: "Failed to fetch fruit" },
      { status: 500 }
    );
  }
}

// UPDATE a fruit by ID
export async function PUT(
  request: Request,
  { params }: { params: { _id: string } }
) {
  try {
    await dbConnection();

    const fruitId =await params._id;
    const body = await request.json();

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(fruitId)) {
      return NextResponse.json(
        { error: "Invalid fruit ID format" },
        { status: 400 }
      );
    }

    // Validate category if provided
    if (body.category && body.category !== "fruit" && body.category !== "vegetable") {
      return NextResponse.json(
        { error: "Category must be either 'fruit' or 'vegetable'" },
        { status: 400 }
      );
    }

    // Find and update the fruit
    const updatedFruit = await Fruit.findByIdAndUpdate(
      fruitId,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedFruit) {
      return NextResponse.json(
        { error: "Fruit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Fruit updated successfully", fruit: updatedFruit },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating fruit:", error);
    
    // Handle duplicate key error
    if (error instanceof Error && error.message.includes('duplicate key error')) {
      return NextResponse.json(
        { error: "A fruit with this name already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update fruit" },
      { status: 500 }
    );
  }
}

// DELETE a fruit by ID
export async function DELETE(
  request: Request,
  { params }: { params: { _id: string } }
) {
  try {
    await dbConnection();

    const fruitId = await params._id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(fruitId)) {
      return NextResponse.json(
        { error: "Invalid fruit ID format" },
        { status: 400 }
      );
    }

    const deletedFruit = await Fruit.findByIdAndDelete(fruitId);

    if (!deletedFruit) {
      return NextResponse.json(
        { error: "Fruit not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Fruit deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting fruit:", error);
    return NextResponse.json(
      { error: "Failed to delete fruit" },
      { status: 500 }
    );
  }
}