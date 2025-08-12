'use client';

import { useState, useCallback } from 'react';
import MemeTemplateSelector from '@/components/MemeTemplateSelector';
import TextEditor from '@/components/TextEditor';
import MemeCanvas from '@/components/MemeCanvas';
import DownloadShare from '@/components/DownloadShare';
import { MemeTemplate, TextBox } from '@/types/meme';
import { getDefaultTextBoxes } from '@/data/memeTemplates';

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const handleTemplateSelect = (template: MemeTemplate) => {
    setSelectedTemplate(template);
    setTextBoxes(getDefaultTextBoxes(template));
  };

  const handleTextBoxChange = (index: number, textBox: TextBox) => {
    const newTextBoxes = [...textBoxes];
    newTextBoxes[index] = textBox;
    setTextBoxes(newTextBoxes);
  };

  const handleAddTextBox = () => {
    if (!selectedTemplate) return;
    
    const newTextBox: TextBox = {
      text: 'New text',
      x: selectedTemplate.width * 0.5,
      y: selectedTemplate.height * 0.5,
      width: selectedTemplate.width * 0.8,
      height: selectedTemplate.height * 0.1,
      fontSize: Math.max(20, Math.min(40, selectedTemplate.width / 25)),
      color: '#FFFFFF',
      fontFamily: 'Arial',
      textAlign: 'center',
    };
    
    setTextBoxes([...textBoxes, newTextBox]);
  };

  const handleRemoveTextBox = (index: number) => {
    const newTextBoxes = textBoxes.filter((_, i) => i !== index);
    setTextBoxes(newTextBoxes);
  };

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    setCanvas(canvas);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <h1 className="text-3xl font-bold text-gray-900">
              🎭 Meme Generator
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <MemeTemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />
            
            {selectedTemplate && (
              <TextEditor
                textBoxes={textBoxes}
                onTextBoxChange={handleTextBoxChange}
                onAddTextBox={handleAddTextBox}
                onRemoveTextBox={handleRemoveTextBox}
              />
            )}
          </div>

          <div className="space-y-8">
            <MemeCanvas
              template={selectedTemplate}
              textBoxes={textBoxes}
              onCanvasReady={handleCanvasReady}
            />
            
            {selectedTemplate && (
              <DownloadShare
                canvas={canvas}
                memeName={selectedTemplate.name}
              />
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <p className="text-gray-600 text-sm">
              Built with Next.js and deployed on Vercel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}