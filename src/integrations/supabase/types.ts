export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          admin_notes: string | null
          check_in_date: string
          check_out_date: string
          created_at: string
          guest_email: string
          guest_name: string
          guest_phone: string
          id: string
          number_of_guests: number
          room_type: string
          status: string
          total_nights: number | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          check_in_date: string
          check_out_date: string
          created_at?: string
          guest_email: string
          guest_name: string
          guest_phone: string
          id?: string
          number_of_guests: number
          room_type: string
          status?: string
          total_nights?: number | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          check_in_date?: string
          check_out_date?: string
          created_at?: string
          guest_email?: string
          guest_name?: string
          guest_phone?: string
          id?: string
          number_of_guests?: number
          room_type?: string
          status?: string
          total_nights?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt_text: string | null
          category: string
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          updated_at: string
        }
        Insert: {
          alt_text?: string | null
          category?: string
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          updated_at?: string
        }
        Update: {
          alt_text?: string | null
          category?: string
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      room_images: {
        Row: {
          alt_text: string | null
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          room_id: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          room_id: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_images_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          availability: boolean | null
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          price: number
          title: string
          updated_at: string
        }
        Insert: {
          availability?: boolean | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          price: number
          title: string
          updated_at?: string
        }
        Update: {
          availability?: boolean | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          price?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
