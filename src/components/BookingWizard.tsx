
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import BookingStepRoomDetails from "./booking/BookingStepRoomDetails";
import BookingStepGuest from "./booking/BookingStepGuest";
import BookingStepConfirmation from "./booking/BookingStepConfirmation";
import { useCreateBooking, BookingFormData } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface BookingWizardProps {
  children: React.ReactNode;
  roomTitle: string;
  roomPrice: number;
}

const BookingWizard = ({ children, roomTitle, roomPrice }: BookingWizardProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<Partial<BookingFormData>>({
    room_type: roomTitle,
  });
  
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

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (data: BookingFormData) => {
    createBooking.mutate(data, {
      onSuccess: () => {
        setStep(3);
      },
    });
  };

  const resetWizard = () => {
    setStep(1);
    setBookingData({ room_type: roomTitle });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={handleTriggerClick}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 1 && (
          <BookingStepRoomDetails
            roomTitle={roomTitle}
            roomPrice={roomPrice}
            bookingData={bookingData}
            setBookingData={setBookingData}
            onNext={nextStep}
          />
        )}
        {step === 2 && (
          <BookingStepGuest
            bookingData={bookingData}
            setBookingData={setBookingData}
            onNext={nextStep}
            onBack={prevStep}
            onSubmit={handleSubmit}
            isLoading={createBooking.isPending}
          />
        )}
        {step === 3 && (
          <BookingStepConfirmation
            bookingData={bookingData as BookingFormData}
            onClose={resetWizard}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingWizard;
