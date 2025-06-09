
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Upload, Link as LinkIcon } from "lucide-react";
import { useFacilities, useCreateFacility, useUpdateFacility, useDeleteFacility, type Facility } from "@/hooks/useFacilities";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const FacilitiesManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [iconType, setIconType] = useState<'lucide' | 'upload' | 'url'>('lucide');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    category: 'general',
    display_order: 0
  });

  const { data: facilities, isLoading } = useFacilities();
  const createFacility = useCreateFacility();
  const updateFacility = useUpdateFacility();
  const deleteFacility = useDeleteFacility();
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      category: 'general',
      display_order: 0
    });
    setSelectedFile(null);
    setIconType('lucide');
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

      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 2MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  const uploadIconImage = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      const fileName = `facility_icon_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      
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

      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      toast({
        title: "Error",
        description: "Failed to upload icon image.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    let iconValue = formData.icon;

    if (iconType === 'upload' && selectedFile) {
      const uploadedUrl = await uploadIconImage();
      if (uploadedUrl) {
        iconValue = uploadedUrl;
      } else {
        return; // Upload failed
      }
    }

    createFacility.mutate({
      ...formData,
      icon: iconValue
    }, {
      onSuccess: () => {
        setShowAddDialog(false);
        resetForm();
      }
    });
  };

  const handleEdit = (facility: Facility) => {
    setEditingFacility(facility);
    setFormData({
      name: facility.name,
      description: facility.description || '',
      icon: facility.icon || '',
      category: facility.category,
      display_order: facility.display_order
    });
    
    // Determine icon type
    if (facility.icon?.startsWith('http')) {
      setIconType('url');
    } else {
      setIconType('lucide');
    }
  };

  const handleUpdate = async () => {
    if (!editingFacility) return;
    
    let iconValue = formData.icon;

    if (iconType === 'upload' && selectedFile) {
      const uploadedUrl = await uploadIconImage();
      if (uploadedUrl) {
        iconValue = uploadedUrl;
      } else {
        return; // Upload failed
      }
    }

    updateFacility.mutate({
      id: editingFacility.id,
      ...formData,
      icon: iconValue
    }, {
      onSuccess: () => {
        setEditingFacility(null);
        resetForm();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this facility?')) {
      deleteFacility.mutate(id);
    }
  };

  const handleToggleActive = (facility: Facility) => {
    updateFacility.mutate({
      id: facility.id,
      is_active: !facility.is_active
    });
  };

  const renderIconInput = () => (
    <div>
      <Label>Icon</Label>
      <Tabs value={iconType} onValueChange={(value) => setIconType(value as typeof iconType)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lucide">Lucide Icon</TabsTrigger>
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="url">Image URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lucide" className="mt-4">
          <Input
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="e.g. wifi, car, phone"
          />
          <p className="text-xs text-gray-500 mt-1">Enter a Lucide icon name</p>
        </TabsContent>
        
        <TabsContent value="upload" className="mt-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          {selectedFile && (
            <p className="text-sm text-gray-600 mt-2">
              Selected: {selectedFile.name}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">Upload an icon image (max 2MB)</p>
        </TabsContent>
        
        <TabsContent value="url" className="mt-4">
          <Input
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="https://example.com/icon.png"
          />
          <p className="text-xs text-gray-500 mt-1">Enter a direct image URL</p>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isLoading) {
    return <div>Loading facilities...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Facilities & Amenities Management</CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Facility
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Facility</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Facility name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Facility description"
                    />
                  </div>
                  {renderIconInput()}
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="connectivity">Connectivity</SelectItem>
                        <SelectItem value="recreation">Recreation</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="wellness">Wellness</SelectItem>
                        <SelectItem value="dining">Dining</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <Button onClick={handleAdd} disabled={createFacility.isPending || uploading}>
                    {createFacility.isPending || uploading ? 'Creating...' : 'Create Facility'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities?.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell>
                    {facility.icon && facility.icon.startsWith('http') ? (
                      <img 
                        src={facility.icon} 
                        alt={facility.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">{facility.icon || 'None'}</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{facility.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{facility.description}</TableCell>
                  <TableCell>{facility.category}</TableCell>
                  <TableCell>{facility.display_order}</TableCell>
                  <TableCell>
                    <Switch
                      checked={facility.is_active}
                      onCheckedChange={() => handleToggleActive(facility)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(facility)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(facility.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingFacility} onOpenChange={() => setEditingFacility(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Facility</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Facility name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Facility description"
              />
            </div>
            {renderIconInput()}
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="connectivity">Connectivity</SelectItem>
                  <SelectItem value="recreation">Recreation</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="dining">Dining</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-display_order">Display Order</Label>
              <Input
                id="edit-display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <Button onClick={handleUpdate} disabled={updateFacility.isPending || uploading}>
              {updateFacility.isPending || uploading ? 'Updating...' : 'Update Facility'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacilitiesManagement;
