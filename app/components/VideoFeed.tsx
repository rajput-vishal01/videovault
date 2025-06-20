"use client";

import { Video as IVideo } from "@/models/Video";
import VideoComponent from "./VideoComponent";
import { useState, useEffect } from "react";
import { Loader, Search, Frown } from "lucide-react";

interface VideoFeedProps {
  videos: IVideo[];
  loading?: boolean;
  showFilters?: boolean;
}

export default function VideoFeed({
  videos,
  loading = false,
  showFilters = true,
}: VideoFeedProps) {
  const [filteredVideos, setFilteredVideos] = useState<IVideo[]>(videos);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    let result = [...videos];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (video) =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query)
      );
    }

    if (sortOption === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt as unknown as string).getTime() -
          new Date(a.createdAt as unknown as string).getTime()
      );
    } else if (sortOption === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt as unknown as string).getTime() -
          new Date(b.createdAt as unknown as string).getTime()
      );
    } else if (sortOption === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredVideos(result);
  }, [videos, searchQuery, sortOption]);

  if (loading) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-600">
        <Loader className="w-6 h-6 mb-4 animate-spin text-black" />
        <p className="text-sm font-medium">Loading videos...</p>
      </div>
    );
  }

  if (!filteredVideos.length) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
        <Frown className="w-8 h-8 mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-black mb-2">
          {videos.length ? "No matching videos" : "No videos uploaded yet"}
        </h3>
        <p className="max-w-md text-sm text-gray-600 leading-relaxed">
          {videos.length
            ? "Try adjusting your search or filter to find what you're looking for."
            : "Be the first to upload a video and start building your collection!"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showFilters && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:border-black placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Sort by:
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="rounded-md px-3 py-2.5 text-sm bg-white border border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:border-black cursor-pointer hover:border-gray-300">
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => (
          <VideoComponent key={video._id?.toString()} video={video} />
        ))}
      </div>
    </div>
  );
}
