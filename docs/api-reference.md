# Bulk Video Cropper API Reference

This document provides detailed information about the available APIs and their usage.

## Core APIs

### 1. Video Processing API

#### `cropVideo`
```typescript
interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ContainerDimensions {
  width: number;
  height: number;
}

export const cropVideo = async (
  videoFile: File,
  cropSettings: CropSettings,
  containerDimensions?: ContainerDimensions
): Promise<Blob> => {
  // Implementation
}
```

- **Parameters**:
  - `videoFile`: The video file to process
  - `cropSettings`: Coordinates and dimensions for cropping
  - `containerDimensions`: Optional container dimensions

- **Returns**: Promise containing the processed video as Blob

#### `processBatchVideos`
```typescript
interface VideoBatchItem {
  id: string;
  file: File;
  cropSettings: CropSettings;
  containerDimensions?: ContainerDimensions;
}

export const processBatchVideos = async (
  videos: VideoBatchItem[],
  onProgress?: (progress: number, currentVideo: string) => void
): Promise<Array<{ id: string; processedVideo: Blob }>> => {
  // Implementation
}
```

- **Parameters**:
  - `videos`: Array of videos to process
  - `onProgress`: Optional callback for progress updates

- **Returns**: Promise with array of processed videos

### 2. File Validation API

#### `validateVideo`
```typescript
export const validateVideo = (file: File): boolean => {
  // Implementation
}
```

- **Parameters**:
  - `file`: The video file to validate

- **Returns**: Boolean indicating if file is valid

#### `isValidFileSize`
```typescript
export const isValidFileSize = (file: File, maxSizeMB: number = 100): boolean => {
  // Implementation
}
```

- **Parameters**:
  - `file`: The file to check
  - `maxSizeMB`: Maximum allowed size in MB

- **Returns**: Boolean indicating if file size is valid

### 3. Video Service API

#### `processVideo`
```typescript
interface ProcessVideoParams {
  file: File;
  cropSettings: CropSettings;
  containerDimensions?: ContainerDimensions;
}

export const processVideo = async (params: ProcessVideoParams): Promise<string> => {
  // Implementation
}
```

- **Parameters**:
  - `params`: Video processing parameters

- **Returns**: Promise with processed video URL

### 4. Backup Service API

#### `backupVideo`
```typescript
interface BackupParams {
  file: Blob;
  fileName: string;
}

export const backupVideo = async (params: BackupParams): Promise<string> => {
  // Implementation
}
```

- **Parameters**:
  - `params`: Backup parameters

- **Returns**: Promise with backup URL

## Error Handling

### Common Error Types

```typescript
interface VideoProcessingError {
  code: string;
  message: string;
  details?: any;
}
```

### Error Codes

| Code | Description |
|------|-------------|
| FILE_TOO_LARGE | File exceeds maximum size limit |
| INVALID_FORMAT | Unsupported video format |
| PROCESSING_FAILED | Video processing failed |
| CANCELLED | Processing was cancelled |

## Usage Examples

### Basic Video Cropping
```typescript
const cropSettings = {
  x: 100,
  y: 100,
  width: 800,
  height: 600
};

const processedVideo = await cropVideo(
  videoFile,
  cropSettings,
  { width: 1280, height: 720 }
);
```

### Batch Processing
```typescript
const videos = [
  { id: '1', file: video1, cropSettings },
  { id: '2', file: video2, cropSettings }
];

const processedVideos = await processBatchVideos(
  videos,
  (progress, currentVideo) => {
    console.log(`Processing ${progress}% - Current: ${currentVideo}`);
  }
);
```

## Best Practices

1. **Error Handling**
   - Always implement proper error handling
   - Use try-catch blocks for async operations
   - Provide user-friendly error messages

2. **Performance**
   - Validate files before processing
   - Use batch processing for multiple videos
   - Monitor memory usage

3. **Security**
   - Validate all inputs
   - Handle sensitive data carefully
   - Implement proper cleanup
