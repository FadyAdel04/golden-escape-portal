
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Facility = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export const useFacilities = () => {
  return useQuery({
    queryKey: ['facilities'],
    queryFn: async () => {
      console.log('Fetching facilities from database...');
      const { data, error } = await supabase
        .from('facilities')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching facilities:', error);
        throw error;
      }

      console.log('Fetched facilities:', data);
      return data as Facility[];
    },
  });
};

export const useCreateFacility = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (facilityData: {
      name: string;
      description?: string;
      icon?: string;
      category?: string;
      display_order?: number;
    }) => {
      console.log('Creating facility:', facilityData);
      const { data, error } = await supabase
        .from('facilities')
        .insert([facilityData])
        .select()
        .single();

      if (error) {
        console.error('Error creating facility:', error);
        throw error;
      }

      console.log('Created facility:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      toast({
        title: "Success",
        description: "Facility created successfully.",
      });
    },
  });
};

export const useUpdateFacility = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (facilityData: {
      id: string;
      name?: string;
      description?: string;
      icon?: string;
      category?: string;
      display_order?: number;
      is_active?: boolean;
    }) => {
      console.log('Updating facility:', facilityData);
      const { id, ...updateData } = facilityData;
      
      const { data, error } = await supabase
        .from('facilities')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating facility:', error);
        throw error;
      }

      console.log('Updated facility:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      toast({
        title: "Success",
        description: "Facility updated successfully.",
      });
    },
  });
};

export const useDeleteFacility = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting facility:', id);
      
      const { error } = await supabase
        .from('facilities')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting facility:', error);
        throw error;
      }

      console.log('Deleted facility successfully');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['facilities'] });
      toast({
        title: "Success",
        description: "Facility deleted successfully.",
      });
    },
  });
};
