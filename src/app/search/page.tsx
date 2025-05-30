"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Filter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Item {
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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/fruits");
        const data = await response.json();

        if (data.fruits) {
          setItems(data.fruits);
          setFilteredItems(data.fruits);
        } else {
          setError("No items found");
        }
      } catch (err) {
        console.error("Error fetching items:", err);
        setError("Failed to load items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    // Filter items based on search query and category
    let result = items;

    // Filter by search query
    if (query) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.description?.toLowerCase().includes(query.toLowerCase()) ||
          item.healthBenefits.some((benefit) =>
            benefit.toLowerCase().includes(query.toLowerCase())
          ) ||
          item.vitamins.some((vitamin) =>
            vitamin.toLowerCase().includes(query.toLowerCase())
          )
      );
    }

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory);
    }

    setFilteredItems(result);
  }, [items, query, activeCategory]);

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
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <section className="py-8 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-2xl font-bold text-card-foreground">Search Results</h1>
            </div>

            <form className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search fruits, vegetables, nutrients..."
                className="pl-10 w-full"
                defaultValue={query}
              />
            </form>

            <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  All
                </TabsTrigger>
                <TabsTrigger value="fruit" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  Fruits
                </TabsTrigger>
                <TabsTrigger value="vegetable" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  Vegetables
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2 text-foreground">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search query or category filter
              </p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                Found {filteredItems.length} results for "{query}"
              </p>
              
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredItems.map((item) => (
                  <motion.div key={item._id} variants={itemVariants}>
                    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                      <div className="relative h-48 bg-muted">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                            <span className="text-primary font-medium">No Image</span>
                          </div>
                        )}
                        <Badge 
                          className={`absolute top-2 right-2 ${
                            item.category === "fruit" 
                              ? "bg-orange-500 hover:bg-orange-600" 
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {item.category === "fruit" ? "Fruit" : "Vegetable"}
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="text-xl font-bold mb-2 text-foreground">{item.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {item.description || "No description available"}
                        </p>
                        
                        {item.calories && (
                          <p className="text-sm mb-3">
                            <span className="font-medium">Calories:</span> {item.calories}
                          </p>
                        )}
                        
                        <div className="mb-3">
                          <h4 className="text-sm font-medium mb-1">Key Vitamins:</h4>
                          <div className="flex flex-wrap gap-1">
                            {item.vitamins.slice(0, 3).map((vitamin, index) => (
                              <Badge key={index} variant="outline" className="bg-primary/5">
                                {vitamin}
                              </Badge>
                            ))}
                            {item.vitamins.length > 3 && (
                              <Badge variant="outline" className="bg-primary/5">
                                +{item.vitamins.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button className="w-full mt-4" variant="outline">
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