"use client";

import { useState, useRef } from "react";
import { upload } from "@imagekit/next";
import {
  UploadCloud,
  X,
  Check,
  Loader,
  AlertTriangle,
  Video,
} from "lucide-react";

interface FileUploadProps {
  onSuccess: (res: any) => void;
  onProgress?: (progress: number) => void;
  fileType?: "image" | "video";
  maxSizeMB?: number;
}

const FileUpload = ({
  onSuccess,
  onProgress,
  fileType = "video",
  maxSizeMB = 100,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    if (fileType === "video" && !file.type.startsWith("video/")) {
      setError("Only video files are allowed (MP4, MOV, etc.)");
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }

    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setSelectedFile(file);
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const authRes = await fetch("/api/auth/imagekit-auth");
      const auth = await authRes.json();

      const { signature, token, expire } = auth.authenticationParameters;

      const res = await upload({
        file,
        fileName: `video_${Date.now()}_${file.name}`,
        publicKey: auth.publicKey,
        signature,
        expire,
        token,
        onProgress: (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
            if (onProgress) onProgress(percent);
          }
        },
      });

      onSuccess(res);
    } catch (error) {
      console.error("Upload failed", error);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-black">
          Upload {fileType === "video" ? "Video" : "Image"}
        </label>

        {!selectedFile ? (
          <div
            className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors duration-200 ${
              error ? "border-red-300 bg-red-50" : "hover:bg-gray-50"
            }`}
            onClick={() => fileInputRef.current?.click()}>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <UploadCloud className="w-8 h-8 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-black">
                  Drag & drop or{" "}
                  <span className="text-black underline">browse files</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {fileType === "video"
                    ? "MP4, MOV, AVI up to 100MB"
                    : "JPG, PNG up to 10MB"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <Video className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-black truncate max-w-[200px]">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={fileType === "video" ? "video/*" : "image/*"}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </div>

      {uploading && (
        <div className="space-y-3">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Uploading... {progress}%</span>
            <Loader className="w-4 h-4 text-gray-500 animate-spin" />
          </div>
        </div>
      )}

      {!uploading && selectedFile && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
          <Check className="w-4 h-4" />
          <span>File ready for upload</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
