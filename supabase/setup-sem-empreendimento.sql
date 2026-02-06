-- ============================================
-- SETUP: Empreendimento "Sem Empreendimento"
-- ============================================
-- 
-- Este script cria um empreendimento placeholder para casas
-- que não estão vinculadas a um empreendimento específico.
--
-- INSTRUÇÕES:
-- 1. Acesse o Supabase Dashboard: https://supabase.com/dashboard/project/byhkitxlcaxbddssnypy/sql/new
-- 2. Cole este script completo no SQL Editor
-- 3. Execute o script
-- 4. Faça um hard refresh no navegador (Ctrl+Shift+R ou Cmd+Shift+R)
--
-- ============================================

-- 1. Criar empreendimento "Sem Empreendimento"
INSERT INTO st_empreendimentos (
  nome,
  slug,
  status,
  is_active,
  descricao,
  descricao_curta,
  endereco_cidade,
  endereco_bairro,
  endereco_uf,
  tags,
  ordem,
  preco_inicial,
  metragem_inicial,
  metragem_final,
  quartos_min,
  quartos_max
) VALUES (
  'Sem Empreendimento',
  'sem-empreendimento',
  'arquivado',      -- Status 'arquivado' para não aparecer em listagens
  false,            -- is_active = false como camada extra de segurança
  'Empreendimento placeholder do sistema para casas avulsas. NÃO DELETAR.',
  'Placeholder do sistema',
  'Curitiba',
  'Centro',
  'PR',
  ARRAY['sistema'], -- Tag especial para identificar como empreendimento do sistema
  9999,             -- Ordem alta para ficar no final
  0,
  0,
  0,
  0,
  0
)
ON CONFLICT (slug) DO UPDATE SET
  nome = EXCLUDED.nome,
  status = EXCLUDED.status,
  is_active = EXCLUDED.is_active,
  tags = EXCLUDED.tags,
  descricao = EXCLUDED.descricao;

-- 2. Atualizar casas sem empreendimento
-- Vincula todas as casas que têm empreendimento_id NULL ao novo empreendimento
UPDATE st_casas 
SET empreendimento_id = (
  SELECT id FROM st_empreendimentos WHERE slug = 'sem-empreendimento'
)
WHERE empreendimento_id IS NULL;

-- 3. Verificar resultados
SELECT 
  'Empreendimento criado:' as info,
  id,
  nome,
  slug,
  status,
  is_active,
  tags
FROM st_empreendimentos 
WHERE slug = 'sem-empreendimento';

SELECT 
  'Casas atualizadas:' as info,
  COUNT(*) as total_casas_vinculadas
FROM st_casas 
WHERE empreendimento_id = (
  SELECT id FROM st_empreendimentos WHERE slug = 'sem-empreendimento'
);

-- ============================================
-- NOTAS IMPORTANTES:
-- ============================================
--
-- O empreendimento "Sem Empreendimento":
-- - NÃO deve ser deletado
-- - NÃO deve ter is_active alterado para true
-- - NÃO deve ter status alterado para "publicado"
-- - NÃO aparecerá em listagens públicas devido aos filtros
-- - Serve apenas como placeholder para relacionamentos
--
-- Características de segurança:
-- - status = 'arquivado' (filtrado em useEmpreendimentos)
-- - is_active = false (filtrado em useEmpreendimentos)
-- - tags = ['sistema'] (filtrado em useEmpreendimentos)
-- - Tripla proteção para garantir que nunca apareça publicamente
--
-- ============================================
