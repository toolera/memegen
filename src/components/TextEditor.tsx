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
  const handleTextChange = (index: number, field: keyof TextBox, value: string | number) => {
    const updatedTextBox = { ...textBoxes[index], [field]: value };
    onTextBoxChange(index, updatedTextBox);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Text Editor</h3>
        <button
          onClick={onAddTextBox}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Add Text
        </button>
      </div>
      
      <div className="space-y-4">
        {textBoxes.map((textBox, index) => (
          <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Text {index + 1}</h4>
              {textBoxes.length > 1 && (
                <button
                  onClick={() => onRemoveTextBox(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Text</label>
                <input
                  type="text"
                  value={textBox.text}
                  onChange={(e) => handleTextChange(index, 'text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter meme text"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Font Size</label>
                <input
                  type="range"
                  min="12"
                  max="72"
                  value={textBox.fontSize}
                  onChange={(e) => handleTextChange(index, 'fontSize', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 mt-1">{textBox.fontSize}px</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <input
                  type="color"
                  value={textBox.color}
                  onChange={(e) => handleTextChange(index, 'color', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Font Family</label>
                <select
                  value={textBox.fontFamily}
                  onChange={(e) => handleTextChange(index, 'fontFamily', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Arial">Arial</option>
                  <option value="Impact">Impact</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Text Alignment</label>
                <select
                  value={textBox.textAlign}
                  onChange={(e) => handleTextChange(index, 'textAlign', e.target.value as 'left' | 'center' | 'right')}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}