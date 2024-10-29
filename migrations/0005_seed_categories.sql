-- Migration number: 0005 	 2024-08-20T19:20:15.857Z
INSERT INTO categories (title, created_at, updated_at) VALUES
  ('Conferências', strftime('%s','now'), strftime('%s','now')),
  ('Congressos', strftime('%s','now'), strftime('%s','now')),
  ('Encontros', strftime('%s','now'), strftime('%s','now')),
  ('Retiros', strftime('%s','now'), strftime('%s','now')),
  ('Acampamentos', strftime('%s','now'), strftime('%s','now')),
  ('Workshops e Cursos', strftime('%s','now'), strftime('%s','now')),
  ('Shows e Festas', strftime('%s','now'), strftime('%s','now')),
  ('Cultos', strftime('%s','now'), strftime('%s','now')),
  ('Ação Social', strftime('%s','now'), strftime('%s','now')),
  ('Missa', strftime('%s','now'), strftime('%s','now')),
  ('Esportivos', strftime('%s','now'), strftime('%s','now'));
