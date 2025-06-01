import { NextRequest, NextResponse } from "next/server";
import dbConnection from "@/lib/db";
import Fruit from "@/models/fruit.model";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await dbConnection();
    
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid fruit ID" },
        { status: 400 }
      );
    }
    
    const fruit = await Fruit.findById(id);
    
    if (!fruit) {
      return NextResponse.json(
        { error: "Fruit not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      fruit: {
        _id: fruit._id,
        name: fruit.name,
        image: fruit.image,
        hasImage: !!fruit.image,
        createdAt: fruit.createdAt,
        updatedAt: fruit.updatedAt
      }
    });
    
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: "Debug failed" },
      { status: 500 }
    );
  }
}