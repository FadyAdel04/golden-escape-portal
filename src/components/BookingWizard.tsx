
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import BookingStepRoomDetails from "./booking/BookingStepRoomDetails";
import BookingStepGuest from "./booking/BookingStepGuest";
import BookingStepConfirmation from "./booking/BookingStepConfirmation";
import { useCreateBooking, BookingFormData } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const bookingSchema = z.object({
  room_type: z.string().min(1, "Please select a room type"),
  check_in_date: z.string().min(1, "Check-in date is required"),
  check_out_date: z.string().min(1, "Check-out date is required"),
  number_of_guests: z.number().min(1, "At least 1 guest is required"),
  guest_name: z.string().min(1, "Guest name is required"),
  guest_email: z.string().email("Please enter a valid email"),
  guest_phone: z.string().min(1, "Phone number is required"),
});

interface BookingWizardProps {
  children: React.ReactNode;
  roomTitle: string;
  roomPrice: number;
}

const BookingWizard = ({ children, roomTitle, roomPrice }: BookingWizardProps) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submittedBooking, setSubmittedBooking] = useState<any>(null);
  
  const createBooking = useCreateBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      room_type: roomTitle,
      check_in_date: "",
      check_out_date: "",
      number_of_guests: 1,
      guest_name: "",
      guest_email: "",
      guest_phone: "",
    },
  });

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

  const getRoomPrice = (roomType: string) => {
    switch (roomType) {
      case "Standard Room": return 199;
      case "Deluxe Room": return 299;
      case "Executive Suite": return 499;
      default: return roomPrice || 199;
    }
  };

  const calculateTotalPrice = () => {
    const nights = calculateNights();
    const currentRoomType = form.watch("room_type");
    const pricePerNight = getRoomPrice(currentRoomType);
    return nights * pricePerNight;
  };

  const handleSubmit = (data: BookingFormData) => {
    createBooking.mutate(data, {
      onSuccess: (newBooking) => {
        setSubmittedBooking(newBooking);
        setStep(3);
      },
    });
  };

  const resetWizard = () => {
    setStep(1);
    setSubmittedBooking(null);
    form.reset({
      room_type: roomTitle,
      check_in_date: "",
      check_out_date: "",
      number_of_guests: 1,
      guest_name: "",
      guest_email: "",
      guest_phone: "",
    });
    setOpen(false);
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof BookingFormData)[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["room_type", "check_in_date", "check_out_date", "number_of_guests"];
    } else if (step === 2) {
      fieldsToValidate = ["guest_name", "guest_email", "guest_phone"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      if (step === 2) {
        // Submit the form
        const formData = form.getValues();
        handleSubmit(formData);
      } else {
        nextStep();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={handleTriggerClick}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Select Room & Dates"}
            {step === 2 && "Guest Information"}
            {step === 3 && "Booking Confirmation"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          {step === 1 && (
            <div className="space-y-6">
              <BookingStepRoomDetails
                form={form}
                roomTitle={roomTitle}
                roomPrice={roomPrice}
              />
              <div className="flex justify-end">
                <Button onClick={handleNext} className="bg-gold hover:bg-gold/90">
                  Next
                </Button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <BookingStepGuest form={form} />
              <div className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  Back
                </Button>
                <Button 
                  onClick={handleNext} 
                  className="bg-gold hover:bg-gold/90"
                  disabled={createBooking.isPending}
                >
                  {createBooking.isPending ? "Processing..." : "Confirm Booking"}
                </Button>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <BookingStepConfirmation
              form={form}
              calculateNights={calculateNights}
              totalPrice={calculateTotalPrice()}
              isSubmitting={createBooking.isPending}
              submittedBooking={submittedBooking}
            />
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingWizard;
