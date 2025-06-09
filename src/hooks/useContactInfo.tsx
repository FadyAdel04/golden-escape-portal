
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type ContactInfo = {
  id: string;
  section_type: string;
  title: string;
  content: string;
  additional_info?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export const useContactInfo = () => {
  return useQuery({
    queryKey: ['contact-info'],
    queryFn: async () => {
      console.log('Fetching contact info from database...');
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching contact info:', error);
        throw error;
      }

      console.log('Fetched contact info:', data);
      return data as ContactInfo[];
    },
  });
};

export const useCreateContactInfo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (contactData: {
      section_type: string;
      title: string;
      content: string;
      additional_info?: string;
      display_order?: number;
    }) => {
      console.log('Creating contact info:', contactData);
      const { data, error } = await supabase
        .from('contact_info')
        .insert([contactData])
        .select()
        .single();

      if (error) {
        console.error('Error creating contact info:', error);
        throw error;
      }

      console.log('Created contact info:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-info'] });
      toast({
        title: "Success",
        description: "Contact information created successfully.",
      });
    },
  });
};

export const useUpdateContactInfo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (contactData: {
      id: string;
      section_type?: string;
      title?: string;
      content?: string;
      additional_info?: string;
      display_order?: number;
      is_active?: boolean;
    }) => {
      console.log('Updating contact info:', contactData);
      const { id, ...updateData } = contactData;
      
      const { data, error } = await supabase
        .from('contact_info')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating contact info:', error);
        throw error;
      }

      console.log('Updated contact info:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-info'] });
      toast({
        title: "Success",
        description: "Contact information updated successfully.",
      });
    },
  });
};

export const useDeleteContactInfo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting contact info:', id);
      
      const { error } = await supabase
        .from('contact_info')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting contact info:', error);
        throw error;
      }

      console.log('Deleted contact info successfully');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-info'] });
      toast({
        title: "Success",
        description: "Contact information deleted successfully.",
      });
    },
  });
};
