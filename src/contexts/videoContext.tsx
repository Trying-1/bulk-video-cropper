import { createContext, useContext, useState, useCallback } from 'react';
import { AppError } from '@/utils/errorHandler';

interface VideoState {
  originalVideo?: File;
  croppedVideo?: File;
  processing: boolean;
  error?: string;
  progress: number;
}

interface VideoActions {
  setOriginalVideo: (file: File) => void;
  setCroppedVideo: (file: File) => void;
  setError: (error: string) => void;
  reset: () => void;
  updateProgress: (progress: number) => void;
}

interface VideoContextType extends VideoState, VideoActions {}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<VideoState>({
    processing: false,
    progress: 0,
  });

  const setOriginalVideo = useCallback((file: File) => {
    setState(prev => ({ ...prev, originalVideo: file, error: undefined }));
  }, []);

  const setCroppedVideo = useCallback((file: File) => {
    setState(prev => ({ ...prev, croppedVideo: file, error: undefined }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, processing: false }));
  }, []);

  const updateProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress }));
  }, []);

  const reset = useCallback(() => {
    setState({
      processing: false,
      progress: 0,
    });
  }, []);

  const value = {
    ...state,
    setOriginalVideo,
    setCroppedVideo,
    setError,
    reset,
    updateProgress,
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideo() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
}
