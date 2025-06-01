"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { createFruitSchema, CreateFruitFormValues } from '@/schemas/create-fruit-schema';
import { toast } from 'sonner';

// UI Components
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FruitImageUpload from '@/components/FruitImageUpload';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

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

interface VitaminEvent extends React.ChangeEvent<HTMLInputElement> {}
interface HealthBenefitEvent extends React.ChangeEvent<HTMLInputElement> {}
interface MineralNameEvent extends React.ChangeEvent<HTMLInputElement> {}
interface MineralValueEvent extends React.ChangeEvent<HTMLInputElement> {}

export default function EditFruitPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fruit, setFruit] = useState<Fruit | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const params = useParams();
  const fruitId = params?.id as string;
  
  // New vitamin and health benefit inputs
  const [newVitamin, setNewVitamin] = useState<string>("");
  const [newHealthBenefit, setNewHealthBenefit] = useState<string>("");
  const [newMineralName, setNewMineralName] = useState<string>("");
  const [newMineralValue, setNewMineralValue] = useState<string>("");

  // Initialize form with explicit type parameter
  const form = useForm<CreateFruitFormValues>({
    resolver: zodResolver(createFruitSchema) as any,
    defaultValues: {
      name: "",
      category: "fruit",
      description: "",
      calories: "",
      vitamins: [],
      minerals: {},
      healthBenefits: [],
      seasonalAvailability: "",
      isOrganic: false,
      originStory: "",
    } as CreateFruitFormValues, // Ensure all required fields are present and non-optional
  });

  useEffect((): void => {
    const fetchFruit = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/fruits/${fruitId}`);
        const fruitData: Fruit = response.data.fruit;
        setFruit(fruitData);
        setImageUrl(fruitData.imageUrl || null);
        
        // Set form values
        form.reset({
          name: fruitData.name,
          category: fruitData.category,
          description: fruitData.description ?? "",
          calories: fruitData.calories ?? "",
          vitamins: fruitData.vitamins ?? [],
          minerals: fruitData.minerals ?? {},
          healthBenefits: fruitData.healthBenefits ?? [],
          seasonalAvailability: fruitData.seasonalAvailability ?? "",
          isOrganic: fruitData.isOrganic ?? false,
          originStory: fruitData.originStory ?? "",
        } as CreateFruitFormValues);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching fruit:', err);
        setError('Failed to load fruit details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (fruitId) {
      fetchFruit();
    }
  }, [fruitId, form]);

  // Add vitamin to the form
  const handleAddVitamin = (): void => {
    if (newVitamin.trim() !== "") {
      const currentVitamins: string[] = form.getValues("vitamins") || [];
      if (!currentVitamins.includes(newVitamin.trim())) {
        form.setValue("vitamins", [...currentVitamins, newVitamin.trim()]);
        setNewVitamin("");
      }
    }
  };

  // Remove vitamin from the form
  const handleRemoveVitamin = (vitamin: string): void => {
    const currentVitamins: string[] = form.getValues("vitamins") || [];
    form.setValue(
      "vitamins",
      currentVitamins.filter((v) => v !== vitamin)
    );
  };

  // Add health benefit to the form
  const handleAddHealthBenefit = (): void => {
    if (newHealthBenefit.trim() !== "") {
      const currentBenefits: string[] = form.getValues("healthBenefits") || [];
      if (!currentBenefits.includes(newHealthBenefit.trim())) {
        form.setValue("healthBenefits", [...currentBenefits, newHealthBenefit.trim()]);
        setNewHealthBenefit("");
      }
    }
  };

  // Remove health benefit from the form
  const handleRemoveHealthBenefit = (benefit: string): void => {
    const currentBenefits: string[] = form.getValues("healthBenefits") || [];
    form.setValue(
      "healthBenefits",
      currentBenefits.filter((b) => b !== benefit)
    );
  };

  // Add mineral to the form
  const handleAddMineral = (): void => {
    if (newMineralName.trim() !== "" && newMineralValue.trim() !== "") {
      const mineralValue: number = parseFloat(newMineralValue);
      if (!isNaN(mineralValue)) {
        const currentMinerals: Record<string, number> = form.getValues("minerals") || {};
        form.setValue("minerals", {
          ...currentMinerals,
          [newMineralName.trim()]: mineralValue,
        });
        setNewMineralName("");
        setNewMineralValue("");
      }
    }
  };

  // Remove mineral from the form
  const handleRemoveMineral = (mineralName: string): void => {
    const currentMinerals: Record<string, number> = form.getValues("minerals") || {};
    const updatedMinerals: Record<string, number> = { ...currentMinerals };
    delete updatedMinerals[mineralName];
    form.setValue("minerals", updatedMinerals);
  };

  // Handle image upload success
  const handleImageUploadSuccess = (url: string): void => {
    setImageUrl(url);
    toast.success("Image uploaded successfully");
  };

  // Handle image upload error
  const handleImageUploadError = (errorMessage: string): void => {
    toast.error(`Failed to upload image: ${errorMessage}`);
  };

  // Form submission handler
  const onSubmit = async (data: CreateFruitFormValues): Promise<void> => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(`/api/fruits/${fruitId}`, data);
      toast.success("Fruit updated successfully");

      // Redirect back to the all fruits page
      router.push('/admin-panel/all');
    } catch (error) {
      console.error("Error updating fruit:", error);
      const axiosError = error as any;
      toast.error(axiosError.response?.data?.error || "Failed to update fruit");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={(): void => router.push('/all')}
        >
          Back to All Fruits
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Edit {fruit?.name}</h1>
        <Button 
          variant="outline" 
          onClick={(): void => router.push('/all')}
        >
          Cancel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit) as React.FormEventHandler} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter fruit name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fruit">Fruit</SelectItem>
                          <SelectItem value="vegetable">Vegetable</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Calories (per 100g)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter calories" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the caloric content per 100g
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="seasonalAvailability"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel>Seasonal Availability</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Summer, Winter, All seasons" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isOrganic"
                  render={({ field }) => (
                    <FormItem className="mt-4 flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 mt-1"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Is Organic</FormLabel>
                        <FormDescription>
                          Check if this fruit/vegetable is organically grown
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Vitamins Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Vitamins</h2>
                
                <div className="flex mb-4">
                  <Input
                    type="text"
                    value={newVitamin}
                    onChange={(e: VitaminEvent) => setNewVitamin(e.target.value)}
                    placeholder="Add vitamin (e.g., Vitamin C)"
                    className="flex-grow rounded-r-none"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddVitamin}
                    className="rounded-l-none"
                  >
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {form.watch("vitamins")?.map((vitamin: string, index: number) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span>{vitamin}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={(): void => handleRemoveVitamin(vitamin)}
                        className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  {(!form.watch("vitamins") || form.watch("vitamins").length === 0) && (
                    <p className="text-gray-500 text-sm italic">No vitamins added yet</p>
                  )}
                </div>
              </div>

              {/* Origin Story Section */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Origin Story</h2>
                
                <FormField
                  control={form.control}
                  name="originStory"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          placeholder="Share the origin story of this fruit/vegetable..." 
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button - Will be at the bottom of the page */}
              <div className="md:hidden">
                {isSubmitting ? (
                  <Button disabled className="w-full">Updating...</Button>
                ) : (
                  <Button type="submit" className="w-full">Update Fruit</Button>
                )}
              </div>
            </form>
          </Form>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Minerals Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Minerals</h2>
            
            <div className="flex mb-4">
              <div className="flex-grow grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  value={newMineralName}
                  onChange={(e: MineralNameEvent) => setNewMineralName(e.target.value)}
                  placeholder="Mineral name"
                  className="rounded-r-none"
                />
                <Input
                  type="number"
                  value={newMineralValue}
                  onChange={(e: MineralValueEvent) => setNewMineralValue(e.target.value)}
                  placeholder="Value (mg)"
                  className="rounded-l-none rounded-r-none"
                  min="0"
                  step="0.1"
                />
              </div>
              <Button 
                type="button" 
                onClick={handleAddMineral}
                className="rounded-l-none"
              >
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {Object.entries(form.watch("minerals") || {}).map(([name, value]: [string, number], index: number) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <span>
                    <span className="font-medium">{name}:</span> {value} mg
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={(): void => handleRemoveMineral(name)}
                    className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {(!form.watch("minerals") || Object.keys(form.watch("minerals")).length === 0) && (
                <p className="text-gray-500 text-sm italic">No minerals added yet</p>
              )}
            </div>
          </div>

          {/* Health Benefits Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Health Benefits</h2>
            
            <div className="flex mb-4">
              <Input
                type="text"
                value={newHealthBenefit}
                onChange={(e: HealthBenefitEvent) => setNewHealthBenefit(e.target.value)}
                placeholder="Add health benefit"
                className="flex-grow rounded-r-none"
              />
              <Button 
                type="button" 
                onClick={handleAddHealthBenefit}
                className="rounded-l-none"
              >
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {form.watch("healthBenefits")?.map((benefit: string, index: number) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <span>{benefit}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={(): void => handleRemoveHealthBenefit(benefit)}
                    className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {(!form.watch("healthBenefits") || form.watch("healthBenefits").length === 0) && (
                <p className="text-gray-500 text-sm italic">No health benefits added yet</p>
              )}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Fruit Image</h2>
            
            {fruit && (
              <div className="flex flex-col items-center">
                <FruitImageUpload
                  fruitId={fruit._id}
                  onUploadSuccess={handleImageUploadSuccess}
                  onUploadError={handleImageUploadError}
                  currentImageUrl={imageUrl || undefined}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="hidden md:block">
            {isSubmitting ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="w-full"
                onClick={form.handleSubmit(onSubmit) as React.MouseEventHandler}
              >
                Update Fruit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}