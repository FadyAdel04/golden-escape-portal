
import { Button } from "@/components/ui/button";
import { Wifi, Wind, Coffee, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useRooms } from "@/hooks/useRooms";
import { Link } from "react-router-dom";
import BookingWizard from "@/components/BookingWizard";
import RoomFiltersComponent, { RoomFilters } from "@/components/RoomFilters";
import { useState, useMemo } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const RoomsSection = () => {
  const { data: rooms, isLoading } = useRooms();

  // Filter state
  const [filters, setFilters] = useState<RoomFilters>({
    search: "",
    priceRange: [0, 1000],
    numberOfGuests: null,
    facilities: [],
    viewType: null
  });

  // Fallback to static data if no rooms in database
  const fallbackRooms = [
    {
      id: "1",
      title: "Standard Room",
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      price: 199,
      description: "Our comfortable standard rooms offer the perfect blend of comfort and elegance for your stay.",
      features: ["Wi-Fi", "Air Conditioning", "Mini Bar", "TV"],
      amenities: [
        { name: "Wi-Fi", icon: Wifi },
        { name: "AC", icon: Wind },
        { name: "Coffee", icon: Coffee }
      ]
    },
    {
      id: "2",
      title: "Deluxe Room",
      image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      price: 299,
      description: "Our deluxe rooms offer extra space and upgraded amenities for a more luxurious experience.",
      features: ["Wi-Fi", "Air Conditioning", "Mini Bar", "Garden View", "Room Service"],
      amenities: [
        { name: "Wi-Fi", icon: Wifi },
        { name: "AC", icon: Wind },
        { name: "Coffee", icon: Coffee },
        { name: "View", icon: Eye }
      ]
    },
    {
      id: "3",
      title: "Executive Suite",
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
      price: 499,
      description: "Our spacious suites offer separate living areas and premium amenities for the ultimate luxury experience.",
      features: ["Wi-Fi", "Air Conditioning", "Mini Bar", "Sea View", "Room Service", "Balcony", "Jacuzzi"],
      amenities: [
        { name: "Wi-Fi", icon: Wifi },
        { name: "AC", icon: Wind },
        { name: "Coffee", icon: Coffee },
        { name: "View", icon: Eye }
      ]
    },
    {
      id: "4",
      title: "Presidential Suite",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      price: 899,
      description: "The ultimate luxury experience with panoramic views and exclusive amenities.",
      features: ["Wi-Fi", "Air Conditioning", "Mini Bar", "Ocean View", "Butler Service", "Private Terrace", "Jacuzzi", "Dining Room"],
      amenities: [
        { name: "Wi-Fi", icon: Wifi },
        { name: "AC", icon: Wind },
        { name: "Coffee", icon: Coffee },
        { name: "View", icon: Eye }
      ]
    },
    {
      id: "5",
      title: "Family Suite",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
      price: 599,
      description: "Spacious family accommodations with separate rooms and child-friendly amenities.",
      features: ["Wi-Fi", "Air Conditioning", "Kitchenette", "Living Area", "Kids Welcome Kit", "Connecting Rooms"],
      amenities: [
        { name: "Wi-Fi", icon: Wifi },
        { name: "AC", icon: Wind },
        { name: "Coffee", icon: Coffee }
      ]
    }
  ];

  const displayRooms = rooms && rooms.length > 0 ? rooms : fallbackRooms;

  // Filter logic
  const filteredRooms = useMemo(() => {
    return displayRooms.filter(room => {
      const isDbRoom = 'room_images' in room;
      const roomTitle = room.title;
      const roomPrice = Number(room.price);
      const roomFeatures = isDbRoom ? room.features : room.features;

      // Search filter
      if (filters.search && !roomTitle.toLowerCase().includes(filters.search.toLowerCase()) && 
          !room.description?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Price range filter
      if (roomPrice < filters.priceRange[0] || roomPrice > filters.priceRange[1]) {
        return false;
      }

      // Facilities filter
      if (filters.facilities.length > 0) {
        const hasAllFacilities = filters.facilities.every(facility => 
          roomFeatures.some(feature => 
            feature.toLowerCase().includes(facility.toLowerCase()) ||
            facility.toLowerCase().includes(feature.toLowerCase())
          )
        );
        if (!hasAllFacilities) return false;
      }

      // View type filter
      if (filters.viewType) {
        const hasView = roomFeatures.some(feature => 
          feature.toLowerCase().includes(filters.viewType!.toLowerCase()) ||
          filters.viewType!.toLowerCase().includes(feature.toLowerCase())
        );
        if (!hasView) return false;
      }

      // Number of guests filter (simplified - could be enhanced with actual guest capacity data)
      if (filters.numberOfGuests) {
        // For now, assume standard rooms fit 1-2, deluxe 2-3, suite 3+
        const guestCapacity = roomTitle.toLowerCase().includes('suite') ? 4 : 
                             roomTitle.toLowerCase().includes('deluxe') ? 3 : 2;
        if (filters.numberOfGuests > guestCapacity) return false;
      }

      return true;
    });
  }, [displayRooms, filters]);

  const getFeatureIcon = (feature: string) => {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('wifi') || lowerFeature.includes('internet')) return Wifi;
    if (lowerFeature.includes('ac') || lowerFeature.includes('air')) return Wind;
    if (lowerFeature.includes('coffee') || lowerFeature.includes('minibar')) return Coffee;
    if (lowerFeature.includes('view') || lowerFeature.includes('balcony')) return Eye;
    return Wifi;
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      priceRange: [0, 1000],
      numberOfGuests: null,
      facilities: [],
      viewType: null
    });
  };

  const renderRoomCard = (room: any, index: number) => {
    const isDbRoom = 'room_images' in room;
    const roomImage = isDbRoom 
      ? room.room_images?.[0]?.image_url || "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
      : room.image;
    
    return (
      <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Room Image */}
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={roomImage} 
            alt={room.title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
          />
        </div>
        
        {/* Room Details */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-navy">{room.title}</h3>
            <div className="text-gold font-playfair">
              <span className="text-lg font-bold">${room.price}</span>
              <span className="text-sm">/night</span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">{room.description}</p>
          
          {/* Room Features */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(isDbRoom ? room.features : room.features).slice(0, 4).map((feature, index) => {
              const IconComponent = isDbRoom ? getFeatureIcon(feature) : room.amenities[index]?.icon || Wifi;
              return (
                <div key={index} className="flex items-center text-sm text-gray-600 bg-beige/50 px-3 py-1 rounded-full">
                  <IconComponent className="w-4 h-4 mr-1 text-gold" />
                  <span>{isDbRoom ? feature : feature}</span>
                </div>
              );
            })}
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Link to={`/rooms/${room.id}`} className="flex-1">
              <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-white w-full">
                View Details
              </Button>
            </Link>
            <BookingWizard 
              roomTitle={room.title} 
              roomPrice={Number(room.price)}
            >
              <Button className="bg-gold hover:bg-gold/90 text-white flex-1">
                Book Now
              </Button>
            </BookingWizard>
          </div>
        </div>
      </div>
    );
  };

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

        {/* Filters */}
        <RoomFiltersComponent 
          filters={filters}
          onFiltersChange={setFilters}
          onReset={resetFilters}
        />

        {/* Results Summary */}
        {!isLoading && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredRooms.length} of {displayRooms.length} rooms
            </p>
          </div>
        )}
        
        {/* Room Cards */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading rooms...</p>
          </div>
        ) : filteredRooms.length > 0 ? (
          filteredRooms.length <= 3 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map(renderRoomCard)}
            </div>
          ) : (
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {filteredRooms.map((room, index) => (
                    <CarouselItem key={room.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      {renderRoomCard(room, index)}
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </Carousel>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No rooms match your current filters.</p>
            <Button 
              variant="outline" 
              onClick={resetFilters}
              className="mt-4"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RoomsSection;
