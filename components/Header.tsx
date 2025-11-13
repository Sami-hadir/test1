
import React from 'react';
import { useDarkMode } from '../hooks/useDarkMode';
import { SunIcon, MoonIcon, SparklesIcon } from './Icons';

export const Header: React.FC = () => {
  const [theme, toggleTheme] = useDarkMode();

  return (
    <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <SparklesIcon className="w-8 h-8 text-indigo-500"/>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
             InSpectra
            </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
      </div>
    </header>
  );
};
