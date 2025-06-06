
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Users, Bed } from "lucide-react";
import { BookingFormData } from "@/hooks/useBookings";

interface BookingStepRoomDetailsProps {
  form: UseFormReturn<BookingFormData>;
  roomTitle?: string;
  roomPrice?: number;
}

const BookingStepRoomDetails = ({ form, roomTitle, roomPrice }: BookingStepRoomDetailsProps) => {
  const calculateNights = () => {
    const checkIn = form.watch("check_in_date");
    const checkOut = form.watch("check_out_date");
    
    if (checkIn && checkOut) {
      const nights = Math.ceil(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
      );
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-navy flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Room & Stay Details
        </h3>
        <p className="text-gray-600 text-sm">Choose your room and dates for your stay.</p>
      </div>

      {/* Room Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Bed className="h-4 w-4 text-gold" />
          <FormLabel>Room Type</FormLabel>
        </div>
        
        <FormField
          control={form.control}
          name="room_type"
          render={({ field }) => (
            <FormItem>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="Standard Room">Standard Room - $199/night</SelectItem>
                  <SelectItem value="Deluxe Room">Deluxe Room - $299/night</SelectItem>
                  <SelectItem value="Executive Suite">Executive Suite - $499/night</SelectItem>
                  {roomTitle && !["Standard Room", "Deluxe Room", "Executive Suite"].includes(roomTitle) && (
                    <SelectItem value={roomTitle}>
                      {roomTitle} - ${roomPrice}/night
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="check_in_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-in Date *</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  min={new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="check_out_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-out Date *</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  min={form.watch("check_in_date") || new Date().toISOString().split('T')[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Guests Selection */}
      <FormField
        control={form.control}
        name="number_of_guests"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Number of Guests *
            </FormLabel>
            <Select 
              value={field.value?.toString()} 
              onValueChange={(value) => field.onChange(parseInt(value))}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Number of Guests" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border shadow-lg z-50">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Stay Summary */}
      {calculateNights() > 0 && (
        <div className="bg-beige/30 p-4 rounded-lg">
          <h4 className="font-semibold text-navy mb-2">Stay Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Nights:</span>
              <span>{calculateNights()}</span>
            </div>
            <div className="flex justify-between">
              <span>Guests:</span>
              <span>{form.watch("number_of_guests")}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingStepRoomDetails;
