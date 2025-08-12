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
    const defaultTextBoxes = getDefaultTextBoxes(template);
    setTextBoxes(defaultTextBoxes);
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
      text: 'Add your text here',
      x: selectedTemplate.width * 0.5,
      y: selectedTemplate.height * 0.5,
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

  const resetTemplate = () => {
    setSelectedTemplate(null);
    setTextBoxes([]);
    setCanvas(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Meme Generator</h1>
          <p className="text-gray-600">Create hilarious memes in seconds!</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Column 1: Template Selection */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">1. Choose Template</h2>
                {selectedTemplate && (
                  <button 
                    onClick={resetTemplate}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Change Template
                  </button>
                )}
              </div>
              
              {selectedTemplate ? (
                <div className="text-center">
                  <div className="inline-block border rounded-lg overflow-hidden mb-3">
                    <img 
                      src={selectedTemplate.url} 
                      alt={selectedTemplate.name}
                      className="w-32 h-32 object-cover"
                    />
                  </div>
                  <p className="font-medium text-gray-900">{selectedTemplate.name}</p>
                  <p className="text-sm text-gray-500">Selected</p>
                </div>
              ) : (
                <MemeTemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateSelect={handleTemplateSelect}
                />
              )}
            </div>

            {/* Text Editor */}
            {selectedTemplate && (
              <div className="bg-white rounded-lg shadow-sm border p-4 mt-4">
                <h2 className="text-xl font-bold mb-4">2. Add/Edit Text</h2>
                <TextEditor
                  textBoxes={textBoxes}
                  onTextBoxChange={handleTextBoxChange}
                  onAddTextBox={handleAddTextBox}
                  onRemoveTextBox={handleRemoveTextBox}
                />
              </div>
            )}
          </div>

          {/* Column 2: Preview */}
          {selectedTemplate && (
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-xl font-bold mb-4">3. Preview</h2>
                <MemeCanvas
                  template={selectedTemplate}
                  textBoxes={textBoxes}
                  onCanvasReady={handleCanvasReady}
                />
              </div>
            </div>
          )}

          {/* Column 3: Download */}
          {canvas && (
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-xl font-bold mb-4">4. Download</h2>
                <DownloadShare
                  canvas={canvas}
                  memeName={selectedTemplate!.name}
                />
              </div>
            </div>
          )}

        </div>

        {/* Instructions for mobile/smaller screens */}
        {!selectedTemplate && (
          <div className="mt-8 text-center">
            <div className="inline-block bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">How it works:</h3>
              <div className="text-blue-800 space-y-1">
                <p>1. Choose a meme template above</p>
                <p>2. Add and customize your text</p>
                <p>3. See live preview</p>
                <p>4. Download your meme!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}