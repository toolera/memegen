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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center sm:text-left">
          Text Editor
        </h3>
        <button
          onClick={onAddTextBox}
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
          aria-label="Add new text box to meme"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Text</span>
        </button>
      </div>
      
      <div className="space-y-6">
        {textBoxes.map((textBox, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            role="listitem"
            aria-labelledby={`textbox-${index}-heading`}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 id={`textbox-${index}-heading`} className="font-semibold text-gray-900 text-lg">
                Text {index + 1}
              </h4>
              {textBoxes.length > 1 && (
                <button
                  onClick={() => onRemoveTextBox(index)}
                  className="text-red-500 hover:text-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg px-3 py-1 text-sm font-medium transition-all duration-200"
                  aria-label={`Remove text box ${index + 1}`}
                >
                  <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label 
                  htmlFor={`text-input-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Text Content
                </label>
                <input
                  id={`text-input-${index}`}
                  type="text"
                  value={textBox.text}
                  onChange={(e) => handleTextChange(index, 'text', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your meme text here..."
                  aria-describedby={`text-help-${index}`}
                />
                <p id={`text-help-${index}`} className="text-xs text-gray-500 mt-1">
                  This text will appear on your meme
                </p>
              </div>
              
              <div>
                <label 
                  htmlFor={`font-size-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Font Size: <span className="font-normal text-blue-600">{textBox.fontSize}px</span>
                </label>
                <input
                  id={`font-size-${index}`}
                  type="range"
                  min="12"
                  max="72"
                  value={textBox.fontSize}
                  onChange={(e) => handleTextChange(index, 'fontSize', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  aria-valuemin={12}
                  aria-valuemax={72}
                  aria-valuenow={textBox.fontSize}
                  aria-label={`Font size for text ${index + 1}`}
                />
              </div>
              
              <div>
                <label 
                  htmlFor={`text-color-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Text Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    id={`text-color-${index}`}
                    type="color"
                    value={textBox.color}
                    onChange={(e) => handleTextChange(index, 'color', e.target.value)}
                    className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    aria-label={`Color for text ${index + 1}`}
                  />
                  <span className="text-sm text-gray-600 font-mono">{textBox.color}</span>
                </div>
              </div>
              
              <div>
                <label 
                  htmlFor={`font-family-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Font Family
                </label>
                <select
                  id={`font-family-${index}`}
                  value={textBox.fontFamily}
                  onChange={(e) => handleTextChange(index, 'fontFamily', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Impact">Impact (Classic)</option>
                  <option value="Arial">Arial (Clean)</option>
                  <option value="Georgia">Georgia (Serif)</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New (Mono)</option>
                </select>
              </div>
              
              <div>
                <label 
                  htmlFor={`text-align-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Text Alignment
                </label>
                <select
                  id={`text-align-${index}`}
                  value={textBox.textAlign}
                  onChange={(e) => handleTextChange(index, 'textAlign', e.target.value as 'left' | 'center' | 'right')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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