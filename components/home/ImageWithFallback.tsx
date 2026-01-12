"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  placeholderText?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fill = false,
  className = "",
  sizes,
  priority = false,
  width,
  height,
  placeholderText,
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (imageError) {
    return (
      <div
        className={`${fill ? "absolute inset-0" : ""} bg-muted border-2 border-dashed border-muted-foreground/20 flex items-center justify-center`}
        style={!fill && width && height ? { width, height } : undefined}
      >
        <div className="text-center p-4">
          <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
          {placeholderText && (
            <p className="text-xs text-muted-foreground/70 font-medium">{placeholderText}</p>
          )}
          <p className="text-xs text-muted-foreground/50 mt-1">Image placeholder</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {imageLoading && (
        <div
          className={`${fill ? "absolute inset-0" : ""} bg-muted animate-pulse ${fill ? "" : "rounded-lg"}`}
          style={!fill && width && height ? { width, height } : undefined}
        />
      )}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        className={`${className} ${imageLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        sizes={sizes}
        priority={priority}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
        onLoad={() => setImageLoading(false)}
      />
    </>
  );
}

