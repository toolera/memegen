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
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Choose a Meme Template</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {POPULAR_MEME_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200 hover:scale-105 ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 shadow-lg'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => onTemplateSelect(template)}
          >
            <div className="relative aspect-square">
              <Image
                src={template.url}
                alt={template.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            </div>
            <div className="p-2 bg-white">
              <h3 className="text-sm font-medium text-center truncate">
                {template.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}