
import { useState } from "react";
import RoomsList from "@/components/admin/RoomsList";
import RoomForm from "@/components/admin/RoomForm";
import BookingsManagement from "@/components/admin/BookingsManagement";
import GalleryManagement from "@/components/admin/GalleryManagement";
import FacilitiesManagement from "@/components/admin/FacilitiesManagement";
import ReviewsManagement from "@/components/admin/ReviewsManagement";
import ContactManagement from "@/components/admin/ContactManagement";
import AdminLogin from "@/components/admin/AdminLogin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCreateRoom, useUpdateRoom } from "@/hooks/useRooms";
import { RoomWithImages } from "@/types/room";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Calendar, ImageIcon, Hotel, Settings, Users, MessageSquare } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

const Admin = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'rooms' | 'bookings' | 'gallery' | 'facilities' | 'reviews' | 'contact' | 'add' | 'edit'>('dashboard');
  const [editingRoom, setEditingRoom] = useState<RoomWithImages | null>(null);
  const { isAdmin, logout } = useAdmin();
  
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="pt-20">
          <AdminLogin />
        </div>
        <Footer />
      </div>
    );
  }

  const handleAdd = () => {
    setCurrentView('add');
    setEditingRoom(null);
  };

  const handleEdit = (room: RoomWithImages) => {
    setCurrentView('edit');
    setEditingRoom(room);
  };

  const handleSubmit = (data: any) => {
    if (currentView === 'edit' && editingRoom) {
      updateRoom.mutate(
        { id: editingRoom.id, ...data },
        {
          onSuccess: () => setCurrentView('rooms')
        }
      );
    } else {
      createRoom.mutate(data, {
        onSuccess: () => setCurrentView('rooms')
      });
    }
  };

  const handleBack = () => {
    if (currentView === 'add' || currentView === 'edit') {
      setCurrentView('rooms');
    } else {
      setCurrentView('dashboard');
    }
    setEditingRoom(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setCurrentView('rooms')}
              >
                <div className="flex items-center gap-4">
                  <Hotel className="h-8 w-8 text-navy" />
                  <div>
                    <h3 className="text-lg font-semibold text-navy">Room Management</h3>
                    <p className="text-gray-600">Manage hotel rooms and suites</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setCurrentView('bookings')}
              >
                <div className="flex items-center gap-4">
                  <Calendar className="h-8 w-8 text-navy" />
                  <div>
                    <h3 className="text-lg font-semibold text-navy">Bookings</h3>
                    <p className="text-gray-600">View and manage reservations</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setCurrentView('gallery')}
              >
                <div className="flex items-center gap-4">
                  <ImageIcon className="h-8 w-8 text-navy" />
                  <div>
                    <h3 className="text-lg font-semibold text-navy">Gallery</h3>
                    <p className="text-gray-600">Manage hotel gallery images</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setCurrentView('facilities')}
              >
                <div className="flex items-center gap-4">
                  <Settings className="h-8 w-8 text-navy" />
                  <div>
                    <h3 className="text-lg font-semibold text-navy">Facilities</h3>
                    <p className="text-gray-600">Manage hotel facilities & amenities</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setCurrentView('reviews')}
              >
                <div className="flex items-center gap-4">
                  <MessageSquare className="h-8 w-8 text-navy" />
                  <div>
                    <h3 className="text-lg font-semibold text-navy">Reviews</h3>
                    <p className="text-gray-600">Manage guest reviews</p>
                  </div>
                </div>
              </div>
              
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setCurrentView('contact')}
              >
                <div className="flex items-center gap-4">
                  <Users className="h-8 w-8 text-navy" />
                  <div>
                    <h3 className="text-lg font-semibold text-navy">Contact Info</h3>
                    <p className="text-gray-600">Manage contact information</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'rooms':
        return <RoomsList onAdd={handleAdd} onEdit={handleEdit} />;
      case 'bookings':
        return <BookingsManagement />;
      case 'gallery':
        return <GalleryManagement />;
      case 'facilities':
        return <FacilitiesManagement />;
      case 'reviews':
        return <ReviewsManagement />;
      case 'contact':
        return <ContactManagement />;
      case 'add':
      case 'edit':
        return (
          <div className="space-y-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rooms
            </Button>
            <RoomForm
              room={editingRoom || undefined}
              onSubmit={handleSubmit}
              isLoading={createRoom.isPending || updateRoom.isPending}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 pb-10">
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-2">Admin Dashboard</h1>
                <p className="text-gray-600">Manage your hotel operations</p>
              </div>
              <div className="flex items-center gap-2">
                {currentView !== 'dashboard' && (
                  <Button variant="outline" onClick={() => setCurrentView('dashboard')}>
                    Dashboard
                  </Button>
                )}
                <Button variant="outline" onClick={logout} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>

            {renderContent()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
