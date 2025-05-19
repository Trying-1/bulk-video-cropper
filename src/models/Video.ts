/**
 * Enhanced Video model with better performance and relationship management
 */

export type VideoProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type VideoFormat = 'mp4' | 'webm' | 'mov' | 'avi' | 'mkv';

export interface VideoMetadata {
  width: number;
  height: number;
  duration: number; // in seconds
  frameRate?: number;
  bitRate?: number;
  codec?: string;
  audioCodec?: string;
  hasAudio: boolean;
  orientation?: 'landscape' | 'portrait' | 'square';
}

export interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  containerWidth: number;
  containerHeight: number;
}

export interface VideoProcessingOptions {
  targetAspectRatio: string; // e.g. '16:9', '1:1', '9:16'
  quality: 'low' | 'medium' | 'high';
  format: VideoFormat;
  cropSettings: CropSettings;
  preserveAudio: boolean;
  targetResolution?: {
    width: number;
    height: number;
  };
}

export interface ProcessingResult {
  success: boolean;
  outputUrl?: string;
  thumbnailUrl?: string;
  processingTime?: number; // in ms
  outputSize?: number; // in bytes
  error?: string;
  logs?: string[];
}

export interface VideoData {
  id: string;
  userId: string;
  title?: string;
  description?: string;
  originalFileName: string;
  originalUrl: string;
  originalSize: number; // in bytes
  thumbnailUrl?: string;
  processedUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // for temporary storage
  metadata: VideoMetadata;
  status: VideoProcessingStatus;
  processingOptions?: VideoProcessingOptions;
  processingResult?: ProcessingResult;
  isPublic: boolean;
  tags?: string[];
  // For optimizing queries
  indexFields: {
    userIdWithStatus: string; // userId_status (for filtering by both fields)
    userIdWithCreatedAt: string; // userId_createdAt (for sorting by date)
    userIdWithSize: string; // userId_size (for quota calculations)
  };
}
