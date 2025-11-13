import React, { useState } from 'react';
import { SparklesIcon } from './Icons';
import { Loader } from './Loader';

interface ImageEditorProps {
  imageSrc: string;
  onAnalyze: (imageSrc: string) => void;
  onEdit: (prompt: string, currentImageSrc: string) => Promise<string>;
  onCancel: () => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ imageSrc, onAnalyze, onEdit, onCancel }) => {
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentImage, setCurrentImage] = useState(imageSrc);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!editPrompt.trim()) return;
    setIsEditing(true);
    setError(null);
    try {
      const newImageSrc = await onEdit(editPrompt, currentImage);
      setCurrentImage(newImageSrc);
      setEditPrompt('');
    } catch (err: any) {
      setError(err.message || 'שגיאה בעריכת התמונה.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleAnalyze = () => {
    onAnalyze(currentImage);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">עריכת תמונה בעזרת AI</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="relative">
                <img src={currentImage} alt="For editing" className="rounded-lg shadow-md w-full" />
                {isEditing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <div className="flex flex-col items-center justify-center p-8 space-y-4">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute h-20 w-20 rounded-full border-4 border-t-indigo-500 border-gray-200 dark:border-gray-600 animate-spin"></div>
                                <SparklesIcon className="h-10 w-10 text-indigo-500" />
                            </div>
                            <p className="text-lg font-semibold text-white animate-pulse">עורך את התמונה...</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-col space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                    באפשרותך לבקש מה-AI לערוך את התמונה. לדוגמה: "הסר את הרקע", "הפוך את התפוח לאדום יותר", "הוסף משקפי שמש לדמות".
                </p>
                <div className="relative">
                    <textarea
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        placeholder="מה תרצה לשנות בתמונה?"
                        className="w-full p-3 pr-14 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        rows={3}
                        disabled={isEditing}
                    />
                    <button
                        onClick={handleEdit}
                        disabled={isEditing || !editPrompt.trim()}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                        aria-label="החל עריכה"
                    >
                        <SparklesIcon className="w-5 h-5" />
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <button
                        onClick={handleAnalyze}
                        disabled={isEditing}
                        className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 text-base font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                    >
                        המשך לניתוח
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isEditing}
                        className="w-full sm:w-auto px-6 py-3 text-base font-semibold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        בטל
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
