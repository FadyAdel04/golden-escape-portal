
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BookingStepPersonal, { PersonalInfoData } from "./booking/BookingStepPersonal";
import BookingStepRoomSelection, { RoomSelectionData } from "./booking/BookingStepRoomSelection";
import BookingStepPayment from "./booking/BookingStepPayment";
import BookingStepConfirmation from "./booking/BookingStepConfirmation";
import { useCreateBooking, BookingFormData } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface BookingWizardProps {
  children: React.ReactNode;
  roomTitle?: string;
  roomPrice?: number;
}

const BookingWizard = ({ children, roomTitle, roomPrice }: BookingWizardProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfoData | null>(null);
  const [roomSelection, setRoomSelection] = useState<RoomSelectionData | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<any>(null);
  
  const createBooking = useCreateBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTriggerClick = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setOpen(true);
  };

  const handlePersonalInfoNext = (data: PersonalInfoData) => {
    setPersonalInfo(data);
    setStep(2);
  };

  const handleRoomSelectionNext = (data: RoomSelectionData) => {
    setRoomSelection(data);
    setStep(3);
  };

  const handleConfirmBooking = () => {
    if (!personalInfo || !roomSelection) return;

    const bookingData: BookingFormData = {
      guest_name: personalInfo.guest_name,
      guest_email: personalInfo.guest_email,
      guest_phone: personalInfo.guest_phone,
      room_type: roomSelection.room_type,
      check_in_date: roomSelection.check_in_date,
      check_out_date: roomSelection.check_out_date,
      number_of_guests: roomSelection.number_of_guests,
    };

    createBooking.mutate(bookingData, {
      onSuccess: (newBooking) => {
        setSubmittedBooking(newBooking);
        setStep(4);
      },
    });
  };

  const resetWizard = () => {
    setStep(1);
    setPersonalInfo(null);
    setRoomSelection(null);
    setSubmittedBooking(null);
    setOpen(false);
  };

  const calculateNights = () => {
    if (!roomSelection) return 0;
    const checkIn = new Date(roomSelection.check_in_date);
    const checkOut = new Date(roomSelection.check_out_date);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  const getRoomPrice = (roomType: string) => {
    switch (roomType) {
      case "Standard Room": return 199;
      case "Deluxe Room": return 299;
      case "Executive Suite": return 499;
      default: return roomPrice || 199;
    }
  };

  const calculateTotalPrice = () => {
    if (!roomSelection) return 0;
    const nights = calculateNights();
    const pricePerNight = getRoomPrice(roomSelection.room_type);
    return nights * pricePerNight;
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Personal Information";
      case 2: return "Room & Dates";
      case 3: return "Payment & Confirmation";
      case 4: return "Booking Confirmed";
      default: return "Book Your Stay";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={handleTriggerClick}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getStepTitle()}</DialogTitle>
          {step < 4 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        stepNumber === step
                          ? "bg-gold text-white"
                          : stepNumber < step
                          ? "bg-navy text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {stepNumber}
                    </div>
                    {stepNumber < 3 && (
                      <div
                        className={`w-12 h-1 mx-2 ${
                          stepNumber < step ? "bg-navy" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogHeader>
        
        {step === 1 && (
          <BookingStepPersonal
            onNext={handlePersonalInfoNext}
            initialData={personalInfo || undefined}
          />
        )}
        
        {step === 2 && (
          <BookingStepRoomSelection
            onNext={handleRoomSelectionNext}
            onBack={() => setStep(1)}
            initialData={roomSelection || undefined}
            preSelectedRoom={roomTitle}
          />
        )}
        
        {step === 3 && personalInfo && roomSelection && (
          <BookingStepPayment
            personalInfo={personalInfo}
            roomSelection={roomSelection}
            onBack={() => setStep(2)}
            onConfirm={handleConfirmBooking}
            isLoading={createBooking.isPending}
          />
        )}
        
        {step === 4 && (
          <BookingStepConfirmation
            form={{
              getValues: () => ({
                ...personalInfo!,
                ...roomSelection!,
              }),
            } as any}
            calculateNights={calculateNights}
            totalPrice={calculateTotalPrice()}
            isSubmitting={false}
            submittedBooking={submittedBooking}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingWizard;
