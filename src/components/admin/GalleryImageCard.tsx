import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useUpdateGalleryImage, useDeleteGalleryImage } from '@/hooks/useGalleryImages';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import { GalleryImage } from '@/hooks/useGalleryImages';

interface GalleryImageCardProps {
  image: GalleryImage;
  onRefetch: () => void;
}

const GalleryImageCard = ({ image, onRefetch }: GalleryImageCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editData, setEditData] = useState({
    alt_text: image.alt_text || '',
    category: image.category,
    display_order: image.display_order,
  });

  const updateImage = useUpdateGalleryImage();
  const deleteImage = useDeleteGalleryImage();
  const { toast } = useToast();

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

  const handleSaveEdit = async () => {
    try {
      setUploading(true);
      let newImageUrl = image.image_url;

      // If a new file is selected, upload it
      if (selectedFile) {
        // Delete old image from storage
        const urlParts = image.image_url.split('/');
        const oldFileName = urlParts[urlParts.length - 1];
        
        const { error: deleteError } = await supabase.storage
          .from('gallery-images')
          .remove([oldFileName]);
          
        if (deleteError) {
          console.error('Error deleting old image:', deleteError);
        }

        // Upload new image
        const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
        const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(fileName, selectedFile);

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Get new public URL
        const { data: urlData } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(fileName);

        newImageUrl = urlData.publicUrl;
      }

      // Update image data
      await updateImage.mutateAsync({
        id: image.id,
        image_url: newImageUrl,
        ...editData,
      });
      
      toast({
        title: "Success",
        description: "Image updated successfully!",
      });
      
      setIsEditing(false);
      setSelectedFile(null);
      onRefetch();
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      return;
    }

    try {
      // Extract filename from URL to delete from storage
      const urlParts = image.image_url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      console.log('Deleting file from storage:', fileName);
      
      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from('gallery-images')
        .remove([fileName]);
        
      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
      }

      // Delete from database
      await deleteImage.mutateAsync(image.id);
      
      toast({
        title: "Success",
        description: "Image deleted successfully!",
      });
      
      onRefetch();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow">
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            src={image.image_url}
            alt={image.alt_text || 'Gallery image'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error('Image failed to load:', image.image_url);
              e.currentTarget.src = 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsViewDialogOpen(true)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-navy capitalize bg-gray-100 px-2 py-1 rounded">
              {image.category}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              #{image.display_order}
            </span>
          </div>
          
          {image.alt_text && (
            <p className="text-sm text-gray-600 line-clamp-2">{image.alt_text}</p>
          )}
          
          <div className="text-xs text-gray-400 mt-2">
            ID: {image.id.slice(0, 8)}...
          </div>
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>View Gallery Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img
              src={image.image_url}
              alt={image.alt_text || 'Gallery image'}
              className="w-full max-h-[60vh] object-contain rounded-lg"
            />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Category:</strong> {image.category}
              </div>
              <div>
                <strong>Display Order:</strong> {image.display_order}
              </div>
              <div className="col-span-2">
                <strong>Description:</strong> {image.alt_text || 'No description'}
              </div>
              <div className="col-span-2">
                <strong>Image URL:</strong> 
                <a href={image.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-2">
                  View Original
                </a>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Gallery Image</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={image.image_url}
                alt={image.alt_text || 'Gallery image'}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-image-upload">Replace Image (Optional)</Label>
              <Input
                id="edit-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="cursor-pointer"
              />
              {selectedFile && (
                <p className="text-xs text-green-600 mt-1">
                  New file selected: {selectedFile.name}
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="edit-alt-text">Image Description</Label>
              <Input
                id="edit-alt-text"
                value={editData.alt_text}
                onChange={(e) => setEditData(prev => ({ ...prev, alt_text: e.target.value }))}
                placeholder="Describe what's in the image..."
              />
            </div>
            
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select 
                value={editData.category} 
                onValueChange={(value) => setEditData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="rooms">Rooms</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="pool">Pool</SelectItem>
                  <SelectItem value="spa">Spa</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="lobby">Lobby</SelectItem>
                  <SelectItem value="exterior">Exterior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="edit-display-order">Display Order</Label>
              <Input
                id="edit-display-order"
                type="number"
                min="0"
                value={editData.display_order}
                onChange={(e) => setEditData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                onClick={handleSaveEdit} 
                disabled={uploading}
                className="flex-1 bg-navy hover:bg-navy/90"
              >
                {uploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setSelectedFile(null);
                }}
                disabled={uploading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GalleryImageCard;
