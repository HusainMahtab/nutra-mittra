import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFruit extends Document {
  name: string;
  category: "fruit" | "vegetable";
  description?: string;
  image?: string;
  calories?: number;
  vitamins?: string[]; // Example: ["Vitamin A", "Vitamin C"]
  minerals: {
    [key: string]: number; // dynamic: e.g., { calcium: 50, iron: 10 }
  };
  healthBenefits?: string[]; // Example: ["Improves immunity", "Good for eyes"]
  seasonalAvailability?: string; // e.g. "Summer", "Winter", "All seasons"
  isOrganic?: boolean;
  originStory?: string;
  createdAt: Date;
  updatedAt: Date;
}

const fruitSchema: Schema<IFruit> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    category: { type: String, enum: ["fruit", "vegetable"], required: true },
    description: { type: String },
    image: { type: String }, // image URL
    calories: { type: Number },
    vitamins: [{ type: String }],
    minerals: { type: Map, of: Number, required: true },
    healthBenefits: [{ type: String }],
    seasonalAvailability: { type: String }, // Optional field
    isOrganic: { type: Boolean, default: false },
    originStory: { type: String }, // Optional field
  },
  { timestamps: true }
);

const Fruit: Model<IFruit> =
  mongoose.models.Fruit || mongoose.model<IFruit>("Fruit", fruitSchema);

export default Fruit;
