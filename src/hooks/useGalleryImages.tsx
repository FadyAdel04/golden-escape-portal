
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type GalleryImage = {
  id: string;
  image_url: string;
  alt_text?: string;
  category: string;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export const useGalleryImages = () => {
  return useQuery({
    queryKey: ['gallery-images'],
    queryFn: async () => {
      console.log('Fetching gallery images from database...');
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching gallery images:', error);
        throw error;
      }

      console.log('Fetched gallery images:', data);
      return data as GalleryImage[];
    },
  });
};

export const useCreateGalleryImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (imageData: {
      image_url: string;
      alt_text?: string;
      category: string;
      display_order?: number;
    }) => {
      console.log('Creating gallery image:', imageData);
      const { data, error } = await supabase
        .from('gallery_images')
        .insert([imageData])
        .select()
        .single();

      if (error) {
        console.error('Error creating gallery image:', error);
        throw error;
      }

      console.log('Created gallery image:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
    },
  });
};

export const useUpdateGalleryImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (imageData: {
      id: string;
      alt_text?: string;
      category?: string;
      display_order?: number;
    }) => {
      console.log('Updating gallery image:', imageData);
      const { id, ...updateData } = imageData;
      
      const { data, error } = await supabase
        .from('gallery_images')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating gallery image:', error);
        throw error;
      }

      console.log('Updated gallery image:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
    },
  });
};

export const useDeleteGalleryImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting gallery image:', id);
      
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting gallery image:', error);
        throw error;
      }

      console.log('Deleted gallery image successfully');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
    },
  });
};
