
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Rooms', href: '#rooms' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Booking', href: '#booking' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="#home" className="flex items-center">
            <h1 className={`text-2xl font-bold ${isScrolled ? 'text-navy' : 'text-white'}`}>
              <span className="text-gold">LUXURY</span> HAVEN
            </h1>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className={`font-medium text-sm hover:text-gold transition-colors ${isScrolled ? 'text-navy' : 'text-white'}`}
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center gap-2">
              <Link to="/admin">
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${isScrolled ? 'border-navy text-navy hover:bg-navy hover:text-white' : 'border-white text-white hover:bg-white hover:text-navy'}`}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Admin
                </Button>
              </Link>
              <Button className="bg-gold hover:bg-gold/90 text-white">
                BOOK NOW
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg 
              className={`w-6 h-6 ${isScrolled ? 'text-navy' : 'text-white'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg py-4 px-2 absolute left-4 right-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  className="text-navy hover:text-gold px-4 py-2 rounded-md transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="px-4 pt-2 space-y-2">
                <Link to="/admin" className="block">
                  <Button variant="outline" className="w-full border-navy text-navy hover:bg-navy hover:text-white">
                    <Settings className="h-4 w-4 mr-1" />
                    Admin
                  </Button>
                </Link>
                <Button className="bg-gold hover:bg-gold/90 text-white w-full">
                  BOOK NOW
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
