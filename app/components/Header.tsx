"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, Upload, LogOut, Video } from "lucide-react";
import { useNotification } from "./Notification";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const { showNotification } = useNotification();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      showNotification("Signed out successfully", "success");
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
      showNotification("Failed to sign out", "error");
    }
  };

  const handleHomeClick = () =>
    showNotification("Welcome to VideoVault", "info");
  const handleUploadClick = () => {
    showNotification("Ready to upload your video!", "info");
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Only show header if user has a session
  if (!session) return null;

  return (
    <header
      className={`sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-200 ${
        scrolled ? "shadow-sm bg-white/95" : ""
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          <Link
            href="/"
            onClick={handleHomeClick}
            className="flex items-center gap-3 font-semibold text-xl text-gray-900 hover:text-black transition-colors">
            <div className="flex items-center justify-center w-8 h-8 bg-black rounded-md">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="font-thin">VideoVault</span>
          </Link>

          <div className="flex items-center gap-4">
            {session && (
              <Link
                href="/upload"
                onClick={handleUploadClick}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-all">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </Link>
            )}

            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 hover:border-gray-300 transition-all bg-white">
                <User className="w-4 h-4 text-gray-700" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden z-50">
                  {status === "loading" ? (
                    <div className="px-4 py-4 flex items-center justify-center text-sm text-gray-600">
                      <span className="ml-2">Loading...</span>
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="text-sm font-medium text-gray-900">
                          {session.user?.name || "Welcome back!"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/upload"
                          onClick={handleUploadClick}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                          <Upload className="w-4 h-4" />
                          <span>Upload Video</span>
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
