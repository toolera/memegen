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
    
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'middle';
    
    const strokeColor = color === '#FFFFFF' || color.toLowerCase() === '#ffffff' ? '#000000' : '#FFFFFF';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = Math.max(3, fontSize / 8);
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    
    const lines = wrapText(ctx, text, textBox.width);
    const lineHeight = fontSize * 1.3;
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
      
      ctx.strokeText(line, textX, lineY);
      ctx.fillStyle = color;
      ctx.fillText(line, textX, lineY);
    });
  };

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

  useEffect(() => {
    if (!template || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setImageLoaded(false);
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        canvas.width = template.width;
        canvas.height = template.height;
        ctx.clearRect(0, 0, template.width, template.height);
        ctx.drawImage(img, 0, 0, template.width, template.height);
        
        textBoxes.forEach((textBox) => {
          drawText(ctx, textBox);
        });

        setImageLoaded(true);
        onCanvasReady(canvas);
      } catch (error) {
        console.error('Error drawing to canvas:', error);
        setImageLoaded(false);
      }
    };

    img.onerror = () => {
      console.error('Failed to load image:', template.url);
      createPlaceholderCanvas(ctx, template);
    };

    img.src = template.url;
  }, [template, textBoxes, onCanvasReady]);

  const createPlaceholderCanvas = (ctx: CanvasRenderingContext2D, template: MemeTemplate) => {
    const canvas = ctx.canvas;
    canvas.width = template.width;
    canvas.height = template.height;
    
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, template.width, template.height);
    
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, template.width, template.height);
    
    ctx.fillStyle = '#666';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(template.name, template.width / 2, template.height / 2 - 20);
    ctx.fillText('(Template Preview)', template.width / 2, template.height / 2 + 20);
    
    textBoxes.forEach((textBox) => {
      drawText(ctx, textBox);
    });
    
    setImageLoaded(true);
    onCanvasReady(canvas);
  };

  if (!template) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-lg font-medium">Select a meme template to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Meme Preview
      </h3>
      
      <div className="inline-block border border-gray-300 rounded-lg overflow-hidden bg-white">
        {!imageLoaded && (
          <div 
            className="flex items-center justify-center bg-gray-100" 
            style={{ width: 400, height: 300 }}
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4 mx-auto"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto"
          style={{
            display: imageLoaded ? 'block' : 'none',
          }}
        />
      </div>
      
      {imageLoaded && (
        <p className="text-sm text-gray-600 mt-4">
          ✨ Your meme updates in real-time
        </p>
      )}
    </div>
  );
}