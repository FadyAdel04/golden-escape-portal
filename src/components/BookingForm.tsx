import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CalendarCheck } from "lucide-react";
import { format } from "date-fns";
import { useCreateBooking } from "@/hooks/useBookings";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

const BookingForm = () => {
  const { toast } = useToast();
  const createBooking = useCreateBooking();
  const [formData, setFormData] = useState({
    checkIn: undefined as Date | undefined,
    checkOut: undefined as Date | undefined,
    guests: "",
    roomType: "",
    name: "",
    email: "",
    phone: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.checkIn) newErrors.checkIn = "Check-in date is required";
    if (!formData.checkOut) newErrors.checkOut = "Check-out date is required";
    if (!formData.guests) newErrors.guests = "Number of guests is required";
    if (!formData.roomType) newErrors.roomType = "Room type is required";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone) newErrors.phone = "Phone is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && formData.checkIn && formData.checkOut) {
      try {
        await createBooking.mutateAsync({
          guest_name: formData.name,
          guest_email: formData.email,
          guest_phone: formData.phone,
          check_in_date: format(formData.checkIn, 'yyyy-MM-dd'),
          check_out_date: format(formData.checkOut, 'yyyy-MM-dd'),
          number_of_guests: parseInt(formData.guests),
          room_type: formData.roomType,
        });

        toast({
          title: "Booking Request Submitted",
          description: "We will contact you shortly to confirm your reservation.",
        });
        
        // Reset form
        setFormData({
          checkIn: undefined,
          checkOut: undefined,
          guests: "",
          roomType: "",
          name: "",
          email: "",
          phone: ""
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit booking. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <section id="booking" className="section-padding bg-navy text-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gold-underline">
            Book Your Stay
          </h2>
          <p className="text-white/80 max-w-3xl mx-auto">
            Reserve your room now for an unforgettable luxury experience. Our staff is ready to make your stay exceptional.
          </p>
        </div>
        
        {/* Booking Form */}
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-sm rounded-lg p-6 md:p-10 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Check-in Date */}
              <div className="space-y-2">
                <Label htmlFor="checkIn" className="text-white">Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        errors.checkIn ? "border-red-500" : "border-white/20 hover:border-gold/50"
                      } bg-white/5 text-white`}
                    >
                      <CalendarCheck className="mr-2 h-4 w-4" />
                      {formData.checkIn ? (
                        format(formData.checkIn, "PPP")
                      ) : (
                        <span>Select check-in date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.checkIn}
                      onSelect={(date) => {
                        setFormData((prev) => ({ ...prev, checkIn: date }));
                        if (errors.checkIn) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.checkIn;
                            return newErrors;
                          });
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.checkIn && <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>}
              </div>
              
              {/* Check-out Date */}
              <div className="space-y-2">
                <Label htmlFor="checkOut" className="text-white">Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        errors.checkOut ? "border-red-500" : "border-white/20 hover:border-gold/50"
                      } bg-white/5 text-white`}
                    >
                      <CalendarCheck className="mr-2 h-4 w-4" />
                      {formData.checkOut ? (
                        format(formData.checkOut, "PPP")
                      ) : (
                        <span>Select check-out date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.checkOut}
                      onSelect={(date) => {
                        setFormData((prev) => ({ ...prev, checkOut: date }));
                        if (errors.checkOut) {
                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.checkOut;
                            return newErrors;
                          });
                        }
                      }}
                      disabled={(date) => 
                        date < new Date() || 
                        (formData.checkIn && date <= formData.checkIn)
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                {errors.checkOut && <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>}
              </div>
              
              {/* Number of Guests */}
              <div className="space-y-2">
                <Label htmlFor="guests" className="text-white">Number of Guests</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("guests", value)}
                  value={formData.guests}
                >
                  <SelectTrigger 
                    className={`${
                      errors.guests ? "border-red-500" : "border-white/20 hover:border-gold/50"
                    } bg-white/5 text-white`}
                  >
                    <SelectValue placeholder="Select number of guests" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4">4 Guests</SelectItem>
                    <SelectItem value="5">5+ Guests</SelectItem>
                  </SelectContent>
                </Select>
                {errors.guests && <p className="text-red-500 text-sm mt-1">{errors.guests}</p>}
              </div>
              
              {/* Room Type */}
              <div className="space-y-2">
                <Label htmlFor="roomType" className="text-white">Room Type</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange("roomType", value)}
                  value={formData.roomType}
                >
                  <SelectTrigger 
                    className={`${
                      errors.roomType ? "border-red-500" : "border-white/20 hover:border-gold/50"
                    } bg-white/5 text-white`}
                  >
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Room</SelectItem>
                    <SelectItem value="deluxe">Deluxe Room</SelectItem>
                    <SelectItem value="suite">Executive Suite</SelectItem>
                    <SelectItem value="presidential">Presidential Suite</SelectItem>
                  </SelectContent>
                </Select>
                {errors.roomType && <p className="text-red-500 text-sm mt-1">{errors.roomType}</p>}
              </div>
              
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${
                    errors.name ? "border-red-500" : "border-white/20 hover:border-gold/50"
                  } bg-white/5 text-white`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${
                    errors.email ? "border-red-500" : "border-white/20 hover:border-gold/50"
                  } bg-white/5 text-white`}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              {/* Phone */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`${
                    errors.phone ? "border-red-500" : "border-white/20 hover:border-gold/50"
                  } bg-white/5 text-white`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-gold hover:bg-gold/90 text-white px-10 py-6 text-lg"
                disabled={createBooking.isPending}
              >
                {createBooking.isPending ? 'Submitting...' : 'Book Now'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
