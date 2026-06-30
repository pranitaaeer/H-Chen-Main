import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string;
  googleId?: string;
  picture?: string;
  name: string;
}

const userSchema = new Schema<IUser>({
  googleId: String,
  name: String,
  email: { type: String, required: true, unique: true },
  picture: String,
  password: {type: String, select: false},
});

export default mongoose.models.User || mongoose.model<IUser>("User", userSchema);
