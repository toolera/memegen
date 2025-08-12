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
  }, [template, textBoxes, onCanvasReady]);

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
      <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">Select a meme template to get started</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4">Meme Preview</h3>
      <div className="flex justify-center">
        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-lg">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto"
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: imageLoaded ? 'block' : 'none',
            }}
          />
          {!imageLoaded && (
            <div className="flex items-center justify-center bg-gray-200" style={{ width: 400, height: 300 }}>
              <p className="text-gray-500">Loading image...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}