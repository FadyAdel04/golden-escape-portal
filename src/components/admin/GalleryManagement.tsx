
import { useState } from 'react';
import { useGalleryImages, useCreateGalleryImage, useDeleteGalleryImage } from '@/hooks/useGalleryImages';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Upload, X } from 'lucide-react';

const GalleryManagement = () => {
  const { data: images, isLoading } = useGalleryImages();
  const createImage = useCreateGalleryImage();
  const deleteImage = useDeleteGalleryImage();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    alt_text: '',
    category: 'general',
    display_order: 0,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
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
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = fileName;

      console.log('Uploading file:', fileName);

      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(filePath, selectedFile);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(filePath);

      console.log('File uploaded, creating database entry...');

      await createImage.mutateAsync({
        image_url: urlData.publicUrl,
        alt_text: formData.alt_text,
        category: formData.category,
        display_order: formData.display_order,
      });

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });

      setIsDialogOpen(false);
      setSelectedFile(null);
      setFormData({ alt_text: '', category: 'general', display_order: 0 });
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage.mutateAsync(id);
        toast({
          title: "Success",
          description: "Image deleted successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading gallery...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy">Gallery Management</h2>
          <p className="text-gray-600">{images?.length || 0} images in gallery</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-navy hover:bg-navy/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Gallery Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-upload">Select Image</Label>
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
                {selectedFile && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <span>Selected: {selectedFile.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div>
                <Label htmlFor="alt-text">Alt Text</Label>
                <Input
                  id="alt-text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                  placeholder="Describe the image..."
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="display-order">Display Order</Label>
                <Input
                  id="display-order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                />
              </div>
              
              <Button 
                onClick={handleUpload} 
                disabled={uploading || !selectedFile}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images?.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={image.image_url}
                alt={image.alt_text || 'Gallery image'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-navy capitalize">
                  {image.category}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteImage(image.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {image.alt_text && (
                <p className="text-sm text-gray-600">{image.alt_text}</p>
              )}
              <div className="text-xs text-gray-500 mt-2">
                Order: {image.display_order}
              </div>
            </div>
          </div>
        ))}
        
        {(!images || images.length === 0) && (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No images uploaded yet. Add your first image to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManagement;
