"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  createdAt: string;
  updatedAt: string;
}

export default function AllFruitsPage() {
  const router = useRouter();
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFruits();
  }, []);

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

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/fruits/${id}`);
      
      // Update the local state to remove the deleted fruit
      setFruits(fruits.filter(fruit => fruit._id !== id));
      
      toast.success("Fruit deleted successfully");
    } catch (err) {
      console.error('Error deleting fruit:', err);
      toast.error("Failed to delete fruit");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/edit-fruit/${id}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Fruits & Vegetables</h1>
        <Button onClick={() => router.push('/admin-panel/create-fruit')}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      {fruits.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No fruits or vegetables found</h2>
          <p className="text-gray-600 mb-6">Start by adding your first fruit or vegetable.</p>
          <Button onClick={() => router.push('/create-fruit')}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fruits.map((fruit) => (
            <Card key={fruit._id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src={fruit.image || '/placeholder-fruit.jpg'}
                  alt={fruit.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-fruit.jpg';
                  }}
                />
                {fruit.isOrganic && (
                  <Badge className="absolute top-2 right-2 bg-green-600">
                    Organic
                  </Badge>
                )}
              </div>
              
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/fruits/${fruit._id}`} className="hover:underline">
                    <h3 className="font-bold text-lg">{fruit.name}</h3>
                  </Link>
                  <Badge variant="outline" className="capitalize">
                    {fruit.category}
                  </Badge>
                </div>
                
                {fruit.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {fruit.description}
                  </p>
                )}
                
                {fruit.calories && (
                  <p className="text-sm mb-2">
                    <span className="font-medium">Calories:</span> {fruit.calories}kcal/100gm
                  </p>
                )}
              </CardContent>
              
              <CardFooter className="border-t pt-3 pb-4 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(fruit._id)}
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      disabled={deletingId === fruit._id}
                    >
                      {deletingId === fruit._id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete <span className='font-bold text-lg'>{fruit.name}</span>
                        and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(fruit._id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}