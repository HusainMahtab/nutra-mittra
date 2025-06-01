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

interface Vegetable {
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
  image?: string;
}

export default function VegetablesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialSearchTerm = searchParams.get("search") || "";
  
  const [vegetables, setVegetables] = useState<Vegetable[]>([]);
  const [filteredVegetables, setFilteredVegetables] = useState<Vegetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [sortBy, setSortBy] = useState("name");
  const [showOrganic, setShowOrganic] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVegetables = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/fruits");
        const data = await response.json();

        if (data.fruits) {
          // Filter only vegetables (not fruits)
          const vegetablesOnly = data.fruits.filter(
            (item: Vegetable) => item.category === "vegetable"
          );
          setVegetables(vegetablesOnly);
          setFilteredVegetables(vegetablesOnly);
        } else {
          setError("No vegetables found");
        }
      } catch (err) {
        console.error("Error fetching vegetables:", err);
        setError("Failed to load vegetables. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVegetables();
  }, []);

  useEffect(() => {
    // Filter vegetables based on search term and organic filter
    let result = vegetables;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (vegetable) =>
          vegetable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vegetable.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vegetable.healthBenefits.some((benefit) =>
            benefit.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          vegetable.vitamins.some((vitamin) =>
            vitamin.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by organic
    if (showOrganic) {
      result = result.filter((vegetable) => vegetable.isOrganic);
    }

    // Sort vegetables
    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "calories") {
      result = [...result].sort((a, b) => {
        const caloriesA = a.calories ? parseInt(a.calories) : 0;
        const caloriesB = b.calories ? parseInt(b.calories) : 0;
        return caloriesA - caloriesB;
      });
    }

    setFilteredVegetables(result);
  }, [vegetables, searchTerm, sortBy, showOrganic]);

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

  const handleViewDetails = (vegetableId: string) => {
    router.push(`/fruits/${vegetableId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-12 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Explore Nutritious Vegetables
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover the nutritional benefits of various vegetables and make
              informed choices for a healthier lifestyle.
            </p>

            {/* Search and Filter Bar */}
            <div className="bg-card rounded-lg shadow-md p-4 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search vegetables by name, benefits, or vitamins..."
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

      {/* Vegetables Grid Section */}
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
          ) : filteredVegetables.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2 text-foreground">No vegetables found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 text-muted-foreground">
                Showing {filteredVegetables.length} of {vegetables.length} vegetables
                {searchTerm && <span> for "{searchTerm}"</span>}
              </div>
              
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredVegetables.map((vegetable) => (
                  <motion.div key={vegetable._id} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="relative h-48 bg-muted">
                        {vegetable.image ? (
                          <Image
                            src={vegetable.image}
                            alt={vegetable.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                            <span className="text-primary font-medium">No Image</span>
                          </div>
                        )}
                        {vegetable.isOrganic && (
                          <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                            Organic
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-xl font-bold mb-2 text-foreground">{vegetable.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {vegetable.description || "No description available"}
                        </p>
                        
                        {vegetable.calories && (
                          <p className="text-sm mb-3">
                            <span className="font-medium">Calories:</span> {vegetable.calories}
                          </p>
                        )}
                        
                        <div className="mb-3">
                          <h4 className="text-sm font-medium mb-1">Key Vitamins:</h4>
                          <div className="flex flex-wrap gap-1">
                            {vegetable.vitamins.slice(0, 3).map((vitamin, index) => (
                              <Badge key={index} variant="outline" className="bg-primary/5">
                                {vitamin}
                              </Badge>
                            ))}
                            {vegetable.vitamins.length > 3 && (
                              <Badge variant="outline" className="bg-primary/5">
                                +{vegetable.vitamins.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {vegetable.seasonalAvailability && (
                          <p className="text-sm">
                            <span className="font-medium">Season:</span> {vegetable.seasonalAvailability}
                          </p>
                        )}
                        
                        <Button 
                          className="w-full mt-4" 
                          variant="outline"
                          onClick={() => handleViewDetails(vegetable._id)}
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