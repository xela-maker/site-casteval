ALTER TABLE st_contatos
  ADD COLUMN IF NOT EXISTS crm_status text,
  ADD COLUMN IF NOT EXISTS crm_enviado_em timestamptz,
  ADD COLUMN IF NOT EXISTS crm_erro text;

ALTER TABLE st_contatos
  DROP CONSTRAINT IF EXISTS st_contatos_crm_status_check;

ALTER TABLE st_contatos
  ADD CONSTRAINT st_contatos_crm_status_check
  CHECK (crm_status IS NULL OR crm_status IN ('pending', 'success', 'error'));

COMMENT ON COLUMN st_contatos.crm_status IS 'Status de sincronização com Loft CRM: pending, success, error';
COMMENT ON COLUMN st_contatos.crm_enviado_em IS 'Data/hora da última tentativa de envio ao Loft CRM';
COMMENT ON COLUMN st_contatos.crm_erro IS 'Detalhe do erro quando crm_status = error';
