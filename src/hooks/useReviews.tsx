
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Review = {
  id: string;
  guest_name: string;
  guest_image?: string;
  rating: number;
  comment: string;
  location?: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export const useReviews = () => {
  return useQuery({
    queryKey: ['reviews'],
    queryFn: async () => {
      console.log('Fetching reviews from database...');
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }

      console.log('Fetched reviews:', data);
      return data as Review[];
    },
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (reviewData: {
      guest_name: string;
      guest_image?: string;
      rating: number;
      comment: string;
      location?: string;
      is_featured?: boolean;
      display_order?: number;
    }) => {
      console.log('Creating review:', reviewData);
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single();

      if (error) {
        console.error('Error creating review:', error);
        throw error;
      }

      console.log('Created review:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: "Success",
        description: "Review created successfully.",
      });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (reviewData: {
      id: string;
      guest_name?: string;
      guest_image?: string;
      rating?: number;
      comment?: string;
      location?: string;
      is_featured?: boolean;
      display_order?: number;
      is_active?: boolean;
    }) => {
      console.log('Updating review:', reviewData);
      const { id, ...updateData } = reviewData;
      
      const { data, error } = await supabase
        .from('reviews')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating review:', error);
        throw error;
      }

      console.log('Updated review:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: "Success",
        description: "Review updated successfully.",
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting review:', id);
      
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting review:', error);
        throw error;
      }

      console.log('Deleted review successfully');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: "Success",
        description: "Review deleted successfully.",
      });
    },
  });
};
