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
  const [imageLoaded, setImageLoaded] = useState(false);

  const drawText = (ctx: CanvasRenderingContext2D, textBox: TextBox) => {
    const { text, x, y, fontSize, color, fontFamily, textAlign } = textBox;
    
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'middle';
    
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = Math.max(1, fontSize / 15);
    
    const lines = wrapText(ctx, text, textBox.width);
    const lineHeight = fontSize * 1.2;
    const totalHeight = lines.length * lineHeight;
    const startY = y - totalHeight / 2;
    
    lines.forEach((line, index) => {
      const lineY = startY + (index + 0.5) * lineHeight;
      let textX = x;
      
      if (textAlign === 'left') {
        textX = x - textBox.width / 2;
      } else if (textAlign === 'right') {
        textX = x + textBox.width / 2;
      }
      
      if (color !== '#FFFFFF') {
        ctx.strokeText(line, textX, lineY);
      }
      ctx.fillText(line, textX, lineY);
    });
  };

  useEffect(() => {
    if (!template || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setImageLoaded(true);
      canvas.width = template.width;
      canvas.height = template.height;
      
      ctx.drawImage(img, 0, 0, template.width, template.height);
      
      textBoxes.forEach((textBox) => {
        drawText(ctx, textBox);
      });

      onCanvasReady(canvas);
    };

    img.onerror = () => {
      console.error('Failed to load image:', template.url);
      setImageLoaded(false);
    };

    img.src = template.url;
  }, [template, textBoxes, onCanvasReady, drawText]);

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  if (!template) {
    return (
      <div 
        className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50"
        role="status"
        aria-label="Waiting for template selection"
      >
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-lg font-medium">Select a meme template to get started</p>
          <p className="text-gray-400 text-sm mt-2">Your meme preview will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" role="region" aria-labelledby="canvas-heading">
      <h3 id="canvas-heading" className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900">
        Meme Preview
      </h3>
      <div className="flex justify-center">
        <div className="relative border border-gray-200 rounded-xl overflow-hidden shadow-xl bg-white">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto block"
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: imageLoaded ? 'block' : 'none',
            }}
            aria-label={`Preview of ${template.name} meme with custom text`}
          />
          
          {!imageLoaded && (
            <div 
              className="flex items-center justify-center bg-gray-100 animate-pulse" 
              style={{ width: Math.min(400, window.innerWidth - 32), height: 300 }}
              role="status"
              aria-live="polite"
              aria-label="Loading meme preview"
            >
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600 font-medium">Generating your meme...</p>
                <p className="text-gray-500 text-sm mt-2">This won&apos;t take long!</p>
              </div>
            </div>
          )}
          
          {imageLoaded && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              Live Preview
            </div>
          )}
        </div>
      </div>
      
      {imageLoaded && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            ✨ Looking good! Your meme updates in real-time as you edit.
          </p>
        </div>
      )}
    </div>
  );
}