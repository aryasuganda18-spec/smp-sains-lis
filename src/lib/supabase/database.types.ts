export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      admin_profiles: {
        Row: { created_at: string; id: string; name: string; role: string };
        Insert: { created_at?: string; id: string; name?: string; role?: string };
        Update: { created_at?: string; id?: string; name?: string; role?: string };
        Relationships: [];
      };
      albums: {
        Row: {
          cover_image_path: string | null;
          cover_image_url: string | null;
          created_at: string;
          description: string;
          id: string;
          title: string;
        };
        Insert: {
          cover_image_path?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          description?: string;
          id?: string;
          title: string;
        };
        Update: {
          cover_image_path?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          description?: string;
          id?: string;
          title?: string;
        };
        Relationships: [];
      };
      announcements: {
        Row: { content: string; created_at: string; id: string; published: boolean; title: string };
        Insert: { content: string; created_at?: string; id?: string; published?: boolean; title: string };
        Update: { content?: string; created_at?: string; id?: string; published?: boolean; title?: string };
        Relationships: [];
      };
      articles: {
        Row: {
          author: string;
          category: string;
          content: string;
          cover_image_path: string | null;
          cover_image_url: string | null;
          created_at: string;
          excerpt: string;
          id: string;
          published_at: string | null;
          slug: string;
          status: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          author?: string;
          category?: string;
          content?: string;
          cover_image_path?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          published_at?: string | null;
          slug: string;
          status?: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          author?: string;
          category?: string;
          content?: string;
          cover_image_path?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string;
          id?: string;
          published_at?: string | null;
          slug?: string;
          status?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      gallery_photos: {
        Row: { album_id: string; caption: string; created_at: string; file_path: string; file_url: string; id: string };
        Insert: { album_id: string; caption?: string; created_at?: string; file_path: string; file_url: string; id?: string };
        Update: { album_id?: string; caption?: string; created_at?: string; file_path?: string; file_url?: string; id?: string };
        Relationships: [
          {
            foreignKeyName: 'gallery_photos_album_id_fkey';
            columns: ['album_id'];
            isOneToOne: false;
            referencedRelation: 'albums';
            referencedColumns: ['id'];
          },
        ];
      };
      ppdb_registrations: {
        Row: {
          boarding_interest: boolean | null;
          created_at: string;
          email: string;
          id: string;
          message: string;
          nisn: string;
          parent_job: string;
          parent_name: string;
          previous_school: string;
          source: string;
          status: string;
          student_address: string;
          student_birthdate: string | null;
          student_birthplace: string;
          student_gender: string | null;
          student_name: string;
          whatsapp: string;
        };
        Insert: {
          boarding_interest?: boolean | null;
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          nisn?: string;
          parent_job?: string;
          parent_name: string;
          previous_school?: string;
          source?: string;
          status?: string;
          student_address?: string;
          student_birthdate?: string | null;
          student_birthplace?: string;
          student_gender?: string | null;
          student_name: string;
          whatsapp: string;
        };
        Update: {
          boarding_interest?: boolean | null;
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          nisn?: string;
          parent_job?: string;
          parent_name?: string;
          previous_school?: string;
          source?: string;
          status?: string;
          student_address?: string;
          student_birthdate?: string | null;
          student_birthplace?: string;
          student_gender?: string | null;
          student_name?: string;
          whatsapp?: string;
        };
        Relationships: [];
      };
      videos: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          published: boolean;
          thumbnail: string | null;
          title: string;
          video_url: string;
        };
        Insert: {
          created_at?: string;
          description?: string;
          id?: string;
          published?: boolean;
          thumbnail?: string | null;
          title: string;
          video_url: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          published?: boolean;
          thumbnail?: string | null;
          title?: string;
          video_url?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      albums_with_cover: {
        Row: {
          cover_image_url: string | null;
          created_at: string | null;
          description: string | null;
          id: string | null;
          title: string | null;
        };
        Relationships: [];
      };
    };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
