
import { useFacilities } from "@/hooks/useFacilities";
import { icons } from "lucide-react";

const FacilitiesSection = () => {
  const { data: facilities, isLoading } = useFacilities();

  if (isLoading) {
    return <div>Loading facilities...</div>;
  }

  const activeFacilities = facilities?.filter(facility => facility.is_active) || [];

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeFacilities.map((facility) => {
            const IconComponent = facility.icon ? icons[facility.icon as keyof typeof icons] : null;
            
            return (
              <div key={facility.id} className="text-center p-6 bg-beige/30 rounded-lg hover:shadow-md transition-shadow">
                <div className="mb-4 flex justify-center">
                  {IconComponent ? (
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
    </section>
  );
};

export default FacilitiesSection;
