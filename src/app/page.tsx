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
  const [step, setStep] = useState<'template' | 'edit' | 'download'>('template');

  const handleTemplateSelect = (template: MemeTemplate) => {
    setSelectedTemplate(template);
    setTextBoxes(getDefaultTextBoxes(template));
    setStep('edit');
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
    setStep('download');
  }, []);

  const resetToStart = () => {
    setSelectedTemplate(null);
    setTextBoxes([]);
    setCanvas(null);
    setStep('template');
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-8">Meme Generator</h1>
      
      {step === 'template' && (
        <MemeTemplateSelector
          selectedTemplate={selectedTemplate}
          onTemplateSelect={handleTemplateSelect}
        />
      )}

      {step === 'edit' && selectedTemplate && (
        <div>
          <button 
            onClick={resetToStart}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ← Back to Templates
          </button>
          
          <MemeCanvas
            template={selectedTemplate}
            textBoxes={textBoxes}
            onCanvasReady={handleCanvasReady}
          />
          
          <div className="mt-8">
            <TextEditor
              textBoxes={textBoxes}
              onTextBoxChange={handleTextBoxChange}
              onAddTextBox={handleAddTextBox}
              onRemoveTextBox={handleRemoveTextBox}
            />
          </div>
        </div>
      )}

      {step === 'download' && selectedTemplate && canvas && (
        <div>
          <button 
            onClick={resetToStart}
            className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            ← Start Over
          </button>
          
          <MemeCanvas
            template={selectedTemplate}
            textBoxes={textBoxes}
            onCanvasReady={handleCanvasReady}
          />
          
          <div className="mt-8">
            <DownloadShare
              canvas={canvas}
              memeName={selectedTemplate.name}
            />
          </div>
        </div>
      )}
    </div>
  );
}