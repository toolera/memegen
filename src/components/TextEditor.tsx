'use client';

import { TextBox } from '@/types/meme';

interface TextEditorProps {
  textBoxes: TextBox[];
  onTextBoxChange: (index: number, textBox: TextBox) => void;
  onAddTextBox: () => void;
  onRemoveTextBox: (index: number) => void;
}

export default function TextEditor({
  textBoxes,
  onTextBoxChange,
  onAddTextBox,
  onRemoveTextBox,
}: TextEditorProps) {
  
  const handleChange = (index: number, field: keyof TextBox, value: string | number) => {
    const updated = { ...textBoxes[index], [field]: value };
    onTextBoxChange(index, updated);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onAddTextBox}
        className="w-full btn-primary text-white px-6 py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Add Text Layer</span>
      </button>
      
      <div className="space-y-4">
        {textBoxes.map((textBox, index) => (
          <div key={index} className="bg-gradient-to-r from-slate-50 to-white rounded-2xl p-5 border border-slate-200 shadow-card animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <h4 className="font-semibold text-slate-800">Text Layer {index + 1}</h4>
              </div>
              {textBoxes.length > 1 && (
                <button
                  onClick={() => onRemoveTextBox(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Text Content</label>
                <input
                  type="text"
                  value={textBox.text}
                  onChange={(e) => handleChange(index, 'text', e.target.value)}
                  className="modern-input w-full p-3 rounded-xl border-0 bg-white shadow-sm focus:shadow-md transition-all text-slate-800 font-medium"
                  placeholder="Enter your meme text..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Font Size
                    <span className="ml-2 text-purple-600 font-bold">{textBox.fontSize}px</span>
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="80"
                    value={textBox.fontSize}
                    onChange={(e) => handleChange(index, 'fontSize', parseInt(e.target.value))}
                    className="modern-slider w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Text Color</label>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <input
                        type="color"
                        value={textBox.color}
                        onChange={(e) => handleChange(index, 'color', e.target.value)}
                        className="w-12 h-12 rounded-xl border-2 border-white shadow-card cursor-pointer"
                      />
                      <div className="absolute inset-0 rounded-xl ring-2 ring-slate-200 pointer-events-none"></div>
                    </div>
                    <span className="text-sm font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">{textBox.color}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Font Family</label>
                  <select
                    value={textBox.fontFamily}
                    onChange={(e) => handleChange(index, 'fontFamily', e.target.value)}
                    className="modern-input w-full p-3 rounded-xl bg-white shadow-sm border-0 focus:shadow-md transition-all text-slate-800"
                  >
                    <option value="Impact">Impact (Classic)</option>
                    <option value="Arial">Arial (Clean)</option>
                    <option value="Georgia">Georgia (Serif)</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New (Mono)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Text Alignment</label>
                  <select
                    value={textBox.textAlign}
                    onChange={(e) => handleChange(index, 'textAlign', e.target.value)}
                    className="modern-input w-full p-3 rounded-xl bg-white shadow-sm border-0 focus:shadow-md transition-all text-slate-800"
                  >
                    <option value="left">← Left</option>
                    <option value="center">↔ Center</option>
                    <option value="right">→ Right</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    X Position
                    <span className="ml-2 text-blue-600 font-bold">{Math.round(textBox.x)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="800"
                    value={textBox.x}
                    onChange={(e) => handleChange(index, 'x', parseInt(e.target.value))}
                    className="modern-slider w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Y Position
                    <span className="ml-2 text-blue-600 font-bold">{Math.round(textBox.y)}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="800"
                    value={textBox.y}
                    onChange={(e) => handleChange(index, 'y', parseInt(e.target.value))}
                    className="modern-slider w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}