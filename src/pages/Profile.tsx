
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile, useUpdateProfile } from '@/hooks/useProfiles';
import { useBookings } from '@/hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Calendar, Phone, Mail, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingTicket from '@/components/BookingTicket';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: bookings, isLoading: bookingsLoading } = useBookings();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfile.mutateAsync(data);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige/30">
      {/* Header */}
      <div className="bg-navy text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-blue-200">Manage your account and bookings</p>
            </div>
            <div className="flex gap-4">
              <Link to="/">
                <Button variant="outline" className="text-navy border-white hover:bg-white">
                  Back to Home
                </Button>
              </Link>
              <Button 
                onClick={signOut}
                variant="outline" 
                className="text-navy border-white hover:bg-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Email:</span>
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Name:</span>
                    <span>{profile?.full_name || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span>{profile?.phone || 'Not set'}</span>
                  </div>
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="bg-gold hover:bg-gold/90"
                  >
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      Email: {user?.email}
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="full_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex gap-2">
                      <Button 
                        type="submit" 
                        className="bg-gold hover:bg-gold/90"
                        disabled={updateProfile.isPending}
                      >
                        {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          {/* Booking History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Booking History
              </CardTitle>
              <CardDescription>
                View all your past and upcoming bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
                </div>
              ) : bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{booking.room_type}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.check_in_date).toLocaleDateString()} - {' '}
                            {new Date(booking.check_out_date).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.number_of_guests} guest{booking.number_of_guests > 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          {booking.status === 'confirmed' && (
                            <BookingTicket booking={booking} />
                          )}
                        </div>
                      </div>
                      {booking.admin_notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                          <strong>Note:</strong> {booking.admin_notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No bookings found</p>
                  <Link to="/#rooms">
                    <Button className="bg-gold hover:bg-gold/90">
                      Browse Rooms
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
