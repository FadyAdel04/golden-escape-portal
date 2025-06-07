
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
  user_id?: string;
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
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (bookingData: BookingFormData) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([{ ...bookingData, user_id: user.id }])
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
