export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cities: {
        Row: {
          code: string
          id: number
          name: string
          region_id: number
        }
        Insert: {
          code: string
          id?: number
          name: string
          region_id: number
        }
        Update: {
          code?: string
          id?: number
          name?: string
          region_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "cities_region_id_fkey"
            columns: ["region_id"]
            referencedRelation: "regions"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          first_name: string
          id: string
          last_name: string
          updated_at: string | null
        }
        Insert: {
          first_name: string
          id: string
          last_name: string
          updated_at?: string | null
        }
        Update: {
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      regions: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          city_id: number | null
          created_at: string
          id: number
          region_id: number | null
          user_id: string | null
        }
        Insert: {
          city_id?: number | null
          created_at?: string
          id?: number
          region_id?: number | null
          user_id?: string | null
        }
        Update: {
          city_id?: number | null
          created_at?: string
          id?: number
          region_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registrations_city_id_fkey"
            columns: ["city_id"]
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_region_id_fkey"
            columns: ["region_id"]
            referencedRelation: "regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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
