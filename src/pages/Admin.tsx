
import { useState } from "react";
import RoomsList from "@/components/admin/RoomsList";
import RoomForm from "@/components/admin/RoomForm";
import AdminLogin from "@/components/admin/AdminLogin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCreateRoom, useUpdateRoom } from "@/hooks/useRooms";
import { RoomWithImages } from "@/types/room";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

const Admin = () => {
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
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
          onSuccess: () => setCurrentView('list')
        }
      );
    } else {
      createRoom.mutate(data, {
        onSuccess: () => setCurrentView('list')
      });
    }
  };

  const handleBack = () => {
    setCurrentView('list');
    setEditingRoom(null);
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
                <p className="text-gray-600">Manage your hotel rooms and bookings</p>
              </div>
              <Button variant="outline" onClick={logout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>

            {currentView === 'list' ? (
              <RoomsList onAdd={handleAdd} onEdit={handleEdit} />
            ) : (
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
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Admin;
