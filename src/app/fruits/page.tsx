"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import FruitCard from '@/components/FruitCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
  image?: string;
}

export default function FruitsPage() {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchFruits = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/fruits');
        setFruits(response.data.fruits);
        setError(null);
      } catch (err) {
        console.error('Error fetching fruits:', err);
        setError('Failed to load fruits. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFruits();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Fruits & Vegetables</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {fruits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No fruits or vegetables found</p>
              <Button onClick={() => router.push('/create-fruit')} className="bg-green-600 hover:bg-green-700">
                Add Your First Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {fruits.map((fruit) => (
                <FruitCard key={fruit._id} fruit={fruit} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}