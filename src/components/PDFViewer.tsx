import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PDFViewerProps {
  pdfUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row justify-between items-center pr-4">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        <DialogDescription className="sr-only">
          {title} için PDF görüntüleyici
        </DialogDescription>
        <div className="flex-grow w-full">
          <iframe 
            src={pdfUrl} 
            className="w-full h-full border-0" 
            title={title}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewer;