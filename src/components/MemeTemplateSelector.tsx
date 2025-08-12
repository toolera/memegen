'use client';

import Image from 'next/image';
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
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {POPULAR_MEME_TEMPLATES.map((template, index) => (
          <div
            key={template.id}
            className="template-card group cursor-pointer relative"
            onClick={() => onTemplateSelect(template)}
          >
            <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden shadow-card border-2 border-transparent group-hover:border-purple-300 transition-all">
              <Image
                src={template.url}
                alt={template.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={index < 4}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-white text-sm truncate">{template.name}</h3>
                  <p className="text-white/80 text-xs">{template.box_count} text areas</p>
                </div>
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Plus icon */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-slate-500 text-sm">Click any template to get started</p>
      </div>
    </div>
  );
}