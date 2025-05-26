
export interface Room {
  id: string;
  title: string;
  description: string | null;
  price: number;
  features: string[];
  availability: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomImage {
  id: string;
  room_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  created_at: string;
}

export interface RoomWithImages extends Room {
  room_images: RoomImage[];
}
