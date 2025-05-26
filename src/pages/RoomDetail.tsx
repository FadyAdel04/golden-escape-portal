
import { useParams, Link } from "react-router-dom";
import { useRoom } from "@/hooks/useRooms";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Wifi, Wind, Coffee, Eye } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const RoomDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: room, isLoading, error } = useRoom(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold"></div>
          <p className="mt-4 text-gray-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Room Not Found</h1>
          <p className="text-gray-600 mb-4">The room you're looking for doesn't exist.</p>
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getFeatureIcon = (feature: string) => {
    const lowerFeature = feature.toLowerCase();
    if (lowerFeature.includes('wifi') || lowerFeature.includes('internet')) return Wifi;
    if (lowerFeature.includes('ac') || lowerFeature.includes('air')) return Wind;
    if (lowerFeature.includes('coffee') || lowerFeature.includes('minibar')) return Coffee;
    if (lowerFeature.includes('view') || lowerFeature.includes('balcony')) return Eye;
    return Wifi; // default icon
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-navy text-white py-8">
        <div className="container mx-auto px-4">
          <Link to="/">
            <Button variant="outline" className="mb-4 border-white text-white hover:bg-white hover:text-navy">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rooms
            </Button>
          </Link>
          <h1 className="text-4xl font-bold font-playfair">{room.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {room.room_images && room.room_images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {room.room_images
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((image) => (
                      <CarouselItem key={image.id}>
                        <div className="aspect-[4/3] overflow-hidden rounded-lg">
                          <img
                            src={image.image_url}
                            alt={image.alt_text || room.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="aspect-[4/3] bg-gray-200 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>

          {/* Room Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="text-gold font-playfair">
                  <span className="text-3xl font-bold">${room.price}</span>
                  <span className="text-lg">/night</span>
                </div>
                <Badge variant={room.availability ? "default" : "destructive"}>
                  {room.availability ? "Available" : "Not Available"}
                </Badge>
              </div>
              
              {room.description && (
                <p className="text-gray-700 text-lg leading-relaxed">{room.description}</p>
              )}
            </div>

            {/* Features */}
            {room.features && room.features.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-navy mb-3">Room Features</h3>
                <div className="grid grid-cols-2 gap-3">
                  {room.features.map((feature, index) => {
                    const IconComponent = getFeatureIcon(feature);
                    return (
                      <div key={index} className="flex items-center text-gray-600 bg-beige/50 px-3 py-2 rounded-lg">
                        <IconComponent className="w-5 h-5 mr-2 text-gold" />
                        <span>{feature}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Booking Section */}
            <div className="border-t pt-6">
              <Button 
                className="w-full bg-gold hover:bg-gold/90 text-white py-3 text-lg font-semibold"
                disabled={!room.availability}
              >
                {room.availability ? 'Book Now' : 'Not Available'}
              </Button>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Best rate guaranteed • Free cancellation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
