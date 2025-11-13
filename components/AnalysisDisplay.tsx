import React from 'react';
import { AnalysisResponse, EnvironmentalComponent } from '../types';
import { WarningIcon, CheckCircleIcon, InfoIcon, HeartIcon } from './Icons';

const getStatusIcon = (status: EnvironmentalComponent['status']) => {
  switch (status) {
    case 'שלילי':
      return <WarningIcon className="w-6 h-6 text-red-500" />;
    case 'חיובי':
      return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
    case 'ניטרלי':
      return <InfoIcon className="w-6 h-6 text-blue-500" />;
    default:
      return null;
  }
};

const getStatusColorClasses = (status: EnvironmentalComponent['status']) => {
    switch (status) {
      case 'שלילי':
        return 'border-red-500/50 bg-red-500/10 dark:bg-red-500/20';
      case 'חיובי':
        return 'border-green-500/50 bg-green-500/10 dark:bg-green-500/20';
      case 'ניטרלי':
        return 'border-blue-500/50 bg-blue-500/10 dark:bg-blue-500/20';
      default:
        return 'border-gray-300/50 bg-gray-500/10 dark:bg-gray-500/20';
    }
  };

const ComponentCard: React.FC<{ component: EnvironmentalComponent }> = ({ component }) => (
    <div className={`p-4 rounded-xl border ${getStatusColorClasses(component.status)} transition-all duration-300 shadow-sm`}>
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{component.name}</h3>
              {component.high_nutritional_value && <HeartIcon className="w-5 h-5 text-pink-500" title="ערך תזונתי גבוה"/>}
            </div>
            {getStatusIcon(component.status)}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1"><strong className="font-semibold text-gray-700 dark:text-gray-300">סוג:</strong> {component.type}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2"><strong className="font-semibold text-gray-700 dark:text-gray-300">תיאור:</strong> {component.description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-3">"{component.rationale_for_status}"</p>
        <div className="text-xs text-gray-500 dark:text-gray-500">
            <span>מיקום בתמונה: {component.location_in_image}</span> | <span>רמת ביטחון: {component.confidence}</span>
        </div>
    </div>
);

export const AnalysisDisplay: React.FC<{ result: AnalysisResponse, imageSrc: string }> = ({ result, imageSrc }) => {
  const negativeCount = result.summary_of_analysis?.negative_elements_count ?? 0;
  const components = result.environmental_components ?? [];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">סיכום הניתוח</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{result.environment_description?.overall_impression ?? 'לא נמצא תיאור כללי.'}</p>
                 {negativeCount > 0 && (
                    <div className="flex items-center gap-3 p-3 mb-4 bg-red-100 dark:bg-red-900/50 border-r-4 border-red-500 rounded-lg">
                        <WarningIcon className="w-8 h-8 text-red-500" />
                        <div>
                            <p className="font-bold text-red-800 dark:text-red-200">נמצאו {negativeCount} מוצרים עם אזהרות!</p>
                            <p className="text-sm text-red-700 dark:text-red-300">מומלץ לעיין בפרטים למטה.</p>
                        </div>
                    </div>
                 )}
                 <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p>{result.summary_of_analysis?.overall_assessment_notes ?? 'לא נמצאו הערות סיכום.'}</p>
                 </div>
            </div>
            <div className="flex justify-center items-center">
                <img src={imageSrc} alt="Analyzed" className="rounded-lg max-h-64 shadow-md" />
            </div>
          </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">פירוט המוצרים שזוהו:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.length > 0 ? (
                components.map(component => (
                    <ComponentCard key={component.id} component={component} />
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8">לא זוהו מוצרים בתמונה.</p>
            )}
        </div>
      </div>
    </div>
  );
};