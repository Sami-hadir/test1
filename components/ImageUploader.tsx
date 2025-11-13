
import React, { useRef } from 'react';
import { CameraIcon, UploadIcon, SparklesIcon } from './Icons';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelect(event.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center p-4">
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 transition-all hover:border-indigo-500 dark:hover:border-indigo-400">
        <SparklesIcon className="mx-auto h-16 w-16 text-indigo-400" />
        <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">נתח את המוצרים שלך</h2>
        <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-gray-400">
          צלם או העלה תמונה של מוצרי מזון או טיפוח כדי לקבל ניתוח מפורט, כולל זיהוי אזהרות.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 text-base font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:bg-indigo-300 transition-transform transform hover:scale-105"
          >
            <CameraIcon className="w-6 h-6" />
            <span>צלם תמונה</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 text-base font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 disabled:bg-indigo-50 transition-transform transform hover:scale-105"
          >
            <UploadIcon className="w-6 h-6" />
            <span>העלה קובץ</span>
          </button>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};
