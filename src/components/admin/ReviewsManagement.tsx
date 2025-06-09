
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Star, StarOff } from "lucide-react";
import { useReviews, useCreateReview, useUpdateReview, useDeleteReview, type Review } from "@/hooks/useReviews";
import { Switch } from "@/components/ui/switch";

const ReviewsManagement = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_image: '',
    rating: 5,
    comment: '',
    location: '',
    is_featured: false,
    display_order: 0
  });

  const { data: reviews, isLoading } = useReviews();
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  const resetForm = () => {
    setFormData({
      guest_name: '',
      guest_image: '',
      rating: 5,
      comment: '',
      location: '',
      is_featured: false,
      display_order: 0
    });
  };

  const handleAdd = () => {
    createReview.mutate(formData, {
      onSuccess: () => {
        setShowAddDialog(false);
        resetForm();
      }
    });
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setFormData({
      guest_name: review.guest_name,
      guest_image: review.guest_image || '',
      rating: review.rating,
      comment: review.comment,
      location: review.location || '',
      is_featured: review.is_featured,
      display_order: review.display_order
    });
  };

  const handleUpdate = () => {
    if (!editingReview) return;
    
    updateReview.mutate({
      id: editingReview.id,
      ...formData
    }, {
      onSuccess: () => {
        setEditingReview(null);
        resetForm();
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      deleteReview.mutate(id);
    }
  };

  const handleToggleActive = (review: Review) => {
    updateReview.mutate({
      id: review.id,
      is_active: !review.is_active
    });
  };

  const handleToggleFeatured = (review: Review) => {
    updateReview.mutate({
      id: review.id,
      is_featured: !review.is_featured
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? "text-gold fill-current" : "text-gray-300"}`}
      />
    ));
  };

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Guest Reviews Management</CardTitle>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="guest_name">Guest Name</Label>
                    <Input
                      id="guest_name"
                      value={formData.guest_name}
                      onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                      placeholder="Guest name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="guest_image">Guest Image URL</Label>
                    <Input
                      id="guest_image"
                      value={formData.guest_image}
                      onChange={(e) => setFormData({ ...formData, guest_image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="comment">Comment</Label>
                    <Textarea
                      id="comment"
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      placeholder="Guest review comment"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. New York, USA"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                    />
                    <Label htmlFor="is_featured">Featured Review</Label>
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
                  <Button onClick={handleAdd} disabled={createReview.isPending}>
                    {createReview.isPending ? 'Creating...' : 'Create Review'}
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
                <TableHead>Guest</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews?.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {review.guest_image && (
                        <img 
                          src={review.guest_image} 
                          alt={review.guest_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      )}
                      <span className="font-medium">{review.guest_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{review.comment}</TableCell>
                  <TableCell>{review.location}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFeatured(review)}
                    >
                      {review.is_featured ? (
                        <Star className="h-4 w-4 text-gold fill-current" />
                      ) : (
                        <StarOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={review.is_active}
                      onCheckedChange={() => handleToggleActive(review)}
                    />
                  </TableCell>
                  <TableCell>{review.display_order}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(review)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(review.id)}
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
      <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-guest_name">Guest Name</Label>
              <Input
                id="edit-guest_name"
                value={formData.guest_name}
                onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                placeholder="Guest name"
              />
            </div>
            <div>
              <Label htmlFor="edit-guest_image">Guest Image URL</Label>
              <Input
                id="edit-guest_image"
                value={formData.guest_image}
                onChange={(e) => setFormData({ ...formData, guest_image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="edit-rating">Rating</Label>
              <Input
                id="edit-rating"
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
              />
            </div>
            <div>
              <Label htmlFor="edit-comment">Comment</Label>
              <Textarea
                id="edit-comment"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                placeholder="Guest review comment"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. New York, USA"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="edit-is_featured">Featured Review</Label>
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
            <Button onClick={handleUpdate} disabled={updateReview.isPending}>
              {updateReview.isPending ? 'Updating...' : 'Update Review'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewsManagement;
