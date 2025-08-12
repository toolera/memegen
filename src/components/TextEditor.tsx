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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Text Editor
        </h3>
        <button
          onClick={onAddTextBox}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          + Add Text
        </button>
      </div>
      
      <div className="space-y-6">
        {textBoxes.map((textBox, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg p-4 bg-white"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-900">
                Text {index + 1}
              </h4>
              {textBoxes.length > 1 && (
                <button
                  onClick={() => onRemoveTextBox(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Text Content
                </label>
                <input
                  type="text"
                  value={textBox.text}
                  onChange={(e) => handleTextChange(index, 'text', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your text here..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size: {textBox.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="72"
                    value={textBox.fontSize}
                    onChange={(e) => handleTextChange(index, 'fontSize', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={textBox.color}
                      onChange={(e) => handleTextChange(index, 'color', e.target.value)}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <span className="text-sm text-gray-600">{textBox.color}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    value={textBox.fontFamily}
                    onChange={(e) => handleTextChange(index, 'fontFamily', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Impact">Impact</option>
                    <option value="Arial">Arial</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Alignment
                  </label>
                  <select
                    value={textBox.textAlign}
                    onChange={(e) => handleTextChange(index, 'textAlign', e.target.value as 'left' | 'center' | 'right')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}