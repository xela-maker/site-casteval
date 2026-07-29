-- Garante espaço amplo para telefone (internacional, máscara formatada, etc.)
-- Antes o corte vinha do front (slice 11), não do banco — reforçamos o schema mesmo assim.
ALTER TABLE public.st_contatos
  ALTER COLUMN telefone TYPE varchar(32);

COMMENT ON COLUMN public.st_contatos.telefone IS
  'Telefone do lead. Preferência: DDD+número (10–11 dígitos). Aceita até 32 chars (máscara/internacional).';
