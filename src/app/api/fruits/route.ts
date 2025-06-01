import { NextResponse } from 'next/server';
import dbConnection from '@/lib/db';
import Fruit from "@/models/fruit.model"

export async function GET() {
  try {
    await dbConnection();
    
    // Fetch all fruits, sorted by newest first
    const fruits = await Fruit.find({}).sort({ createdAt: -1 });
    console.log("Fruits fetched successfully!",fruits);
    
    return NextResponse.json({ fruits }, { status: 200 });
  } catch (error) {
    console.error('Error fetching fruits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fruits' },
      { status: 500 }
    );
  }
}