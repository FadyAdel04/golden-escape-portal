
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const updateImage = useUpdateGalleryImage();
  const deleteImage = useDeleteGalleryImage();
  const { toast } = useToast();

  const handleUpdate = () => {
    updateImage.mutate({
      id: image.id,
      ...editData
    });
    setShowEdit(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleImageUpdate = async () => {
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    
    try {
      // Delete old image from storage if it exists
      if (image.image_url) {
        const oldFileName = image.image_url.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('gallery-images')
            .remove([oldFileName]);
        }
      }

      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName);

      updateImage.mutate({
        id: image.id,
        image_url: urlData.publicUrl
      });

      setShowImageUpload(false);
      setSelectedFile(null);

    } catch (error) {
      console.error('Upload process failed:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
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
        <ScrollArea className="h-32 w-full mt-4">
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
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="image-upload">Select New Image</Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={uploading}
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-gray-600">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleImageUpdate} 
                      disabled={uploading || !selectedFile}
                      className="flex-1"
                    >
                      {uploading ? 'Uploading...' : 'Replace Image'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowImageUpload(false)}
                      disabled={uploading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
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
