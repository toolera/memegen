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
        link.download = `${memeName.replace(/\s+/g, '-').toLowerCase()}-meme.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
      setDownloading(false);
    }, 'image/png');
  };

  const copyToClipboard = async () => {
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && ClipboardItem) {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          alert('Meme copied to clipboard!');
        } else {
          alert('Clipboard not supported - use download instead');
        }
      }, 'image/png');
    } catch (error) {
      alert('Failed to copy - use download instead');
    }
  };

  if (!canvas) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-4 text-green-800">Ready to Download!</h3>
      
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={downloadMeme}
          disabled={downloading}
          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
        >
          {downloading ? 'Downloading...' : '⬇️ Download PNG'}
        </button>
        
        <button
          onClick={copyToClipboard}
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          📋 Copy to Clipboard
        </button>
      </div>
      
      <p className="text-sm text-green-700 mt-3">
        Your meme is ready! Download it or copy to clipboard to share.
      </p>
    </div>
  );
}