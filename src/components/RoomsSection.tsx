
import { Button } from "@/components/ui/button";
import { Wifi, Wind, Coffee, Eye } from "lucide-react";

const RoomsSection = () => {
  const rooms = [
    {
      id: 1,
      name: "Standard Room",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      price: 199,
      description: "Our comfortable standard rooms offer the perfect blend of comfort and elegance for your stay.",
      features: ["Wi-Fi", "Air Conditioning", "Mini Bar", "TV"],
      amenities: [
        { name: "Wi-Fi", icon: Wifi },
        { name: "AC", icon: Wind },
        { name: "Coffee", icon: Coffee },
      ]
    },
    {
      id: 2,
      name: "Deluxe Room",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      price: 299,
      description: "Our deluxe rooms offer extra space and upgraded amenities for a more luxurious experience.",
      features: ["Wi-Fi", "Air Conditioning", "Mini Bar", "Garden View", "Room Service"],
      amenities: [
        { name: "Wi-Fi", icon: Wifi },
        { name: "AC", icon: Wind },
        { name: "Coffee", icon: Coffee },
        { name: "View", icon: Eye },
      ]
    },
    {
      id: 3,
      name: "Executive Suite",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      price: 499,
      description: "Our spacious suites offer separate living areas and premium amenities for the ultimate luxury experience.",
      features: ["Wi-Fi", "Air Conditioning", "Mini Bar", "Sea View", "Room Service", "Balcony", "Jacuzzi"],
      amenities: [
        { name: "Wi-Fi", icon: Wifi },
        { name: "AC", icon: Wind },
        { name: "Coffee", icon: Coffee },
        { name: "View", icon: Eye },
      ]
    }
  ];

  return (
    <section id="rooms" className="section-padding bg-beige/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 gold-underline">
            Rooms & Suites
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Experience the ultimate in comfort and luxury in our carefully designed rooms and suites, each offering a unique blend of elegance and modern amenities.
          </p>
        </div>
        
        {/* Room Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Room Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Room Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-navy">{room.name}</h3>
                  <div className="text-gold font-playfair">
                    <span className="text-lg font-bold">${room.price}</span>
                    <span className="text-sm">/night</span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{room.description}</p>
                
                {/* Room Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 bg-beige/50 px-3 py-1 rounded-full">
                      <amenity.icon className="w-4 h-4 mr-1 text-gold" />
                      <span>{amenity.name}</span>
                    </div>
                  ))}
                </div>
                
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white flex-1">
                    View Details
                  </Button>
                  <Button className="bg-gold hover:bg-gold/90 text-white flex-1">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white">
            View All Rooms
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;
