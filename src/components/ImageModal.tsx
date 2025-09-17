import React from 'react';
import { X, ZoomIn, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl, title }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${title}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Download Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-16 z-10 bg-black/50 hover:bg-black/70 text-white"
            onClick={handleDownload}
          >
            <Download className="h-5 w-5" />
          </Button>

          {/* Image */}
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imageUrl}
              alt={title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/marble-default.jpg';
              }}
            />
          </div>

          {/* Title */}
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <h3 className="text-white text-xl font-semibold bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
              {title}
            </h3>
          </div>

          {/* Zoom Icon */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <ZoomIn className="h-8 w-8 text-white/70" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;
