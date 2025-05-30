/**
 * Uploads a fruit image to Cloudinary and updates the fruit record
 * @param file The image file to upload
 * @param fruitId The ID of the fruit to associate with the image
 * @returns Object containing success status and response data
 */
export async function uploadFruitImage(file: File, fruitId: string) {
  try {
    // Step 1: Upload the image to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fruitId", fruitId);

    const uploadResponse = await fetch("/api/fruits/upload-image", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.error || "Failed to upload image");
    }

    const uploadResult = await uploadResponse.json();

    // Step 2: Update the fruit record with the image URL
    const updateResponse = await fetch("/api/fruits/update-image", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fruitId,
        imageUrl: uploadResult.imageUrl,
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(errorData.error || "Failed to update fruit with image URL");
    }

    const updateResult = await updateResponse.json();

    return {
      success: true,
      data: {
        imageUrl: uploadResult.imageUrl,
        fruit: updateResult.fruit,
      },
    };
  } catch (error) {
    console.error("Error in uploadFruitImage:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}