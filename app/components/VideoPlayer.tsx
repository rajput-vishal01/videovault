"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
} from "lucide-react";

interface VideoPlayerProps {
  src: string;
  thumbnail?: string;
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
}

export default function VideoPlayer({
  src,
  thumbnail,
  className = "",
  autoPlay = false,
  showControls = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-hide controls on mobile when playing
  useEffect(() => {
    if (isMobile && isPlaying && controlsVisible) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3000); // Hide after 3 seconds
    }

    return () => {
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [isMobile, isPlaying, controlsVisible]);

  const showControlsTemporarily = () => {
    setControlsVisible(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
  };

  const handleVideoClick = () => {
    if (isMobile) {
      if (controlsVisible) {
        togglePlay();
      } else {
        showControlsTemporarily();
      }
    } else {
      togglePlay();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = volume;
    video.playbackRate = playbackRate;

    const handleLoadedData = () => setIsLoading(false);
    const handleTimeUpdate = () =>
      setProgress((video.currentTime / video.duration) * 100);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [volume, playbackRate]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (videoRef.current) {
      videoRef.current.currentTime =
        (newProgress / 100) * videoRef.current.duration;
    }
  };

  const toggleFullscreen = () => {
    const element = videoRef.current?.parentElement;
    if (!element) return;

    if (!document.fullscreenElement) {
      element.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handlePlaybackRate = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSettings(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Determine if controls should be visible
  const shouldShowControls = isMobile ? controlsVisible : true;

  return (
    <div
      className={`relative group overflow-hidden rounded-lg border border-gray-200 bg-black shadow-sm ${className}`}
      onMouseMove={!isMobile ? showControlsTemporarily : undefined}
      onTouchStart={isMobile ? showControlsTemporarily : undefined}
    >
      <video
        ref={videoRef}
        src={src}
        poster={thumbnail}
        className="w-full h-full object-contain bg-black"
        preload="metadata"
        autoPlay={autoPlay}
        onClick={handleVideoClick}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {showControls && (
        <>
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 bg-black/20 hover:bg-black/30 ${
                isMobile 
                  ? (shouldShowControls ? 'opacity-100' : 'opacity-0') 
                  : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <div className="w-16 h-16 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105">
                <Play className="w-6 h-6 ml-1 text-black" />
              </div>
            </button>
          )}

          <div 
            className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-200 ${
              isMobile 
                ? (shouldShowControls ? 'opacity-100' : 'opacity-0') 
                : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <div className="flex items-center mb-3">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                style={{
                  background: `linear-gradient(to right, white 0%, white ${progress}%, rgba(255,255,255,0.3) ${progress}%, rgba(255,255,255,0.3) 100%)`,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="text-white hover:text-gray-200 transition-colors duration-150">
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMute}
                    className="text-white hover:text-gray-200 transition-colors duration-150">
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  {!isMobile && (
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                      style={{
                        background: `linear-gradient(to right, white 0%, white ${
                          volume * 100
                        }%, rgba(255,255,255,0.3) ${
                          volume * 100
                        }%, rgba(255,255,255,0.3) 100%)`,
                      }}
                    />
                  )}
                </div>

                {videoRef.current && (
                  <div className="text-sm text-white font-mono">
                    {formatTime(videoRef.current.currentTime)} /{" "}
                    {formatTime(videoRef.current.duration)}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white hover:text-gray-200 transition-colors duration-150">
                    <Settings className="w-5 h-5" />
                  </button>

                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
                      <div className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 border-b border-gray-100">
                        Playback Speed
                      </div>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => handlePlaybackRate(rate)}
                          className={`block w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                            playbackRate === rate
                              ? "font-semibold text-black bg-gray-50"
                              : "text-gray-700 hover:text-black"
                          }`}>
                          {rate}x {playbackRate === rate && "(Current)"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-gray-200 transition-colors duration-150">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}