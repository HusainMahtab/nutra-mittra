"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Filter, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

export default function AllFruitsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearchTerm = searchParams.get("search") || "";
  
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [filteredFruits, setFilteredFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortBy, setSortBy] = useState("name");
  const [showOrganic, setShowOrganic] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFruits = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/fruits");
        const data = await response.json();

        if (data.fruits) {
          // Filter only fruits (not vegetables)
          const fruitsOnly = data.fruits.filter(
            (item: Fruit) => item.category === "fruit"
          );
          setFruits(fruitsOnly);
          setFilteredFruits(fruitsOnly);
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
    // Filter fruits based on search term and organic filter
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

    // Filter by organic
    if (showOrganic) {
      result = result.filter((fruit) => fruit.isOrganic);
    }

    // Sort fruits
    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "calories") {
      result = [...result].sort((a, b) => {
        const caloriesA = a.calories ? parseInt(a.calories) : 0;
        const caloriesB = b.calories ? parseInt(b.calories) : 0;
        return caloriesA - caloriesB;
      });
    }

    setFilteredFruits(result);
  }, [fruits, searchTerm, sortBy, showOrganic]);

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

  const handleViewDetails = (fruitId: string) => {
    router.push(`/fruits/${fruitId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Explore Nutritious Fruits
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover the nutritional benefits of various fruits and make
              informed choices for a healthier lifestyle.
            </p>

            {/* Search and Filter Bar */}
            <div className="bg-card rounded-lg shadow-md p-4 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search fruits by name, benefits, or vitamins..."
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="calories">Calories (Low to High)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant={showOrganic ? "default" : "outline"}
                    className={
                      showOrganic
                        ? "bg-primary hover:bg-primary/90"
                        : "border-primary text-primary hover:bg-primary/10"
                    }
                    onClick={() => setShowOrganic(!showOrganic)}
                  >
                    <Leaf className="mr-2 h-4 w-4" />
                    Organic
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fruits Grid Section */}
      <section className="py-12">
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
              <h3 className="text-xl font-semibold mb-2 text-foreground">No fruits found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-muted-foreground">
                Showing {filteredFruits.length} of {fruits.length} fruits
                {searchTerm && <span> for "{searchTerm}"</span>}
              </div>
              
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredFruits.map((fruit) => (
                  <motion.div key={fruit._id} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="relative h-48 bg-muted">
                        {fruit.imageUrl ? (
                          <Image
                            src={fruit.imageUrl}
                            alt={fruit.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                            <span className="text-primary font-medium">No Image</span>
                          </div>
                        )}
                        {fruit.isOrganic && (
                          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                            Organic
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-xl font-bold mb-2 text-foreground">{fruit.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {fruit.description || "No description available"}
                        </p>
                        
                        {fruit.calories && (
                          <p className="text-sm mb-3">
                            <span className="font-medium">Calories:</span> {fruit.calories}
                          </p>
                        )}
                        
                        <div className="mb-3">
                          <h4 className="text-sm font-medium mb-1">Key Vitamins:</h4>
                          <div className="flex flex-wrap gap-1">
                            {fruit.vitamins.slice(0, 3).map((vitamin, index) => (
                              <Badge key={index} variant="outline" className="bg-primary/5">
                                {vitamin}
                              </Badge>
                            ))}
                            {fruit.vitamins.length > 3 && (
                              <Badge variant="outline" className="bg-primary/5">
                                +{fruit.vitamins.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {fruit.seasonalAvailability && (
                          <p className="text-sm">
                            <span className="font-medium">Season:</span> {fruit.seasonalAvailability}
                          </p>
                        )}
                        
                        <Button 
                          className="w-full mt-4" 
                          variant="outline"
                          onClick={() => handleViewDetails(fruit._id)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}