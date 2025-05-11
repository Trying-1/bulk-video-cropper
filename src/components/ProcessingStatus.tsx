import React, { useState, useEffect } from 'react';

interface ProcessingStatusProps {
  isProcessing: boolean;
  progress: number;
  currentVideoName?: string;
  onCancel?: () => void;
  onClose?: () => void;
  totalVideos?: number;
  processedVideos?: number;
  completionMessage?: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ 
  isProcessing, 
  progress, 
  currentVideoName,
  onCancel,
  onClose,
  totalVideos = 0,
  processedVideos = 0,
  completionMessage = ''
}) => {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  
  // Reset timer when processing starts
  useEffect(() => {
    if (isProcessing) {
      setStartTime(Date.now());
      setElapsedTime(0);
    }
  }, [isProcessing]);
  
  // Update elapsed time every second
  useEffect(() => {
    if (!isProcessing) return;
    
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isProcessing, startTime]);
  
  // Add a subtle animation effect to make progress bar appear smoother
  const [smoothProgress, setSmoothProgress] = useState(0);
  
  useEffect(() => {
    // When actual progress changes, animate smoothly to the new value
    const animationFrame = requestAnimationFrame(() => {
      if (Math.abs(smoothProgress - progress) < 0.1) {
        setSmoothProgress(progress);
        return;
      }
      
      // Move smoothProgress toward progress at a rate of 2% per frame
      const step = (progress - smoothProgress) * 0.1;
      setSmoothProgress(prev => prev + step);
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [progress, smoothProgress]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  

  
  // Keep the dialog visible even when processing is complete if there's a completion message
  if (!isProcessing && !completionMessage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-teal-700 dark:text-teal-300 mb-4 flex items-center">
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Videos
            </>
          ) : (
            <>
              <svg className="-ml-1 mr-3 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Processing Complete
            </>
          )}
        </h3>
        
        <div className="bg-teal-50 dark:bg-teal-900/30 p-3 rounded-lg mb-4 border border-teal-100 dark:border-teal-800">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-teal-800 dark:text-teal-200">Progress</span>
            <span className="text-sm font-bold text-teal-800 dark:text-teal-200">{processedVideos} of {totalVideos} videos</span>
          </div>
          
          {currentVideoName && isProcessing && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 border-l-2 border-teal-500 pl-2">
              Currently processing: <span className="font-medium text-teal-700 dark:text-teal-300">{currentVideoName}</span>
            </p>
          )}
          
          {!isProcessing && completionMessage && (
            <p className="text-sm text-teal-600 dark:text-teal-300 mb-2 border-l-2 border-teal-500 pl-2 font-medium">
              {completionMessage}
            </p>
          )}
          
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            <div>
              <span className="block">Elapsed time:</span>
              <span className="font-medium text-teal-600 dark:text-teal-400">{formatTime(elapsedTime)}</span>
            </div>
          </div>

        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full" 
            style={{ width: `${smoothProgress}%` }}
          ></div>
        </div>
        
        <p className="text-center text-sm font-medium text-teal-700 dark:text-teal-300 mb-4">
          {Math.round(progress)}% Complete
        </p>
        
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isProcessing ? 
              "Please don't close this window while processing is in progress." :
              "You can now close this dialog or continue working with your processed videos."
            }
          </p>
          {isProcessing && onCancel ? (
            <button
              onClick={onCancel}
              className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-md hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel Processing
            </button>
          ) : !isProcessing && (
            <button
              onClick={() => {
                // Use the dedicated close function to properly close the dialog
                if (onClose) onClose();
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs rounded-md hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all shadow-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatus;
