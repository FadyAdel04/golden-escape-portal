
import { Contact } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactInfo } from "@/hooks/useContactInfo";

const LocationSection = () => {
  const { data: contactInfo, isLoading } = useContactInfo();

  if (isLoading) {
    return <div>Loading contact information...</div>;
  }

  const activeContactInfo = contactInfo?.filter(info => info.is_active) || [];
  
  // Group contact info by section type
  const groupedInfo = activeContactInfo.reduce((acc, info) => {
    if (!acc[info.section_type]) {
      acc[info.section_type] = [];
    }
    acc[info.section_type].push(info);
    return acc;
  }, {} as Record<string, typeof activeContactInfo>);

  // Get map embed URL
  const mapInfo = groupedInfo.location?.[0];

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
              {/* Address */}
              {groupedInfo.address && (
                <div>
                  <h4 className="font-bold text-navy mb-2">Address</h4>
                  {groupedInfo.address.map((info) => (
                    <div key={info.id}>
                      <p className="text-gray-700">
                        {info.content}
                        {info.additional_info && (
                          <>
                            <br />
                            {info.additional_info}
                          </>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Phone */}
              {groupedInfo.phone && (
                <div>
                  <h4 className="font-bold text-navy mb-2">Phone</h4>
                  {groupedInfo.phone.map((info) => (
                    <p key={info.id} className="text-gray-700">
                      {info.title}: {info.content}
                    </p>
                  ))}
                </div>
              )}
              
              {/* Email */}
              {groupedInfo.email && (
                <div>
                  <h4 className="font-bold text-navy mb-2">Email</h4>
                  {groupedInfo.email.map((info) => (
                    <p key={info.id} className="text-gray-700">
                      {info.content}
                    </p>
                  ))}
                </div>
              )}
              
              {/* Hours */}
              {groupedInfo.hours && (
                <div>
                  <h4 className="font-bold text-navy mb-2">Hours</h4>
                  {groupedInfo.hours.map((info) => (
                    <p key={info.id} className="text-gray-700">
                      {info.title}: {info.content}
                    </p>
                  ))}
                </div>
              )}
              
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
              {mapInfo ? (
                <iframe 
                  src={mapInfo.content}
                  className="w-full h-full border-0"
                  allowFullScreen 
                  loading="lazy"
                  title={mapInfo.additional_info || "Hotel Location Map"}
                ></iframe>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Map not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
