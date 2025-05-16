import { BackupService } from './backupService';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { getEnv } from '@/config/env';

export class VideoService {
  private static ffmpeg: FFmpeg | null = null;

  private static async loadFFmpeg() {
    if (!this.ffmpeg) {
      this.ffmpeg = new FFmpeg();
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd';
      await this.ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
    }
  }

  static async init() {
    if (!this.ffmpeg) {
      await this.loadFFmpeg();
    }
  }

  static async processVideo(file: File, cropSettings: {
    x: number;
    y: number;
    width: number;
    height: number;
  }, containerDimensions: {
    width: number;
    height: number;
  }): Promise<string> {
    try {
      if (!this.ffmpeg) {
        throw new Error('FFmpeg not initialized');
      }

      // Create a temporary file name
      const timestamp = Date.now();
      const tempFileName = `temp_${timestamp}_${file.name}`;

      // Load the video file
      await this.ffmpeg.writeFile(tempFileName, await fetchFile(file));

      // Calculate the crop parameters
      const videoDimensions = await this.getVideoDimensions(tempFileName);
      const cropParams = this.calculateCropParameters(cropSettings, videoDimensions, containerDimensions);

      // Apply the crop
      await this.ffmpeg.exec([
        '-i', tempFileName,
        '-vf', `crop=${cropParams.width}:${cropParams.height}:${cropParams.x}:${cropParams.y}`,
        '-c:v', 'libx264',
        '-crf', '18',
        '-preset', 'fast',
        'output.mp4'
      ]);

      // Get the processed video
      const data = await this.ffmpeg.readFile('output.mp4');
      const processedFile = new File([data], `processed_${timestamp}_${file.name}`);

      // Upload to Firebase
      const processedUrl = await BackupService.backupVideo(processedFile, `processed_${timestamp}_${file.name}`);

      // Clean up
      await this.ffmpeg.deleteFile(tempFileName);
      await this.ffmpeg.deleteFile('output.mp4');

      return processedUrl;
    } catch (error) {
      console.error('Video processing error:', error);
      throw new Error('Failed to process video');
    }
  }

  private static async getVideoDimensions(fileName: string): Promise<{ width: number, height: number }> {
    if (!this.ffmpeg) {
      throw new Error('FFmpeg not initialized');
    }

    try {
      // Get video dimensions using FFmpeg
      const output = await this.ffmpeg.exec(['-i', fileName]);
      const stdout = output.toString();
      const match = stdout.match(/Stream.*Video.* ([0-9]+)x([0-9]+)/);
      if (!match) {
        throw new Error('Could not get video dimensions');
      }
      return {
        width: parseInt(match[1]),
        height: parseInt(match[2])
      };
    } catch (error) {
      console.error('Error getting video dimensions:', error);
      throw new Error('Failed to get video dimensions');
    }
  }

  private static calculateCropParameters(
    cropSettings: { x: number; y: number; width: number; height: number },
    videoDimensions: { width: number; height: number },
    containerDimensions: { width: number; height: number }
  ): { x: number; y: number; width: number; height: number } {
    // Calculate scale factor based on container dimensions
    const scale = Math.min(
      containerDimensions.width / videoDimensions.width,
      containerDimensions.height / videoDimensions.height
    );

    // Scale the crop settings
    return {
      x: Math.round(cropSettings.x * scale),
      y: Math.round(cropSettings.y * scale),
      width: Math.round(cropSettings.width * scale),
      height: Math.round(cropSettings.height * scale)
    };
  }

  static async getVideoUrl(videoId: string): Promise<string> {
    return await BackupService.getVideoUrl(videoId);
  }
}
