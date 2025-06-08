
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/hooks/useProfiles";
import { useAuth } from "@/contexts/AuthContext";

const personalInfoSchema = z.object({
  guest_name: z.string().min(1, "Full name is required"),
  guest_email: z.string().email("Please enter a valid email"),
  guest_phone: z.string().min(1, "Phone number is required"),
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

interface BookingStepPersonalProps {
  onNext: (data: PersonalInfoData) => void;
  initialData?: Partial<PersonalInfoData>;
}

const BookingStepPersonal = ({ onNext, initialData }: BookingStepPersonalProps) => {
  const { user } = useAuth();
  const { data: profile } = useProfile();

  const form = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      guest_name: initialData?.guest_name || profile?.full_name || "",
      guest_email: initialData?.guest_email || user?.email || "",
      guest_phone: initialData?.guest_phone || profile?.phone || "",
    },
  });

  const handleSubmit = (data: PersonalInfoData) => {
    onNext(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-navy mb-2">Personal Information</h3>
        <p className="text-gray-600">Please confirm your contact details for the booking.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="guest_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
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
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
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
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-gold hover:bg-gold/90">
              Continue to Room Details
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BookingStepPersonal;
