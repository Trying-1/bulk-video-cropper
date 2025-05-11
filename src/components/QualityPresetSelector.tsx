import React from 'react';
import { QualityPreset, qualityPresets } from '@/utils/ffmpeg';

interface QualityPresetSelectorProps {
  selectedPreset: QualityPreset;
  onChange: (preset: QualityPreset) => void;
}

const QualityPresetSelector: React.FC<QualityPresetSelectorProps> = ({ 
  selectedPreset, 
  onChange 
}) => {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Processing Quality
      </label>
      <div className="grid grid-cols-3 gap-2">
        {(Object.keys(qualityPresets) as QualityPreset[]).map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`
              px-3 py-2 text-sm font-medium rounded-md border 
              ${selectedPreset === preset 
                ? 'bg-teal-100 border-teal-500 text-teal-800 dark:bg-teal-900 dark:border-teal-600 dark:text-teal-200' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}
              transition-colors duration-150 ease-in-out
            `}
          >
            <div className="flex flex-col items-center">
              <span className="font-medium capitalize">{preset}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {preset === 'fastest' && (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Speed
                  </span>
                )}
                {preset === 'balanced' && (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Balanced
                  </span>
                )}
                {preset === 'quality' && (
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Quality
                  </span>
                )}
              </span>
            </div>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {qualityPresets[selectedPreset].description}
      </p>
    </div>
  );
};

export default QualityPresetSelector;
