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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      banner_translations: {
        Row: {
          banner_id: string
          button_text: string | null
          created_at: string | null
          description: string | null
          id: string
          language_code: string
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          banner_id: string
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          language_code: string
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          banner_id?: string
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          language_code?: string
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banner_translations_banner_id_fkey"
            columns: ["banner_id"]
            isOneToOne: false
            referencedRelation: "banners"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          brand_id: string | null
          button_text: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          hotel_id: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          link_target: string | null
          link_url: string | null
          order_index: number | null
          position: string | null
          start_date: string | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          brand_id?: string | null
          button_text?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          hotel_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_target?: string | null
          link_url?: string | null
          order_index?: number | null
          position?: string | null
          start_date?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          brand_id?: string | null
          button_text?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          hotel_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_target?: string | null
          link_url?: string | null
          order_index?: number | null
          position?: string | null
          start_date?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banners_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "banners_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          code: string | null
          color_primary: string | null
          color_secondary: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          color_primary?: string | null
          color_secondary?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          color_primary?: string | null
          color_secondary?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      files: {
        Row: {
          brand_id: string | null
          created_at: string | null
          description: string | null
          download_count: number | null
          duration: number | null
          file_path: string
          file_size: number | null
          file_url: string | null
          folder_id: string | null
          height: number | null
          hotel_id: string | null
          id: string
          is_deleted: boolean | null
          is_public: boolean | null
          metadata: Json | null
          mime_type: string | null
          name: string
          original_name: string
          processing_status: string | null
          share_expires_at: string | null
          share_token: string | null
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string | null
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          duration?: number | null
          file_path: string
          file_size?: number | null
          file_url?: string | null
          folder_id?: string | null
          height?: number | null
          hotel_id?: string | null
          id?: string
          is_deleted?: boolean | null
          is_public?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          name: string
          original_name: string
          processing_status?: string | null
          share_expires_at?: string | null
          share_token?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          description?: string | null
          download_count?: number | null
          duration?: number | null
          file_path?: string
          file_size?: number | null
          file_url?: string | null
          folder_id?: string | null
          height?: number | null
          hotel_id?: string | null
          id?: string
          is_deleted?: boolean | null
          is_public?: boolean | null
          metadata?: Json | null
          mime_type?: string | null
          name?: string
          original_name?: string
          processing_status?: string | null
          share_expires_at?: string | null
          share_token?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "files_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "files_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      folder_translations: {
        Row: {
          created_at: string | null
          description: string | null
          folder_id: string
          id: string
          language_code: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          folder_id: string
          id?: string
          language_code: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          folder_id?: string
          id?: string
          language_code?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folder_translations_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          brand_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          hotel_id: string | null
          id: string
          image_url: string | null
          is_deleted: boolean | null
          is_public: boolean | null
          name: string
          order_index: number | null
          parent_id: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          image_url?: string | null
          is_deleted?: boolean | null
          is_public?: boolean | null
          name: string
          order_index?: number | null
          parent_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          image_url?: string | null
          is_deleted?: boolean | null
          is_public?: boolean | null
          name?: string
          order_index?: number | null
          parent_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "folders_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          code: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          location: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          location?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          created_at: string | null
          destination: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          menu_id: string
          order_index: number | null
          parent_id: string | null
          target: string | null
          title: string
          type: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          destination?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          menu_id: string
          order_index?: number | null
          parent_id?: string | null
          target?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          destination?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          menu_id?: string
          order_index?: number | null
          parent_id?: string | null
          target?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_translations: {
        Row: {
          created_at: string | null
          id: string
          language_code: string
          menu_id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          language_code: string
          menu_id: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          language_code?: string
          menu_id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_translations_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "menus"
            referencedColumns: ["id"]
          },
        ]
      }
      menus: {
        Row: {
          brand_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          hotel_id: string | null
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
          slug: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
          slug: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          slug?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menus_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menus_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      page_settings: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          page_type: string
          settings: Json | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          page_type: string
          settings?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          page_type?: string
          settings?: Json | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          brand_id: string | null
          content: string | null
          created_at: string | null
          created_by: string | null
          excerpt: string | null
          featured_image: string | null
          hotel_id: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          status: string | null
          template: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          brand_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          featured_image?: string | null
          hotel_id?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          status?: string | null
          template?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          brand_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          featured_image?: string | null
          hotel_id?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          template?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      pinned_folders: {
        Row: {
          created_at: string | null
          folder_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          folder_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          folder_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pinned_folders_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
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
          preferences: Json | null
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          preferences?: Json | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      st_banners_home: {
        Row: {
          background_image: string
          created_at: string | null
          id: string
          is_active: boolean | null
          link_destino: string
          logo_alt: string | null
          logo_image: string | null
          ordem: number | null
          subtitulo: string | null
          texto_botao: string | null
          titulo: string
          updated_at: string | null
        }
        Insert: {
          background_image: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          link_destino: string
          logo_alt?: string | null
          logo_image?: string | null
          ordem?: number | null
          subtitulo?: string | null
          texto_botao?: string | null
          titulo: string
          updated_at?: string | null
        }
        Update: {
          background_image?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          link_destino?: string
          logo_alt?: string | null
          logo_image?: string | null
          ordem?: number | null
          subtitulo?: string | null
          texto_botao?: string | null
          titulo?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      st_blog_posts: {
        Row: {
          autor_id: string | null
          autor_nome: string | null
          categoria: string | null
          conteudo: string | null
          created_at: string | null
          data_publicacao: string | null
          id: string
          imagem_card: string | null
          imagem_destaque: string | null
          is_destaque: boolean | null
          is_published: boolean | null
          resumo: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          tags: string[] | null
          titulo: string
          updated_at: string | null
          visualizacoes: number | null
        }
        Insert: {
          autor_id?: string | null
          autor_nome?: string | null
          categoria?: string | null
          conteudo?: string | null
          created_at?: string | null
          data_publicacao?: string | null
          id?: string
          imagem_card?: string | null
          imagem_destaque?: string | null
          is_destaque?: boolean | null
          is_published?: boolean | null
          resumo?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          tags?: string[] | null
          titulo: string
          updated_at?: string | null
          visualizacoes?: number | null
        }
        Update: {
          autor_id?: string | null
          autor_nome?: string | null
          categoria?: string | null
          conteudo?: string | null
          created_at?: string | null
          data_publicacao?: string | null
          id?: string
          imagem_card?: string | null
          imagem_destaque?: string | null
          is_destaque?: boolean | null
          is_published?: boolean | null
          resumo?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          tags?: string[] | null
          titulo?: string
          updated_at?: string | null
          visualizacoes?: number | null
        }
        Relationships: []
      }
      st_casas: {
        Row: {
          amenidades: Json | null
          area_privativa: number | null
          area_terreno: number | null
          banheiros: number | null
          caracteristicas: Json | null
          comodidades: Json | null
          created_at: string | null
          descricao_curta: string | null
          descricao_detalhada: string | null
          destaque: boolean | null
          empreendimento_id: string | null
          foto_capa: string | null
          galeria: Json | null
          hero_image: string | null
          id: string
          is_active: boolean | null
          mapa_google_embed: string | null
          metragem: number | null
          nome: string
          ordem: number | null
          ordem_business: number | null
          ordem_select: number | null
          pavimentos: number | null
          planta_image: string | null
          plantas: Json | null
          preco: number | null
          quartos: number | null
          slug: string
          status: string | null
          suites: number | null
          tags: string[] | null
          tem_lavabo: boolean | null
          tipo: string | null
          tour_360_url: string | null
          updated_at: string | null
          vagas: number | null
          video_url: string | null
        }
        Insert: {
          amenidades?: Json | null
          area_privativa?: number | null
          area_terreno?: number | null
          banheiros?: number | null
          caracteristicas?: Json | null
          comodidades?: Json | null
          created_at?: string | null
          descricao_curta?: string | null
          descricao_detalhada?: string | null
          destaque?: boolean | null
          empreendimento_id?: string | null
          foto_capa?: string | null
          galeria?: Json | null
          hero_image?: string | null
          id?: string
          is_active?: boolean | null
          mapa_google_embed?: string | null
          metragem?: number | null
          nome: string
          ordem?: number | null
          ordem_business?: number | null
          ordem_select?: number | null
          pavimentos?: number | null
          planta_image?: string | null
          plantas?: Json | null
          preco?: number | null
          quartos?: number | null
          slug: string
          status?: string | null
          suites?: number | null
          tags?: string[] | null
          tem_lavabo?: boolean | null
          tipo?: string | null
          tour_360_url?: string | null
          updated_at?: string | null
          vagas?: number | null
          video_url?: string | null
        }
        Update: {
          amenidades?: Json | null
          area_privativa?: number | null
          area_terreno?: number | null
          banheiros?: number | null
          caracteristicas?: Json | null
          comodidades?: Json | null
          created_at?: string | null
          descricao_curta?: string | null
          descricao_detalhada?: string | null
          destaque?: boolean | null
          empreendimento_id?: string | null
          foto_capa?: string | null
          galeria?: Json | null
          hero_image?: string | null
          id?: string
          is_active?: boolean | null
          mapa_google_embed?: string | null
          metragem?: number | null
          nome?: string
          ordem?: number | null
          ordem_business?: number | null
          ordem_select?: number | null
          pavimentos?: number | null
          planta_image?: string | null
          plantas?: Json | null
          preco?: number | null
          quartos?: number | null
          slug?: string
          status?: string | null
          suites?: number | null
          tags?: string[] | null
          tem_lavabo?: boolean | null
          tipo?: string | null
          tour_360_url?: string | null
          updated_at?: string | null
          vagas?: number | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "st_casas_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "st_empreendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      st_config: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json | null
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json | null
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json | null
        }
        Relationships: []
      }
      st_contatos: {
        Row: {
          atendido_em: string | null
          atendido_por: string | null
          created_at: string | null
          email: string
          empreendimento_id: string | null
          id: string
          interesse: string | null
          mensagem: string | null
          nome: string
          notas_internas: string | null
          origem: string | null
          status: string | null
          telefone: string | null
          updated_at: string | null
          url_origem: string | null
        }
        Insert: {
          atendido_em?: string | null
          atendido_por?: string | null
          created_at?: string | null
          email: string
          empreendimento_id?: string | null
          id?: string
          interesse?: string | null
          mensagem?: string | null
          nome: string
          notas_internas?: string | null
          origem?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          url_origem?: string | null
        }
        Update: {
          atendido_em?: string | null
          atendido_por?: string | null
          created_at?: string | null
          email?: string
          empreendimento_id?: string | null
          id?: string
          interesse?: string | null
          mensagem?: string | null
          nome?: string
          notas_internas?: string | null
          origem?: string | null
          status?: string | null
          telefone?: string | null
          updated_at?: string | null
          url_origem?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "st_contatos_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "st_empreendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      st_empreendimentos: {
        Row: {
          amenidades: Json | null
          card_image: string | null
          created_at: string | null
          created_by: string | null
          descricao: string | null
          descricao_curta: string | null
          destaque: boolean | null
          diferenciais: Json | null
          endereco_bairro: string | null
          endereco_cep: string | null
          endereco_cidade: string | null
          endereco_rua: string | null
          endereco_uf: string | null
          galeria: Json | null
          galeria_videos: Json | null
          hero_image: string | null
          hero_video_url: string | null
          id: string
          implantacao_imagem: string | null
          is_active: boolean | null
          localizacao: string | null
          localizacao_detalhes: Json | null
          logo_image: string | null
          mapa_google_embed: string | null
          metragem_final: number | null
          metragem_inicial: number | null
          mostrar_implantacao: boolean | null
          nome: string
          ordem: number | null
          ordem_select: number | null
          plantas: Json | null
          preco_inicial: number | null
          previsao_entrega: string | null
          quartos_max: number | null
          quartos_min: number | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slogan_subtitulo: string | null
          slug: string
          status: string | null
          suites_min: number | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          amenidades?: Json | null
          card_image?: string | null
          created_at?: string | null
          created_by?: string | null
          descricao?: string | null
          descricao_curta?: string | null
          destaque?: boolean | null
          diferenciais?: Json | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_rua?: string | null
          endereco_uf?: string | null
          galeria?: Json | null
          galeria_videos?: Json | null
          hero_image?: string | null
          hero_video_url?: string | null
          id?: string
          implantacao_imagem?: string | null
          is_active?: boolean | null
          localizacao?: string | null
          localizacao_detalhes?: Json | null
          logo_image?: string | null
          mapa_google_embed?: string | null
          metragem_final?: number | null
          metragem_inicial?: number | null
          mostrar_implantacao?: boolean | null
          nome: string
          ordem?: number | null
          ordem_select?: number | null
          plantas?: Json | null
          preco_inicial?: number | null
          previsao_entrega?: string | null
          quartos_max?: number | null
          quartos_min?: number | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slogan_subtitulo?: string | null
          slug: string
          status?: string | null
          suites_min?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          amenidades?: Json | null
          card_image?: string | null
          created_at?: string | null
          created_by?: string | null
          descricao?: string | null
          descricao_curta?: string | null
          destaque?: boolean | null
          diferenciais?: Json | null
          endereco_bairro?: string | null
          endereco_cep?: string | null
          endereco_cidade?: string | null
          endereco_rua?: string | null
          endereco_uf?: string | null
          galeria?: Json | null
          galeria_videos?: Json | null
          hero_image?: string | null
          hero_video_url?: string | null
          id?: string
          implantacao_imagem?: string | null
          is_active?: boolean | null
          localizacao?: string | null
          localizacao_detalhes?: Json | null
          logo_image?: string | null
          mapa_google_embed?: string | null
          metragem_final?: number | null
          metragem_inicial?: number | null
          mostrar_implantacao?: boolean | null
          nome?: string
          ordem?: number | null
          ordem_select?: number | null
          plantas?: Json | null
          preco_inicial?: number | null
          previsao_entrega?: string | null
          quartos_max?: number | null
          quartos_min?: number | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slogan_subtitulo?: string | null
          slug?: string
          status?: string | null
          suites_min?: number | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      st_page_settings: {
        Row: {
          hero_cta_link: string | null
          hero_cta_text: string | null
          hero_description: string | null
          hero_image: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          is_active: boolean | null
          page_type: string
          sections: Json | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          hero_cta_link?: string | null
          hero_cta_text?: string | null
          hero_description?: string | null
          hero_image?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          is_active?: boolean | null
          page_type: string
          sections?: Json | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          hero_cta_link?: string | null
          hero_cta_text?: string | null
          hero_description?: string | null
          hero_image?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          is_active?: boolean | null
          page_type?: string
          sections?: Json | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      st_taxonomia_comodidades: {
        Row: {
          created_at: string | null
          icone: string | null
          id: string
          is_active: boolean | null
          nome: string
          ordem: number | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          icone?: string | null
          id?: string
          is_active?: boolean | null
          nome: string
          ordem?: number | null
          slug: string
        }
        Update: {
          created_at?: string | null
          icone?: string | null
          id?: string
          is_active?: boolean | null
          nome?: string
          ordem?: number | null
          slug?: string
        }
        Relationships: []
      }
      st_taxonomia_itens_lazer: {
        Row: {
          created_at: string | null
          icone: string | null
          id: string
          is_active: boolean | null
          nome: string
          ordem: number | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          icone?: string | null
          id?: string
          is_active?: boolean | null
          nome: string
          ordem?: number | null
          slug: string
        }
        Update: {
          created_at?: string | null
          icone?: string | null
          id?: string
          is_active?: boolean | null
          nome?: string
          ordem?: number | null
          slug?: string
        }
        Relationships: []
      }
      st_user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { user_id?: string }; Returns: boolean }
      is_st_admin: { Args: { user_id?: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
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
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
