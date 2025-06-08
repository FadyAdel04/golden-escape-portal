
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import AuthButton from "@/components/AuthButton";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { href: "#hero", label: "Home", section: "hero" },
    { href: "#about", label: "About", section: "about" },
    { href: "#rooms", label: "Rooms", section: "rooms" },
    { href: "#facilities", label: "Facilities", section: "facilities" },
    { href: "#gallery", label: "Gallery", section: "gallery" },
    { href: "#reviews", label: "Reviews", section: "reviews" },
    { href: "#location", label: "Location", section: "location" },
  ];

  const handleNavClick = (href: string, section: string) => {
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete, then scroll to section
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If we're on the home page, just scroll to section
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-navy text-white shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
              <span className="text-navy font-bold text-sm">GE</span>
            </div>
            <span className="font-playfair text-xl font-bold">Golden Escape</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href, item.section)}
                className="hover:text-gold transition-colors duration-200 cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Auth Button */}
          <div className="hidden md:flex">
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-white hover:text-gold"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item.href, item.section)}
                  className="block py-2 hover:text-gold transition-colors duration-200 text-left"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-2">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
