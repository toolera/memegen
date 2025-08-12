'use client';

import { useState } from 'react';

interface DownloadShareProps {
  canvas: HTMLCanvasElement | null;
  memeName: string;
}

export default function DownloadShare({ canvas, memeName }: DownloadShareProps) {
  const [downloading, setDownloading] = useState(false);
  const [copying, setCopying] = useState(false);

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

    setCopying(true);
    
    try {
      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && ClipboardItem) {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          setCopying(false);
          // Show success feedback
          const btn = document.getElementById('copy-btn');
          if (btn) {
            btn.classList.add('bg-green-500');
            setTimeout(() => btn.classList.remove('bg-green-500'), 2000);
          }
        } else {
          throw new Error('Clipboard not supported');
        }
      }, 'image/png');
    } catch (error) {
      setCopying(false);
      alert('Clipboard not supported - please use download instead');
    }
  };

  if (!canvas) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={downloadMeme}
          disabled={downloading}
          className="btn-success text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download PNG</span>
            </>
          )}
        </button>
        
        <button
          id="copy-btn"
          onClick={copyToClipboard}
          disabled={copying}
          className="btn-secondary text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copying ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Copying...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy to Clipboard</span>
            </>
          )}
        </button>
      </div>
      
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
        <h4 className="font-bold text-slate-800 mb-2 flex items-center">
          <span className="text-base mr-2">🚀</span>
          Pro Tips
        </h4>
        <ul className="text-sm text-slate-600 space-y-1">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            <span>High-quality PNG format perfect for social media</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span>Copy to clipboard for instant sharing in messages</span>
          </li>
          <li className="flex items-start">
            <span className="text-purple-500 mr-2">•</span>
            <span>Share on Twitter, Instagram, or Reddit to go viral!</span>
          </li>
        </ul>
      </div>
      
      <div className="text-center">
        <p className="text-slate-500 text-sm">
          🎉 Your masterpiece is ready to break the internet!
        </p>
      </div>
    </div>
  );
}