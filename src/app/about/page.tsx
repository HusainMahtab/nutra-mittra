"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check, Leaf, Award, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Import images
import aboutHero from "../../../public/logo.png"; // Replace with your actual image
import teamMember1 from "../../../public/logo.png"; // Replace with your actual image
import teamMember2 from "../../../public/logo.png"; // Replace with your actual image
import teamMember3 from "../../../public/logo.png"; // Replace with your actual image

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function AboutPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/5 dark:to-primary/10 -z-10"></div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.span 
                variants={fadeIn}
                className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
              >
                Our Story
              </motion.span>
              <motion.h1 
                variants={fadeIn}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
              >
                Empowering Health Through <span className="text-primary">Nature's Nutrition</span>
              </motion.h1>
              <motion.p 
                variants={fadeIn}
                className="text-lg text-muted-foreground"
              >
                At Nutraमित्रा, we believe that understanding the nutritional value of what we eat is the first step toward better health. Our mission is to make nutritional information accessible, understandable, and actionable for everyone.
              </motion.p>
              <motion.div variants={fadeIn}>
                <Button onClick={()=>{router.push("/fruits")}} className="bg-primary hover:bg-primary/90 mt-4" size="lg">
                  Explore Our Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={aboutHero}
                  alt="Fresh fruits and vegetables"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-6 text-card-foreground"
            >
              Our Mission & Vision
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-muted-foreground"
            >
              We're on a mission to transform how people understand and engage with the nutritional aspects of fruits and vegetables, making healthy choices simpler and more informed.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              className="bg-background rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Leaf className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Nutritional Awareness</h3>
              <p className="text-muted-foreground">
                We aim to increase awareness about the essential vitamins, minerals, and other nutrients present in everyday fruits and vegetables, helping people make more informed dietary choices.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              transition={{ delay: 0.2 }}
              className="bg-background rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Quality Information</h3>
              <p className="text-muted-foreground">
                We are committed to providing accurate, science-backed information about the nutritional content and health benefits of fruits and vegetables, ensuring our users can trust what they learn.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
              transition={{ delay: 0.4 }}
              className="bg-background rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Healthier Communities</h3>
              <p className="text-muted-foreground">
                Our vision is to contribute to healthier communities by empowering individuals with knowledge about nutrition, fostering better eating habits and improved overall well-being.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
            >
              What We Offer
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-muted-foreground"
            >
              Nutraमित्रा provides a comprehensive platform for exploring the nutritional world of fruits and vegetables, with features designed to educate and inspire.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Comprehensive Nutritional Database</h3>
                  <p className="text-muted-foreground">
                    Access detailed nutritional information for a wide variety of fruits and vegetables, including vitamins, minerals, calories, and more.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Health Benefit Insights</h3>
                  <p className="text-muted-foreground">
                    Learn about the specific health benefits associated with different fruits and vegetables, backed by scientific research.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Seasonal Availability Guide</h3>
                  <p className="text-muted-foreground">
                    Discover when different fruits and vegetables are in season, helping you make fresher, more sustainable food choices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 bg-primary/10 p-2 rounded-full">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">Organic Identification</h3>
                  <p className="text-muted-foreground">
                    Easily identify organic options and understand the benefits of choosing organic produce for certain fruits and vegetables.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ 
                opacity: 1, 
                scale: 1,
                transition: {
                  duration: 0.8,
                  ease: "easeOut"
                }
              }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="bg-card p-6 rounded-xl shadow-lg"
                >
                  <h4 className="font-semibold mb-2 text-card-foreground">Vitamins</h4>
                  <p className="text-sm text-muted-foreground">Detailed breakdown of vitamin content in each fruit and vegetable</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="bg-card p-6 rounded-xl shadow-lg mt-8"
                >
                  <h4 className="font-semibold mb-2 text-card-foreground">Minerals</h4>
                  <p className="text-sm text-muted-foreground">Complete mineral profiles to understand nutritional value</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="bg-card p-6 rounded-xl shadow-lg"
                >
                  <h4 className="font-semibold mb-2 text-card-foreground">Health Benefits</h4>
                  <p className="text-sm text-muted-foreground">Evidence-based health benefits for informed choices</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="bg-card p-6 rounded-xl shadow-lg mt-8"
                >
                  <h4 className="font-semibold mb-2 text-card-foreground">Seasonal Guide</h4>
                  <p className="text-sm text-muted-foreground">Know when produce is at its nutritional peak</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold mb-6 text-card-foreground"
            >
              Meet Our Team
            </motion.h2>
            <motion.p 
              variants={fadeIn}
              className="text-lg text-muted-foreground"
            >
              Our dedicated team of nutrition experts, researchers, and technology enthusiasts work together to bring you the most accurate and useful information about fruits and vegetables.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-background rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative h-80">
                <Image
                  src={teamMember1}
                  alt="Team Member"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-foreground">Dr. Priya Sharma</h3>
                <p className="text-primary mb-4">Nutrition Scientist</p>
                <p className="text-muted-foreground">
                  With a Ph.D. in Nutritional Sciences, Dr. Sharma leads our research efforts, ensuring all information is scientifically accurate and up-to-date.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-background rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative h-80">
                <Image
                  src={teamMember2}
                  alt="Team Member"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-foreground">Rajiv Patel</h3>
                <p className="text-primary mb-4">Agricultural Specialist</p>
                <p className="text-muted-foreground">
                  Rajiv brings 15 years of experience in sustainable agriculture, providing insights on growing practices and seasonal availability of produce.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-background rounded-xl overflow-hidden shadow-lg"
            >
              <div className="relative h-80">
                <Image
                  src={teamMember3}
                  alt="Team Member"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 text-foreground">Ananya Gupta</h3>
                <p className="text-primary mb-4">Dietitian & Content Creator</p>
                <p className="text-muted-foreground">
                  As a registered dietitian, Ananya translates complex nutritional information into practical, easy-to-understand content for our users.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Us in Our Mission for Better Nutrition
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Explore our comprehensive database of fruits and vegetables to make more informed nutritional choices and take a step toward a healthier lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={()=>router.push('/fruits')} size="lg" className="bg-background text-primary hover:bg-background/90">
                Explore Our Collection
              </Button>
              <Button size="lg" variant="outline" className="border-background text-background hover:bg-primary-foreground/10">
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}