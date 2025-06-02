
import { useState } from "react";
import { useGalleryImages } from "@/hooks/useGalleryImages";
import LightboxGallery from "./LightboxGallery";

const GallerySection = () => {
  const { data: galleryImages, isLoading, error } = useGalleryImages();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const displayImages = galleryImages || [];

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  if (isLoading) {
    return (
      <section id="gallery" className="section-padding bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 gold-underline">
              Gallery
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Take a visual journey through our hotel and discover the luxury that awaits you.
            </p>
          </div>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error('Gallery loading error:', error);
  }

  return (
    <section id="gallery" className="section-padding bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 gold-underline">
            Gallery
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Take a visual journey through our hotel and discover the luxury that awaits you.
          </p>
        </div>

        {/* Gallery Grid */}
        {displayImages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer aspect-[4/3]"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    console.error('Image failed to load:', image.image_url);
                    // Fallback to a default image if the original fails to load
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium capitalize">{image.category}</p>
                  {image.alt_text && (
                    <p className="text-xs text-white/80">{image.alt_text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gallery Coming Soon</h3>
            <p className="text-gray-500">Our gallery images are being prepared and will be available shortly.</p>
          </div>
        )}

        {/* Lightbox */}
        {displayImages.length > 0 && (
          <LightboxGallery
            images={displayImages.map(img => ({ 
              src: img.image_url, 
              alt: img.alt_text || '', 
              category: img.category 
            }))}
            isOpen={lightboxOpen}
            currentIndex={currentImageIndex}
            onClose={() => setLightboxOpen(false)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </div>
    </section>
  );
};

export default GallerySection;
