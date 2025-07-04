
import React, { useState } from 'react';
import { useGalleryImages, useCreateGalleryImage } from '@/hooks/useGalleryImages';
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
import { Plus, Upload, X, Image as ImageIcon } from 'lucide-react';
import GalleryImageCard from './GalleryImageCard';

const GalleryManagement = () => {
  const { data: images, isLoading, refetch } = useGalleryImages();
  const createImage = useCreateGalleryImage();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    alt_text: '',
    category: 'general',
    display_order: 0,
  });

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({ alt_text: '', category: 'general', display_order: 0 });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "Please select a valid image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
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
      console.log('Starting upload process...');
      
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      const fileName = `gallery_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log('Uploading file to storage:', fileName);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      console.log('File uploaded successfully:', uploadData);

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName);

      console.log('Public URL generated:', urlData.publicUrl);

      // Save to database
      const imageData = {
        image_url: urlData.publicUrl,
        alt_text: formData.alt_text || selectedFile.name,
        category: formData.category,
        display_order: formData.display_order || (images?.length || 0) + 1,
      };

      console.log('Saving to database:', imageData);

      await createImage.mutateAsync(imageData);

      toast({
        title: "Success",
        description: "Image uploaded and saved successfully!",
      });

      // Close dialog and reset form
      setIsDialogOpen(false);
      resetForm();
      
      // Refetch images to update the display
      refetch();

    } catch (error) {
      console.error('Upload process failed:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Clean up preview URL when component unmounts or file changes
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading gallery images...</p>
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
            <Button className="bg-navy hover:bg-navy/90" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Image
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Upload New Gallery Image</DialogTitle>
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
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supports JPG, PNG, GIF up to 5MB
                </p>
              </div>

              {selectedFile && previewUrl && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-1 right-1 bg-white/80 hover:bg-white"
                      onClick={() => {
                        setSelectedFile(null);
                        if (previewUrl) {
                          URL.revokeObjectURL(previewUrl);
                        }
                        setPreviewUrl(null);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    File: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
              
              <div>
                <Label htmlFor="alt-text">Image Description</Label>
                <Input
                  id="alt-text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                  placeholder="Describe what's in the image..."
                  disabled={uploading}
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  disabled={uploading}
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
                <Label htmlFor="display-order">Display Order</Label>
                <Input
                  id="display-order"
                  type="number"
                  min="0"
                  value={formData.display_order}
                  onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  disabled={uploading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first
                </p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={handleUpload} 
                  disabled={uploading || !selectedFile}
                  className="flex-1 bg-navy hover:bg-navy/90"
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
                
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images?.map((image) => (
          <GalleryImageCard 
            key={image.id} 
            image={image} 
          />
        ))}
        
        {(!images || images.length === 0) && (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <ImageIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
            <p className="text-gray-500 mb-4">Upload your first gallery image to get started!</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-navy hover:bg-navy/90">
              <Plus className="h-4 w-4 mr-2" />
              Add First Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManagement;
