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
import logo from "../../public/logo.png";
import HomeImage from "../../public/home-image.png"; // Replace with your actual image path
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
        className="relative h-[80vh] flex items-center overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/20 dark:from-primary/5 dark:to-primary/10 opacity-70"></div>
        </div>

        <div className="container mx-auto px-4 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div className="space-y-6" variants={containerVariants}>
              <motion.div variants={itemVariants}>
                <Badge className="px-3 py-1 text-sm bg-primary/20 text-primary-foreground dark:bg-primary/30 dark:text-primary-foreground border-primary/30 mb-4">
                  Healthy Living
                </Badge>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-6xl font-bold text-foreground leading-tight"
                variants={itemVariants}
              >
                Discover the Power of{" "}
                <span className="text-primary dark:text-primary">Nature's Nutrition</span>
              </motion.h1>

              <motion.p
                className="text-lg text-muted-foreground max-w-lg"
                variants={itemVariants}
              >
                Explore our collection of fruits and vegetables, learn about
                their nutritional benefits, and make informed choices for a
                healthier lifestyle.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                variants={itemVariants}
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    const collectionSection =
                      document.getElementById("collection-section");
                    collectionSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="hidden md:flex justify-center relative"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <div className="relative w-[400px] h-[400px]">
                <div className="absolute top-0 left-0 w-full h-full bg-primary/20 dark:bg-primary/10 rounded-full opacity-20 animate-pulse"></div>
                <Image
                  src={HomeImage}
                  alt="Fresh fruits and vegetables"
                  width={400}
                  height={400}
                  className="rounded-full object-cover shadow-xl"
                  priority
                />
                <motion.div
                  className="absolute -top-4 -right-4 bg-card p-3 rounded-full shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 0, 10, 0],
                    y: [0, -15, 0],
                    x: [0, 10, 0, -10, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 6,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 12,
                      ease: "linear"
                    }}
                  >
                    <Leaf className="h-8 w-8 text-green-500" />
                  </motion.div>
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-card p-3 rounded-full shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0, -10, 0],
                    y: [0, 15, 0],
                    x: [0, -10, 0, 10, 0]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 6,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, -360] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 12,
                      ease: "linear"
                    }}
                  >
                    <Apple className="h-8 w-8 text-red-500" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"
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
                            <Badge className="absolute top-2 right-2 bg-green-600">
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
                                  className="bg-blue-50 text-blue-700 border-blue-100"
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

      {/* Footer */}
      <footer className="bg-primary-foreground dark:bg-card text-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="relative h-32 w-32">
                <Image
                  src={logo}
                  alt="Nutra Mitra Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-muted-foreground">
                Your guide to nutritional wellness through nature's bounty.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/fruits"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    All Fruits
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-foreground">Connect With Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-muted text-center text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Nutraमित्रा. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>

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
