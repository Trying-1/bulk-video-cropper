import { storage } from '@/config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export class BackupService {
  static async backupVideo(file: File, originalName: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${originalName}`;
      const storageRef = ref(storage, `videos/${fileName}`);

      // Upload the video
      await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (error) {
      console.error('Backup error:', error);
      throw new Error('Failed to backup video');
    }
  }

  static async getVideoUrl(fileName: string): Promise<string> {
    try {
      const storageRef = ref(storage, `videos/${fileName}`);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Get video error:', error);
      throw new Error('Video not found');
    }
  }
}