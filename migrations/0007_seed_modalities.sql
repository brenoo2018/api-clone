-- Migration number: 0007 	 2024-08-20T19:40:58.988Z
INSERT INTO modalities (title, created_at, updated_at) VALUES
  ('Presencial', strftime('%s', 'now'), strftime('%s', 'now')),
  ('Online', strftime('%s', 'now'), strftime('%s', 'now'));
