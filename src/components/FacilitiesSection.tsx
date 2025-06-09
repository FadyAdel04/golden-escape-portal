
import { useFacilities } from "@/hooks/useFacilities";
import { icons } from "lucide-react";
import { useEffect, useState } from "react";

const FacilitiesSection = () => {
  const { data: facilities, isLoading } = useFacilities();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeFacilities = facilities?.filter(facility => facility.is_active) || [];

  // Auto-slide effect
  useEffect(() => {
    if (activeFacilities.length <= 4) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(activeFacilities.length / 4));
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [activeFacilities.length]);

  if (isLoading) {
    return <div>Loading facilities...</div>;
  }

  const facilitiesPerSlide = 4;
  const totalSlides = Math.ceil(activeFacilities.length / facilitiesPerSlide);

  const getCurrentFacilities = () => {
    const start = currentIndex * facilitiesPerSlide;
    return activeFacilities.slice(start, start + facilitiesPerSlide);
  };

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 gold-underline">
            Facilities & Amenities
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Discover our world-class facilities and amenities designed to make your stay exceptional and memorable.
          </p>
        </div>
        
        {/* Facilities Grid */}
        {activeFacilities.length <= 4 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {activeFacilities.map((facility) => {
              const IconComponent = facility.icon ? icons[facility.icon as keyof typeof icons] : null;
              
              return (
                <div key={facility.id} className="text-center p-6 bg-beige/30 rounded-lg hover:shadow-md transition-shadow">
                  <div className="mb-4 flex justify-center">
                    {facility.icon && facility.icon.startsWith('http') ? (
                      <img 
                        src={facility.icon} 
                        alt={facility.name}
                        className="w-12 h-12 object-contain"
                      />
                    ) : IconComponent ? (
                      <IconComponent className="w-12 h-12 text-gold" />
                    ) : (
                      <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{facility.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-navy mb-2">{facility.name}</h3>
                  <p className="text-gray-700">{facility.description}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {activeFacilities
                      .slice(slideIndex * facilitiesPerSlide, (slideIndex + 1) * facilitiesPerSlide)
                      .map((facility) => {
                        const IconComponent = facility.icon ? icons[facility.icon as keyof typeof icons] : null;
                        
                        return (
                          <div key={facility.id} className="text-center p-6 bg-beige/30 rounded-lg hover:shadow-md transition-shadow">
                            <div className="mb-4 flex justify-center">
                              {facility.icon && facility.icon.startsWith('http') ? (
                                <img 
                                  src={facility.icon} 
                                  alt={facility.name}
                                  className="w-12 h-12 object-contain"
                                />
                              ) : IconComponent ? (
                                <IconComponent className="w-12 h-12 text-gold" />
                              ) : (
                                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold">{facility.name.charAt(0)}</span>
                                </div>
                              )}
                            </div>
                            <h3 className="text-xl font-bold text-navy mb-2">{facility.name}</h3>
                            <p className="text-gray-700">{facility.description}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Slide Indicators */}
            {totalSlides > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-gold' : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FacilitiesSection;
