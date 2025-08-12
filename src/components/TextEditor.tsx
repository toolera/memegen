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
    <div>
      <div className="mb-4">
        <button
          onClick={onAddTextBox}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
        >
          + Add New Text
        </button>
      </div>
      
      {textBoxes.map((textBox, index) => (
        <div key={index} className="border rounded p-4 mb-4 bg-gray-50">
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
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Text</label>
              <input
                type="text"
                value={textBox.text}
                onChange={(e) => handleChange(index, 'text', e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Font Size: {textBox.fontSize}px
                </label>
                <input
                  type="range"
                  min="16"
                  max="80"
                  value={textBox.fontSize}
                  onChange={(e) => handleChange(index, 'fontSize', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textBox.color}
                    onChange={(e) => handleChange(index, 'color', e.target.value)}
                    className="w-12 h-10 rounded border"
                  />
                  <span className="text-sm font-mono">{textBox.color}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Font</label>
                <select
                  value={textBox.fontFamily}
                  onChange={(e) => handleChange(index, 'fontFamily', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Impact">Impact</option>
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Align</label>
                <select
                  value={textBox.textAlign}
                  onChange={(e) => handleChange(index, 'textAlign', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  X Position: {Math.round(textBox.x)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="800"
                  value={textBox.x}
                  onChange={(e) => handleChange(index, 'x', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Y Position: {Math.round(textBox.y)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="800"
                  value={textBox.y}
                  onChange={(e) => handleChange(index, 'y', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}