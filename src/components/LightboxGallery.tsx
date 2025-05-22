
import { useState, useEffect } from "react";

interface LightboxGalleryProps {
  images: { src: string; alt: string; category: string }[];
  isOpen: boolean;
  currentImageIndex: number;
  onClose: () => void;
}

const LightboxGallery = ({ images, isOpen, currentImageIndex, onClose }: LightboxGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(currentImageIndex);

  useEffect(() => {
    setActiveIndex(currentImageIndex);
  }, [currentImageIndex]);

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

  if (!isOpen) return null;

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
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
            src={images[activeIndex].src} 
            alt={images[activeIndex].alt}
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
            {activeIndex + 1} / {images.length} - {images[activeIndex].alt}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LightboxGallery;
