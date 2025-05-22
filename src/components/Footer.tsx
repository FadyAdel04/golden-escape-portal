
import { Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-navy text-white pt-16 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 mb-16">
          {/* Hotel Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-gold">LUXURY</span> HAVEN
            </h3>
            <p className="text-white/70 mb-4">
              Experience luxury redefined at our exquisite hotel, where every detail is crafted for your perfect getaway.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-white/70 hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-white/70 hover:text-gold transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-white/70 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-white/70 hover:text-gold transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-white/70 hover:text-gold transition-colors">About Us</a>
              </li>
              <li>
                <a href="#rooms" className="text-white/70 hover:text-gold transition-colors">Rooms & Suites</a>
              </li>
              <li>
                <a href="#facilities" className="text-white/70 hover:text-gold transition-colors">Facilities</a>
              </li>
              <li>
                <a href="#gallery" className="text-white/70 hover:text-gold transition-colors">Gallery</a>
              </li>
              <li>
                <a href="#contact" className="text-white/70 hover:text-gold transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex">
                <svg className="w-5 h-5 mr-2 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span className="text-white/70">
                  123 Luxury Avenue, Beachfront District<br />
                  Paradise City, 10001
                </span>
              </li>
              <li className="flex">
                <svg className="w-5 h-5 mr-2 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span className="text-white/70">+1 (800) 123-4567</span>
              </li>
              <li className="flex">
                <svg className="w-5 h-5 mr-2 text-gold shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span className="text-white/70">info@luxuryhaven.com</span>
              </li>
            </ul>
          </div>
          
          {/* Instagram Feed */}
          <div>
            <h3 className="text-lg font-bold mb-4">Instagram</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="block aspect-square rounded-md overflow-hidden"
                >
                  <img 
                    src={`https://source.unsplash.com/random/100x100?hotel,luxury,${item}`}
                    alt={`Instagram photo ${item}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-white/60 text-sm">
            &copy; {currentYear} Luxury Haven Hotel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
