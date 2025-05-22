
import { Bed, Pool, Restaurant, Gym, Wifi, ParkingMeter } from "lucide-react";

const FacilitiesSection = () => {
  const facilities = [
    {
      icon: Pool,
      title: "Swimming Pool",
      description: "Relax and unwind in our infinity pool with panoramic views."
    },
    {
      icon: Restaurant,
      title: "Fine Dining",
      description: "Savor gourmet cuisine prepared by our Michelin-starred chef."
    },
    {
      icon: Gym,
      title: "Fitness Center",
      description: "Stay fit with state-of-the-art equipment and personal trainers."
    },
    {
      icon: Bed,
      title: "Luxury Spa",
      description: "Indulge in rejuvenating treatments and massages in our spa."
    },
    {
      icon: Wifi,
      title: "Free Wi-Fi",
      description: "Stay connected with high-speed internet throughout the property."
    },
    {
      icon: ParkingMeter,
      title: "Valet Parking",
      description: "Enjoy convenient parking with our professional valet service."
    }
  ];

  return (
    <section id="facilities" className="section-padding bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 gold-underline">
            Facilities & Amenities
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Discover our wide range of exceptional facilities designed to enhance your stay and provide an unforgettable experience.
          </p>
        </div>
        
        {/* Facilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <div 
              key={index} 
              className="bg-beige/30 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-md transition-shadow"
            >
              <div className="bg-gold/10 p-4 rounded-full mb-6">
                <facility.icon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">{facility.title}</h3>
              <p className="text-gray-700">{facility.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;
