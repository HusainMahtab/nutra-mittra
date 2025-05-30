import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Fruit from "@/models/fruit.model";
import dbConnection from "@/lib/db";

// GET a single fruit by ID
export async function GET(request: NextRequest) {
  try {
    await dbConnection();

    const url = new URL(request.url);
    const _id = url.pathname.split("/").pop();

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return NextResponse.json(
        { error: "Invalid fruit ID format" },
        { status: 400 }
      );
    }

    const fruit = await Fruit.findById(_id);

    if (!fruit) {
      return NextResponse.json({ error: "Fruit not found" }, { status: 404 });
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

// PUT: Update a fruit by ID
export async function PUT(request: NextRequest) {
  try {
    await dbConnection();

    const url = new URL(request.url);
    const _id = url.pathname.split("/").pop();

    const body = await request.json();

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return NextResponse.json(
        { error: "Invalid fruit ID format" },
        { status: 400 }
      );
    }

    if (
      body.category &&
      body.category !== "fruit" &&
      body.category !== "vegetable"
    ) {
      return NextResponse.json(
        { error: "Category must be either 'fruit' or 'vegetable'" },
        { status: 400 }
      );
    }

    const updatedFruit = await Fruit.findByIdAndUpdate(_id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedFruit) {
      return NextResponse.json({ error: "Fruit not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Fruit updated successfully", fruit: updatedFruit },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating fruit:", error);
    if (error.message.includes("duplicate key error")) {
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

// DELETE: Delete a fruit by ID
export async function DELETE(request: NextRequest) {
  try {
    await dbConnection();

    const url = new URL(request.url);
    const _id = url.pathname.split("/").pop();

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return NextResponse.json(
        { error: "Invalid fruit ID format" },
        { status: 400 }
      );
    }

    const deletedFruit = await Fruit.findByIdAndDelete(_id);

    if (!deletedFruit) {
      return NextResponse.json({ error: "Fruit not found" }, { status: 404 });
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
