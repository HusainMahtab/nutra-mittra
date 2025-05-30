// Utility functions for search and filtering

export interface NutritionItem {
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

/**
 * Filter items based on search term, category, and organic filter
 */
export function filterItems(
  items: NutritionItem[],
  searchTerm: string = "",
  category: "fruit" | "vegetable" | "all" = "all",
  showOrganic: boolean = false
): NutritionItem[] {
  let result = [...items];

  // Filter by category
  if (category !== "all") {
    result = result.filter((item) => item.category === category);
  }

  // Filter by search term
  if (searchTerm) {
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.healthBenefits.some((benefit) =>
          benefit.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        item.vitamins.some((vitamin) =>
          vitamin.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }

  // Filter by organic
  if (showOrganic) {
    result = result.filter((item) => item.isOrganic);
  }

  return result;
}

/**
 * Sort items by different criteria
 */
export function sortItems(
  items: NutritionItem[],
  sortBy: string = "name"
): NutritionItem[] {
  const result = [...items];

  switch (sortBy) {
    case "name":
      return result.sort((a, b) => a.name.localeCompare(b.name));
    case "calories":
      return result.sort((a, b) => {
        const caloriesA = a.calories ? parseInt(a.calories) : 0;
        const caloriesB = b.calories ? parseInt(b.calories) : 0;
        return caloriesA - caloriesB;
      });
    default:
      return result;
  }
}