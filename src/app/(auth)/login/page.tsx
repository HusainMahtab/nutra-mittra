"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { z } from "zod";
import { Leaf, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn } from "next-auth/react";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const errorParam = searchParams.get("error");
  
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Check for registration success message
  useEffect(() => {
    if (registered === "true") {
      setRegistrationSuccess(true);
      
      // Clear the success message after 5 seconds
      const timer = setTimeout(() => {
        setRegistrationSuccess(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }

    // Check for authentication errors
    if (errorParam) {
      setGeneralError(
        errorParam === "CredentialsSignin" 
          ? "Invalid email or password" 
          : "An error occurred during login"
      );
    }
  }, [registered, errorParam]);
  
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
  
  // Validate form
  const validateForm = () => {
    try {
      loginSchema.parse(formData);
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
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      setGeneralError("");
      
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (result?.ok) {
        router.push("/");
      }
      
    } catch (error) {
      console.error("Error logging in:", error);
      setGeneralError(error instanceof Error ? error.message : "Login failed");
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
              <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
              <CardDescription className="text-center">
                Sign in to your Nutra-Mitra account
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent>
            {registrationSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4"
              >
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Account created successfully! You can now log in.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
            
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
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
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
                
                <motion.div variants={itemVariants}>
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.form>
          </CardContent>
          
          <CardFooter>
            <p className="text-center text-sm text-gray-600 w-full">
              Don't have an account?{" "}
              <Link href="/signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}