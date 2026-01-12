export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name_ru: string;
          name_en: string;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name_ru: string;
          name_en: string;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name_ru?: string;
          name_en?: string;
          slug?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          category_id: string;
          name_ru: string;
          name_en: string;
          variety_ru: string | null;
          variety_en: string | null;
          origin_ru: string | null;
          origin_en: string | null;
          packaging_options: Json;
          moq: string | null;
          shelf_life: string | null;
          export_readiness: string | null;
          slug: string;
          image_urls: Json;
          hs_code: string | null;
          grade_ru: string | null;
          grade_en: string | null;
          origin_place_ru: string | null;
          origin_place_en: string | null;
          calibers: Json;
          processing_method_ru: string | null;
          processing_method_en: string | null;
          description_ru: string | null;
          description_en: string | null;
          is_active: boolean;
          is_featured: boolean;
          certificates_ru: Json;
          certificates_en: Json;
          seasonality: Json;
          logistics_info_ru: Json | null;
          logistics_info_en: Json | null;
          video_url: string | null;
          faqs_ru: Json;
          faqs_en: Json;
          view_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          category_id: string;
          name_ru: string;
          name_en: string;
          variety_ru?: string | null;
          variety_en?: string | null;
          origin_ru?: string | null;
          origin_en?: string | null;
          packaging_options?: Json;
          moq?: string | null;
          shelf_life?: string | null;
          export_readiness?: string | null;
          slug: string;
          image_urls?: Json;
          hs_code?: string | null;
          grade_ru?: string | null;
          grade_en?: string | null;
          origin_place_ru?: string | null;
          origin_place_en?: string | null;
          calibers?: Json;
          processing_method_ru?: string | null;
          processing_method_en?: string | null;
          description_ru?: string | null;
          description_en?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          certificates_ru?: Json;
          certificates_en?: Json;
          seasonality?: Json;
          logistics_info_ru?: Json | null;
          logistics_info_en?: Json | null;
          video_url?: string | null;
          faqs_ru?: Json;
          faqs_en?: Json;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string;
          name_ru?: string;
          name_en?: string;
          variety_ru?: string | null;
          variety_en?: string | null;
          origin_ru?: string | null;
          origin_en?: string | null;
          packaging_options?: Json;
          moq?: string | null;
          shelf_life?: string | null;
          export_readiness?: string | null;
          slug?: string;
          image_urls?: Json;
          hs_code?: string | null;
          grade_ru?: string | null;
          grade_en?: string | null;
          origin_place_ru?: string | null;
          origin_place_en?: string | null;
          calibers?: Json;
          processing_method_ru?: string | null;
          processing_method_en?: string | null;
          description_ru?: string | null;
          description_en?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          certificates_ru?: Json;
          certificates_en?: Json;
          seasonality?: Json;
          logistics_info_ru?: Json | null;
          logistics_info_en?: Json | null;
          video_url?: string | null;
          faqs_ru?: Json;
          faqs_en?: Json;
          view_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_views: {
        Row: {
          id: string;
          product_id: string;
          viewed_at: string;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          viewed_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          viewed_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      managers: {
        Row: {
          id: string;
          name: string;
          telegram_username: string;
          telegram_link: string;
          email: string | null;
          phone: string | null;
          whatsapp_link: string | null;
          is_active: boolean;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          telegram_username: string;
          telegram_link: string;
          email?: string | null;
          phone?: string | null;
          whatsapp_link?: string | null;
          is_active?: boolean;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          telegram_username?: string;
          telegram_link?: string;
          email?: string | null;
          phone?: string | null;
          whatsapp_link?: string | null;
          is_active?: boolean;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      inquiries: {
        Row: {
          id: string;
          product_id: string | null;
          manager_id: string;
          customer_name: string;
          customer_email: string | null;
          customer_phone: string | null;
          customer_company: string | null;
          message: string | null;
          telegram_sent: boolean;
          status: "new" | "contacted" | "closed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id?: string | null;
          manager_id: string;
          customer_name: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          customer_company?: string | null;
          message?: string | null;
          telegram_sent?: boolean;
          status?: "new" | "contacted" | "closed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string | null;
          manager_id?: string;
          customer_name?: string;
          customer_email?: string | null;
          customer_phone?: string | null;
          customer_company?: string | null;
          message?: string | null;
          telegram_sent?: boolean;
          status?: "new" | "contacted" | "closed";
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          role?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          role?: string;
          created_at?: string;
        };
      };
      product_submissions: {
        Row: {
          id: string;
          supplier_name: string;
          supplier_email: string | null;
          supplier_phone: string;
          supplier_company: string | null;
          supplier_location: string | null;
          product_name_ru: string;
          product_name_en: string;
          category_id: string | null;
          description_ru: string | null;
          description_en: string | null;
          hs_code: string | null;
          grade_ru: string | null;
          grade_en: string | null;
          origin_place_ru: string | null;
          origin_place_en: string | null;
          calibers: Json;
          processing_method_ru: string | null;
          processing_method_en: string | null;
          packaging_options: Json;
          moq: string | null;
          shelf_life: string | null;
          export_readiness: string | null;
          images: Json;
          certificates: Json;
          status: "pending" | "approved" | "rejected" | "needs_revision";
          rejection_reason: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          access_token: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_name: string;
          supplier_email?: string | null;
          supplier_phone: string;
          supplier_company?: string | null;
          supplier_location?: string | null;
          product_name_ru: string;
          product_name_en: string;
          category_id?: string | null;
          description_ru?: string | null;
          description_en?: string | null;
          hs_code?: string | null;
          grade_ru?: string | null;
          grade_en?: string | null;
          origin_place_ru?: string | null;
          origin_place_en?: string | null;
          calibers?: Json;
          processing_method_ru?: string | null;
          processing_method_en?: string | null;
          packaging_options?: Json;
          moq?: string | null;
          shelf_life?: string | null;
          export_readiness?: string | null;
          images?: Json;
          certificates?: Json;
          status?: "pending" | "approved" | "rejected" | "needs_revision";
          rejection_reason?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          access_token?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          supplier_name?: string;
          supplier_email?: string | null;
          supplier_phone?: string;
          supplier_company?: string | null;
          supplier_location?: string | null;
          product_name_ru?: string;
          product_name_en?: string;
          category_id?: string | null;
          description_ru?: string | null;
          description_en?: string | null;
          hs_code?: string | null;
          grade_ru?: string | null;
          grade_en?: string | null;
          origin_place_ru?: string | null;
          origin_place_en?: string | null;
          calibers?: Json;
          processing_method_ru?: string | null;
          processing_method_en?: string | null;
          packaging_options?: Json;
          moq?: string | null;
          shelf_life?: string | null;
          export_readiness?: string | null;
          images?: Json;
          certificates?: Json;
          status?: "pending" | "approved" | "rejected" | "needs_revision";
          rejection_reason?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          access_token?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_market_quotes: {
        Row: {
          id: string;
          product_id: string;
          quote_date: string;
          incoterm: string;
          unit: string;
          price_mid_usd: number;
          tolerance_usd: number;
          notes: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          quote_date: string;
          incoterm?: string;
          unit?: string;
          price_mid_usd: number;
          tolerance_usd?: number;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          quote_date?: string;
          incoterm?: string;
          unit?: string;
          price_mid_usd?: number;
          tolerance_usd?: number;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
      fx_rates_daily: {
        Row: {
          rate_date: string;
          usd_uzs: number;
          source: string | null;
          created_at: string;
        };
        Insert: {
          rate_date: string;
          usd_uzs: number;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          rate_date?: string;
          usd_uzs?: number;
          source?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

