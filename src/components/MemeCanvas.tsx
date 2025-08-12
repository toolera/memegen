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
    
    // Enhanced stroke for better visibility
    const strokeColor = color === '#FFFFFF' || color.toLowerCase() === '#ffffff' ? '#000000' : '#FFFFFF';
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = Math.max(3, fontSize / 8); // Thicker stroke
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
      
      // Always draw stroke first for visibility
      ctx.strokeText(line, textX, lineY);
      
      // Then draw the filled text
      ctx.fillStyle = color;
      ctx.fillText(line, textX, lineY);
    });
  };

  useEffect(() => {
    if (!template || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setImageLoaded(false);
    
    const img = new Image();
    
    // Try different approaches for CORS
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        // Set canvas dimensions
        canvas.width = template.width;
        canvas.height = template.height;
        
        // Clear canvas first
        ctx.clearRect(0, 0, template.width, template.height);
        
        // Draw the background image
        ctx.drawImage(img, 0, 0, template.width, template.height);
        
        // Draw all text boxes
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

    img.onerror = (error) => {
      console.error('Failed to load image:', template.url, error);
      
      // Fallback: try without crossOrigin
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        try {
          canvas.width = template.width;
          canvas.height = template.height;
          ctx.clearRect(0, 0, template.width, template.height);
          ctx.drawImage(fallbackImg, 0, 0, template.width, template.height);
          
          textBoxes.forEach((textBox) => {
            drawText(ctx, textBox);
          });

          setImageLoaded(true);
          onCanvasReady(canvas);
        } catch (fallbackError) {
          console.error('Fallback image loading also failed:', fallbackError);
          // Create a placeholder canvas
          createPlaceholderCanvas(ctx, template);
        }
      };
      
      fallbackImg.onerror = () => {
        console.error('Fallback image also failed');
        createPlaceholderCanvas(ctx, template);
      };
      
      fallbackImg.src = template.url;
    };

    // Load the main image
    img.src = template.url;
  }, [template, textBoxes, onCanvasReady, drawText]);

  const createPlaceholderCanvas = (ctx: CanvasRenderingContext2D, template: MemeTemplate) => {
    const canvas = ctx.canvas;
    canvas.width = template.width;
    canvas.height = template.height;
    
    // Create a placeholder background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, template.width, template.height);
    
    // Add border
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, template.width, template.height);
    
    // Add placeholder text
    ctx.fillStyle = '#666';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(template.name, template.width / 2, template.height / 2 - 20);
    ctx.fillText('(Template Preview)', template.width / 2, template.height / 2 + 20);
    
    // Draw user text boxes
    textBoxes.forEach((textBox) => {
      drawText(ctx, textBox);
    });
    
    setImageLoaded(true);
    onCanvasReady(canvas);
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
    <div className="w-full">
      <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900 text-center">
        Meme Preview
      </h3>
      
      <div className="flex justify-center mb-6">
        <div className="relative border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white max-w-full">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto block"
            style={{
              display: imageLoaded ? 'block' : 'none',
            }}
            aria-label={`Preview of ${template.name} meme with custom text`}
          />
          
          {!imageLoaded && (
            <div 
              className="flex items-center justify-center bg-gray-100" 
              style={{ width: 400, height: 300 }}
              role="status"
              aria-label="Loading meme preview"
            >
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600 font-medium">Generating your meme...</p>
                <p className="text-gray-500 text-sm mt-2">This won&apos;t take long!</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {imageLoaded && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            ✨ Your meme updates in real-time as you edit
          </p>
        </div>
      )}
    </div>
  );
}