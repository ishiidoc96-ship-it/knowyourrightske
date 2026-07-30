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
      content: {
        Row: {
          id: string
          title: string
          platform: 'tiktok' | 'instagram' | 'youtube' | 'podcast'
          embed_url: string
          topic_tag: string
          description: string
          published_at: string
        }
        Insert: {
          id?: string
          title: string
          platform: 'tiktok' | 'instagram' | 'youtube' | 'podcast'
          embed_url: string
          topic_tag: string
          description: string
          published_at?: string
        }
        Update: {
          id?: string
          title?: string
          platform?: 'tiktok' | 'instagram' | 'youtube' | 'podcast'
          embed_url?: string
          topic_tag?: string
          description?: string
          published_at?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          id: string
          title: string
          topic_tag: string
          summary: string
          body: string
          related_content_id: string | null
          published_at: string
        }
        Insert: {
          id?: string
          title: string
          topic_tag: string
          summary: string
          body: string
          related_content_id?: string | null
          published_at?: string
        }
        Update: {
          id?: string
          title?: string
          topic_tag?: string
          summary?: string
          body?: string
          related_content_id?: string | null
          published_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "articles_related_content_id_fkey"
            columns: ["related_content_id"]
            referencedRelation: "content"
            referencedColumns: ["id"]
          }
        ]
      }
      gallery: {
        Row: {
          id: string
          media_type: 'video' | 'photo'
          platform: 'tiktok' | 'instagram' | 'youtube' | 'facebook'
          title: string
          embed_or_image_url: string
          topic_tag: string
          thumbnail_url: string | null
          published_at: string
        }
        Insert: {
          id?: string
          media_type: 'video' | 'photo'
          platform: 'tiktok' | 'instagram' | 'youtube' | 'facebook'
          title: string
          embed_or_image_url: string
          topic_tag: string
          thumbnail_url?: string | null
          published_at?: string
        }
        Update: {
          id?: string
          media_type?: 'video' | 'photo'
          platform?: 'tiktok' | 'instagram' | 'youtube' | 'facebook'
          title?: string
          embed_or_image_url?: string
          topic_tag?: string
          thumbnail_url?: string | null
          published_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: string
          question_text: string
          topic_tag: string | null
          email: string | null
          status: 'pending' | 'answered'
          answer_link: string | null
          submitted_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          question_text: string
          topic_tag?: string | null
          email?: string | null
          status?: 'pending' | 'answered'
          answer_link?: string | null
          submitted_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          question_text?: string
          topic_tag?: string | null
          email?: string | null
          status?: 'pending' | 'answered'
          answer_link?: string | null
          submitted_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
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
