import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import dbConnection from '@/lib/db';
import User from '@/models/user.model';

// User validation schema
const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  isVerified: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate user data
    const result = userSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { name, email, password, isverified } = body;
    
    // Connect to database
    await dbConnection();
    
    // Check if user already exists using the User model
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user using the User model
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isverified,
    });
    
    // Save user to database
    const savedUser = await newUser.save();
    
    // Return success response (exclude password)
    const userWithoutPassword = savedUser.toObject();

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}