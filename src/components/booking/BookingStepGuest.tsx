
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { BookingFormData } from "@/hooks/useBookings";

interface BookingStepGuestProps {
  form: UseFormReturn<BookingFormData>;
}

const BookingStepGuest = ({ form }: BookingStepGuestProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-navy flex items-center gap-2 text-lg">
        <User className="h-5 w-5" />
        Guest Information
      </h3>
      <p className="text-gray-600 text-sm">Please provide your contact details for the reservation.</p>
      
      <FormField
        control={form.control}
        name="guest_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name *</FormLabel>
            <FormControl>
              <Input placeholder="Enter your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="guest_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address *</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="guest_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number *</FormLabel>
            <FormControl>
              <Input 
                type="tel" 
                placeholder="Enter your phone number" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BookingStepGuest;
