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

export type CollaboratorLevel =
  | "bacheca"
  | "collaboratore_occasionale"
  | "sotto_pr"
  | "pr_attivo"
  | "pr_stretto"
  | "capo_pr"
  | "core_team";

export type CollaboratorStatus =
  | "in_prova"
  | "attivo"
  | "molto_attivo"
  | "occasionale"
  | "dormiente"
  | "da_riattivare"
  | "non_affidabile"
  | "uscito";

export type GroupType = "bacheca" | "pr" | "sotto_pr";

export type EventStatus =
  | "bozza"
  | "in_preparazione"
  | "attivo"
  | "chiuso"
  | "completato"
  | "annullato";

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
          avatar_url: string | null;
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
          avatar_url?: string | null;
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
          avatar_url?: string | null;
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
      teams: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          capo_pr_user_id: string;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          capo_pr_user_id: string;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          capo_pr_user_id?: string;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      collaborators: {
        Row: {
          id: string;
          lead_id: string | null;
          first_name: string | null;
          last_name: string | null;
          instagram_username: string;
          instagram_url: string | null;
          avatar_url: string | null;
          phone: string | null;
          city: string | null;
          level: CollaboratorLevel;
          status: CollaboratorStatus;
          team_id: string | null;
          capo_pr_user_id: string | null;
          notes: string | null;
          reliability_notes: string | null;
          joined_board_at: string | null;
          joined_team_at: string | null;
          last_active_at: string | null;
          is_archived: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          instagram_username: string;
          instagram_url?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          city?: string | null;
          level?: CollaboratorLevel;
          status?: CollaboratorStatus;
          team_id?: string | null;
          capo_pr_user_id?: string | null;
          notes?: string | null;
          reliability_notes?: string | null;
          joined_board_at?: string | null;
          joined_team_at?: string | null;
          last_active_at?: string | null;
          is_archived?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          instagram_username?: string;
          instagram_url?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          city?: string | null;
          level?: CollaboratorLevel;
          status?: CollaboratorStatus;
          team_id?: string | null;
          capo_pr_user_id?: string | null;
          notes?: string | null;
          reliability_notes?: string | null;
          joined_board_at?: string | null;
          joined_team_at?: string | null;
          last_active_at?: string | null;
          is_archived?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      whatsapp_groups: {
        Row: {
          id: string;
          name: string;
          type: GroupType;
          invite_link: string | null;
          team_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type?: GroupType;
          invite_link?: string | null;
          team_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: GroupType;
          invite_link?: string | null;
          team_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          collaborator_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          collaborator_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          collaborator_id?: string;
          joined_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          name: string;
          event_date: string;
          venue: string | null;
          city: string | null;
          description: string | null;
          ticket_url: string | null;
          target_attendance: number | null;
          status: EventStatus;
          post_event_notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          event_date: string;
          venue?: string | null;
          city?: string | null;
          description?: string | null;
          ticket_url?: string | null;
          target_attendance?: number | null;
          status?: EventStatus;
          post_event_notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          event_date?: string;
          venue?: string | null;
          city?: string | null;
          description?: string | null;
          ticket_url?: string | null;
          target_attendance?: number | null;
          status?: EventStatus;
          post_event_notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      event_team_assignments: {
        Row: {
          id: string;
          event_id: string;
          team_id: string;
          assigned_by: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          team_id: string;
          assigned_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          team_id?: string;
          assigned_by?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      event_collaborator_performances: {
        Row: {
          id: string;
          event_id: string;
          collaborator_id: string;
          team_id: string | null;
          capo_pr_user_id: string | null;
          confirmed_support: boolean;
          shared_story: boolean;
          broadcast_sent: boolean;
          list_names_count: number;
          tickets_sold_count: number;
          tables_count: number;
          actual_entries_count: number;
          negative_behavior: boolean;
          performance_score: number;
          notes: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          collaborator_id: string;
          team_id?: string | null;
          capo_pr_user_id?: string | null;
          confirmed_support?: boolean;
          shared_story?: boolean;
          broadcast_sent?: boolean;
          list_names_count?: number;
          tickets_sold_count?: number;
          tables_count?: number;
          actual_entries_count?: number;
          negative_behavior?: boolean;
          performance_score?: number;
          notes?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          collaborator_id?: string;
          team_id?: string | null;
          capo_pr_user_id?: string | null;
          confirmed_support?: boolean;
          shared_story?: boolean;
          broadcast_sent?: boolean;
          list_names_count?: number;
          tickets_sold_count?: number;
          tables_count?: number;
          actual_entries_count?: number;
          negative_behavior?: boolean;
          performance_score?: number;
          notes?: string | null;
          updated_by?: string | null;
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
      owns_team: { Args: { team_uuid: string }; Returns: boolean };
      convert_lead_to_collaborator: {
        Args: { p_lead_id: string };
        Returns: string;
      };
      check_lead_duplicate: {
        Args: { p_username: string };
        Returns: {
          owner_name: string;
          lead_status: string;
          last_update: string;
        }[];
      };
      ranking_collaborators: {
        Args: Record<string, never>;
        Returns: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          instagram_username: string;
          avatar_url: string | null;
          team_id: string | null;
          level: CollaboratorLevel;
          status: CollaboratorStatus;
          last_active_at: string | null;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
