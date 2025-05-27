
import { useState } from "react";
import { useGalleryImages } from "@/hooks/useGalleryImages";
import LightboxGallery from "./LightboxGallery";

const GallerySection = () => {
  const { data: galleryImages, isLoading } = useGalleryImages();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fallback images if database is empty
  const fallbackImages = [
    {
      id: "1",
      image_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      alt_text: "Luxury Suite Interior",
      category: "rooms"
    },
    {
      id: "2", 
      image_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
      alt_text: "Hotel Restaurant",
      category: "dining"
    },
    {
      id: "3",
      image_url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      alt_text: "Infinity Pool",
      category: "pool"
    },
    {
      id: "4",
      image_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      alt_text: "Luxury Bedroom",
      category: "rooms"
    },
    {
      id: "5",
      image_url: "https://images.unsplash.com/photo-1530229540764-e6faaf6b8f6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      alt_text: "Wedding Reception",
      category: "events"
    },
    {
      id: "6",
      image_url: "https://images.unsplash.com/photo-1534679541758-8dc68f0a9977?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1746&q=80",
      alt_text: "Breakfast Spread",
      category: "dining"
    }
  ];

  const displayImages = galleryImages && galleryImages.length > 0 ? galleryImages : fallbackImages;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
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

        {/* Lightbox */}
        <LightboxGallery
          images={displayImages.map(img => ({ src: img.image_url, alt: img.alt_text || '' }))}
          isOpen={lightboxOpen}
          currentIndex={currentImageIndex}
          onClose={() => setLightboxOpen(false)}
          onNext={() => setCurrentImageIndex((prev) => (prev + 1) % displayImages.length)}
          onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
        />
      </div>
    </section>
  );
};

export default GallerySection;
