'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface MemeTemplate {
  id: number;
  name: string;
  url: string;
  width: number;
  height: number;
}

const MEME_TEMPLATES: MemeTemplate[] = [
  { id: 1, name: 'Drake', url: 'https://i.imgflip.com/30b1gx.jpg', width: 300, height: 300 },
  { id: 2, name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg', width: 400, height: 300 },
  { id: 3, name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg', width: 400, height: 300 },
  { id: 4, name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg', width: 400, height: 300 },
  { id: 5, name: 'Woman Yelling at Cat', url: 'https://i.imgflip.com/345v97.jpg', width: 400, height: 300 },
  { id: 6, name: 'Mocking SpongeBob', url: 'https://i.imgflip.com/1otk96.jpg', width: 400, height: 300 },
];

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!selectedTemplate || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      canvas.width = selectedTemplate.width;
      canvas.height = selectedTemplate.height;
      
      ctx.drawImage(img, 0, 0, selectedTemplate.width, selectedTemplate.height);
      
      // Draw text
      ctx.font = 'bold 30px Impact';
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      
      // Top text
      if (topText) {
        ctx.fillText(topText, canvas.width / 2, 40);
        ctx.strokeText(topText, canvas.width / 2, 40);
      }
      
      // Bottom text
      if (bottomText) {
        ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
        ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);
      }
    };

    img.src = selectedTemplate.url;
  }, [selectedTemplate, topText, bottomText]);

  const downloadMeme = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `meme-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white mb-2">🔥 MEME MAKER 🔥</h1>
          <p className="text-white/80 text-lg">Create viral memes in seconds!</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Left: Templates & Controls */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Choose Template</h2>
                <div className="grid grid-cols-3 gap-3">
                  {MEME_TEMPLATES.map((template) => (
                    <div
                      key={template.id}
                      className={`cursor-pointer rounded-xl overflow-hidden transform hover:scale-105 transition-all ${
                        selectedTemplate?.id === template.id 
                          ? 'ring-4 ring-yellow-400 shadow-lg' 
                          : 'hover:shadow-lg'
                      }`}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <div className="relative w-full h-20">
                        <Image
                          src={template.url}
                          alt={template.name}
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm p-2">
                        <p className="text-white text-xs font-semibold text-center truncate">
                          {template.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTemplate && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">Add Your Text</h3>
                  
                  <input
                    type="text"
                    placeholder="Top text..."
                    value={topText}
                    onChange={(e) => setTopText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-semibold"
                  />
                  
                  <input
                    type="text"
                    placeholder="Bottom text..."
                    value={bottomText}
                    onChange={(e) => setBottomText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-semibold"
                  />

                  <button
                    onClick={downloadMeme}
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-4 px-6 rounded-xl hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all shadow-lg"
                  >
                    🚀 DOWNLOAD MEME
                  </button>
                </div>
              )}
            </div>

            {/* Right: Preview */}
            <div className="flex flex-col items-center justify-center">
              <h3 className="text-xl font-bold text-white mb-4">Preview</h3>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/20">
                {selectedTemplate ? (
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto rounded-xl shadow-lg"
                  />
                ) : (
                  <div className="w-80 h-60 flex items-center justify-center border-2 border-dashed border-white/30 rounded-xl">
                    <div className="text-center text-white/60">
                      <div className="text-4xl mb-2">🎨</div>
                      <p>Select a template to start</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8 text-white/60">
          <p>Made with ❤️ for meme lovers everywhere</p>
        </div>
      </div>
    </div>
  );
}