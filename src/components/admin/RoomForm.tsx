
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Upload, Plus } from "lucide-react";
import { Room, RoomImage } from "@/types/room";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RoomFormProps {
  room?: Partial<Room>;
  onSubmit: (data: Omit<Room, 'id' | 'created_at' | 'updated_at'>) => void;
  isLoading?: boolean;
}

const RoomForm = ({ room, onSubmit, isLoading }: RoomFormProps) => {
  const [formData, setFormData] = useState({
    title: room?.title || "",
    description: room?.description || "",
    price: room?.price || 0,
    features: room?.features || [],
    availability: room?.availability ?? true,
  });
  const [newFeature, setNewFeature] = useState("");
  const [uploading, setUploading] = useState(false);
  const [roomImages, setRoomImages] = useState<RoomImage[]>([]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature)
    }));
  };

  const uploadImage = async (file: File, roomId: string) => {
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
          display_order: roomImages.length + 1
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setRoomImages(prev => [...prev, imageData]);
      
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

      setRoomImages(prev => prev.filter(img => img.id !== imageId));
      
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
    if (file && room?.id) {
      uploadImage(file, room.id);
    } else if (file && !room?.id) {
      toast({
        title: "Note",
        description: "Please save the room first before uploading images",
        variant: "destructive",
      });
    }
  };

  // Load existing images if editing a room
  useEffect(() => {
    if (room?.id) {
      const fetchImages = async () => {
        const { data, error } = await supabase
          .from('room_images')
          .select('*')
          .eq('room_id', room.id)
          .order('display_order');

        if (error) {
          console.error('Error fetching images:', error);
        } else {
          setRoomImages(data || []);
        }
      };
      fetchImages();
    }
  }, [room?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{room?.id ? 'Edit Room' : 'Add New Room'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Room Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="price">Price per Night ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
              required
            />
          </div>

          <div>
            <Label>Features</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeFeature(feature)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <Label>Room Images</Label>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {roomImages.map((image) => (
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
                      type="button"
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
                      disabled={uploading || !room?.id}
                    />
                    {uploading ? (
                      <Upload className="h-8 w-8 text-gray-400 animate-spin" />
                    ) : (
                      <Plus className="h-8 w-8 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-500 mt-2 text-center">
                      {uploading ? 'Uploading...' : 
                       !room?.id ? 'Save room first' : 'Add Image'}
                    </span>
                  </label>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="availability"
              checked={formData.availability}
              onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.checked }))}
            />
            <Label htmlFor="availability">Available for booking</Label>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : (room?.id ? 'Update Room' : 'Create Room')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RoomForm;
