/**
 * Uploads a fruit image to Cloudinary and updates the fruit record
 * @param file The image file to upload
 * @param fruitId The ID of the fruit to associate with the image
 * @returns Object containing success status and response data
 */
export async function uploadFruitImage(file: File, fruitId: string) {
  try {
    console.log("Starting image upload for fruit:", fruitId);
    
    // Step 1: Upload the image to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fruitId", fruitId);

    console.log("Sending request to upload-image API");
    
    const uploadResponse = await fetch("/api/fruits/upload-image", {
      method: "POST",
      body: formData,
    });

    console.log("Upload response status:", uploadResponse.status);
    console.log("Upload response headers:", Object.fromEntries(uploadResponse.headers.entries()));

    if (!uploadResponse.ok) {
      let errorMessage = `HTTP ${uploadResponse.status}: ${uploadResponse.statusText}`;
      
      try {
        const errorData = await uploadResponse.json();
        errorMessage = errorData.error || errorMessage;
      } catch (jsonError) {
        console.error("Failed to parse error response as JSON:", jsonError);
        // Try to get text response
        try {
          const errorText = await uploadResponse.text();
          console.error("Error response text:", errorText);
          errorMessage = errorText || errorMessage;
        } catch (textError) {
          console.error("Failed to get error response text:", textError);
        }
      }
      
      throw new Error(errorMessage);
    }

    let uploadResult;
    try {
      uploadResult = await uploadResponse.json();
      console.log("Upload result:", uploadResult);
    } catch (jsonError) {
      console.error("Failed to parse upload response as JSON:", jsonError);
      throw new Error("Invalid response from upload API");
    }

    // Step 2: Update the fruit record with the image URL
    console.log("Starting database update for fruit:", fruitId);
    console.log("Image URL to save:", uploadResult.imageUrl);
    
    const updateResponse = await fetch("/api/fruits/update-image", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fruitId,
        image: uploadResult.imageUrl,
      }),
    });

    console.log("Update response status:", updateResponse.status);
    console.log("Update response headers:", Object.fromEntries(updateResponse.headers.entries()));

    if (!updateResponse.ok) {
      let errorMessage = `HTTP ${updateResponse.status}: ${updateResponse.statusText}`;
      
      try {
        const errorData = await updateResponse.json();
        console.error("Update error data:", errorData);
        errorMessage = errorData.error || errorMessage;
      } catch (jsonError) {
        console.error("Failed to parse update error response as JSON:", jsonError);
        try {
          const errorText = await updateResponse.text();
          console.error("Update error response text:", errorText);
          errorMessage = errorText || errorMessage;
        } catch (textError) {
          console.error("Failed to get update error response text:", textError);
        }
      }
      
      throw new Error(errorMessage);
    }

    let updateResult;
    try {
      updateResult = await updateResponse.json();
      console.log("Update result:", updateResult);
    } catch (jsonError) {
      console.error("Failed to parse update response as JSON:", jsonError);
      throw new Error("Invalid response from update API");
    }

    return {
      success: true,
      data: {
        image: uploadResult.imageUrl,
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