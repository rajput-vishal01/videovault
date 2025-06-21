import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSIONS = {
  height: 1080,
  width: 1920,
} as const;


export interface User {
  _id: mongoose.Types.ObjectId;
  email: string;
  name?: string;

}

export interface Video {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | User; //being populated User
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls?: boolean;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
}

const videoSchema = new Schema<Video>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSIONS.height },
      width: { type: Number, default: VIDEO_DIMENSIONS.width },
      quality: { type: Number, min: 1, max: 100 }, //comes from imagekit.io
    },
  },
  {
    timestamps: true,
  }
);

const Video = models?.Video || model<Video>("Video", videoSchema);

export default Video;
