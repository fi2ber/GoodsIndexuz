"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  files: string[];
  onChange: (files: string[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

interface UploadProgress {
  fileName: string;
  progress: number;
  error?: string;
}

const ALLOWED_TYPES = ["application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB default

function validateFile(file: File, maxSize: number): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Only PDF files are allowed" };
  }

  // Check file extension
  const extension = file.name.toLowerCase().split(".").pop();
  if (extension !== "pdf") {
    return { valid: false, error: "Invalid file extension. Only .pdf files are allowed" };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }

  return { valid: true };
}

export function FileUploader({
  files,
  onChange,
  maxFiles = 3,
  maxSizeMB = 10,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

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

  const uploadFiles = useCallback(
    async (filesToUpload: FileList | File[]) => {
      const fileArray = Array.from(filesToUpload);

      // Check limit
      if (files.length + fileArray.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed. Please remove some files first.`);
        return;
      }

      // Validate files
      const validFiles: File[] = [];
      const invalidFiles: { name: string; error: string }[] = [];

      fileArray.forEach((file) => {
        const validation = validateFile(file, maxSizeBytes);
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
      setUploadProgress(validFiles.map((file) => ({ fileName: file.name, progress: 0 })));

      try {
        const formData = new FormData();
        validFiles.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("type", "document");

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          // Проверяем Content-Type перед парсингом JSON
          const contentType = response.headers.get("content-type");
          let errorMessage = "Failed to upload files";
          
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
        onChange([...files, ...data.urls]);
        setUploadProgress([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload files");
        setUploadProgress([]);
      } finally {
        setUploading(false);
        setIsDragging(false);
      }
    },
    [files, maxFiles, maxSizeBytes, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        uploadFiles(droppedFiles);
      }
    },
    [uploadFiles]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      uploadFiles(selectedFiles);
    }
    // Reset input for re-uploading the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const getFileName = (url: string) => {
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          uploading && "opacity-50 pointer-events-none"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading || files.length >= maxFiles}
        />

        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag and drop PDF files here, or click to select
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Maximum {maxFiles} files, up to {maxSizeMB}MB each
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || files.length >= maxFiles}
        >
          <Upload className="mr-2 h-4 w-4" />
          Select Files
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {uploadProgress.length > 0 && (
        <div className="space-y-2">
          {uploadProgress.map((progress, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{progress.fileName}</span>
                <span>{progress.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map((fileUrl, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{getFileName(fileUrl)}</p>
                      <p className="text-xs text-muted-foreground">PDF Document</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(index)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-3">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    View Document
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

