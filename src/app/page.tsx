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
    setCanvas(null);
  };

  const handleTextBoxChange = (index: number, textBox: TextBox) => {
    const newTextBoxes = [...textBoxes];
    newTextBoxes[index] = textBox;
    setTextBoxes(newTextBoxes);
  };

  const handleAddTextBox = () => {
    if (!selectedTemplate) return;
    const newTextBox: TextBox = {
      text: 'NEW TEXT',
      x: selectedTemplate.width * 0.5,
      y: selectedTemplate.height * 0.8,
      width: selectedTemplate.width * 0.8,
      height: selectedTemplate.height * 0.15,
      fontSize: Math.min(40, selectedTemplate.width / 10),
      color: '#FFFFFF',
      fontFamily: 'Impact',
      textAlign: 'center',
    };
    setTextBoxes([...textBoxes, newTextBox]);
  };

  const handleRemoveTextBox = (index: number) => {
    setTextBoxes(textBoxes.filter((_, i) => i !== index));
  };

  const handleCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    setCanvas(canvas);
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">Meme Generator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <MemeTemplateSelector
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect}
          />
          
          {selectedTemplate && textBoxes.length > 0 && (
            <TextEditor
              textBoxes={textBoxes}
              onTextBoxChange={handleTextBoxChange}
              onAddTextBox={handleAddTextBox}
              onRemoveTextBox={handleRemoveTextBox}
            />
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {selectedTemplate && (
            <>
              <MemeCanvas
                template={selectedTemplate}
                textBoxes={textBoxes}
                onCanvasReady={handleCanvasReady}
              />
              
              {canvas && (
                <DownloadShare
                  canvas={canvas}
                  memeName={selectedTemplate.name}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}