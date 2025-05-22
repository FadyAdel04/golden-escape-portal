
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LightboxGallery from "./LightboxGallery";
import { GalleryHorizontal } from "lucide-react";

const GallerySection = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      alt: "Luxury Suite Interior",
      category: "rooms"
    },
    {
      src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80",
      alt: "Hotel Restaurant",
      category: "dining"
    },
    {
      src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      alt: "Infinity Pool",
      category: "pool"
    },
    {
      src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      alt: "Luxury Bedroom",
      category: "rooms"
    },
    {
      src: "https://images.unsplash.com/photo-1530229540764-e6faaf6b8f6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      alt: "Wedding Reception",
      category: "events"
    },
    {
      src: "https://images.unsplash.com/photo-1534679541758-8dc68f0a9977?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1746&q=80",
      alt: "Breakfast Spread",
      category: "dining"
    }
  ];

  const filters = [
    { name: "All", value: "all" },
    { name: "Rooms", value: "rooms" },
    { name: "Dining", value: "dining" },
    { name: "Pool", value: "pool" },
    { name: "Events", value: "events" }
  ];

  const filteredImages = galleryImages.filter(
    image => activeFilter === "all" || image.category === activeFilter
  );

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="gallery" className="section-padding bg-beige/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 gold-underline">
            Photo Gallery
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Take a visual journey through our hotel and get a glimpse of the luxury and comfort that await you.
          </p>
        </div>
        
        {/* Gallery Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <Button 
              key={filter.value}
              variant={activeFilter === filter.value ? "default" : "outline"}
              className={
                activeFilter === filter.value 
                  ? "bg-gold hover:bg-gold/90 text-white border-gold"
                  : "border-navy text-navy hover:bg-navy/10"
              }
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.name}
            </Button>
          ))}
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image, index) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-lg cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-4 w-full">
                  <p className="text-white font-medium">{image.alt}</p>
                  <div className="flex items-center text-gold/80 mt-1">
                    <GalleryHorizontal className="w-4 h-4 mr-1" />
                    <span className="text-sm capitalize">{image.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      <LightboxGallery 
        images={filteredImages}
        isOpen={lightboxOpen}
        currentImageIndex={currentImageIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  );
};

export default GallerySection;
