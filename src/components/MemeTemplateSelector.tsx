'use client';

import Image from 'next/image';
import { useState } from 'react';
import { MemeTemplate } from '@/types/meme';
import { POPULAR_MEME_TEMPLATES } from '@/data/memeTemplates';

interface MemeTemplateSelectorProps {
  selectedTemplate: MemeTemplate | null;
  onTemplateSelect: (template: MemeTemplate) => void;
}

export default function MemeTemplateSelector({
  selectedTemplate,
  onTemplateSelect,
}: MemeTemplateSelectorProps) {
  const [loadingStates, setLoadingStates] = useState<{[key: string]: boolean}>({});
  const [errorStates, setErrorStates] = useState<{[key: string]: boolean}>({});

  const handleImageLoad = (templateId: string) => {
    setLoadingStates(prev => ({ ...prev, [templateId]: false }));
  };

  const handleImageError = (templateId: string) => {
    setLoadingStates(prev => ({ ...prev, [templateId]: false }));
    setErrorStates(prev => ({ ...prev, [templateId]: true }));
  };

  const handleTemplateClick = (template: MemeTemplate) => {
    if (!errorStates[template.id]) {
      onTemplateSelect(template);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, template: MemeTemplate) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleTemplateClick(template);
    }
  };

  return (
    <div className="w-full" role="region" aria-labelledby="template-selector-heading">
      <h2 
        id="template-selector-heading" 
        className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-900"
      >
        Choose a Meme Template
      </h2>
      <div 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
        role="grid"
        aria-label="Meme template selection"
      >
        {POPULAR_MEME_TEMPLATES.map((template, index) => (
          <div
            key={template.id}
            role="gridcell"
            tabIndex={0}
            className={`
              relative cursor-pointer border-2 rounded-xl overflow-hidden transition-all duration-300 
              transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none
              ${selectedTemplate?.id === template.id
                ? 'border-blue-500 shadow-xl ring-2 ring-blue-200 animate-pulse-glow'
                : errorStates[template.id]
                ? 'border-red-300 opacity-50 cursor-not-allowed'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }
            `}
            onClick={() => handleTemplateClick(template)}
            onKeyDown={(e) => handleKeyDown(e, template)}
            aria-label={`Select ${template.name} template`}
            aria-selected={selectedTemplate?.id === template.id}
            aria-disabled={errorStates[template.id]}
          >
            <div className="relative aspect-square bg-gray-100">
              {loadingStates[template.id] !== false && (
                <div className="absolute inset-0 loading-skeleton rounded-t-xl" />
              )}
              
              {errorStates[template.id] ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-400">
                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs">Failed to load</p>
                  </div>
                </div>
              ) : (
                <Image
                  src={template.url}
                  alt={`${template.name} meme template`}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    loadingStates[template.id] === false ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  onLoad={() => handleImageLoad(template.id)}
                  onError={() => handleImageError(template.id)}
                  priority={index < 4}
                />
              )}
              
              {selectedTemplate?.id === template.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="p-3 bg-white">
              <h3 className="text-sm font-semibold text-center text-gray-900 truncate">
                {template.name}
              </h3>
              <p className="text-xs text-gray-500 text-center mt-1">
                {template.box_count} text area{template.box_count !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Can't find what you're looking for? More templates coming soon! 🎉</p>
      </div>
    </div>
  );
}