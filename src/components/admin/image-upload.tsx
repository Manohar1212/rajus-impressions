'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
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
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const filename = `impression-${timestamp}.${extension}`;

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
      className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
        dragOver
          ? 'border-[hsl(var(--admin-gold))] bg-[hsl(var(--admin-gold)_/_0.03)] scale-[1.01]'
          : 'border-[hsl(var(--admin-border))]'
      } ${value ? 'aspect-[4/3]' : 'aspect-video'} ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:border-[hsl(var(--admin-border)_/_0.8)]'
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
            className="object-cover rounded-xl"
          />
          {!disabled && (
            <button
              className="absolute top-2 right-2 h-8 w-8 rounded-lg bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center shadow-md transition-colors"
              onClick={() => onChange('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </>
      ) : (
        <label
          className={`flex flex-col items-center justify-center h-full ${
            disabled ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-7 w-7 animate-spin text-[hsl(var(--admin-gold))]" />
              <span className="text-xs text-[hsl(var(--admin-text-muted))]">Uploading...</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-[hsl(var(--admin-surface-2))] flex items-center justify-center mb-3">
                <Upload className="h-5 w-5 text-[hsl(var(--admin-text-faint))]" />
              </div>
              <span className="text-sm text-[hsl(var(--admin-text-muted))] font-medium">
                Drag & drop or click to upload
              </span>
              <span className="text-xs text-[hsl(var(--admin-text-faint))] mt-1">
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
