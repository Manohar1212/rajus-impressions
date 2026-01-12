'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseHelpers } from '@/lib/parse';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = useCallback(
    async (file: File) => {
      if (disabled) return;
      setUploading(true);

      try {
        // Generate unique filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const filename = `impression-${timestamp}.${extension}`;

        // Upload to Parse
        const url = await parseHelpers.uploadFile(file, filename);
        onChange(url);
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setUploading(false);
      }
    },
    [onChange, disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg transition-colors ${
        dragOver ? 'border-primary bg-primary/5' : 'border-border'
      } ${value ? 'aspect-[4/3]' : 'aspect-video'} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {value ? (
        <>
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover rounded-lg"
          />
          {!disabled && (
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={() => onChange('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </>
      ) : (
        <label
          className={`flex flex-col items-center justify-center h-full ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">
                Drag & drop or click to upload
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WEBP up to 5MB
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={disabled || uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
        </label>
      )}
    </div>
  );
}
