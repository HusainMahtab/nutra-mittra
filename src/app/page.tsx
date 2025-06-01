"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Leaf, Apple, Carrot, ArrowRight, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import banner1 from "../../public/banner1.png"
import banner2 from "../../public/banner2.png";
import banner3 from "../../public/banner3.png";
import banner4 from "../../public/banner4.png";
// Hero images - replace with your actual image paths
const heroImages = [
  banner1,
  banner2,
  banner3,
  banner4
];
interface Fruit {
  _id: string;
  name: string;
  category: "fruit" | "vegetable";
  description?: string;
  calories?: string;
  vitamins: string[];
  minerals: Record<string, number>;
  healthBenefits: string[];
  seasonalAvailability?: string;
  isOrganic: boolean;
  originStory?: string;
  imageUrl?: string;
}

export default function Home() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, []);
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [filteredFruits, setFilteredFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showOrganic, setShowOrganic] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFruits = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/fruits");
        const data = await response.json();

        if (data.fruits) {
          setFruits(data.fruits);
          setFilteredFruits(data.fruits);
        } else {
          setError("No fruits found");
        }
      } catch (err) {
        console.error("Error fetching fruits:", err);
        setError("Failed to load fruits. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFruits();
  }, []);

  useEffect(() => {
    // Filter fruits based on search term, category, and organic filter
    let result = fruits;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (fruit) =>
          fruit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fruit.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fruit.healthBenefits.some((benefit) =>
            benefit.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          fruit.vitamins.some((vitamin) =>
            vitamin.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((fruit) => fruit.category === activeCategory);
    }

    // Filter by organic
    if (showOrganic) {
      result = result.filter((fruit) => fruit.isOrganic);
    }

    setFilteredFruits(result);
  }, [fruits, searchTerm, activeCategory, showOrganic]);

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

  const heroVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80 relative">
      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen py-2 flex items-center overflow-hidden bg-gradient-to-br from-background via-secondary/30 to-accent/20"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        {/* Animated Background Elements using your defined colors */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <motion.div className="space-y-8" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <Badge className="px-4 py-2 text-sm bg-primary text-primary-foreground border-0 shadow-lg">
                  🌱 Healthy Living
                </Badge>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-5xl font-bold text-foreground leading-tight"
                variants={itemVariants}
              >
                Discover the Power of{" "}
                <span className="text-primary">
                  Nature's Nutrition
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
                variants={itemVariants}
              >
                Explore our comprehensive collection of fruits and vegetables, discover their incredible nutritional benefits, and make informed choices for a healthier, more vibrant lifestyle.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-6"
                variants={itemVariants}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
                  onClick={() => {
                    const collectionSection =
                      document.getElementById("collection-section");
                    collectionSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore Collection <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-3 transition-all duration-300"
                >
                  Learn More
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div 
                className="grid grid-cols-3 gap-6 pt-8"
                variants={itemVariants}
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">100+</div>
                  <div className="text-sm text-muted-foreground">Fruits & Vegetables</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Health Benefits</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Nutrition Guide</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Image Section */}
            <motion.div
              className="flex justify-center relative"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <div className="relative w-[500px] h-[500px]">
               {/* Background Glow using your defined colors */}
                <div className="absolute top-0 left-0 w-full h-full bg-primary/20 rounded-full opacity-60 animate-pulse"></div>
                
                {/* Main Image Container */}
                <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-card">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full"
                    >
                       <Image
                        src={heroImages[currentImageIndex]}
                        alt={`Healthy nutrition ${currentImageIndex + 1}`}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Image Indicators */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 py-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-primary scale-125' 
                          : 'bg-muted hover:bg-primary/60'
                      }`}
                    />
                  ))}
                </div>

                {/* Floating Elements using your defined colors */}
                <motion.div
                  className="absolute -top-6 -right-6 bg-card p-4 rounded-full shadow-xl border border-border"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, -10, 0, 10, 0],
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4,
                    ease: "easeInOut"
                  }}
                >
                  <Leaf className="h-8 w-8 text-primary" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-6 -left-6 bg-card p-4 rounded-full shadow-xl border border-border"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, 0, -10, 0],
                    y: [0, 10, 0],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <Apple className="h-8 w-8 text-destructive" />
                </motion.div>

                <motion.div
                  className="absolute top-1/2 -left-8 bg-card p-3 rounded-full shadow-xl border border-border"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    x: [0, -5, 0, 5, 0],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 5,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Carrot className="h-6 w-6 text-primary" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        />
      </motion.section>

      {/* Filter Section */}
      <section id="collection-section" className="py-12 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-bold text-card-foreground">
                Explore Our Collection
              </h2>

              <div className="relative w-full md:w-auto max-w-md">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="Search by name, benefits, or vitamins..."
                  className="pl-10 pr-4 py-2 md:w-[400px] w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8"
              variants={itemVariants}
            >
              <Tabs
                defaultValue="all"
                className="w-full sm:w-auto"
                onValueChange={setActiveCategory}
              >
                <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/30"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="fruit"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/30"
                  >
                    <Apple className="mr-1 h-4 w-4" /> Fruits
                  </TabsTrigger>
                  <TabsTrigger
                    value="vegetable"
                    className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary dark:data-[state=active]:bg-primary/30"
                  >
                    <Carrot className="mr-1 h-4 w-4" /> Vegetables
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <Button
                  variant={showOrganic ? "default" : "outline"}
                  size="sm"
                  className={
                    showOrganic
                      ? "bg-primary hover:bg-primary/90"
                      : "border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
                  }
                  onClick={() => setShowOrganic(!showOrganic)}
                >
                  <Leaf className="mr-1 h-4 w-4" />
                  Organic Only
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Fruits Grid Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          ) : filteredFruits.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2 text-foreground">No items found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {filteredFruits.map((fruit) => (
                  <motion.div
                    key={fruit._id}
                    variants={itemVariants}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Link href={`/fruits/${fruit._id}`}>
                      <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                        <div className="relative h-48 w-full">
                          <Image
                            src={fruit.imageUrl || "/placeholder-fruit.jpg"}
                            alt={fruit.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                          {fruit.isOrganic && (
                            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                              <Leaf className="mr-1 h-3 w-3" /> Organic
                            </Badge>
                          )}
                        </div>

                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{fruit.name}</h3>
                            <Badge variant="outline" className="capitalize">
                              {fruit.category}
                            </Badge>
                          </div>

                          {fruit.description && (
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                              {fruit.description}
                            </p>
                          )}

                          {fruit.calories && (
                            <p className="text-sm mb-2">
                              <span className="font-medium">Calories:</span>{" "}
                              {fruit.calories}kcal/100gm
                            </p>
                          )}

                          <div className="flex flex-wrap gap-1 mt-3">
                            {fruit.vitamins
                              .slice(0, 2)
                              .map((vitamin, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-primary/10 text-primary border-primary/50"
                                >
                                  {vitamin}
                                </Badge>
                              ))}

                            {fruit.healthBenefits
                              .slice(0, 1)
                              .map((benefit, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="bg-accent text-accent-foreground border-accent/50"
                                >
                                  {benefit}
                                </Badge>
                              ))}

                            {(fruit.vitamins.length > 2 ||
                              fruit.healthBenefits.length > 1) && (
                              <Badge variant="outline" className="">
                                +
                                {fruit.vitamins.length +
                                  fruit.healthBenefits.length -
                                  3}{" "}
                                more
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <motion.section
        className="py-16 bg-primary text-primary-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            Ready to Embrace a Healthier Lifestyle?
          </motion.h2>

          <motion.p
            className="text-lg mb-8 max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            Discover more about the nutritional benefits of fruits and
            vegetables and how they can transform your health.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Button
              size="lg"
              className="bg-card text-primary hover:bg-card/90"
            >
              Learn More About Nutrition
            </Button>
          </motion.div>
        </div>
      </motion.section>
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="icon"
              className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 shadow-lg"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
