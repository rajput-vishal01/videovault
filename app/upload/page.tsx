"use client";

import VideoUploadForm from "../components/VideoUploadForm";

export default function VideoUploadPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-black mb-2 tracking-tight">
              Upload New Video
            </h1>
            <p className="text-gray-600">
              Share your creativity with the VideoVault community
            </p>
          </div>
          <VideoUploadForm />
        </div>
      </div>
    </div>
  );
}
