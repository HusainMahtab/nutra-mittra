"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Leaf } from 'lucide-react';

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

interface RelatedFruitsProps {
  currentFruit: Fruit;
  maxItems?: number;
}

export default function RelatedFruits({ currentFruit, maxItems = 4 }: RelatedFruitsProps) {
  const [relatedFruits, setRelatedFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedFruits = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/fruits');
        const data = await response.json();

        if (data.fruits) {
          // Filter out the current fruit and find related ones
          const otherFruits = data.fruits.filter((fruit: Fruit) => fruit._id !== currentFruit._id);
          
          // Logic to find related fruits:
          // 1. Same category (fruit/vegetable)
          // 2. Similar vitamins or health benefits
          // 3. Random selection if not enough matches
          
          const sameCategory = otherFruits.filter((fruit: Fruit) => 
            fruit.category === currentFruit.category
          );
          
          const similarVitamins = otherFruits.filter((fruit: Fruit) =>
            fruit.vitamins.some(vitamin => currentFruit.vitamins.includes(vitamin))
          );
          
          const similarBenefits = otherFruits.filter((fruit: Fruit) =>
            fruit.healthBenefits.some(benefit => 
              currentFruit.healthBenefits.some(currentBenefit =>
                benefit.toLowerCase().includes(currentBenefit.toLowerCase()) ||
                currentBenefit.toLowerCase().includes(benefit.toLowerCase())
              )
            )
          );

          // Combine and deduplicate
          const relatedSet = new Set<string>();
          const related: Fruit[] = [];

          // Add same category first
          sameCategory.forEach((fruit: Fruit) => {
            if (!relatedSet.has(fruit._id) && related.length < maxItems) {
              relatedSet.add(fruit._id);
              related.push(fruit);
            }
          });

          // Add similar vitamins
          similarVitamins.forEach((fruit: Fruit) => {
            if (!relatedSet.has(fruit._id) && related.length < maxItems) {
              relatedSet.add(fruit._id);
              related.push(fruit);
            }
          });

          // Add similar benefits
          similarBenefits.forEach((fruit: Fruit) => {
            if (!relatedSet.has(fruit._id) && related.length < maxItems) {
              relatedSet.add(fruit._id);
              related.push(fruit);
            }
          });

          // Fill remaining slots with random fruits
          if (related.length < maxItems) {
            const remaining: Fruit[] = otherFruits.filter((fruit: Fruit) => !relatedSet.has(fruit._id));
            const shuffled = remaining.sort(() => 0.5 - Math.random());
            
            shuffled.forEach(fruit => {
              if (related.length < maxItems) {
                related.push(fruit);
              }
            });
          }

          setRelatedFruits(related);
        }
      } catch (error) {
        console.error('Error fetching related fruits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedFruits();
  }, [currentFruit._id, currentFruit.category, currentFruit.vitamins, currentFruit.healthBenefits, maxItems]);

  if (loading) {
    return <RelatedFruitsSkeleton maxItems={maxItems} />;
  }

  if (relatedFruits.length === 0) {
    return null;
  }

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
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Related {currentFruit.category === 'fruit' ? 'Fruits' : 'Vegetables'}</h2>
      
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {relatedFruits.map((fruit) => (
          <motion.div key={fruit._id} variants={itemVariants}>
            <Link href={`/fruits/${fruit._id}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={fruit.imageUrl || "/placeholder-fruit.jpg"}
                      alt={fruit.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/default-fruit.png";
                      }}
                    />
                    {fruit.isOrganic && (
                      <Badge className="absolute top-2 right-2 bg-green-600">
                        <Leaf size={12} className="mr-1" />
                        Organic
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {fruit.name}
                      </h3>
                      <Badge variant="outline" className="text-xs capitalize">
                        {fruit.category}
                      </Badge>
                    </div>
                    
                    {fruit.calories && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {fruit.calories} kcal/100g
                      </p>
                    )}
                    
                    {fruit.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {fruit.description}
                      </p>
                    )}
                    
                    {fruit.vitamins.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {fruit.vitamins.slice(0, 3).map((vitamin, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {vitamin}
                            </Badge>
                          ))}
                          {fruit.vitamins.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{fruit.vitamins.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function RelatedFruitsSkeleton({ maxItems = 4 }: { maxItems: number }) {
  return (
    <div className="mt-12 border-t pt-8">
      <Skeleton className="h-8 w-48 mb-6" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: maxItems }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-0">
              <Skeleton className="aspect-square w-full rounded-t-lg" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-3" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-10" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}