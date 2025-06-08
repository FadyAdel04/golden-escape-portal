
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookStay = () => {
    if (!user) {
      navigate('/auth');
    } else {
      // Scroll to rooms section for booking
      const element = document.getElementById('rooms');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleExploreRooms = () => {
    const element = document.getElementById('rooms');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')"
      }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-navy/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Your Luxury Escape Awaits
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience unparalleled luxury and comfort in our exquisite hotel, where every detail is crafted for your perfect getaway.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={handleBookStay}
              className="bg-gold hover:bg-gold/90 text-white text-sm px-8 py-6" 
              size="lg"
            >
              BOOK YOUR STAY
            </Button>
            <Button 
              onClick={handleExploreRooms}
              variant="outline" 
              size="lg" 
              className="border-white text-sm px-8 py-6 bg-transparent text-gray-200"
            >
              EXPLORE ROOMS
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <button 
          onClick={() => {
            const element = document.getElementById('about');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex flex-col items-center"
        >
          <span className="text-sm mb-2">Scroll Down</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
