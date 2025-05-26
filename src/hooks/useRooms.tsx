
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Room, RoomImage, RoomWithImages } from "@/types/room";
import { useToast } from "@/hooks/use-toast";

export const useRooms = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['rooms'],
    queryFn: async (): Promise<RoomWithImages[]> => {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          room_images (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rooms:', error);
        toast({
          title: "Error",
          description: "Failed to fetch rooms",
          variant: "destructive",
        });
        throw error;
      }

      return data || [];
    },
  });
};

export const useRoom = (id: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['room', id],
    queryFn: async (): Promise<RoomWithImages> => {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          room_images (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching room:', error);
        toast({
          title: "Error",
          description: "Failed to fetch room details",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (roomData: Omit<Room, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('rooms')
        .insert([roomData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: "Success",
        description: "Room created successfully",
      });
    },
    onError: (error) => {
      console.error('Error creating room:', error);
      toast({
        title: "Error",
        description: "Failed to create room",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...roomData }: Partial<Room> & { id: string }) => {
      const { data, error } = await supabase
        .from('rooms')
        .update(roomData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: "Success",
        description: "Room updated successfully",
      });
    },
    onError: (error) => {
      console.error('Error updating room:', error);
      toast({
        title: "Error",
        description: "Failed to update room",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Error deleting room:', error);
      toast({
        title: "Error",
        description: "Failed to delete room",
        variant: "destructive",
      });
    },
  });
};
