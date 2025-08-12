'use client';

import { useState } from 'react';

interface DownloadShareProps {
  canvas: HTMLCanvasElement | null;
  memeName: string;
}

export default function DownloadShare({ canvas, memeName }: DownloadShareProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const downloadMeme = async () => {
    if (!canvas) return;

    setIsDownloading(true);
    
    try {
      canvas.toBlob((blob) => {
        if (!blob) {
          setIsDownloading(false);
          return;
        }
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `${memeName.toLowerCase().replace(/\s+/g, '-')}-meme-${Date.now()}.png`;
        link.download = filename;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      }, 'image/png', 1.0);
    } catch (error) {
      console.error('Error downloading meme:', error);
      setIsDownloading(false);
    }
  };

  const shareToTwitter = () => {
    if (!canvas) return;

    const text = encodeURIComponent(`Just created this hilarious meme with MemeGen! 😂 #meme #memegen #viral`);
    const url = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent('https://memegen.vercel.app')}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const copyToClipboard = async () => {
    if (!canvas) return;

    setIsCopying(true);
    setCopySuccess(false);

    try {
      if (navigator.clipboard && ClipboardItem) {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            setIsCopying(false);
            return;
          }
          
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 3000);
          } catch (err) {
            console.error('Clipboard API failed:', err);
          } finally {
            setIsCopying(false);
          }
        }, 'image/png');
      } else {
        throw new Error('Clipboard API not supported');
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      setIsCopying(false);
      // Fallback: show instruction to user
      alert('Copying to clipboard is not supported in your browser. Please right-click the meme and select "Copy image" or use the download button.');
    }
  };

  const isDisabled = !canvas;

  return (
    <div className="w-full" role="region" aria-labelledby="download-share-heading">
      <h3 id="download-share-heading" className="text-xl sm:text-2xl font-semibold mb-6 text-gray-900">
        Download & Share
      </h3>
      
      {copySuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm animate-fade-in">
          ✅ Meme copied to clipboard successfully!
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={downloadMeme}
          disabled={isDisabled || isDownloading}
          className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          aria-label={`Download ${memeName} meme as PNG file`}
        >
          {isDownloading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Downloading...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PNG
            </>
          )}
        </button>

        <button
          onClick={copyToClipboard}
          disabled={isDisabled || isCopying}
          className={`flex items-center justify-center px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none transition-all duration-200 ${
            copySuccess 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-500 text-white hover:bg-blue-600'
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
          aria-label="Copy meme to clipboard"
        >
          {isCopying ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Copying...
            </>
          ) : copySuccess ? (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy to Clipboard
            </>
          )}
        </button>

        <button
          onClick={shareToTwitter}
          disabled={isDisabled}
          className="flex items-center justify-center px-4 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          aria-label="Share meme on Twitter"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
          </svg>
          Share on Twitter
        </button>
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Download in PNG format for best quality</li>
          <li>• Copy to clipboard for quick sharing in messages</li>
          <li>• Share on Twitter to go viral! 🚀</li>
        </ul>
      </div>
    </div>
  );
}