import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { Chat } from './components/Chat';
import { Loader } from './components/Loader';
import { ImageEditor } from './components/ImageEditor';
import { analyzeImageWithGemini, startChat, editImageWithGemini } from './services/geminiService';
import { AnalysisResponse } from './types';

type View = 'uploader' | 'editing' | 'loading' | 'results';

const App: React.FC = () => {
  const [view, setView] = useState<View>('uploader');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (file: File) => {
    setImageFile(file);
    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const resultString = reader.result as string;
      setImageBase64(resultString);
      setView('editing');
    };
    reader.onerror = () => {
      setError('שגיאה בקריאת הקובץ.');
      setView('uploader');
    };
  }, []);

  const handleStartAnalysis = useCallback(async (imageToAnalyze: string) => {
    if (!imageFile) return;
    
    setView('loading');
    
    const base64 = imageToAnalyze.split(',')[1];
    setImageBase64(imageToAnalyze);

    try {
        const result = await analyzeImageWithGemini(base64, imageFile.type);
        setAnalysisResult(result);
        startChat(JSON.stringify(result));
        setView('results');
    } catch (err: any) {
        setError("הניתוח נכשל. ודא שהחיבור שלך תקין ונסה שוב. אם הבעיה ממשיכה, ייתכן שיש בעיה עם תצורת ה-API.");
        setView('uploader');
    }
  }, [imageFile]);

  const handleEditImage = useCallback(async (prompt: string, currentImageSrc: string): Promise<string> => {
      if (!imageFile) throw new Error("No image file available for editing.");

      const currentBase64 = currentImageSrc.split(',')[1];
      const editedBase64 = await editImageWithGemini(currentBase64, imageFile.type, prompt);
      const newImageSrc = `data:${imageFile.type};base64,${editedBase64}`;
      return newImageSrc;
  }, [imageFile]);


  const resetApp = () => {
    setView('uploader');
    setImageFile(null);
    setImageBase64('');
    setAnalysisResult(null);
    setError(null);
  }

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {view === 'uploader' && (
          <>
            <ImageUploader onImageSelect={handleImageSelect} isLoading={false} />
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
          </>
        )}
        {view === 'editing' && (
          <ImageEditor 
            imageSrc={imageBase64}
            onAnalyze={handleStartAnalysis}
            onEdit={handleEditImage}
            onCancel={resetApp}
          />
        )}
        {view === 'loading' && <Loader />}
        {view === 'results' && analysisResult && (
          <>
            <AnalysisDisplay result={analysisResult} imageSrc={imageBase64} />
            <Chat analysisContext={JSON.stringify(analysisResult)} />
            <div className="text-center mt-8">
              <button
                onClick={resetApp}
                className="px-6 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-semibold rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/80 transition"
              >
                סרוק תמונה חדשה
              </button>
            </div>
          </>
        )}
      </main>
      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        <p>פותח בעזרת Google Gemini. כל הזכויות שמורות © InSpectra {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;