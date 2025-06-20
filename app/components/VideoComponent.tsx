"use client";

import Link from "next/link";
import { Video as IVideo } from "@/models/Video";
import { useState } from "react";
import { Play, Clock, User } from "lucide-react";

export default function VideoComponent({ video }: { video: IVideo }) {
  const [isHovered, setIsHovered] = useState(false);
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

  if (!urlEndpoint) {
    console.error("ImageKit URL endpoint is not defined");
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 hover:border-gray-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <Link
        href={`/videos/${video._id}`}
        className="block relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-lg">
        <div className="aspect-video w-full relative bg-gray-100">
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundImage: `url(${video.thumbnailUrl})`,
              backgroundSize: "cover",
            }}
          />

          {/* Play button overlay */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}>
            <div className="w-14 h-14 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 ml-1 text-white fill-white" />
            </div>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link
          href={`/videos/${video._id}`}
          className="focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded">
          <h3 className="font-semibold text-black mb-2 line-clamp-2 hover:text-gray-700 transition-colors duration-200">
            {video.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {video.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="font-medium">
              {video.userId?.email?.split("@")[0] ?? "Unknown"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDate(video.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Hover progress bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300 ease-out"
        style={{ width: isHovered ? "100%" : "0%" }}
      />
    </div>
  );
}
