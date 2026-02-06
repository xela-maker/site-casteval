# Empreendimento "Sem Empreendimento"

## Visão Geral

O sistema utiliza um empreendimento especial chamado **"Sem Empreendimento"** que serve como placeholder para casas que não estão vinculadas a um empreendimento específico. Este é um empreendimento do sistema que garante a integridade referencial do banco de dados.

## Por que existe?

Anteriormente, casas podiam ter `empreendimento_id = NULL`, o que causava problemas:
- Queries com `INNER JOIN` falhavam
- Páginas de detalhes quebravam ao tentar acessar dados do empreendimento
- Falta de consistência nos dados

## Características

| Propriedade | Valor | Motivo |
|------------|-------|--------|
| **Nome** | Sem Empreendimento | Identificação clara |
| **Slug** | `sem-empreendimento` | URL amigável (não acessível) |
| **Status** | `arquivado` | Não aparece em listagens públicas |
| **is_active** | `false` | Camada extra de proteção |
| **Tags** | `['sistema']` | Identificador especial do sistema |
| **Ordem** | `9999` | Aparece no final em listagens administrativas |

## Proteção Tripla

O empreendimento é **invisível para o público** através de três filtros:

1. **Filtro de Status**: `status != 'publicado'`
2. **Filtro de Ativo**: `is_active = false`
3. **Filtro de Tag**: `tags não contém 'sistema'`

Implementado em `src/hooks/useEmpreendimentos.tsx`:
```typescript
.eq('is_active', true)
.eq('status', 'publicado')
.not('tags', 'cs', '{"sistema"}')
```

## Como Usar

### Na Interface Administrativa

O empreendimento "Sem Empreendimento" aparecerá na lista de empreendimentos do formulário de casas. Administradores podem selecioná-lo para casas que não pertencem a um empreendimento específico.

### Campo Obrigatório

A partir da implementação desta solução, o campo **Empreendimento** é obrigatório em todas as casas. Se uma casa não pertence a um empreendimento real, ela deve ser vinculada ao "Sem Empreendimento".

## Setup Inicial

Para criar o empreendimento e migrar casas existentes:

1. Acesse o [Supabase SQL Editor](https://supabase.com/dashboard/project/byhkitxlcaxbddssnypy/sql/new)
2. Execute o script: `supabase/setup-sem-empreendimento.sql`
3. Faça hard refresh no navegador (Ctrl+Shift+R)

O script irá:
- Criar o empreendimento "Sem Empreendimento" (ou atualizar se já existir)
- Vincular automaticamente todas as casas com `empreendimento_id = NULL`
- Mostrar estatísticas de casas atualizadas

## ⚠️ Avisos Importantes

### NÃO DELETAR
Este empreendimento é parte da infraestrutura do sistema. Deletá-lo causará:
- Erros em casas vinculadas
- Quebra de relacionamentos no banco
- Falhas em queries

### NÃO ATIVAR
Nunca altere:
- `is_active` para `true`
- `status` para `publicado`, `em-breve`, `em-construcao` ou `pronto`
- Remover a tag `sistema`

Essas mudanças fariam o empreendimento aparecer publicamente, o que não é desejado.

## Queries Seguras

### Buscar Empreendimentos Públicos
```typescript
const { data } = await supabase
  .from('st_empreendimentos')
  .select('*')
  .eq('is_active', true)
  .eq('status', 'publicado')
  .not('tags', 'cs', '{"sistema"}');
```

### Buscar Todos (Admin)
```typescript
const { data } = await supabase
  .from('st_empreendimentos')
  .select('*')
  .order('nome');
```

### Buscar Casas com Empreendimento
```typescript
const { data } = await supabase
  .from('st_casas')
  .select(`
    *,
    empreendimento:st_empreendimentos!inner(*)
  `)
  .eq('is_active', true);
```

## Manutenção

### Identificar Casas no "Sem Empreendimento"
```sql
SELECT c.nome, c.slug
FROM st_casas c
JOIN st_empreendimentos e ON c.empreendimento_id = e.id
WHERE e.slug = 'sem-empreendimento';
```

### Migrar Casa para Empreendimento Real
```sql
UPDATE st_casas
SET empreendimento_id = '<id_do_empreendimento_real>'
WHERE id = '<id_da_casa>';
```

## Arquitetura

```
┌─────────────────────────────────────────┐
│   st_empreendimentos                    │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │ Sem Empreendimento               │   │
│  │ - status: nao-publicado          │   │
│  │ - is_active: false               │   │
│  │ - tags: ['sistema']              │   │
│  └──────────────┬───────────────────┘   │
│                 │                       │
└─────────────────┼───────────────────────┘
                  │
                  │ FK: empreendimento_id
                  │
        ┌─────────▼──────────┐
        │    st_casas        │
        │                    │
        │  Casa 1  Casa 2   │
        │  Casa 3  Casa 4   │
        └────────────────────┘
```

## Suporte

Se houver dúvidas ou problemas relacionados a este empreendimento, consulte:
- Este documento
- Script: `supabase/setup-sem-empreendimento.sql`
- Código: `src/hooks/useEmpreendimentos.tsx`
- Formulário: `src/components/admin/CasaFormBase.tsx`
