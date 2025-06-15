import mongoose, { Schema, model, models } from "mongoose";

export const VIDEO_DIMENSIONS = {
  heigth: 1920,
  width: 1080,
} as const;

export interface Video {
  _id?: mongoose.Types.ObjectId;
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
}
const videoSchema = new Schema<Video>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    controls: { type: Boolean, default: true },
    transformation: {
      height: { type: Number, default: VIDEO_DIMENSIONS.heigth },
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
