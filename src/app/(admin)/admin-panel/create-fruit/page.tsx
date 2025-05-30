"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { createFruitSchema, CreateFruitFormValues } from '@/schemas/create-fruit-schema';
import { toast } from '@/components/ui/use-toast';

// UI Components
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FruitImageUpload from '@/components/FruitImageUpload';

function CreateFruitPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdFruitId, setCreatedFruitId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // New vitamin and health benefit inputs
  const [newVitamin, setNewVitamin] = useState("");
  const [newHealthBenefit, setNewHealthBenefit] = useState("");
  const [newMineralName, setNewMineralName] = useState("");
  const [newMineralValue, setNewMineralValue] = useState("");

  // Initialize form
  const form = useForm<CreateFruitFormValues>({
    resolver: zodResolver(createFruitSchema),
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
    },
  });

  // Add vitamin to the form
  const handleAddVitamin = () => {
    if (newVitamin.trim() !== "") {
      const currentVitamins = form.getValues("vitamins") || [];
      if (!currentVitamins.includes(newVitamin.trim())) {
        form.setValue("vitamins", [...currentVitamins, newVitamin.trim()]);
        setNewVitamin("");
      }
    }
  };

  // Remove vitamin from the form
  const handleRemoveVitamin = (vitamin: string) => {
    const currentVitamins = form.getValues("vitamins") || [];
    form.setValue(
      "vitamins",
      currentVitamins.filter((v) => v !== vitamin)
    );
  };

  // Add health benefit to the form
  const handleAddHealthBenefit = () => {
    if (newHealthBenefit.trim() !== "") {
      const currentBenefits = form.getValues("healthBenefits") || [];
      if (!currentBenefits.includes(newHealthBenefit.trim())) {
        form.setValue("healthBenefits", [...currentBenefits, newHealthBenefit.trim()]);
        setNewHealthBenefit("");
      }
    }
  };

  // Remove health benefit from the form
  const handleRemoveHealthBenefit = (benefit: string) => {
    const currentBenefits = form.getValues("healthBenefits") || [];
    form.setValue(
      "healthBenefits",
      currentBenefits.filter((b) => b !== benefit)
    );
  };

  // Add mineral to the form
  const handleAddMineral = () => {
    if (newMineralName.trim() !== "" && newMineralValue.trim() !== "") {
      const mineralValue = parseFloat(newMineralValue);
      if (!isNaN(mineralValue)) {
        const currentMinerals = form.getValues("minerals") || {};
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
  const handleRemoveMineral = (mineralName: string) => {
    const currentMinerals = form.getValues("minerals") || {};
    const updatedMinerals = { ...currentMinerals };
    delete updatedMinerals[mineralName];
    form.setValue("minerals", updatedMinerals);
  };

  // Handle image upload success
  const handleImageUploadSuccess = (url: string) => {
    setImageUrl(url);
    toast({
      title: "Success",
      description: "Image uploaded successfully",
    });
  };

  // Handle image upload error
  const handleImageUploadError = (errorMessage: string) => {
    toast({
      title: "Error",
      description: `Failed to upload image: ${errorMessage}`,
      variant: "destructive",
    });
  };

  // Form submission handler
  const onSubmit = async (data: CreateFruitFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/fruits/create-fruit', data);
      
      toast({
        title: "Success",
        description: response.data.message || "Fruit created successfully"
      });
      
      setCreatedFruitId(response.data.fruit._id);
      
      // Don't reset form if we want to upload an image
      // form.reset();
    } catch (error) {
      console.error("Error creating fruit:", error);
      const axiosError = error as any;
      toast({
        title: "Error",
        description: axiosError.response?.data?.error || "Failed to create fruit",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-full">
      <h1 className="text-3xl font-bold mb-6">Create New Fruit/Vegi</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit) as React.FormEventHandler} className="space-y-6">
              {/* Basic Information */}
              <div className="p-6 rounded-lg shadow-md">
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
              <div className="p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Vitamins</h2>
                
                <div className="flex mb-4">
                  <Input
                    type="text"
                    value={newVitamin}
                    onChange={(e) => setNewVitamin(e.target.value)}
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
                  {form.watch("vitamins")?.map((vitamin, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md">
                      <span>{vitamin}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRemoveVitamin(vitamin)}
                        className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  {(!form.watch("vitamins") || form.watch("vitamins").length === 0) && (
                    <p className="text-sm italic">No vitamins added yet</p>
                  )}
                </div>
              </div>

              {/* Origin Story Section */}
              <div className="p-6 rounded-lg shadow-md">
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
                  <Button disabled className="w-full">Creating...</Button>
                ) : (
                  <Button type="submit" className="w-full">Create Fruit</Button>
                )}
              </div>
            </form>
          </Form>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Minerals Section */}
          <div className="p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">
              Minerals <span className="text-red-500">*</span>
            </h2>
            
            <div className="flex mb-4">
              <Input
                type="text"
                value={newMineralName}
                onChange={(e) => setNewMineralName(e.target.value)}
                placeholder="Mineral name (e.g., Iron)"
                className="flex-grow rounded-r-none"
              />
              <Input
                type="number"
                value={newMineralValue}
                onChange={(e) => setNewMineralValue(e.target.value)}
                placeholder="Value (gm)"
                className="w-24 rounded-none"
                min="0"
                step="0.1"
              />
              <Button 
                type="button" 
                onClick={handleAddMineral}
                className="rounded-l-none"
              >
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {Object.entries(form.watch("minerals") || {}).map(([name, value], index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-md">
                  <span>
                    {name}: {value} gm
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveMineral(name)}
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
            
            {form.formState.errors.minerals && (
              <p className="text-red-500 text-sm mt-2">{form.formState.errors.minerals.message}</p>
            )}
          </div>

          {/* Health Benefits Section */}
          <div className="p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Health Benefits</h2>
            
            <div className="flex mb-4">
              <Input
                type="text"
                value={newHealthBenefit}
                onChange={(e) => setNewHealthBenefit(e.target.value)}
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
              {form.watch("healthBenefits")?.map((benefit, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-md">
                  <span>{benefit}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveHealthBenefit(benefit)}
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
          <div className="p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Image Upload</h2>
            
            {!createdFruitId ? (
              <p className="text-gray-600 mb-4">
                You can upload an image after creating the fruit.
              </p>
            ) : (
              <div className="flex flex-col items-center">
                <FruitImageUpload
                  fruitId={createdFruitId}
                  onUploadSuccess={handleImageUploadSuccess}
                  onUploadError={handleImageUploadError}
                  currentImageUrl={imageUrl || undefined}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button - Desktop */}
      <div className="mt-6 hidden md:block">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit) as React.FormEventHandler}>
            {isSubmitting ? (
              <Button disabled className="w-full">Creating...</Button>
            ) : (
              <Button type="submit" className="w-full">Create Fruit</Button>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}

export default CreateFruitPage;