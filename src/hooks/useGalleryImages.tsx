
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
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
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
      const { data, error } = await supabase
        .from('gallery_images')
        .insert([imageData])
        .select()
        .single();
      
      if (error) throw error;
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
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-images'] });
    },
  });
};
