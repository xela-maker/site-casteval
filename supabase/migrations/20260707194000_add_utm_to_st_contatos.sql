ALTER TABLE st_contatos
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_term text,
  ADD COLUMN IF NOT EXISTS utm_content text;

COMMENT ON COLUMN st_contatos.utm_source IS 'Parâmetro UTM utm_source capturado na visita';
COMMENT ON COLUMN st_contatos.utm_medium IS 'Parâmetro UTM utm_medium capturado na visita';
COMMENT ON COLUMN st_contatos.utm_campaign IS 'Parâmetro UTM utm_campaign capturado na visita';
COMMENT ON COLUMN st_contatos.utm_term IS 'Parâmetro UTM utm_term capturado na visita';
COMMENT ON COLUMN st_contatos.utm_content IS 'Parâmetro UTM utm_content capturado na visita';
