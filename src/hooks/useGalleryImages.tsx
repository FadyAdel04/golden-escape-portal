
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

export const useDeleteGalleryImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting gallery image:', id);
      
      // First get the image to delete the file from storage
      const { data: imageData, error: fetchError } = await supabase
        .from('gallery_images')
        .select('image_url')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching image for deletion:', fetchError);
        throw fetchError;
      }

      // Extract filename from URL to delete from storage
      if (imageData?.image_url) {
        const urlParts = imageData.image_url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        
        const { error: storageError } = await supabase.storage
          .from('gallery-images')
          .remove([fileName]);
          
        if (storageError) {
          console.error('Error deleting image from storage:', storageError);
        }
      }

      // Delete from database
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
