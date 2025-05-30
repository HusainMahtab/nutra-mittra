import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  isverified: boolean;
  profilePic?: string;
  verifyCode?: string; // Make optional as it won't always be present
  verifyCodeExpiry?: Date; // Make optional
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isverified: { type: Boolean, default: false },
    profilePic: { type: String },
    verifyCode: { type: String },
    verifyCodeExpiry: { type: Date },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;