import React, { useState } from 'react';
import { Download, Maximize2, X, Trash2 } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ImageGridProps {
  images: GeneratedImage[];
  title?: string;
  emptyMessage?: string;
  onDelete?: (id: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, title, emptyMessage = "No images generated yet.", onDelete }) => {
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleDownload = (url: string, id: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `bizimage-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
      if (selectedImage?.id === id) {
        setSelectedImage(null);
      }
    }
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <img 
              src={img.url} 
              alt={img.prompt} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                onClick={() => setSelectedImage(img)}
                className="p-2 bg-white/90 text-gray-900 rounded-full hover:bg-white transition-colors"
                title="Zoom"
              >
                <Maximize2 size={20} />
              </button>
              <button 
                onClick={() => handleDownload(img.url, img.id)}
                className="p-2 bg-white/90 text-gray-900 rounded-full hover:bg-white transition-colors"
                title="Download"
              >
                <Download size={20} />
              </button>
              {onDelete && (
                <button 
                  onClick={() => handleDelete(img.id)}
                  className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs truncate px-1">{img.prompt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-[110]"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          
          <div 
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()} 
          >
            <img 
              src={selectedImage.url} 
              alt={selectedImage.prompt} 
              className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl" 
            />
            <div className="mt-4 flex flex-col md:flex-row items-center gap-4 max-w-full">
                <p className="text-white/90 text-sm font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 truncate max-w-md">
                  {selectedImage.prompt}
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleDownload(selectedImage.url, selectedImage.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-full hover:bg-gray-100 transition-colors text-sm font-medium"
                    title="Download Original"
                  >
                    <Download size={16} /> Download
                  </button>
                  {onDelete && (
                    <button 
                      onClick={() => handleDelete(selectedImage.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm font-medium"
                      title="Delete Image"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;