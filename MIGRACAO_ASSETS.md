# Migração de Assets Locais para Supabase Storage

## ⚠️ Problema Identificado

Vários registros no banco de dados ainda referenciam imagens com caminhos locais (`/src/assets/...`) que não funcionam em produção, causando erros 404.

## 📋 Arquivos que Precisam Ser Migrados

### Para o bucket `empreendimentos`:

1. **hero-house.jpg** (usado em 2 banners)
2. **splendore-logo.webp** (usado em 1 banner)
3. **casa-volpi-card.jpg** (usado em 1 empreendimento + 2 casas)
4. **casa-volpi-hero.jpg** (usado em 1 empreendimento)
5. **splendore-card.jpg** (usado em 2 casas)
6. **parque-imbuias-card.jpg** (usado em 2 casas)

## 🚀 Passo a Passo

### 1️⃣ Fazer Upload Manual no Supabase

Acesse: https://supabase.com/dashboard/project/byhkitxlcaxbddssnypy/storage/buckets/empreendimentos

Para cada arquivo listado acima:
1. Clique em "Upload files"
2. Selecione o arquivo de `src/assets/`
3. Faça upload na pasta apropriada:
   - Banners → `banners/`
   - Empreendimentos → `empreendimentos/`
   - Casas → `casas/`

### 2️⃣ Executar SQLs de Atualização

Após fazer upload de todos os arquivos, execute os SQLs abaixo no **SQL Editor do Supabase**:

```sql
-- =====================================================
-- ATUALIZAR BANNERS
-- =====================================================

-- Banner: Luxo e conforto
UPDATE st_banners_home 
SET 
  background_image = 'https://byhkitxlcaxbddssnypy.supabase.co/storage/v1/object/public/empreendimentos/banners/hero-house.jpg',
  logo_image = 'https://byhkitxlcaxbddssnypy.supabase.co/storage/v1/object/public/empreendimentos/banners/splendore-logo.webp'
WHERE id = '5eb34763-e03d-4454-b816-118cecd6f187';

-- Banner: Sofisticação e exclusividade
UPDATE st_banners_home 
SET background_image = 'https://byhkitxlcaxbddssnypy.supabase.co/storage/v1/object/public/empreendimentos/banners/hero-house.jpg'
WHERE id = 'abebbb33-c42f-4e2a-b6a0-1290dcf3e79a';

-- =====================================================
-- ATUALIZAR EMPREENDIMENTOS
-- =====================================================

-- Empreendimento: Casa Volpi (Cópia)
UPDATE st_empreendimentos 
SET 
  hero_image = 'https://byhkitxlcaxbddssnypy.supabase.co/storage/v1/object/public/empreendimentos/empreendimentos/casa-volpi-hero.jpg',
  card_image = 'https://byhkitxlcaxbddssnypy.supabase.co/storage/v1/object/public/empreendimentos/empreendimentos/casa-volpi-card.jpg'
WHERE id = '11698b7a-2b2c-47cd-9954-ba0c73fa1bb4';

-- =====================================================
-- ATUALIZAR CASAS
-- =====================================================

-- Casas com splendore-card.jpg
UPDATE st_casas 
SET foto_capa = 'https://byhkitxlcaxbddssnypy.supabase.co/storage/v1/object/public/empreendimentos/casas/splendore-card.jpg'
WHERE id IN (
  '1b87cbd0-aa57-4f64-a894-64cb559523f5',
  'e4bf9559-ad8a-4348-bd09-5503d04468b5'
);

-- Casas com parque-imbuias-card.jpg
UPDATE st_casas 
SET foto_capa = 'https://byhkitxlcaxbddssnypy.supabase.co/storage/v1/object/public/empreendimentos/casas/parque-imbuias-card.jpg'
WHERE id IN (
  'a84138d8-f168-440c-80c6-67281b6f6992',
  '7a7c4f4e-3a53-4ff9-ad7f-49b2247c56bc'
);

-- Casas com casa-volpi-card.jpg
UPDATE st_casas 
SET foto_capa = 'https://byhkitxlcaxbddssnypy.supabase.co/storage/v1/object/public/empreendimentos/casas/casa-volpi-card.jpg'
WHERE id IN (
  'c31e9c46-617a-409d-88bc-9e44f984dc05',
  '7a5751fc-85ee-4dbf-9659-757dd8be6528'
);
```

### 3️⃣ Verificar Resultados

Execute estas queries para confirmar que não restam caminhos locais:

```sql
-- Verificar empreendimentos
SELECT id, nome, hero_image, card_image, logo_image 
FROM st_empreendimentos 
WHERE hero_image LIKE '/src/assets/%' 
   OR card_image LIKE '/src/assets/%' 
   OR logo_image LIKE '/src/assets/%';

-- Verificar banners
SELECT id, titulo, background_image, logo_image 
FROM st_banners_home 
WHERE background_image LIKE '/src/assets/%' 
   OR logo_image LIKE '/src/assets/%';

-- Verificar casas
SELECT id, nome, foto_capa, hero_image 
FROM st_casas 
WHERE foto_capa LIKE '/src/assets/%' 
   OR hero_image LIKE '/src/assets/%';
```

Todas as queries devem retornar **0 resultados**.

## ✅ Checklist

- [ ] Upload de `hero-house.jpg` para `banners/`
- [ ] Upload de `splendore-logo.webp` para `banners/`
- [ ] Upload de `casa-volpi-hero.jpg` para `empreendimentos/`
- [ ] Upload de `casa-volpi-card.jpg` para `empreendimentos/`
- [ ] Upload de `splendore-card.jpg` para `casas/`
- [ ] Upload de `parque-imbuias-card.jpg` para `casas/`
- [ ] Executar SQL de atualização de banners
- [ ] Executar SQL de atualização de empreendimentos
- [ ] Executar SQL de atualização de casas
- [ ] Verificar que não há mais erros 404
- [ ] Testar homepage e páginas de detalhes

## 🎯 Resultado Esperado

Após completar todos os passos:
- ✅ Nenhum erro 404 de imagens
- ✅ Todos os banners carregando corretamente
- ✅ Cards de empreendimentos e casas com imagens funcionando
- ✅ Site totalmente funcional em produção
