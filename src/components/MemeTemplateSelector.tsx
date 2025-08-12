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
      <h2 className="text-xl font-bold mb-4">Choose a Template</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {POPULAR_MEME_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="border rounded p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => onTemplateSelect(template)}
          >
            <div className="relative aspect-square bg-gray-200 mb-2">
              <Image
                src={template.url}
                alt={template.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-center font-medium">{template.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}