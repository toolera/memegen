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
  const [activeStep, setActiveStep] = useState<'template' | 'edit' | 'download'>('template');

  const handleTemplateSelect = (template: MemeTemplate) => {
    setSelectedTemplate(template);
    setTextBoxes(getDefaultTextBoxes(template));
    setActiveStep('edit');
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
      y: selectedTemplate.height * 0.5,
      width: selectedTemplate.width * 0.9,
      height: selectedTemplate.height * 0.15,
      fontSize: Math.max(24, Math.min(48, selectedTemplate.width / 15)),
      color: '#FFFFFF',
      fontFamily: 'Impact',
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
    setActiveStep('download');
  }, []);

  const resetToTemplateSelection = () => {
    setSelectedTemplate(null);
    setTextBoxes([]);
    setCanvas(null);
    setActiveStep('template');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center text-gray-900">
            🎭 MemeGen - Free Meme Generator
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Create viral memes instantly with our easy-to-use generator
          </p>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-center space-x-8">
            <div className={`flex items-center space-x-2 ${activeStep === 'template' ? 'text-blue-600' : selectedTemplate ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                activeStep === 'template' ? 'bg-blue-600 text-white' : 
                selectedTemplate ? 'bg-green-600 text-white' : 
                'bg-gray-200 text-gray-600'
              }`}>1</div>
              <span className="font-medium">Template</span>
            </div>
            
            <div className={`flex items-center space-x-2 ${activeStep === 'edit' ? 'text-blue-600' : canvas ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                activeStep === 'edit' ? 'bg-blue-600 text-white' : 
                canvas ? 'bg-green-600 text-white' : 
                'bg-gray-200 text-gray-600'
              }`}>2</div>
              <span className="font-medium">Edit</span>
            </div>
            
            <div className={`flex items-center space-x-2 ${activeStep === 'download' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                activeStep === 'download' ? 'bg-blue-600 text-white' : 
                'bg-gray-200 text-gray-600'
              }`}>3</div>
              <span className="font-medium">Download</span>
            </div>
          </div>
          
          {selectedTemplate && (
            <div className="text-center mt-4">
              <button
                onClick={resetToTemplateSelection}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded hover:bg-gray-100"
              >
                ← Start Over
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Step 1: Template Selection */}
        {activeStep === 'template' && (
          <div>
            <MemeTemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />
          </div>
        )}

        {/* Step 2: Edit Mode */}
        {activeStep === 'edit' && selectedTemplate && (
          <div className="space-y-8">
            <div>
              <MemeCanvas
                template={selectedTemplate}
                textBoxes={textBoxes}
                onCanvasReady={handleCanvasReady}
              />
            </div>
            <div>
              <TextEditor
                textBoxes={textBoxes}
                onTextBoxChange={handleTextBoxChange}
                onAddTextBox={handleAddTextBox}
                onRemoveTextBox={handleRemoveTextBox}
              />
            </div>
          </div>
        )}

        {/* Step 3: Download */}
        {activeStep === 'download' && selectedTemplate && canvas && (
          <div className="space-y-8">
            <div>
              <MemeCanvas
                template={selectedTemplate}
                textBoxes={textBoxes}
                onCanvasReady={handleCanvasReady}
              />
            </div>
            <div>
              <DownloadShare
                canvas={canvas}
                memeName={selectedTemplate.name}
              />
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-400">
            © 2024 MemeGen - Create and share memes for free!
          </p>
        </div>
      </footer>
    </div>
  );
}