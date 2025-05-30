"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { ArrowLeft, Calendar, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ExpandableText } from '@/components/ExpandableText';

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

export default function FruitDetailsPage({ params }: { params: { id: string } }) {
  const [fruit, setFruit] = useState<Fruit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  console.log("image", fruit?.imageUrl)
  
  // Use params directly
  const fruitId = params.id;

  useEffect(() => {
    const fetchFruitDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/fruits/${fruitId}`);
        setFruit(response.data.fruit);
        setError(null);
      } catch (err) {
        console.error('Error fetching fruit details:', err);
        setError('Failed to load fruit details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (fruitId) {
      fetchFruitDetails();
    }
  }, [fruitId]);

  if (loading) {
    return <FruitDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!fruit) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Fruit Not Found</h2>
          <p className="text-gray-600 mb-6">The fruit you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push('/fruits')}>
            View All Fruits
          </Button>
        </div>
      </div>
    );
  }

  // Default image if none provided
  const imageUrl = fruit?.imageUrl ?? "/placeholder-fruit.jpg"; // Make sure this fallback image exists in your public/images folder

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column - Image */}
        <div className="md:col-span-1">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-md">
            <Image
              src={imageUrl}
              alt={fruit.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = "/images/default-fruit.png";
              }}
            />
            {fruit.isOrganic && (
              <Badge className="absolute top-3 right-3 bg-green-600">
                <Leaf size={14} className="mr-1" />
                Organic
              </Badge>
            )}
          </div>
        </div>

        {/* Right column - Details */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold">{fruit.name}</h1>
            <Badge variant="outline" className="capitalize text-base px-3 py-1">
              {fruit.category}
            </Badge>
          </div>

          {fruit.description && (
            <div className="mb-6">
              <ExpandableText text={fruit.description} maxLength={200} />
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {fruit.calories && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-500 mb-1">Calories</h3>
                  <p className="font-semibold">{fruit.calories}<span className='mx-1 font-normal'>kcal/100gm</span></p>
                </CardContent>
              </Card>
            )}

            {fruit.seasonalAvailability && (
              <Card>
                <CardContent className="p-4 flex items-start gap-2">
                  <Calendar size={18} className="text-gray-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-500 mb-1">Seasonal Availability</h3>
                    <p className="font-semibold">{fruit.seasonalAvailability}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Vitamins & Minerals */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Nutritional Content</h2>
            
            {/* Vitamins */}
            {fruit.vitamins.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-600 mb-2">Vitamins</h3>
                <div className="flex flex-wrap gap-2">
                  {fruit.vitamins.map((vitamin, index) => (
                    <Badge key={index} variant="secondary">
                      {vitamin}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Minerals */}
            {Object.keys(fruit.minerals).length > 0 && (
              <div>
                <h3 className="font-medium text-gray-600 mb-2">Minerals</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(fruit.minerals).map(([name, value], index) => (
                    <div key={index} className=" bg-accent p-2 rounded-md">
                      <span className="font-medium">{name}:</span> {value} gm
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Health Benefits */}
          {fruit.healthBenefits.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Health Benefits</h2>
              <ul className="list-disc pl-5 space-y-1">
                {fruit.healthBenefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Origin Story */}
          {fruit.originStory && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Origin Story</h2>
              <ExpandableText text={fruit.originStory} maxLength={300} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FruitDetailsSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="h-10 w-20 mb-6">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Image skeleton */}
        <div className="md:col-span-1">
          <Skeleton className="aspect-square w-full rounded-lg" />
        </div>

        {/* Details skeleton */}
        <div className="md:col-span-2">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-2/3 mb-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>

          <Skeleton className="h-8 w-48 mb-3" />
          <div className="flex flex-wrap gap-2 mb-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </div>

          <Skeleton className="h-8 w-48 mb-3" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          <Skeleton className="h-8 w-48 mb-3" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-2" />
        </div>
      </div>
    </div>
  );
}