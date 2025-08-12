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

  useEffect(() => {
    if (!template || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
        ctx.lineWidth = 3;
        ctx.textAlign = textBox.textAlign;
        ctx.textBaseline = 'middle';
        
        const lines = textBox.text.split(' ');
        lines.forEach((line, index) => {
          const y = textBox.y + (index * textBox.fontSize * 1.2);
          ctx.strokeText(line, textBox.x, y);
          ctx.fillText(line, textBox.x, y);
        });
      });

      setLoaded(true);
      onCanvasReady(canvas);
    };

    img.src = template.url;
  }, [template, textBoxes, onCanvasReady]);

  if (!template) {
    return <div className="p-8 bg-gray-100 text-center">Select a template</div>;
  }

  return (
    <div className="text-center">
      <h3 className="text-lg font-bold mb-4">Preview</h3>
      <canvas
        ref={canvasRef}
        className="border max-w-full h-auto"
        style={{ display: loaded ? 'block' : 'none' }}
      />
      {!loaded && (
        <div className="p-8 bg-gray-100">Loading...</div>
      )}
    </div>
  );
}