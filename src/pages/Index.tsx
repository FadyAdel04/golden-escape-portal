
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RoomsSection from "@/components/RoomsSection";
import FacilitiesSection from "@/components/FacilitiesSection";
import GallerySection from "@/components/GallerySection";
import BookingForm from "@/components/BookingForm";
import ReviewsSection from "@/components/ReviewsSection";
import LocationSection from "@/components/LocationSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";

const Index = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <HeroSection />
        <AboutSection />
        <RoomsSection />
        <FacilitiesSection />
        <GallerySection />
        <BookingForm />
        <ReviewsSection />
        <LocationSection />
        <NewsletterSection />
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default Index;
