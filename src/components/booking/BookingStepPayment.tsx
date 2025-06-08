
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock } from "lucide-react";
import { PersonalInfoData } from "./BookingStepPersonal";
import { RoomSelectionData } from "./BookingStepRoomSelection";

export interface BookingStepPaymentProps {
  personalInfo: PersonalInfoData;
  roomSelection: RoomSelectionData;
  onBack: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

const BookingStepPayment = ({ personalInfo, roomSelection, onBack, onConfirm, isLoading }: BookingStepPaymentProps) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  });

  const calculateNights = () => {
    const checkIn = new Date(roomSelection.check_in_date);
    const checkOut = new Date(roomSelection.check_out_date);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getRoomPrice = (roomType: string) => {
    switch (roomType) {
      case "Standard Room": return 199;
      case "Deluxe Room": return 299;
      case "Executive Suite": return 499;
      default: return 199;
    }
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const pricePerNight = getRoomPrice(roomSelection.room_type);
    return nights * pricePerNight;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-navy mb-2">Payment & Confirmation</h3>
        <p className="text-gray-600">Review your booking details and complete your payment.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Booking Summary */}
        <div className="space-y-4">
          <h4 className="font-semibold text-navy">Booking Summary</h4>
          
          <div className="bg-beige/30 p-4 rounded-lg space-y-3">
            <div>
              <h5 className="font-medium text-navy">Guest Information</h5>
              <p className="text-sm text-gray-600">{personalInfo.guest_name}</p>
              <p className="text-sm text-gray-600">{personalInfo.guest_email}</p>
              <p className="text-sm text-gray-600">{personalInfo.guest_phone}</p>
            </div>

            <Separator />

            <div>
              <h5 className="font-medium text-navy">Room Details</h5>
              <p className="text-sm text-gray-600">{roomSelection.room_type}</p>
              <p className="text-sm text-gray-600">{roomSelection.number_of_guests} guest(s)</p>
            </div>

            <Separator />

            <div>
              <h5 className="font-medium text-navy">Stay Duration</h5>
              <p className="text-sm text-gray-600">
                Check-in: {new Date(roomSelection.check_in_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Check-out: {new Date(roomSelection.check_out_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">{calculateNights()} night(s)</p>
            </div>

            <Separator />

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Room rate ({calculateNights()} nights)</span>
                <span>${getRoomPrice(roomSelection.room_type)} × {calculateNights()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Taxes & fees</span>
                <span>$0</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span className="text-gold">${calculateTotal()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-navy" />
            <h4 className="font-semibold text-navy">Payment Information</h4>
            <Lock className="h-4 w-4 text-gray-500" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nameOnCard">Name on Card</Label>
              <Input
                id="nameOnCard"
                value={paymentData.nameOnCard}
                onChange={(e) => setPaymentData(prev => ({ ...prev, nameOnCard: e.target.value }))}
                placeholder="Enter cardholder name"
                required
              />
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={paymentData.cvv}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Your payment information is secure and encrypted
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={onBack} disabled={isLoading}>
                Back
              </Button>
              <Button 
                type="submit" 
                className="bg-gold hover:bg-gold/90" 
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : `Confirm & Pay $${calculateTotal()}`}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingStepPayment;
