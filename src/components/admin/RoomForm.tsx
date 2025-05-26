
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Room, RoomImage } from "@/types/room";
import ImageUpload from "./ImageUpload";
import { useRoomImages } from "@/hooks/useRoomImages";

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
  const [roomImages, setRoomImages] = useState<RoomImage[]>([]);

  const { data: existingImages } = useRoomImages(room?.id || '');

  useEffect(() => {
    if (existingImages) {
      setRoomImages(existingImages);
    }
  }, [existingImages]);

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

          {room?.id && (
            <ImageUpload
              roomId={room.id}
              existingImages={roomImages}
              onImagesChange={setRoomImages}
            />
          )}

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
