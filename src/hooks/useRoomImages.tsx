
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RoomImage } from "@/types/room";
import { useToast } from "@/hooks/use-toast";

export const useRoomImages = (roomId: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['room-images', roomId],
    queryFn: async (): Promise<RoomImage[]> => {
      const { data, error } = await supabase
        .from('room_images')
        .select('*')
        .eq('room_id', roomId)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching room images:', error);
        toast({
          title: "Error",
          description: "Failed to fetch room images",
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
    enabled: !!roomId,
  });
};
