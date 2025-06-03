
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Booking = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  room_type: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
  admin_notes?: string;
  total_nights: number;
  created_at: string;
  updated_at: string;
};

export type BookingFormData = {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  number_of_guests: number;
  room_type: string;
};

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Booking[];
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (bookingData: BookingFormData) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, status, admin_notes }: { 
      id: string; 
      status: Booking['status']; 
      admin_notes?: string; 
    }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status, admin_notes })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Simple success message without email functionality
      toast({
        title: "Booking updated",
        description: "Booking status updated successfully.",
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
