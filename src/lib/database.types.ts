export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string; email: string; phone: string | null; role: string; status: string; created_at: string; updated_at: string; last_active_at: string | null };
        Insert: { id: string; full_name: string; email: string; phone?: string | null; role: string; status?: string };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      farms: {
        Row: { id: string; name: string; code: string; location: string | null; district: string | null; state: string | null; country: string | null; total_acres: number; status: string; created_by: string | null; created_at: string; updated_at: string };
        Insert: { name: string; code: string; location?: string | null; district?: string | null; state?: string | null; country?: string | null; total_acres?: number; created_by?: string | null };
        Update: Partial<Database["public"]["Tables"]["farms"]["Insert"]>;
      };
      fields: {
        Row: { id: string; farm_id: string; name: string; code: string; area_acres: number; total_trees: number; status: string; created_at: string; updated_at: string };
        Insert: { farm_id: string; name: string; code: string; area_acres?: number; total_trees?: number; status?: string };
        Update: Partial<Database["public"]["Tables"]["fields"]["Insert"]>;
      };
      trees: {
        Row: { id: string; tree_code: string; farm_id: string; field_id: string; latitude: number; longitude: number; current_health_status: string; current_disease_stage: string; current_confidence: number | null; latest_image_url: string | null; inspection_status: string; treatment_status: string; risk_score: number; is_active: boolean; created_at: string; updated_at: string };
        Insert: { tree_code: string; farm_id: string; field_id: string; latitude: number; longitude: number; current_health_status?: string; current_disease_stage?: string; current_confidence?: number | null };
        Update: Partial<Database["public"]["Tables"]["trees"]["Insert"]>;
      };
      inspections: {
        Row: { id: string; tree_id: string; farm_id: string; field_id: string; assigned_to: string | null; assigned_by: string | null; status: string; priority: string; due_date: string | null; inspection_result: string | null; corrected_stage: string | null; inspector_notes: string | null; inspected_at: string | null; created_at: string; updated_at: string };
        Insert: { tree_id: string; farm_id: string; field_id: string; assigned_to?: string | null; assigned_by?: string | null; status?: string; priority?: string; due_date?: string | null };
        Update: Partial<Database["public"]["Tables"]["inspections"]["Insert"]>;
      };
      false_positive_reports: {
        Row: { id: string; tree_id: string | null; farm_id: string | null; field_id: string | null; ai_prediction: string | null; ai_stage: string | null; ai_confidence: number | null; reason_tag: string | null; status: string; dev_notes: string | null; created_at: string };
        Insert: { tree_id?: string | null; farm_id?: string | null; field_id?: string | null; ai_prediction?: string | null; ai_stage?: string | null; ai_confidence?: number | null; reason_tag?: string | null; status?: string; dev_notes?: string | null };
        Update: Partial<Database["public"]["Tables"]["false_positive_reports"]["Insert"]>;
      };
    };
  };
}
