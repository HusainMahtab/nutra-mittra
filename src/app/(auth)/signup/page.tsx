"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { z } from "zod";
import { Leaf, Eye, EyeOff,CheckCircle2} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Form validation schema
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
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

export default function SignupPage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  
  // OTP verification state
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(60);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
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
  
  // Validate form
  const validateForm = () => {
    try {
      signupSchema.parse(formData);
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
    try {
      setIsLoading(true);
      setOtpError("");
      
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }
      
      setOtpSent(true);
      
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
      
    } catch (error) {
      console.error("Error sending OTP:", error);
      setOtpError(error instanceof Error ? error.message : "Failed to send OTP");
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
          email: formData.email,
          otp: otpValue
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP");
      }
      
      setOtpVerified(true);
      
      // Register user after OTP verification
      await registerUser();
      
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError(error instanceof Error ? error.message : "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register user
  const registerUser = async () => {
    try {
      setIsLoading(true);
      setGeneralError("");
      
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          isverified: true,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
      
      // Redirect to login page on successful registration
      router.push("/login?registered=true");
      
    } catch (error) {
      console.error("Error registering user:", error);
      setGeneralError(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setShowOtpVerification(true);
    await sendOtp();
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
    <div className="min-h-screen bg-primary/20 flex items-center justify-center p-4">
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
              <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
              <CardDescription className="text-center">
                Join Nutra-Mitra to explore nutritional benefits
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent>
            {!showOtpVerification ? (
              <motion.form onSubmit={handleSubmit} variants={containerVariants}>
                {generalError && (
                  <motion.div variants={itemVariants} className="mb-4">
                    <Alert variant="destructive">
                      <AlertDescription>{generalError}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                
                <motion.div className="space-y-4" variants={containerVariants}>
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </motion.div>
                  
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </motion.div>
                  
                  <motion.div className="space-y-2" variants={itemVariants}>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleChange}
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
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
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
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <span>Sign Up</span>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.form>
            ) : (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {otpVerified ? (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <CheckCircle2 className="h-16 w-16 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold">Verification Successful!</h3>
                    <p className="text-gray-600">Your account is being created...</p>
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold mb-2">Verify Your Email</h3>
                      <p className="text-gray-600 text-sm">
                        We've sent a 6-digit code to <span className="font-medium">{formData.email}</span>
                      </p>
                    </div>
                    
                    {otpError && (
                      <Alert variant="destructive" className="mt-4">
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
                        className="text-sm text-gray-600 hover:text-gray-800"
                        onClick={() => setShowOtpVerification(false)}
                        disabled={isLoading}
                      >
                        Change Email
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
                  </>
                )}
              </motion.div>
            )}
          </CardContent>
          
          <CardFooter>
            <p className="text-center text-sm text-gray-600 w-full">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}