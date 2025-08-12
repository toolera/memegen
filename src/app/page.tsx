'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MemeTemplate, TextBox } from '@/types/meme';
import { POPULAR_MEME_TEMPLATES, getDefaultTextBoxes } from '@/data/memeTemplates';

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle template selection
  const handleTemplateSelect = (template: MemeTemplate) => {
    setSelectedTemplate(template);
    const defaultTextBoxes = getDefaultTextBoxes(template);
    setTextBoxes(defaultTextBoxes);
  };

  // Handle text changes
  const handleTextChange = (index: number, field: keyof TextBox, value: string | number) => {
    const newTextBoxes = [...textBoxes];
    newTextBoxes[index] = { ...newTextBoxes[index], [field]: value };
    setTextBoxes(newTextBoxes);
  };

  // Add new text box
  const addTextBox = () => {
    if (!selectedTemplate) return;
    const newTextBox: TextBox = {
      text: 'New Text',
      x: selectedTemplate.width * 0.5,
      y: selectedTemplate.height * 0.7,
      width: selectedTemplate.width * 0.8,
      height: selectedTemplate.height * 0.15,
      fontSize: 32,
      color: '#FFFFFF',
      fontFamily: 'Impact',
      textAlign: 'center',
    };
    setTextBoxes([...textBoxes, newTextBox]);
  };

  // Remove text box
  const removeTextBox = (index: number) => {
    setTextBoxes(textBoxes.filter((_, i) => i !== index));
  };

  // Draw canvas
  useEffect(() => {
    if (!selectedTemplate || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = selectedTemplate.width;
      canvas.height = selectedTemplate.height;
      
      ctx.clearRect(0, 0, selectedTemplate.width, selectedTemplate.height);
      ctx.drawImage(img, 0, 0, selectedTemplate.width, selectedTemplate.height);
      
      // Draw text
      textBoxes.forEach((textBox) => {
        ctx.font = `bold ${textBox.fontSize}px ${textBox.fontFamily}`;
        ctx.fillStyle = textBox.color;
        ctx.strokeStyle = textBox.color === '#FFFFFF' ? '#000000' : '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.textAlign = textBox.textAlign;
        ctx.textBaseline = 'middle';
        
        const words = textBox.text.split(' ');
        const lines = [];
        let currentLine = words[0] || '';
        
        for (let i = 1; i < words.length; i++) {
          const testLine = currentLine + ' ' + words[i];
          const metrics = ctx.measureText(testLine);
          if (metrics.width > textBox.width && currentLine) {
            lines.push(currentLine);
            currentLine = words[i];
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);
        
        const lineHeight = textBox.fontSize * 1.2;
        const startY = textBox.y - (lines.length * lineHeight) / 2;
        
        lines.forEach((line, index) => {
          const y = startY + (index * lineHeight);
          ctx.strokeText(line, textBox.x, y);
          ctx.fillText(line, textBox.x, y);
        });
      });

      setImageLoaded(true);
      setCanvas(canvas);
    };

    img.src = selectedTemplate.url;
  }, [selectedTemplate, textBoxes]);

  // Download meme
  const downloadMeme = () => {
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `meme-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Meme Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Templates */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">1. Choose Template</h2>
            <div className="grid grid-cols-2 gap-3">
              {POPULAR_MEME_TEMPLATES.map((template) => (
                <div
                  key={template.id}
                  className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                    selectedTemplate?.id === template.id ? 'border-blue-500' : 'border-gray-200'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="aspect-square relative bg-gray-200">
                    <Image
                      src={template.url}
                      alt={template.name}
                      fill
                      className="object-cover"
                      sizes="150px"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <p className="text-sm font-medium truncate">{template.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">2. Preview</h2>
            <div className="flex justify-center">
              {selectedTemplate ? (
                <div className="border rounded-lg overflow-hidden bg-gray-100">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto"
                    style={{ display: imageLoaded ? 'block' : 'none' }}
                  />
                  {!imageLoaded && (
                    <div className="flex items-center justify-center w-80 h-60">
                      <p>Loading...</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center w-80 h-60 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">Select a template</p>
                </div>
              )}
            </div>
          </div>

          {/* Editor */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">3. Edit & Download</h2>
            
            {selectedTemplate && (
              <div className="space-y-4">
                <button
                  onClick={addTextBox}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  Add Text
                </button>
                
                {textBoxes.map((textBox, index) => (
                  <div key={index} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Text {index + 1}</span>
                      {textBoxes.length > 1 && (
                        <button
                          onClick={() => removeTextBox(index)}
                          className="text-red-500 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={textBox.text}
                        onChange={(e) => handleTextChange(index, 'text', e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter text"
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm">Size: {textBox.fontSize}</label>
                          <input
                            type="range"
                            min="16"
                            max="72"
                            value={textBox.fontSize}
                            onChange={(e) => handleTextChange(index, 'fontSize', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-sm">Color</label>
                          <input
                            type="color"
                            value={textBox.color}
                            onChange={(e) => handleTextChange(index, 'color', e.target.value)}
                            className="w-full h-8 rounded border"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-sm">X: {Math.round(textBox.x)}</label>
                          <input
                            type="range"
                            min="0"
                            max="800"
                            value={textBox.x}
                            onChange={(e) => handleTextChange(index, 'x', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="text-sm">Y: {Math.round(textBox.y)}</label>
                          <input
                            type="range"
                            min="0"
                            max="800"
                            value={textBox.y}
                            onChange={(e) => handleTextChange(index, 'y', parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <select
                        value={textBox.fontFamily}
                        onChange={(e) => handleTextChange(index, 'fontFamily', e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="Impact">Impact</option>
                        <option value="Arial">Arial</option>
                        <option value="Georgia">Georgia</option>
                      </select>
                    </div>
                  </div>
                ))}
                
                {canvas && (
                  <button
                    onClick={downloadMeme}
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 font-bold"
                  >
                    Download Meme
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}