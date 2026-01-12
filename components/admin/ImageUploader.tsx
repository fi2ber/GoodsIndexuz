"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Upload, X, GripVertical, Image as ImageIcon, AlertCircle, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { validateImageFile } from "@/lib/utils/file-upload";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  productId?: string;
  maxImages?: number;
  uploadEndpoint?: string; // Кастомный endpoint для загрузки
}

interface UploadProgress {
  fileName: string;
  progress: number;
  error?: string;
}

export function ImageUploader({
  images,
  onChange,
  productId,
  maxImages = 10,
  uploadEndpoint,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<string[]>(images);
  
  // Синхронизируем ref с images при изменении
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    // Определяем, используем ли мы публичный endpoint для формы подачи товара
    const isPublicEndpoint = uploadEndpoint === "/api/product-submissions/upload";
    
    // Для новых товаров разрешаем загрузку во временную папку
    const actualProductId = productId || `temp-${Date.now()}`;
    console.log("Uploading files for productId:", actualProductId, "productId:", productId);

    const fileArray = Array.from(files);
    
    // Проверка лимита - используем актуальное значение из ref
    if (imagesRef.current.length + fileArray.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed. Please remove some images first.`);
      return;
    }

    // Валидация файлов
    const validFiles: File[] = [];
    const invalidFiles: { name: string; error: string }[] = [];

    fileArray.forEach((file) => {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        invalidFiles.push({ name: file.name, error: validation.error || "Invalid file" });
      }
    });

    if (invalidFiles.length > 0) {
      setError(
        `Invalid files: ${invalidFiles.map((f) => `${f.name} (${f.error})`).join(", ")}`
      );
    }

    if (validFiles.length === 0) {
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(
      validFiles.map((file) => ({ fileName: file.name, progress: 0 }))
    );

    try {
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append("files", file);
      });
      
      // Для публичного endpoint используем submissionId, для админского - productId
      if (isPublicEndpoint) {
        formData.append("submissionId", actualProductId);
      } else {
        formData.append("productId", actualProductId);
        if (!productId) {
          formData.append("isTemporary", "true");
        }
      }

      const endpoint = uploadEndpoint || "/api/admin/upload";
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Проверяем Content-Type перед парсингом JSON
        const contentType = response.headers.get("content-type");
        let errorMessage = "Failed to upload images";
        
        if (contentType && contentType.includes("application/json")) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } catch (parseError) {
            // Если не удалось распарсить JSON, используем дефолтное сообщение
            console.error("Failed to parse error response:", parseError);
          }
        } else {
          // Если ответ не JSON, используем статус код
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Upload response:", data);
      console.log("Current images from ref:", imagesRef.current);
      console.log("New URLs:", data.urls);
      
      // Используем актуальное значение images из ref
      const currentImages = imagesRef.current;
      const newImages = [...currentImages, ...data.urls];
      console.log("Updated images:", newImages);
      onChange(newImages);
      setUploadProgress([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images");
      setUploadProgress([]);
    } finally {
      setUploading(false);
      setIsDragging(false);
    }
  }, [productId, maxImages, onChange, uploadEndpoint]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        uploadFiles(files);
      }
    },
    [uploadFiles]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFiles(files);
    }
    // Сброс input для возможности повторной загрузки того же файла
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleImageDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleImageDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newImages = [...images];
      const [removed] = newImages.splice(draggedIndex, 1);
      newImages.splice(dragOverIndex, 0, removed);
      onChange(newImages);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleMove = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= images.length) return;
    
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePreviousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {images.length < maxImages && (
        <Card
          className={cn(
            "border-2 border-dashed transition-colors cursor-pointer",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-primary/50",
            uploading && "opacity-50 pointer-events-none"
          )}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <CardContent className="flex flex-col items-center justify-center p-12">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm font-medium mb-1">
                  {isDragging ? "Drop images here" : "Drag & drop images or click to upload"}
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP up to 10MB ({images.length}/{maxImages})
                </p>
                {!productId && (
                  <p className="text-xs text-yellow-600 mt-1">
                    Temporary upload - save product to finalize
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((progress, index) => (
            <div key={index} className="text-sm text-muted-foreground">
              {progress.fileName}: {progress.progress}%
            </div>
          ))}
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable
              onDragStart={() => handleImageDragStart(index)}
              onDragOver={(e) => handleImageDragOver(e, index)}
              onDragEnd={handleImageDragEnd}
              className={cn(
                "relative group aspect-square rounded-lg overflow-hidden border bg-muted cursor-move transition-all",
                draggedIndex === index && "opacity-50 scale-95",
                dragOverIndex === index && draggedIndex !== index && "ring-2 ring-primary ring-offset-2"
              )}
            >
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover transition-transform group-hover:scale-105 cursor-pointer"
                onClick={() => handleImageClick(index)}
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleImageClick(index);
                  }}
                  className="h-8 w-8"
                  title="View full size"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="flex gap-2">
                  {index > 0 && (
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(index, "up");
                      }}
                      className="h-8 w-8"
                      title="Move up"
                    >
                      ↑
                    </Button>
                  )}
                  {index < images.length - 1 && (
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMove(index, "down");
                      }}
                      className="h-8 w-8"
                      title="Move down"
                    >
                      ↓
                    </Button>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Are you sure you want to remove this image?")) {
                      handleRemove(index);
                    }
                  }}
                  className="h-8 w-8"
                  title="Remove image"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Drag handle */}
              <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="h-4 w-4" />
              </div>

              {/* Primary badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded font-medium">
                  Primary
                </div>
              )}

              {/* Image number */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && !uploading && (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">No images uploaded yet</p>
          {!productId && (
            <p className="text-xs mt-2">
              Images will be saved temporarily. Save the product to finalize.
            </p>
          )}
        </div>
      )}

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => !open && setSelectedImageIndex(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <div className="relative w-full h-[80vh] bg-black">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
                onClick={() => setSelectedImageIndex(null)}
              >
                <X className="h-6 w-6" />
              </Button>
              {selectedImageIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={handlePreviousImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              )}
              {selectedImageIndex < images.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              )}
              <Image
                src={images[selectedImageIndex]}
                alt={`Product image ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded">
                Image {selectedImageIndex + 1} of {images.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

