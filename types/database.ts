/**
 * Minimal hand-written Supabase schema types for Phase 1 (auth + profiles).
 *
 * Once a Supabase project (or local stack) is available, regenerate the full
 * file with:
 *   npx supabase gen types typescript --local > types/database.ts
 * or
 *   npx supabase gen types typescript --project-id <ref> > types/database.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "manager" | "capo_pr";

export type LeadStatus =
  | "da_contattare"
  | "contattato"
  | "ha_risposto"
  | "interessato"
  | "da_spiegare"
  | "da_inserire_bacheca"
  | "inserito_bacheca"
  | "da_inserire_squadra"
  | "inserito_squadra"
  | "convertito_collaboratore"
  | "non_interessato"
  | "non_risponde"
  | "da_ricontattare"
  | "scartato";

export type LeadPriority = "low" | "medium" | "high";
export type LeadInterest = "cold" | "warm" | "hot";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          role: UserRole;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          instagram_username: string;
          instagram_url: string | null;
          phone: string | null;
          city: string | null;
          source: string | null;
          status: LeadStatus;
          priority: LeadPriority;
          interest_level: LeadInterest;
          owner_user_id: string | null;
          owner_team_id: string | null;
          created_by: string | null;
          next_action: string | null;
          notes: string | null;
          last_contact_at: string | null;
          next_follow_up_at: string | null;
          converted_to_collaborator: boolean;
          converted_collaborator_id: string | null;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          instagram_username: string;
          instagram_url?: string | null;
          phone?: string | null;
          city?: string | null;
          source?: string | null;
          status?: LeadStatus;
          priority?: LeadPriority;
          interest_level?: LeadInterest;
          owner_user_id?: string | null;
          owner_team_id?: string | null;
          created_by?: string | null;
          next_action?: string | null;
          notes?: string | null;
          last_contact_at?: string | null;
          next_follow_up_at?: string | null;
          converted_to_collaborator?: boolean;
          converted_collaborator_id?: string | null;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          instagram_username?: string;
          instagram_url?: string | null;
          phone?: string | null;
          city?: string | null;
          source?: string | null;
          status?: LeadStatus;
          priority?: LeadPriority;
          interest_level?: LeadInterest;
          owner_user_id?: string | null;
          owner_team_id?: string | null;
          created_by?: string | null;
          next_action?: string | null;
          notes?: string | null;
          last_contact_at?: string | null;
          next_follow_up_at?: string | null;
          converted_to_collaborator?: boolean;
          converted_collaborator_id?: string | null;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_manager: { Args: Record<string, never>; Returns: boolean };
      is_capo_pr: { Args: Record<string, never>; Returns: boolean };
      check_lead_duplicate: {
        Args: { p_username: string };
        Returns: {
          owner_name: string;
          lead_status: string;
          last_update: string;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
