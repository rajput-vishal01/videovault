"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FileUpload from "./FileUpload";
import { useNotification } from "./Notification";
import { apiClient, VideoFormData } from "@/lib/api-client";
import {
  Upload,
  Video,
  FileText,
  Check,
  ChevronLeft,
  RotateCw,
  Tag,
  Settings,
} from "lucide-react";

interface VideoFormState {
  title: string;
  description: string;
  tags: string;
  controls: boolean;
  quality: number;
}

interface UploadResponse {
  url: string;
  fileId: string;
  name: string;
  size: number;
}

export default function VideoUploadForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();

  const [videoData, setVideoData] = useState<VideoFormState>({
    title: "",
    description: "",
    tags: "",
    controls: true,
    quality: 80,
  });

  const [uploadedVideo, setUploadedVideo] = useState<UploadResponse | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setVideoData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleVideoUploadSuccess = (response: UploadResponse) => {
    setUploadedVideo(response);
    setCurrentStep(2);
    showNotification("Video uploaded successfully!", "success");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedVideo) {
      showNotification("Please upload a video first", "error");
      return;
    }

    if (!videoData.title.trim()) {
      showNotification("Please enter a video title", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const videoFormData: VideoFormData = {
        title: videoData.title,
        description: videoData.description,
        videoUrl: uploadedVideo.url,
        tags: videoData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        controls: videoData.controls,
        transformation: {
          height: 1080,
          width: 1920,
          quality: videoData.quality,
        },
      };

      const result = await apiClient.createVideo(videoFormData);
      showNotification("Video published successfully!", "success");
      router.push(`/`);
    } catch (error) {
      console.error("Error saving video:", error);
      showNotification("Failed to publish video. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setVideoData({
      title: "",
      description: "",
      tags: "",
      controls: true,
      quality: 80,
    });
    setUploadedVideo(null);
    setCurrentStep(1);
    setShowAdvanced(false);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-sm w-full p-8 bg-white rounded-lg border border-gray-200 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-black mb-3">
            Authentication Required
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Please sign in to upload videos to your VideoVault.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="w-full px-6 py-2.5 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="max-w-2xl mx-auto px-4 space-y-8">
        {/* Progress Steps */}
        <div className="flex justify-between items-center relative">
          <div className="absolute top-4 left-8 right-8 h-px bg-gray-200"></div>
          {[1, 2, 3].map((step) => (
            <div key={step} className="relative flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all relative z-10 ${
                  step <= currentStep
                    ? "bg-black text-white"
                    : "bg-white border border-gray-200 text-gray-400"
                }`}>
                {step < currentStep ? <Check className="w-4 h-4" /> : step}
              </div>
              <span
                className={`text-xs font-medium mt-2 ${
                  step <= currentStep ? "text-black" : "text-gray-400"
                }`}>
                {step === 1 ? "Upload" : step === 2 ? "Details" : "Publish"}
              </span>
            </div>
          ))}
        </div>

        {/* Step 1: Upload */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Upload className="w-5 h-5 text-gray-900" />
                <div>
                  <h2 className="text-lg font-semibold text-black">
                    Upload Your Video
                  </h2>
                  <p className="text-gray-600 text-sm mt-0.5">
                    Supported formats: MP4, MOV, AVI. Max file size: 100MB
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <FileUpload
                fileType="video"
                onSuccess={handleVideoUploadSuccess}
              />
            </div>
          </div>
        )}

        {/* Step 2: Form */}
        {currentStep === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-900" />
                  <div>
                    <h2 className="text-lg font-semibold text-black">
                      Video Details
                    </h2>
                    <p className="text-gray-600 text-sm mt-0.5">
                      Add information about your video to help viewers discover
                      it
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Video Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={videoData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a descriptive title"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={videoData.description}
                    onChange={handleInputChange}
                    placeholder="Tell viewers about your video"
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Tags
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-2.5">
                      <Tag className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="tags"
                      value={videoData.tags}
                      onChange={handleInputChange}
                      placeholder="e.g., tutorial, tech, how-to"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Separate tags with commas
                  </p>
                </div>

                {/* Advanced Options */}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors duration-200 font-medium">
                    <Settings className="w-4 h-4" />
                    {showAdvanced
                      ? "Hide Advanced Options"
                      : "Show Advanced Options"}
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-md border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-black">
                            Show video controls
                          </label>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Allow viewers to control playback
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="controls"
                            checked={videoData.controls}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Confirmation */}
            {uploadedVideo && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="p-1.5 bg-green-100 rounded-full">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-green-900">
                    Video Uploaded
                  </h3>
                  <p className="text-sm text-green-700 mt-0.5">
                    {uploadedVideo.name} •{" "}
                    {(uploadedVideo.size / 1024 / 1024).toFixed(2)}MB
                  </p>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-2">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-white text-black border border-gray-200 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                  Reset
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  "Publish Video"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
