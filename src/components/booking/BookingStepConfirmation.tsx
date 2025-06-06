
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard } from "lucide-react";
import { BookingFormData } from "@/hooks/useBookings";

interface BookingStepConfirmationProps {
  form: UseFormReturn<BookingFormData>;
  calculateNights: () => number;
  totalPrice: number;
  isSubmitting: boolean;
}

const BookingStepConfirmation = ({ 
  form, 
  calculateNights, 
  totalPrice, 
  isSubmitting 
}: BookingStepConfirmationProps) => {
  const formData = form.getValues();
  const nights = calculateNights();

  const getRoomPrice = (roomType: string) => {
    switch (roomType) {
      case "Standard Room": return 199;
      case "Deluxe Room": return 299;
      case "Executive Suite": return 499;
      default: return 199;
    }
  };

  const roomPrice = getRoomPrice(formData.room_type);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-navy flex items-center gap-2 text-lg">
          <CheckCircle className="h-5 w-5" />
          Confirm Your Booking
        </h3>
        <p className="text-gray-600 text-sm">Please review your booking details before confirming.</p>
      </div>

      {/* Guest Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-navy mb-2">Guest Information</h4>
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">Name:</span> {formData.guest_name}</p>
          <p><span className="font-medium">Email:</span> {formData.guest_email}</p>
          <p><span className="font-medium">Phone:</span> {formData.guest_phone}</p>
        </div>
      </div>

      {/* Booking Details */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-navy mb-2">Booking Details</h4>
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">Room:</span> {formData.room_type}</p>
          <p><span className="font-medium">Check-in:</span> {new Date(formData.check_in_date).toLocaleDateString()}</p>
          <p><span className="font-medium">Check-out:</span> {new Date(formData.check_out_date).toLocaleDateString()}</p>
          <p><span className="font-medium">Guests:</span> {formData.number_of_guests}</p>
          <p><span className="font-medium">Nights:</span> {nights}</p>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-beige/30 p-4 rounded-lg border border-gold/20">
        <h4 className="font-semibold text-navy mb-3 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Payment Summary
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Room rate (per night):</span>
            <span>${roomPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Number of nights:</span>
            <span>{nights}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${totalPrice}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-gold text-lg">
              <span>Total Amount:</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <p className="font-medium mb-1">Booking Terms:</p>
        <ul className="space-y-1">
          <li>• Payment will be processed upon confirmation</li>
          <li>• Free cancellation up to 24 hours before check-in</li>
          <li>• Check-in time: 3:00 PM | Check-out time: 11:00 AM</li>
          <li>• Valid ID required at check-in</li>
        </ul>
      </div>
    </div>
  );
};

export default BookingStepConfirmation;
