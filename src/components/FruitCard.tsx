import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

interface FruitCardProps {
  fruit: Fruit;
}

export default function FruitCard({ fruit }: FruitCardProps) {
  const router = useRouter();
  
  // Get first 3 health benefits or vitamins to display
  const benefitsToShow = fruit.healthBenefits.slice(0, 2);
  const vitaminsToShow = fruit.vitamins.slice(0, 2);
  
  // Default image if none provided
  const imageUrl = fruit.imageUrl ?? '/placeholder-fruit.jpg';
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col"
      onClick={() => router.push(`/fruits/${fruit._id}`)}
    >
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
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
      
      <CardContent className="pt-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{fruit.name}</h3>
          <Badge variant="outline" className="capitalize">
            {fruit.category}
          </Badge>
        </div>
        
        {fruit.description && (
          <p className="text-sm mb-3 line-clamp-5">
            {fruit.description}
          </p>
        )}
        
        {fruit.calories && (
          <p className="text-sm">
            <span className="font-medium">Calories:</span> {fruit.calories}kcal/100gm
          </p>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-3 pb-4 flex flex-wrap gap-1">
        {benefitsToShow.map((benefit, index) => (
          <Badge key={`benefit-${index}`} variant="secondary" className="mr-1 mb-1">
            {benefit}
          </Badge>
        ))}
        
        {vitaminsToShow.map((vitamin, index) => (
          <Badge key={`vitamin-${index}`} variant="outline" className="bg-primary/10 text-primary mr-1 mb-1">
            {vitamin}
          </Badge>
        ))}
        
        {(fruit.healthBenefits.length > 2 || fruit.vitamins.length > 2) && (
          <Badge variant="outline" className="bg-primary/10 text-primary">
            +{fruit.healthBenefits.length + fruit.vitamins.length - benefitsToShow.length - vitaminsToShow.length} more
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}