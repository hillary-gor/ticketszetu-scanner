export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      brand_invitations: {
        Row: {
          brand_id: string
          created_at: string
          email: string
          expires_at: string
          id: string
          role: Database["public"]["Enums"]["brand_role"]
          token: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          role?: Database["public"]["Enums"]["brand_role"]
          token?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          role?: Database["public"]["Enums"]["brand_role"]
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_invitations_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      brand_members: {
        Row: {
          brand_id: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["brand_role"] | null
          user_id: string | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["brand_role"] | null
          user_id?: string | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["brand_role"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_members_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          contact_email: string | null
          country: string | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          logo_url: string | null
          name: string
          slug: string
          social_links: Json | null
          storefront_theme: string | null
          support_email: string | null
          support_phone: string | null
          theme_colors: Json | null
          updated_at: string | null
        }
        Insert: {
          contact_email?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          name: string
          slug: string
          social_links?: Json | null
          storefront_theme?: string | null
          support_email?: string | null
          support_phone?: string | null
          theme_colors?: Json | null
          updated_at?: string | null
        }
        Update: {
          contact_email?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          logo_url?: string | null
          name?: string
          slug?: string
          social_links?: Json | null
          storefront_theme?: string | null
          support_email?: string | null
          support_phone?: string | null
          theme_colors?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          inquiry_type: string
          message: string
          name: string
          order_reference: string | null
          status: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          inquiry_type: string
          message: string
          name: string
          order_reference?: string | null
          status?: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          message?: string
          name?: string
          order_reference?: string | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      enterprise_leads: {
        Row: {
          company_name: string
          created_at: string | null
          email: string
          estimated_volume: string
          id: string
          message: string
          name: string
          phone_number: string
          status: string | null
        }
        Insert: {
          company_name: string
          created_at?: string | null
          email: string
          estimated_volume: string
          id?: string
          message: string
          name: string
          phone_number: string
          status?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string | null
          email?: string
          estimated_volume?: string
          id?: string
          message?: string
          name?: string
          phone_number?: string
          status?: string | null
        }
        Relationships: []
      }
      event_categories: {
        Row: {
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string
        }
        Insert: {
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug: string
        }
        Update: {
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          absorb_fees: boolean
          banner_url: string | null
          brand_id: string | null
          category_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          end_time: string | null
          format: string | null
          id: string
          is_featured: boolean | null
          slug: string
          start_time: string
          status: Database["public"]["Enums"]["event_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          venue_coordinates: Json | null
          venue_name: string | null
        }
        Insert: {
          absorb_fees?: boolean
          banner_url?: string | null
          brand_id?: string | null
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          end_time?: string | null
          format?: string | null
          id?: string
          is_featured?: boolean | null
          slug: string
          start_time: string
          status?: Database["public"]["Enums"]["event_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          venue_coordinates?: Json | null
          venue_name?: string | null
        }
        Update: {
          absorb_fees?: boolean
          banner_url?: string | null
          brand_id?: string | null
          category_id?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          end_time?: string | null
          format?: string | null
          id?: string
          is_featured?: boolean | null
          slug?: string
          start_time?: string
          status?: Database["public"]["Enums"]["event_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          venue_coordinates?: Json | null
          venue_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      impact_applications: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          organization_name: string
          status: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          organization_name: string
          status?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          organization_name?: string
          status?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          brand_id: string | null
          brand_revenue: number | null
          created_at: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          customer_user_id: string | null
          discount_applied: number | null
          event_id: string | null
          expires_at: string | null
          fee_absorbed_by_organizer: boolean
          id: string
          payment_provider: string | null
          payment_reference: string | null
          platform_fee: number | null
          promo_code_id: string | null
          provider_metadata: Json | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          brand_id?: string | null
          brand_revenue?: number | null
          created_at?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          customer_user_id?: string | null
          discount_applied?: number | null
          event_id?: string | null
          expires_at?: string | null
          fee_absorbed_by_organizer?: boolean
          id?: string
          payment_provider?: string | null
          payment_reference?: string | null
          platform_fee?: number | null
          promo_code_id?: string | null
          provider_metadata?: Json | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          brand_id?: string | null
          brand_revenue?: number | null
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          customer_user_id?: string | null
          discount_applied?: number | null
          event_id?: string | null
          expires_at?: string | null
          fee_absorbed_by_organizer?: boolean
          id?: string
          payment_provider?: string | null
          payment_reference?: string | null
          platform_fee?: number | null
          promo_code_id?: string | null
          provider_metadata?: Json | null
          status?: Database["public"]["Enums"]["order_status"] | null
          subtotal?: number
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_user_id_fkey"
            columns: ["customer_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      payouts: {
        Row: {
          amount: number
          brand_id: string
          created_at: string
          destination_account: string
          id: string
          mpesa_reference: string | null
          requested_by: string
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
        }
        Insert: {
          amount: number
          brand_id: string
          created_at?: string
          destination_account: string
          id?: string
          mpesa_reference?: string | null
          requested_by: string
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Update: {
          amount?: number
          brand_id?: string
          created_at?: string
          destination_account?: string
          id?: string
          mpesa_reference?: string | null
          requested_by?: string
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payouts_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payouts_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_superadmin: boolean | null
          marketing_opt_in: boolean | null
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_superadmin?: boolean | null
          marketing_opt_in?: boolean | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_superadmin?: boolean | null
          marketing_opt_in?: boolean | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          discount_amount: number
          discount_type: string | null
          event_id: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          times_used: number | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          discount_amount: number
          discount_type?: string | null
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          times_used?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          discount_amount?: number
          discount_type?: string | null
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          times_used?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_codes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      promoted_events: {
        Row: {
          brand_id: string | null
          created_at: string | null
          display_order: number | null
          ends_at: string
          event_id: string | null
          id: string
          is_active: boolean | null
          starts_at: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          display_order?: number | null
          ends_at: string
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          starts_at?: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          display_order?: number | null
          ends_at?: string
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "promoted_events_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promoted_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      success_stories: {
        Row: {
          cover_image_url: string
          created_at: string | null
          display_order: number | null
          event_id: string | null
          id: string
          is_active: boolean | null
          organizer_name: string
          testimonial_quote: string | null
          title: string
          youtube_video_id: string | null
        }
        Insert: {
          cover_image_url: string
          created_at?: string | null
          display_order?: number | null
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          organizer_name: string
          testimonial_quote?: string | null
          title: string
          youtube_video_id?: string | null
        }
        Update: {
          cover_image_url?: string
          created_at?: string | null
          display_order?: number | null
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          organizer_name?: string
          testimonial_quote?: string | null
          title?: string
          youtube_video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "success_stories_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_types: {
        Row: {
          capacity: number
          created_at: string | null
          description: string | null
          event_id: string | null
          id: string
          max_per_order: number | null
          name: string
          price: number
          sales_end: string | null
          sales_start: string | null
          updated_at: string | null
        }
        Insert: {
          capacity: number
          created_at?: string | null
          description?: string | null
          event_id?: string | null
          id?: string
          max_per_order?: number | null
          name: string
          price?: number
          sales_end?: string | null
          sales_start?: string | null
          updated_at?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string | null
          description?: string | null
          event_id?: string | null
          id?: string
          max_per_order?: number | null
          name?: string
          price?: number
          sales_end?: string | null
          sales_start?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_types_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          created_at: string | null
          device_id: string | null
          event_id: string | null
          gate_name: string | null
          id: string
          order_id: string | null
          scanned_at: string | null
          scanned_by: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          ticket_type_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          device_id?: string | null
          event_id?: string | null
          gate_name?: string | null
          id?: string
          order_id?: string | null
          scanned_at?: string | null
          scanned_by?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          ticket_type_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          device_id?: string | null
          event_id?: string | null
          gate_name?: string | null
          id?: string
          order_id?: string | null
          scanned_at?: string | null
          scanned_by?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          ticket_type_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_scanned_by_fkey"
            columns: ["scanned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_ticket_type_id_fkey"
            columns: ["ticket_type_id"]
            isOneToOne: false
            referencedRelation: "ticket_types"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          brand_id: string
          created_at: string | null
          id: string
          order_id: string | null
          payout_id: string | null
          status: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Insert: {
          amount: number
          brand_id: string
          created_at?: string | null
          id?: string
          order_id?: string | null
          payout_id?: string | null
          status?: string
          type: Database["public"]["Enums"]["transaction_type"]
        }
        Update: {
          amount?: number
          brand_id?: string
          created_at?: string | null
          id?: string
          order_id?: string | null
          payout_id?: string | null
          status?: string
          type?: Database["public"]["Enums"]["transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "transactions_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_payout_id_fkey"
            columns: ["payout_id"]
            isOneToOne: false
            referencedRelation: "payouts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_promo_usage: {
        Args: { promo_row_id: string }
        Returns: undefined
      }
      scan_ticket: {
        Args: {
          p_device_id?: string
          p_gate_name?: string
          p_offline_scanned_at?: string
          p_scanned_by: string
          p_ticket_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      brand_role: "owner" | "admin" | "scanner"
      event_status: "draft" | "published" | "cancelled" | "completed"
      order_status:
        | "pending"
        | "processing"
        | "completed"
        | "failed"
        | "refunded"
      payout_status: "pending" | "processing" | "completed" | "failed"
      ticket_status: "valid" | "scanned" | "voided"
      transaction_type: "ticket_sale" | "platform_fee" | "payout" | "refund"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      brand_role: ["owner", "admin", "scanner"],
      event_status: ["draft", "published", "cancelled", "completed"],
      order_status: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
      ],
      payout_status: ["pending", "processing", "completed", "failed"],
      ticket_status: ["valid", "scanned", "voided"],
      transaction_type: ["ticket_sale", "platform_fee", "payout", "refund"],
    },
  },
} as const
