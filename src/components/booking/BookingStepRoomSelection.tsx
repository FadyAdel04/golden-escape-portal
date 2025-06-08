
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const roomSelectionSchema = z.object({
  room_type: z.string().min(1, "Please select a room type"),
  check_in_date: z.string().min(1, "Check-in date is required"),
  check_out_date: z.string().min(1, "Check-out date is required"),
  number_of_guests: z.number().min(1, "At least 1 guest is required"),
});

export type RoomSelectionData = z.infer<typeof roomSelectionSchema>;

interface BookingStepRoomSelectionProps {
  onNext: (data: RoomSelectionData) => void;
  onBack: () => void;
  initialData?: Partial<RoomSelectionData>;
  preSelectedRoom?: string;
}

const BookingStepRoomSelection = ({ onNext, onBack, initialData, preSelectedRoom }: BookingStepRoomSelectionProps) => {
  const form = useForm<RoomSelectionData>({
    resolver: zodResolver(roomSelectionSchema),
    defaultValues: {
      room_type: initialData?.room_type || preSelectedRoom || "",
      check_in_date: initialData?.check_in_date || "",
      check_out_date: initialData?.check_out_date || "",
      number_of_guests: initialData?.number_of_guests || 1,
    },
  });

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
      default: return 199;
    }
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const roomType = form.watch("room_type");
    const pricePerNight = getRoomPrice(roomType);
    return nights * pricePerNight;
  };

  const handleSubmit = (data: RoomSelectionData) => {
    onNext(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-navy mb-2">Room & Booking Details</h3>
        <p className="text-gray-600">Select your room type and dates for your stay.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="room_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a room type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Standard Room">Standard Room - $199/night</SelectItem>
                    <SelectItem value="Deluxe Room">Deluxe Room - $299/night</SelectItem>
                    <SelectItem value="Executive Suite">Executive Suite - $499/night</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="check_in_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check-in Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="check_out_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check-out Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                        disabled={(date) => {
                          const checkInDate = form.getValues("check_in_date");
                          return date <= new Date(checkInDate);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                <FormLabel>Number of Guests</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("room_type") && form.watch("check_in_date") && form.watch("check_out_date") && (
            <div className="bg-beige/30 p-4 rounded-lg">
              <h4 className="font-semibold text-navy mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Room Type:</span>
                  <span>{form.watch("room_type")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nights:</span>
                  <span>{calculateNights()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price per night:</span>
                  <span>${getRoomPrice(form.watch("room_type"))}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span className="text-gold">${calculateTotal()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" className="bg-gold hover:bg-gold/90">
              Continue to Payment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BookingStepRoomSelection;
