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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              MemeGen AI
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Create viral memes in seconds with our powerful editor. Professional quality, zero effort.
            </p>
          </div>
          
          {/* Progress Steps */}
          <div className="flex justify-center items-center space-x-8 mt-8 animate-slide-in">
            <div className={`progress-step flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${!selectedTemplate ? 'active' : 'completed'}`}>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">1</div>
              <span>Choose</span>
            </div>
            <div className={`h-px w-12 ${selectedTemplate ? 'bg-gradient-to-r from-purple-400 to-blue-400' : 'bg-slate-300'}`}></div>
            <div className={`progress-step flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${selectedTemplate && !canvas ? 'active' : canvas ? 'completed' : 'text-slate-400'}`}>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">2</div>
              <span>Create</span>
            </div>
            <div className={`h-px w-12 ${canvas ? 'bg-gradient-to-r from-green-400 to-emerald-400' : 'bg-slate-300'}`}></div>
            <div className={`progress-step flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${canvas ? 'active' : 'text-slate-400'}`}>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">3</div>
              <span>Download</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Column 1: Template Selection */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-modern border border-white/20 p-6 animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Templates</h2>
                  <p className="text-slate-500 text-sm">Choose your perfect meme template</p>
                </div>
                {selectedTemplate && (
                  <button 
                    onClick={resetTemplate}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium px-3 py-1 rounded-full hover:bg-purple-50 transition-all"
                  >
                    ← Change
                  </button>
                )}
              </div>
              
              {selectedTemplate ? (
                <div className="text-center animate-fade-in">
                  <div className="inline-block relative">
                    <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-card mb-4 ring-4 ring-purple-200">
                      <img 
                        src={selectedTemplate.url} 
                        alt={selectedTemplate.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">{selectedTemplate.name}</h3>
                  <p className="text-slate-500 text-sm">Selected template</p>
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
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-modern border border-white/20 p-6 animate-slide-in">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Text Editor</h2>
                  <p className="text-slate-500 text-sm">Customize your meme text</p>
                </div>
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
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-modern border border-white/20 p-6 animate-scale-in">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Live Preview</h2>
                  <p className="text-slate-500 text-sm">See your meme come to life</p>
                </div>
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
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-modern border border-green-200 p-6 animate-fade-in">
                <div className="mb-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-1">Ready to Share!</h2>
                  <p className="text-slate-600 text-sm">Your meme is ready for the world</p>
                </div>
                <DownloadShare
                  canvas={canvas}
                  memeName={selectedTemplate!.name}
                />
              </div>
            </div>
          )}

        </div>

        {/* Getting Started */}
        {!selectedTemplate && (
          <div className="mt-16 text-center animate-fade-in">
            <div className="inline-block glass rounded-3xl p-8 max-w-2xl">
              <h3 className="text-2xl font-bold text-slate-800 mb-4">Ready to create your first meme?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <h4 className="font-semibold text-slate-700">Pick Template</h4>
                  <p className="text-slate-500 text-sm">Choose from our viral meme collection</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <h4 className="font-semibold text-slate-700">Add Text</h4>
                  <p className="text-slate-500 text-sm">Customize with your hilarious content</p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-green-400 rounded-xl flex items-center justify-center mx-auto">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <h4 className="font-semibold text-slate-700">Go Viral</h4>
                  <p className="text-slate-500 text-sm">Download and share your masterpiece</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}