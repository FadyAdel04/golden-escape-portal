
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateBooking, type BookingFormData } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfiles";
import { useToast } from "@/hooks/use-toast";
import BookingStepGuest from "@/components/booking/BookingStepGuest";
import BookingStepRoomDetails from "@/components/booking/BookingStepRoomDetails";
import BookingStepConfirmation from "@/components/booking/BookingStepConfirmation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navigate } from "react-router-dom";

const bookingSchema = z.object({
  guest_name: z.string().min(2, "Name must be at least 2 characters"),
  guest_email: z.string().email("Please enter a valid email address"),
  guest_phone: z.string().min(10, "Please enter a valid phone number"),
  check_in_date: z.string().min(1, "Check-in date is required"),
  check_out_date: z.string().min(1, "Check-out date is required"),
  number_of_guests: z.number().min(1, "At least 1 guest is required"),
  room_type: z.string().min(1, "Room type is required"),
}).refine(
  (data) => {
    const checkIn = new Date(data.check_in_date);
    const checkOut = new Date(data.check_out_date);
    return checkOut > checkIn;
  },
  {
    message: "Check-out date must be after check-in date",
    path: ["check_out_date"],
  }
);

interface BookingWizardProps {
  roomTitle?: string;
  roomPrice?: number;
  children: React.ReactNode;
}

const BookingWizard = ({ roomTitle, roomPrice, children }: BookingWizardProps) => {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedBooking, setSubmittedBooking] = useState<any>(null);
  const [redirectToAuth, setRedirectToAuth] = useState(false);
  const createBooking = useCreateBooking();
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guest_name: profile?.full_name || "",
      guest_email: user?.email || "",
      guest_phone: profile?.phone || "",
      check_in_date: "",
      check_out_date: "",
      number_of_guests: 1,
      room_type: roomTitle || "",
    },
  });

  // Update form defaults when profile loads
  useState(() => {
    if (profile && user) {
      form.reset({
        guest_name: profile.full_name || "",
        guest_email: user.email || "",
        guest_phone: profile.phone || "",
        check_in_date: form.getValues("check_in_date"),
        check_out_date: form.getValues("check_out_date"),
        number_of_guests: form.getValues("number_of_guests"),
        room_type: roomTitle || form.getValues("room_type"),
      });
    }
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen && !user) {
      setRedirectToAuth(true);
      return;
    }
    setOpen(newOpen);
  };

  if (redirectToAuth) {
    toast({
      title: "Authentication Required",
      description: "Please sign in to make a booking.",
    });
    return <Navigate to="/auth" />;
  }

  const steps = [
    { number: 1, title: "Guest Details", description: "Your information" },
    { number: 2, title: "Room & Dates", description: "Choose your stay" },
    { number: 3, title: "Confirmation", description: "Review & pay" },
  ];

  const onSubmit = async (data: BookingFormData) => {
    try {
      const result = await createBooking.mutateAsync(data);
      setSubmittedBooking(result);
      toast({
        title: "Booking Request Submitted",
        description: "Your booking request has been submitted successfully. You'll receive an email confirmation once it's reviewed.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit booking request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentStep(1);
    setSubmittedBooking(null);
    form.reset();
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

  const totalPrice = calculateNights() * (roomPrice || 0);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-navy">
            Book Your Stay
          </DialogTitle>
        </DialogHeader>
        
        {submittedBooking ? (
          <BookingStepConfirmation 
            form={form}
            calculateNights={calculateNights}
            totalPrice={totalPrice}
            isSubmitting={false}
            submittedBooking={submittedBooking}
          />
        ) : (
          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    currentStep >= step.number 
                      ? 'bg-gold text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.number}
                  </div>
                  <div className="ml-2 hidden sm:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-gold' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      currentStep > step.number ? 'bg-gold' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step Content */}
                {currentStep === 1 && <BookingStepGuest form={form} />}
                {currentStep === 2 && (
                  <BookingStepRoomDetails 
                    form={form} 
                    roomTitle={roomTitle}
                    roomPrice={roomPrice}
                  />
                )}
                {currentStep === 3 && (
                  <BookingStepConfirmation 
                    form={form}
                    calculateNights={calculateNights}
                    totalPrice={totalPrice}
                    isSubmitting={createBooking.isPending}
                  />
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={currentStep === 1 ? handleClose : prevStep}
                    className="flex items-center gap-2"
                  >
                    {currentStep === 1 ? (
                      "Cancel"
                    ) : (
                      <>
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </>
                    )}
                  </Button>

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 bg-gold hover:bg-gold/90"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={createBooking.isPending}
                      className="bg-gold hover:bg-gold/90"
                    >
                      {createBooking.isPending ? "Processing..." : "Confirm & Pay"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingWizard;
