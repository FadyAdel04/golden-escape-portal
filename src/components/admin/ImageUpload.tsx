
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RoomImage } from '@/types/room';

interface ImageUploadProps {
  roomId: string;
  existingImages: RoomImage[];
  onImagesChange: (images: RoomImage[]) => void;
}

const ImageUpload = ({ roomId, existingImages, onImagesChange }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${roomId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('room-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('room-images')
        .getPublicUrl(fileName);

      const { data: imageData, error: insertError } = await supabase
        .from('room_images')
        .insert({
          room_id: roomId,
          image_url: publicUrl,
          alt_text: file.name,
          display_order: existingImages.length + 1
        })
        .select()
        .single();

      if (insertError) throw insertError;

      onImagesChange([...existingImages, imageData]);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('room_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      onImagesChange(existingImages.filter(img => img.id !== imageId));
      
      toast({
        title: "Success",
        description: "Image removed successfully",
      });
    } catch (error) {
      console.error('Error removing image:', error);
      toast({
        title: "Error",
        description: "Failed to remove image",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Room Images</Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {existingImages.map((image) => (
          <Card key={image.id} className="relative">
            <CardContent className="p-2">
              <img
                src={image.image_url}
                alt={image.alt_text || 'Room image'}
                className="w-full h-32 object-cover rounded"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0"
                onClick={() => removeImage(image.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
        
        <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
          <CardContent className="p-2">
            <label className="flex flex-col items-center justify-center h-32 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <Upload className="h-8 w-8 text-gray-400 animate-spin" />
              ) : (
                <Plus className="h-8 w-8 text-gray-400" />
              )}
              <span className="text-sm text-gray-500 mt-2">
                {uploading ? 'Uploading...' : 'Add Image'}
              </span>
            </label>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageUpload;
