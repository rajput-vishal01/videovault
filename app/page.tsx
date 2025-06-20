"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VideoFeed from "./components/VideoFeed";
import { apiClient } from "@/lib/api-client";
import { Video as IVideo } from "@/models/Video";
import { PlayCircle, UploadCloud, Loader2 } from "lucide-react";

export default function HomePage() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videosData = await apiClient.getVideos();
        setVideos(videosData);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="animate-spin w-6 h-6 text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center justify-center px-4 py-16 border-b border-gray-200">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-bold text-black mb-6 tracking-tight">
            Welcome to <span className="font-light  font-sans">VideoVault</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Your modern platform to upload, discover, and share videos.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
              <UploadCloud className="w-4 h-4 mr-2" />
              Upload Video
            </Link>
            <Link
              href="#videos"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-black border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
              <PlayCircle className="w-4 h-4 mr-2" />
              Watch Videos
            </Link>
          </div>
        </div>
      </section>

      {/* Video Feed Section */}
      <section id="videos" className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold text-black mb-4 sm:mb-0 tracking-tight">
              Latest Videos
            </h2>
            <Link
              href="/upload"
              className="inline-flex items-center px-4 py-2 bg-white text-black border border-gray-200 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
              <UploadCloud className="w-4 h-4 mr-2" />
              Upload New Video
            </Link>
          </div>
          <VideoFeed videos={videos} />
        </div>
      </section>
    </div>
  );
}
