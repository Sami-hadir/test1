
import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <div className="relative flex items-center justify-center">
        <div className="absolute h-20 w-20 rounded-full border-4 border-t-indigo-500 border-gray-200 dark:border-gray-600 animate-spin"></div>
        <svg className="h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
    </div>
    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 animate-pulse">מנתח את התמונה, אנא המתן...</p>
    <p className="text-sm text-gray-500 dark:text-gray-400">ה-AI שלנו בוחן כל פרט ופרט.</p>
  </div>
);
