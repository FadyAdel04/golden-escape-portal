
import { useState } from 'react';
import { useBookings, useUpdateBooking, type Booking } from '@/hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, User, Phone, Mail, Clock } from 'lucide-react';
import { format } from 'date-fns';

const BookingsManagement = () => {
  const { data: bookings, isLoading } = useBookings();
  const updateBooking = useUpdateBooking();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [newStatus, setNewStatus] = useState<Booking['status']>('pending');
  const [adminNotes, setAdminNotes] = useState('');

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-green-500';
      case 'cancelled': return 'bg-gray-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleUpdateBooking = () => {
    if (!selectedBooking) return;
    
    updateBooking.mutate({
      id: selectedBooking.id,
      status: newStatus,
      admin_notes: adminNotes,
    });
    
    setSelectedBooking(null);
    setAdminNotes('');
  };

  const openBookingDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setAdminNotes(booking.admin_notes || '');
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  const pendingBookings = bookings?.filter(b => b.status === 'pending') || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-navy">Booking Management</h2>
          <p className="text-gray-600">
            {pendingBookings.length} pending bookings require attention
          </p>
        </div>
        {pendingBookings.length > 0 && (
          <Badge variant="destructive" className="text-sm px-3 py-1">
            {pendingBookings.length} New
          </Badge>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Room Type</TableHead>
              <TableHead>Guests</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings?.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{booking.guest_name}</div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {booking.guest_email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {booking.guest_phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-sm">
                        {format(new Date(booking.check_in_date), 'MMM dd')} - 
                        {format(new Date(booking.check_out_date), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {booking.total_nights} nights
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{booking.room_type}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4 text-gray-500" />
                    {booking.number_of_guests}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(booking.status)} text-white capitalize`}>
                    {booking.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {format(new Date(booking.created_at), 'MMM dd, HH:mm')}
                  </div>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openBookingDialog(booking)}
                      >
                        Manage
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Manage Booking</DialogTitle>
                      </DialogHeader>
                      {selectedBooking && (
                        <div className="space-y-4">
                          <div>
                            <Label>Status</Label>
                            <Select value={newStatus} onValueChange={(value: Booking['status']) => setNewStatus(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Admin Notes</Label>
                            <Textarea
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Add notes about this booking..."
                              rows={3}
                            />
                          </div>
                          
                          <Button 
                            onClick={handleUpdateBooking}
                            disabled={updateBooking.isPending}
                            className="w-full"
                          >
                            {updateBooking.isPending ? 'Updating...' : 'Update Booking'}
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BookingsManagement;
