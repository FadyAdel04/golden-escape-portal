
-- Create facilities table
CREATE TABLE public.facilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Lucide icon name
  category TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_image TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  location TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_info table for dynamic contact management
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_type TEXT NOT NULL, -- 'address', 'phone', 'email', 'hours', 'location'
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  additional_info TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default facilities
INSERT INTO public.facilities (name, description, icon, category, display_order) VALUES
('Free WiFi', 'High-speed wireless internet throughout the property', 'wifi', 'connectivity', 1),
('Swimming Pool', 'Outdoor infinity pool with ocean views', 'waves', 'recreation', 2),
('Fitness Center', '24/7 fully equipped modern gym', 'dumbbell', 'fitness', 3),
('Spa & Wellness', 'Full-service spa with massage and beauty treatments', 'sparkles', 'wellness', 4),
('Restaurant', 'Fine dining restaurant with international cuisine', 'utensils', 'dining', 5),
('Room Service', '24-hour in-room dining service', 'phone', 'service', 6),
('Parking', 'Complimentary valet parking', 'car', 'transport', 7),
('Concierge', 'Personal concierge service', 'user-check', 'service', 8),
('Business Center', 'Fully equipped business facilities', 'briefcase', 'business', 9),
('Airport Shuttle', 'Complimentary airport transportation', 'plane', 'transport', 10);

-- Insert default reviews
INSERT INTO public.reviews (guest_name, guest_image, rating, comment, location, is_featured, display_order) VALUES
('John Smith', 'https://randomuser.me/api/portraits/men/32.jpg', 5, 'Absolutely phenomenal experience! The room was immaculate, the staff was incredibly attentive, and the amenities were top-notch. Can''t wait to return for another luxurious stay.', 'New York, USA', true, 1),
('Sarah Johnson', 'https://randomuser.me/api/portraits/women/44.jpg', 5, 'Our stay at Luxury Haven exceeded all expectations. The attention to detail in both the room and service was impeccable. The spa treatments were particularly outstanding.', 'London, UK', true, 2),
('Michael Wong', 'https://randomuser.me/api/portraits/men/22.jpg', 4, 'Great experience overall. Beautiful property with excellent service. The only minor issue was that the restaurant was fully booked during our stay, but the concierge helped us find alternatives.', 'Singapore', true, 3);

-- Insert default contact information
INSERT INTO public.contact_info (section_type, title, content, additional_info, display_order) VALUES
('address', 'Address', '123 Luxury Avenue', 'Beachfront District, Paradise City, 10001', 1),
('phone', 'Reservations', '+1 (800) 123-4567', null, 2),
('phone', 'Front Desk', '+1 (800) 123-4568', null, 3),
('email', 'Reservations Email', 'reservations@luxuryhaven.com', null, 4),
('email', 'General Email', 'info@luxuryhaven.com', null, 5),
('hours', 'Check-in', '3:00 PM', null, 6),
('hours', 'Check-out', '12:00 PM', null, 7),
('hours', 'Front Desk', 'Open 24/7', null, 8),
('location', 'Map Embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.3059353029!2d-74.25986548248684!3d40.697149419326095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2suk!4v1617786771224!5m2!1sen!2suk', 'Hotel Location Map', 9);

-- Create update triggers for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_facilities_updated_at BEFORE UPDATE ON public.facilities FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
