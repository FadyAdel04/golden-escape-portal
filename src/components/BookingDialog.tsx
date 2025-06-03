
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBooking, type BookingFormData } from "@/hooks/useBookings";
import { Calendar, Users, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import InvoiceGenerator from "@/components/InvoiceGenerator";

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

interface BookingDialogProps {
  roomTitle: string;
  roomPrice: number;
  children: React.ReactNode;
}

const BookingDialog = ({ roomTitle, roomPrice, children }: BookingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<any>(null);
  const createBooking = useCreateBooking();
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      guest_name: "",
      guest_email: "",
      guest_phone: "",
      check_in_date: "",
      check_out_date: "",
      number_of_guests: 1,
      room_type: roomTitle,
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    try {
      const result = await createBooking.mutateAsync(data);
      setSubmittedBooking(result);
      toast({
        title: t('booking.success'),
        description: t('booking.successDesc'),
      });
      form.reset();
    } catch (error) {
      toast({
        title: t('booking.error'),
        description: t('booking.errorDesc'),
        variant: "destructive",
      });
    }
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

  const totalPrice = calculateNights() * roomPrice;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[500px] max-h-[90vh] overflow-y-auto ${isRTL ? 'text-right' : ''}`}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-navy">
            {t('booking.title')} {roomTitle}
          </DialogTitle>
        </DialogHeader>
        
        {submittedBooking ? (
          <div className="space-y-4 text-center">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-green-800 font-semibold mb-2">{t('booking.success')}</h3>
              <p className="text-green-700 text-sm">{t('booking.successDesc')}</p>
            </div>
            <InvoiceGenerator booking={submittedBooking} />
            <Button 
              onClick={() => {
                setOpen(false);
                setSubmittedBooking(null);
              }}
              className="w-full"
            >
              {t('booking.cancel')}
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Guest Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-navy flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t('booking.guestInfo')}
                </h3>
                
                <FormField
                  control={form.control}
                  name="guest_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('booking.fullName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('booking.fullName')} {...field} />
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
                      <FormLabel>{t('booking.email')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder={t('booking.email')} 
                          {...field} 
                          className="flex items-center"
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
                      <FormLabel>{t('booking.phone')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel" 
                          placeholder={t('booking.phone')} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <h3 className="font-semibold text-navy flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {t('booking.bookingDetails')}
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="check_in_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('booking.checkIn')}</FormLabel>
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
                        <FormLabel>{t('booking.checkOut')}</FormLabel>
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
                
                <FormField
                  control={form.control}
                  name="number_of_guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {t('booking.guests')}
                      </FormLabel>
                      <Select 
                        value={field.value?.toString()} 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('booking.guests')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border shadow-lg z-50">
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? (isRTL ? 'نزيل' : 'Guest') : (isRTL ? 'نزلاء' : 'Guests')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Booking Summary */}
              {calculateNights() > 0 && (
                <div className="bg-beige/30 p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold text-navy">{t('booking.summary')}</h3>
                  <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{t('booking.roomType')}:</span>
                    <span>{roomTitle}</span>
                  </div>
                  <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{t('booking.nights')}:</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{t('booking.ratePerNight')}:</span>
                    <span>${roomPrice}</span>
                  </div>
                  <div className={`flex justify-between font-semibold text-gold border-t pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span>{t('booking.total')}:</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              )}

              <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  {t('booking.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={createBooking.isPending}
                  className="flex-1 bg-gold hover:bg-gold/90"
                >
                  {createBooking.isPending ? t('booking.submitting') : t('booking.submit')}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
