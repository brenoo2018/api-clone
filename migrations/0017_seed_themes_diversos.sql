-- Migration number: 0017 	 2024-10-24T19:26:42.304Z
INSERT INTO themes (title, created_at, updated_at) VALUES
  ('Diversos', strftime('%s', 'now'), strftime('%s', 'now'));