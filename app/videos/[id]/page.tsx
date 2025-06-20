"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import VideoPlayer from "@/app/components/VideoPlayer";
import { apiClient } from "@/lib/api-client";
import { Video as IVideo } from "@/models/Video";
import { useNotification } from "@/app/components/Notification";

import { ArrowLeft, Share } from "lucide-react";

export default function VideoDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();

  const [video, setVideo] = useState<IVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const videoData = await apiClient.fetchVideoById(params.id);
        setVideo(videoData);
      } catch {
        showNotification("Video not found", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [params.id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification("Link copied to clipboard", "success");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600">Loading video...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-sm w-full p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h1 className="text-xl font-semibold text-black mb-3">
            Video Not Found
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            The video you're looking for doesn't exist or may have been removed.
          </p>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 mx-auto">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors duration-200 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Video Player */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm mb-6">
          <VideoPlayer
            src={video.videoUrl}
            thumbnail={video.thumbnailUrl}
            className="w-full aspect-video"
          />
        </div>

        {/* Video Info */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-start mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-semibold text-black mb-3">
                  {video.title}
                </h1>
                {video.description && (
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {video.description}
                  </p>
                )}
              </div>
            </div>

            {/* Tags */}
            {video.tags && video.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {video.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                <Share className="w-4 h-4" /> Share Video
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
