import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import dbConnection from "@/lib/db";
import User from "@/models/user.model";

// Email validation schema
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Generate a 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTPs temporarily (in a real app, use a database or Redis)
const otpStore: Record<string, { otp: string; expires: number }> = {};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate email
    const result = emailSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const { email } = body;

    // Generate OTP
    const otp = generateOTP();

    // Store OTP with 10-minute expiration
    otpStore[email] = {
      otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // Try 587 instead of 465
      secure: false, // true for 465, false for other ports
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Nutraमित्रा Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #16a34a; text-align: center;">Nutraमित्रा</h2>
          <h3 style="text-align: center;">Your Verification Code</h3>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 32px; letter-spacing: 5px; margin: 0; color: #333;">${otp}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Nutraमित्रा. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}

// Verify OTP endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Check if OTP exists and is valid
    const storedOTP = otpStore[email];

    if (!storedOTP) {
      return NextResponse.json(
        { error: "No OTP found for this email" },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (Date.now() > storedOTP.expires) {
      delete otpStore[email]; // Clean up expired OTP
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Verify OTP
    if (storedOTP.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }


    // OTP is valid, clean up
    delete otpStore[email];

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      verified: true,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
