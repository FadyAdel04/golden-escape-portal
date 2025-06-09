
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Star, StarOff } from "lucide-react";
import { useFacilities, useCreateFacility, useUpdateFacility, useDeleteFacility, type Facility } from "@/hooks/useFacilities";
import { Switch } from "@/components/ui/switch";

const FacilitiesManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      category: 'general',
      display_order: 0
    });
  };

  const handleAdd = () => {
    createFacility.mutate(formData, {
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
  };

  const handleUpdate = () => {
    if (!editingFacility) return;
    
    updateFacility.mutate({
      id: editingFacility.id,
      ...formData
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
                  <div>
                    <Label htmlFor="icon">Icon (Lucide icon name)</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="e.g. wifi, car, phone"
                    />
                  </div>
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
                  <Button onClick={handleAdd} disabled={createFacility.isPending}>
                    {createFacility.isPending ? 'Creating...' : 'Create Facility'}
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
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facilities?.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell className="font-medium">{facility.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{facility.description}</TableCell>
                  <TableCell>{facility.category}</TableCell>
                  <TableCell>{facility.icon}</TableCell>
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
            <div>
              <Label htmlFor="edit-icon">Icon (Lucide icon name)</Label>
              <Input
                id="edit-icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g. wifi, car, phone"
              />
            </div>
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
            <Button onClick={handleUpdate} disabled={updateFacility.isPending}>
              {updateFacility.isPending ? 'Updating...' : 'Update Facility'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FacilitiesManagement;
