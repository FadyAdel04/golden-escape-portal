
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { useRooms, useDeleteRoom } from "@/hooks/useRooms";
import { RoomWithImages } from "@/types/room";

interface RoomsListProps {
  onEdit: (room: RoomWithImages) => void;
  onAdd: () => void;
}

const RoomsList = ({ onEdit, onAdd }: RoomsListProps) => {
  const { data: rooms, isLoading } = useRooms();
  const deleteRoom = useDeleteRoom();

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      deleteRoom.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading rooms...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Rooms</h2>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Room
        </Button>
      </div>

      <div className="grid gap-4">
        {rooms?.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{room.title}</CardTitle>
                  <p className="text-gold font-bold text-lg">${room.price}/night</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={room.availability ? "default" : "destructive"}>
                    {room.availability ? "Available" : "Unavailable"}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => onEdit(room)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(room.id)}
                    disabled={deleteRoom.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{room.description}</p>
              <div className="flex flex-wrap gap-1">
                {room.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Images: {room.room_images?.length || 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoomsList;
