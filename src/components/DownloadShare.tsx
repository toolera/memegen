'use client';

import { useState } from 'react';

interface DownloadShareProps {
  canvas: HTMLCanvasElement | null;
  memeName: string;
}

export default function DownloadShare({ canvas, memeName }: DownloadShareProps) {
  const [downloading, setDownloading] = useState(false);

  const downloadMeme = () => {
    if (!canvas) return;

    setDownloading(true);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${memeName}-meme.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
      setDownloading(false);
    }, 'image/png');
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">Download Your Meme</h3>
      
      <button
        onClick={downloadMeme}
        disabled={!canvas || downloading}
        className="px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {downloading ? 'Downloading...' : 'Download PNG'}
      </button>
      
      <p className="text-sm text-gray-600 mt-4">
        Click the button above to download your meme as a PNG file.
      </p>
    </div>
  );
}