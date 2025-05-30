import mongoose, { Schema, Document } from 'mongoose';

export interface IFruit extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const FruitSchema = new Schema<IFruit>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['fruit', 'vegetable'],
    },
    description: {
      type: String,
      trim: true,
    },
    calories: {
      type: String,
    },
    vitamins: {
      type: [String],
      default: [],
    },
    minerals: {
      type: Map,
      of: Number,
      default: {},
    },
    healthBenefits: {
      type: [String],
      default: [],
    },
    seasonalAvailability: {
      type: String,
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    originStory: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists to prevent overwriting during hot reloads
const Fruit = mongoose.models.Fruit || mongoose.model<IFruit>('Fruit', FruitSchema);

export default Fruit;