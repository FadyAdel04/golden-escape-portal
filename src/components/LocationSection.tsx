
import { Contact } from "lucide-react";

const LocationSection = () => {
  return (
    <section id="contact" className="section-padding bg-beige/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 gold-underline">
            Location & Contact
          </h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Discover our prime location and find all the information you need to get in touch with us.
          </p>
        </div>
        
        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact Information */}
          <div className="md:col-span-2 bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-2xl font-bold text-navy mb-6">Get in Touch</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-navy mb-2">Address</h4>
                <p className="text-gray-700">
                  123 Luxury Avenue<br />
                  Beachfront District<br />
                  Paradise City, 10001
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-navy mb-2">Phone</h4>
                <p className="text-gray-700">
                  Reservations: +1 (800) 123-4567<br />
                  Front Desk: +1 (800) 123-4568
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-navy mb-2">Email</h4>
                <p className="text-gray-700">
                  reservations@luxuryhaven.com<br />
                  info@luxuryhaven.com
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-navy mb-2">Hours</h4>
                <p className="text-gray-700">
                  Check-in: 3:00 PM<br />
                  Check-out: 12:00 PM<br />
                  Front Desk: Open 24/7
                </p>
              </div>
              
              <div>
                <Button className="bg-gold hover:bg-gold/90 text-white">
                  <Contact className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div className="md:col-span-3">
            <div className="aspect-[16/10] rounded-lg overflow-hidden shadow-sm">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059353029!2d-74.25986548248684!3d40.697149419326095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2suk!4v1617786771224!5m2!1sen!2suk" 
                className="w-full h-full border-0"
                allowFullScreen 
                loading="lazy"
                title="Hotel Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import { Button } from "@/components/ui/button";

export default LocationSection;
