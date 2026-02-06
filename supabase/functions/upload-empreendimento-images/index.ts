import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.80.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verificar autenticação admin
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Não autorizado');
    }

    // Verificar se é admin
    const { data: isAdmin } = await supabaseClient.rpc('is_st_admin', { user_id: user.id });
    if (!isAdmin) {
      throw new Error('Apenas administradores podem fazer upload de imagens');
    }

    // Mapear slugs para imagens locais (URLs que precisam ser baixadas)
    const imagesToUpload = [
      {
        slug: 'casa-volpi',
        card: 'casa-volpi-card.jpg',
        hero: 'casa-volpi-hero.jpg',
        logo: 'casa-volpi-logo.webp'
      },
      {
        slug: 'splendore',
        card: 'splendore-card.jpg',
        hero: 'splendore-hero.jpg',
        logo: 'splendore-logo.webp'
      },
      {
        slug: 'parque-imbuias',
        card: 'parque-imbuias-card.jpg',
        hero: 'parque-imbuias-hero.jpg',
        logo: null
      },
      {
        slug: 'tannenbaum',
        card: 'tannenbaum-card.jpg',
        hero: null,
        logo: null
      }
    ];

    const results = [];

    for (const item of imagesToUpload) {
      // Upload card image
      if (item.card) {
        const cardPath = `cards/${item.slug}-card.jpg`;
        // Nota: Em produção, você precisaria buscar a imagem real dos assets
        // Por enquanto, apenas registramos que o path foi configurado
        console.log(`Configured card image path: ${cardPath}`);
      }

      // Upload hero image
      if (item.hero) {
        const heroPath = `hero/${item.slug}-hero.jpg`;
        console.log(`Configured hero image path: ${heroPath}`);
      }

      // Upload logo image
      if (item.logo) {
        const logoPath = `logos/${item.slug}-logo.webp`;
        console.log(`Configured logo image path: ${logoPath}`);
      }

      results.push({ slug: item.slug, status: 'paths_configured' });
    }

    return new Response(
      JSON.stringify({ 
        message: 'Image paths configured successfully',
        note: 'Please upload images manually to Supabase Storage bucket "empreendimentos" using the paths specified in the database',
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
