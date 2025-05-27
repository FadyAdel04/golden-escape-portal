
import { useState, useEffect } from "react";

interface LightboxGalleryProps {
  images: { src: string; alt: string; category: string }[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const LightboxGallery = ({ images, isOpen, currentIndex, onClose, onNext, onPrev }: LightboxGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  useEffect(() => {
    setActiveIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose]);

  if (!isOpen || !images.length) return null;

  const handlePrevious = () => {
    const newIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
    onPrev();
  };

  const handleNext = () => {
    const newIndex = activeIndex === images.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(newIndex);
    onNext();
  };

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="relative max-w-4xl w-full max-h-[90vh] p-4" onClick={(e) => e.stopPropagation()}>
        <button 
          className="absolute top-4 right-4 z-10 text-white hover:text-gold transition-colors" 
          onClick={onClose}
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
        
        <div className="flex justify-center items-center h-[70vh]">
          <img 
            src={images[activeIndex]?.src} 
            alt={images[activeIndex]?.alt}
            className="max-h-full max-w-full object-contain"
          />
        </div>
        
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <button 
            className="bg-black/30 text-white hover:bg-gold/80 p-2 rounded-full transition-colors"
            onClick={handlePrevious}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 19l-7-7 7-7" 
              />
            </svg>
          </button>
        </div>
        
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <button 
            className="bg-black/30 text-white hover:bg-gold/80 p-2 rounded-full transition-colors"
            onClick={handleNext}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7" 
              />
            </svg>
          </button>
        </div>
        
        <div className="text-center mt-4 text-white">
          <p className="text-sm">
            {activeIndex + 1} / {images.length} - {images[activeIndex]?.alt}
          </p>
          <p className="text-xs text-white/80 capitalize mt-1">
            {images[activeIndex]?.category}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LightboxGallery;
