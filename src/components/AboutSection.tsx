
const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                alt="Luxury Haven Hotel Exterior" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-gold/20 rounded-lg -z-10"></div>
          </div>
          
          {/* Content */}
          <div className="animate-slide-in">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 gold-underline gold-underline-left">
              About Luxury Haven
            </h2>
            <p className="text-gray-700 mb-6">
              Nestled in the heart of the most picturesque landscapes, Luxury Haven Hotel stands as a testament to sophistication and tranquility. Since our establishment in 2010, we have been committed to providing an unparalleled hospitality experience.
            </p>
            <p className="text-gray-700 mb-6">
              Our prime location offers the perfect blend of convenience and serenity, just minutes away from iconic landmarks and cultural attractions, yet secluded enough to provide a peaceful retreat from the hustle and bustle of everyday life.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gold rounded-full mr-2"></div>
                <span className="text-navy">Beachfront Location</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gold rounded-full mr-2"></div>
                <span className="text-navy">Award-Winning Spa</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gold rounded-full mr-2"></div>
                <span className="text-navy">Michelin-Star Restaurant</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gold rounded-full mr-2"></div>
                <span className="text-navy">Personalized Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
