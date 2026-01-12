"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ImageIcon, ZoomIn, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageWithFallback } from "@/components/home/ImageWithFallback";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  videoUrl?: string | null;
}

export function ProductImageGallery({ images, productName, videoUrl }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showVideo, setShowVideo] = useState(false);

  if (images.length === 0) {
    return (
      <div className="h-[400px] lg:h-[500px] w-full bg-muted rounded-[2rem] border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
        <div className="text-center p-8">
          <ImageIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <span className="text-muted-foreground font-medium">No images available</span>
        </div>
      </div>
    );
  }

  const mainImage = images[selectedIndex];
  const thumbnailImages = images.slice(0, 5);

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious();
    } else if (e.key === "ArrowRight") {
      handleNext();
    } else if (e.key === "Escape") {
      setIsLightboxOpen(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/')) {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    // Vimeo
    if (url.includes('vimeo.com/')) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    return url;
  };

  return (
    <>
      <div className="space-y-6">
        {/* Main Image/Video */}
        <div
          className="relative h-[400px] lg:h-[600px] w-full rounded-[2.5rem] overflow-hidden bg-muted cursor-zoom-in group shadow-xl"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        >
          {showVideo && videoUrl ? (
            <div className="relative w-full h-full">
              <iframe
                src={getVideoEmbedUrl(videoUrl) || videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setShowVideo(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <>
              <ImageWithFallback
                src={mainImage}
                alt={`${productName} - Image ${selectedIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={cn(
                  "object-cover transition-transform duration-300",
                  isZoomed ? "scale-150" : "group-hover:scale-105"
                )}
                style={isZoomed ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                } : undefined}
                priority
                placeholderText={productName}
                onClick={() => setIsLightboxOpen(true)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              
              {/* Zoom indicator */}
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/50 text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
                  <ZoomIn className="h-3 w-3" />
                  Click to zoom
                </div>
              </div>

              {/* Video button */}
              {videoUrl && (
                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute bottom-4 right-4 bg-primary text-primary-foreground hover:bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowVideo(true);
                  }}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Video
                </Button>
              )}
            </>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {(thumbnailImages.length > 1 || videoUrl) && (
          <div className={cn(
            "grid gap-4",
            videoUrl ? "grid-cols-6" : "grid-cols-5"
          )}>
            {videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className={cn(
                  "relative h-20 sm:h-24 w-full rounded-2xl overflow-hidden bg-primary/10 border-2 transition-all duration-300",
                  showVideo
                    ? "ring-2 ring-primary ring-offset-2 border-primary"
                    : "border-transparent hover:border-primary/50 hover:scale-105"
                )}
              >
                <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                  <Play className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute bottom-1 left-1 right-1 text-xs font-semibold text-primary text-center">
                  Video
                </div>
              </button>
            )}
            {thumbnailImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  handleThumbnailClick(idx);
                  setShowVideo(false);
                }}
                className={cn(
                  "relative h-20 sm:h-24 w-full rounded-2xl overflow-hidden bg-muted transition-all duration-300",
                  selectedIndex === idx && !showVideo
                    ? "ring-2 ring-primary ring-offset-2 scale-95 shadow-inner"
                    : "hover:opacity-80 hover:scale-105"
                )}
              >
                <ImageWithFallback
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 20vw, 10vw"
                  className="object-cover"
                  placeholderText="..."
                />
              </button>
            ))}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground/60 text-center">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent
          className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none"
          onKeyDown={handleKeyDown}
        >
          <DialogHeader className="sr-only">
            {productName} - Image Gallery
          </DialogHeader>
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Previous Button */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 z-50 text-white hover:bg-white/20"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {/* Main Image in Lightbox */}
            <div className="relative w-full h-full flex items-center justify-center p-8">
              <Image
                src={images[selectedIndex]}
                alt={`${productName} - Image ${selectedIndex + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain"
                priority
              />
            </div>

            {/* Next Button */}
            {images.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 z-50 text-white hover:bg-white/20"
                onClick={handleNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Image Counter in Lightbox */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
