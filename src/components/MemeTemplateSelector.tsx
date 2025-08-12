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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
        Choose a Meme Template
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {POPULAR_MEME_TEMPLATES.map((template, index) => (
          <div
            key={template.id}
            className={`
              cursor-pointer border-2 rounded-lg overflow-hidden transition-all
              ${selectedTemplate?.id === template.id
                ? 'border-blue-500 shadow-lg'
                : errorStates[template.id]
                ? 'border-red-300 opacity-50'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
              }
            `}
            onClick={() => !errorStates[template.id] && onTemplateSelect(template)}
          >
            <div className="relative aspect-square bg-gray-100">
              {loadingStates[template.id] !== false && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
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
                  className={`object-cover transition-opacity ${
                    loadingStates[template.id] === false ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
              <h3 className="text-sm font-semibold text-center text-gray-900">
                {template.name}
              </h3>
              <p className="text-xs text-gray-500 text-center mt-1">
                {template.box_count} text area{template.box_count !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}