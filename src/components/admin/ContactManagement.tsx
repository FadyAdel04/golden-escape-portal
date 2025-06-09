
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useContactInfo, useCreateContactInfo, useUpdateContactInfo, useDeleteContactInfo, type ContactInfo } from "@/hooks/useContactInfo";
import { Switch } from "@/components/ui/switch";

const ContactManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState({
    section_type: 'address',
    title: '',
    content: '',
    additional_info: '',
    display_order: 0
  });

  const { data: contactInfo, isLoading } = useContactInfo();
  const createContactInfo = useCreateContactInfo();
  const updateContactInfo = useUpdateContactInfo();
  const deleteContactInfo = useDeleteContactInfo();

  const resetForm = () => {
    setFormData({
      section_type: 'address',
      title: '',
      content: '',
      additional_info: '',
      display_order: 0
    });
  };

  const handleAdd = () => {
    createContactInfo.mutate(formData, {
      onSuccess: () => {
        setShowAddDialog(false);
        resetForm();
      }
    });
  };

  const handleEdit = (contact: ContactInfo) => {
    setEditingContact(contact);
    setFormData({
      section_type: contact.section_type,
      title: contact.title,
      content: contact.content,
      additional_info: contact.additional_info || '',
      display_order: contact.display_order
    });
  };

  const handleUpdate = () => {
    if (!editingContact) return;
    
    updateContactInfo.mutate({
      id: editingContact.id,
      ...formData
    }, {
      onSuccess: () => {
        setEditingContact(null);
        resetForm();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this contact information?')) {
      deleteContactInfo.mutate(id);
    }
  };

  const handleToggleActive = (contact: ContactInfo) => {
    updateContactInfo.mutate({
      id: contact.id,
      is_active: !contact.is_active
    });
  };

  if (isLoading) {
    return <div>Loading contact information...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Contact Information Management</CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact Info
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Contact Information</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="section_type">Section Type</Label>
                    <Select
                      value={formData.section_type}
                      onValueChange={(value) => setFormData({ ...formData, section_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select section type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="address">Address</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="location">Location/Map</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Phone, Email, Address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Main content"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="additional_info">Additional Info</Label>
                    <Input
                      id="additional_info"
                      value={formData.additional_info}
                      onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                      placeholder="Optional additional information"
                    />
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
                  <Button onClick={handleAdd} disabled={createContactInfo.isPending}>
                    {createContactInfo.isPending ? 'Creating...' : 'Create Contact Info'}
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
                <TableHead>Type</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Additional Info</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contactInfo?.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.section_type}</TableCell>
                  <TableCell>{contact.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{contact.content}</TableCell>
                  <TableCell className="max-w-xs truncate">{contact.additional_info}</TableCell>
                  <TableCell>{contact.display_order}</TableCell>
                  <TableCell>
                    <Switch
                      checked={contact.is_active}
                      onCheckedChange={() => handleToggleActive(contact)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(contact)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(contact.id)}
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
      <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-section_type">Section Type</Label>
              <Select
                value={formData.section_type}
                onValueChange={(value) => setFormData({ ...formData, section_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="address">Address</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                  <SelectItem value="location">Location/Map</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Phone, Email, Address"
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Main content"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-additional_info">Additional Info</Label>
              <Input
                id="edit-additional_info"
                value={formData.additional_info}
                onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                placeholder="Optional additional information"
              />
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
            <Button onClick={handleUpdate} disabled={updateContactInfo.isPending}>
              {updateContactInfo.isPending ? 'Updating...' : 'Update Contact Info'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactManagement;
