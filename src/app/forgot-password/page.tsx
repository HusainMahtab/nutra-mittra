"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { z } from "zod";
import { Leaf, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Form validation schemas
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  
  // Step state
  const [step, setStep] = useState<"email" | "otp" | "reset" | "success">("email");
  
  // Form state
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    // Clear OTP error when user types
    if (otpError) setOtpError("");
  };
  
  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    
    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      
      // Focus the last input
      const lastInput = document.getElementById("otp-5");
      if (lastInput) lastInput.focus();
    }
  };
  
  // Validate email form
  const validateEmailForm = () => {
    try {
      emailSchema.parse({ email });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  // Validate password form
  const validatePasswordForm = () => {
    try {
      passwordSchema.parse({ password, confirmPassword });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };
  
  // Send OTP
  const sendOtp = async () => {
    if (!validateEmailForm()) return;
    
    try {
      setIsLoading(true);
      setGeneralError("");
      
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }
      
      // Start countdown for resend button
      setResendDisabled(true);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Move to OTP verification step
      setStep("otp");
      
    } catch (error) {
      console.error("Error sending OTP:", error);
      setGeneralError(error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verify OTP
  const verifyOtp = async () => {
    try {
      setIsLoading(true);
      setOtpError("");
      
      // Check if OTP is complete
      const otpValue = otp.join("");
      if (otpValue.length !== 6) {
        setOtpError("Please enter all 6 digits");
        return;
      }
      
      const response = await fetch("/api/auth/send-otp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email,
          otp: otpValue
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }
      
      // Move to reset password step
      setStep("reset");
      
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError(error instanceof Error ? error.message : "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset password
  const resetPassword = async () => {
    if (!validatePasswordForm()) return;
    
    try {
      setIsLoading(true);
      setGeneralError("");
      
      // In a real app, you would call an API endpoint to reset the password
      // For this example, we'll just simulate a successful password reset
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move to success step
      setStep("success");
      
    } catch (error) {
      console.error("Error resetting password:", error);
      setGeneralError(error instanceof Error ? error.message : "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <motion.div
                className="bg-green-100 p-3 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <Leaf className="h-6 w-6 text-green-600" />
              </motion.div>
            </div>
            
            <motion.div variants={itemVariants}>
              <CardTitle className="text-2xl text-center">
                {step === "email" && "Forgot Password"}
                {step === "otp" && "Verify Your Email"}
                {step === "reset" && "Reset Password"}
                {step === "success" && "Password Reset"}
              </CardTitle>
              <CardDescription className="text-center">
                {step === "email" && "Enter your email to reset your password"}
                {step === "otp" && "Enter the 6-digit code sent to your email"}
                {step === "reset" && "Create a new password for your account"}
                {step === "success" && "Your password has been reset successfully"}
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent>
            {generalError && (
              <motion.div variants={itemVariants} className="mb-4">
                <Alert variant="destructive">
                  <AlertDescription>{generalError}</AlertDescription>
                </Alert>
              </motion.div>
            )}
            
            {step === "email" && (
              <motion.div className="space-y-4" variants={containerVariants}>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.email;
                          return newErrors;
                        });
                      }
                    }}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Button
                    type="button"
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={sendOtp}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <span>Send Reset Code</span>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            )}
            
            {step === "otp" && (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-4">
                    We've sent a 6-digit code to <span className="font-medium">{email}</span>
                  </p>
                </div>
                
                {otpError && (
                  <Alert variant="destructive">
                    <AlertDescription>{otpError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onPaste={index === 0 ? handleOtpPaste : undefined}
                      className="w-12 h-12 text-center text-lg"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    className={`text-sm ${
                      resendDisabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-green-600 hover:text-green-700"
                    }`}
                    onClick={sendOtp}
                    disabled={resendDisabled || isLoading}
                  >
                    {resendDisabled
                      ? `Resend in ${countdown}s`
                      : "Resend Code"}
                  </button>
                  
                  <Button
                    type="button"
                    variant="link"
                    className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                    onClick={() => setStep("email")}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Back
                  </Button>
                </div>
                
                <Button
                  type="button"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={verifyOtp}
                  disabled={otp.some(digit => !digit) || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    <span>Verify</span>
                  )}
                </Button>
              </motion.div>
            )}
            
            {step === "reset" && (
              <motion.div className="space-y-4" variants={containerVariants}>
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a new password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.password;
                            return newErrors;
                          });
                        }
                      }}
                      className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                  )}
                </motion.div>
                
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.confirmPassword;
                            return newErrors;
                          });
                        }
                      }}
                      className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Button
                    type="button"
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={resetPassword}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        <span>Resetting...</span>
                      </div>
                    ) : (
                      <span>Reset Password</span>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            )}
            
            {step === "success" && (
              <motion.div
                className="text-center space-y-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-center">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Password Reset Successful</h3>
                  <p className="text-gray-600">
                    Your password has been reset successfully. You can now log in with your new password.
                  </p>
                </div>
                
                <Button
                  type="button"
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => router.push("/login")}
                >
                  Go to Login
                </Button>
              </motion.div>
            )}
          </CardContent>
          
          <CardFooter>
            {step !== "success" && (
              <p className="text-center text-sm text-gray-600 w-full">
                Remember your password?{" "}
                <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                  Sign In
                </Link>
              </p>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}