// Script temporário para atualizar o vídeo do empreendimento Casa Volpi (Cópia)
// Execute este script uma vez para adicionar o vídeo do YouTube

import { supabase } from '@/integrations/supabase/client';

export async function updateCasaVolpiVideo() {
  const { data, error } = await supabase
    .from('st_empreendimentos')
    .update({ 
      hero_video_url: 'https://www.youtube.com/watch?v=xvFZjo5PgG0'
    })
    .eq('slug', 'casa-volpi-copia')
    .select();

  if (error) {
    console.error('Erro ao atualizar vídeo:', error);
    return { success: false, error };
  }

  console.log('Vídeo atualizado com sucesso:', data);
  return { success: true, data };
}

// Para executar: importe esta função em algum componente temporário
// e chame-a no useEffect ou em um botão de teste
