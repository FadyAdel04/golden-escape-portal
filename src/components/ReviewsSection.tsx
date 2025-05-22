
import { useState, useEffect } from "react";

const ReviewsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const reviews = [
    {
      name: "John Smith",
      rating: 5,
      comment: "Absolutely phenomenal experience! The room was immaculate, the staff was incredibly attentive, and the amenities were top-notch. Can't wait to return for another luxurious stay.",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      location: "New York, USA"
    },
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Our stay at Luxury Haven exceeded all expectations. The attention to detail in both the room and service was impeccable. The spa treatments were particularly outstanding.",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      location: "London, UK"
    },
    {
      name: "Michael Wong",
      rating: 4,
      comment: "Great experience overall. Beautiful property with excellent service. The only minor issue was that the restaurant was fully booked during our stay, but the concierge helped us find alternatives.",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      location: "Singapore"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 6000);
    
    return () => clearInterval(interval);
  }, [reviews.length]);

  // Render stars based on rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? "text-gold" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 gold-underline">
            Guest Reviews
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Don't just take our word for it. Hear what our guests have to say about their experiences at Luxury Haven Hotel.
          </p>
        </div>
        
        {/* Reviews Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-lg">
            {/* Reviews Slide Container */}
            <div 
              className="flex transition-transform duration-700"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {reviews.map((review, index) => (
                <div key={index} className="min-w-full p-8 bg-beige/30 rounded-lg shadow-sm">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Guest Image */}
                    <div className="shrink-0">
                      <img 
                        src={review.image} 
                        alt={review.name} 
                        className="w-20 h-20 rounded-full object-cover border-2 border-gold"
                      />
                    </div>
                    
                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-gray-700 italic mb-4">"{review.comment}"</p>
                      <div>
                        <h4 className="font-bold text-navy">{review.name}</h4>
                        <p className="text-sm text-gray-600">{review.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? "bg-gold" : "bg-gray-300"
                }`}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
