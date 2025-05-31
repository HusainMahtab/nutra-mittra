import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";
import * as z from "zod";

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = contactSchema.parse(body);
    const { name, email, subject, message } = validatedData;

    // Email template for the admin/team
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #22c55e; margin: 0; font-size: 28px;">New Contact Form Submission</h1>
            <p style="color: #666; margin: 10px 0 0 0;">From Nutra Mitra Website</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">Contact Details</h2>
            <p style="margin: 8px 0; color: #555;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 8px 0; color: #555;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 8px 0; color: #555;"><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">Message</h2>
            <p style="color: #555; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="color: #888; font-size: 14px; margin: 0;">
              This message was sent from the Nutra Mitra contact form.
            </p>
          </div>
        </div>
      </div>
    `;

    // Email template for the user (auto-reply)
    const userEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #22c55e; margin: 0; font-size: 28px;">Thank You for Contacting Us!</h1>
            <p style="color: #666; margin: 10px 0 0 0;">Nutraमित्रा Team</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <p style="color: #555; line-height: 1.6; margin: 0 0 15px 0;">Dear ${name},</p>
            <p style="color: #555; line-height: 1.6; margin: 0 0 15px 0;">
              Thank you for reaching out to us! We have received your message and appreciate you taking the time to contact Nutraमित्रा.
            </p>
            <p style="color: #555; line-height: 1.6; margin: 0 0 15px 0;">
              Our team will review your inquiry and get back to you within 24 hours during business days. 
              If your matter is urgent, please don't hesitate to call us directly at +91 9118168704.
            </p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">Your Message Summary</h2>
            <p style="margin: 8px 0; color: #555;"><strong>Subject:</strong> ${subject}</p>
            <p style="margin: 8px 0; color: #555;"><strong>Message:</strong></p>
            <p style="color: #555; line-height: 1.6; margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="background-color: #22c55e; color: white; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h3 style="margin: 0 0 10px 0; font-size: 18px;">While You Wait...</h3>
            <p style="margin: 0 0 10px 0; line-height: 1.6;">
              Explore our comprehensive database of fruits and vegetables to learn more about their nutritional benefits!
            </p>
            <a href="${process.env.NEXTAUTH_URL}/all-fruits" 
               style="color: white; text-decoration: underline;">
              Browse Our Fruit Collection →
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 14px; margin: 0 0 10px 0;">
              Best regards,<br>
              The Nutra Mitra Team
            </p>
            <p style="color: #888; font-size: 12px; margin: 0;">
              This is an automated response. Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email to admin/team
    await sendEmail({
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER || "admin@nutramitra.com",
      subject: `New Contact Form: ${subject}`,
      html: adminEmailHtml,
    });

    // Send auto-reply to user
    await sendEmail({
      to: email,
      subject: "Thank you for contacting Nutraमित्रा - We'll be in touch soon!",
      html: userEmailHtml,
    });

    return NextResponse.json(
      { 
        message: "Message sent successfully! We'll get back to you soon.",
        success: true 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Contact form error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: "Invalid form data", 
          errors: error.errors,
          success: false 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        message: "Failed to send message. Please try again later.",
        success: false 
      },
      { status: 500 }
    );
  }
}