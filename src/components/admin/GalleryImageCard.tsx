
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Edit, Trash2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateGalleryImage, useDeleteGalleryImage, type GalleryImage } from "@/hooks/useGalleryImages";
import ImageUpload from "./ImageUpload";

interface GalleryImageCardProps {
  image: GalleryImage;
}

const GalleryImageCard = ({ image }: GalleryImageCardProps) => {
  const [editData, setEditData] = useState({
    alt_text: image.alt_text || '',
    category: image.category,
    display_order: image.display_order || 0
  });
  const [showPreview, setShowPreview] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  
  const updateImage = useUpdateGalleryImage();
  const deleteImage = useDeleteGalleryImage();

  const handleUpdate = () => {
    updateImage.mutate({
      id: image.id,
      ...editData
    });
    setShowEdit(false);
  };

  const handleImageUpdate = (newImageUrl: string) => {
    updateImage.mutate({
      id: image.id,
      image_url: newImageUrl
    });
    setShowImageUpload(false);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this image?')) {
      deleteImage.mutate(image.id);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="aspect-video relative mb-4">
          <img
            src={image.image_url}
            alt={image.alt_text || 'Gallery image'}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Category: {image.category}</p>
          <p className="text-xs text-gray-500">Order: {image.display_order}</p>
        </div>

        {/* Scrollable Actions */}
        <ScrollArea className="h-20 w-full mt-4">
          <div className="flex flex-col space-y-2">
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Image
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Image Preview</DialogTitle>
                </DialogHeader>
                <div className="aspect-video">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || 'Gallery image'}
                    className="w-full h-full object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>

            <Separator />

            <Dialog open={showEdit} onOpenChange={setShowEdit}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Image Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="alt_text">Alt Text</Label>
                    <Input
                      id="alt_text"
                      value={editData.alt_text}
                      onChange={(e) => setEditData({ ...editData, alt_text: e.target.value })}
                      placeholder="Image description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={editData.category}
                      onValueChange={(value) => setEditData({ ...editData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="rooms">Rooms</SelectItem>
                        <SelectItem value="facilities">Facilities</SelectItem>
                        <SelectItem value="dining">Dining</SelectItem>
                        <SelectItem value="exterior">Exterior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={editData.display_order}
                      onChange={(e) => setEditData({ ...editData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <Button onClick={handleUpdate} disabled={updateImage.isPending}>
                    {updateImage.isPending ? 'Updating...' : 'Update'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Separator />

            <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Replace Image
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Replace Image</DialogTitle>
                </DialogHeader>
                <ImageUpload onImageUpload={handleImageUpdate} />
              </DialogContent>
            </Dialog>

            <Separator />

            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleDelete}
              disabled={deleteImage.isPending}
              className="w-full justify-start"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {deleteImage.isPending ? 'Deleting...' : 'Delete Image'}
            </Button>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GalleryImageCard;
