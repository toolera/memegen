'use client';

import { useRef, useEffect, useState } from 'react';
import { MemeTemplate, TextBox } from '@/types/meme';

interface MemeCanvasProps {
  template: MemeTemplate | null;
  textBoxes: TextBox[];
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

export default function MemeCanvas({ template, textBoxes, onCanvasReady }: MemeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!template || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setLoaded(false);
    setError(false);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      canvas.width = template.width;
      canvas.height = template.height;
      
      ctx.clearRect(0, 0, template.width, template.height);
      ctx.drawImage(img, 0, 0, template.width, template.height);
      
      textBoxes.forEach((textBox) => {
        ctx.font = `bold ${textBox.fontSize}px ${textBox.fontFamily}`;
        ctx.fillStyle = textBox.color;
        ctx.strokeStyle = textBox.color === '#FFFFFF' ? '#000000' : '#FFFFFF';
        ctx.lineWidth = Math.max(2, textBox.fontSize / 15);
        ctx.textAlign = textBox.textAlign;
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';
        
        // Split text into words and wrap them
        const words = textBox.text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const metrics = ctx.measureText(testLine);
          if (metrics.width > textBox.width && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);
        
        // Draw each line
        const lineHeight = textBox.fontSize * 1.2;
        const totalHeight = lines.length * lineHeight;
        const startY = textBox.y - (totalHeight / 2) + (lineHeight / 2);
        
        lines.forEach((line, index) => {
          const y = startY + (index * lineHeight);
          ctx.strokeText(line, textBox.x, y);
          ctx.fillText(line, textBox.x, y);
        });
      });

      setLoaded(true);
      onCanvasReady(canvas);
    };

    img.onerror = () => {
      console.error('Failed to load image:', template.url);
      setError(true);
      setLoaded(false);
    };

    img.src = template.url;
  }, [template, textBoxes, onCanvasReady]);

  if (!template) {
    return (
      <div className="flex items-center justify-center h-80 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl border-2 border-dashed border-slate-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Choose a Template</h3>
          <p className="text-slate-500">Select a meme template to start creating</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="relative inline-block">
        <div className="canvas-container rounded-3xl overflow-hidden p-2">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto rounded-2xl shadow-modern"
            style={{ display: loaded ? 'block' : 'none' }}
          />
          
          {!loaded && !error && (
            <div className="flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl" style={{ width: 400, height: 300 }}>
              <div className="text-center">
                <div className="relative w-12 h-12 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-purple-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-purple-600 border-t-transparent animate-spin"></div>
                </div>
                <h3 className="font-semibold text-slate-700 mb-1">Creating Magic...</h3>
                <p className="text-slate-500 text-sm">Loading your meme template</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 rounded-2xl" style={{ width: 400, height: 300 }}>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="font-semibold text-red-700 mb-1">Oops!</h3>
                <p className="text-red-600 text-sm">Failed to load template</p>
              </div>
            </div>
          )}
        </div>
        
        {loaded && (
          <div className="absolute -bottom-2 -right-2">
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              ✨ Live Preview
            </div>
          </div>
        )}
      </div>
      
      {loaded && (
        <p className="text-slate-600 text-sm mt-4">
          🎯 Your changes update in real-time
        </p>
      )}
    </div>
  );
}