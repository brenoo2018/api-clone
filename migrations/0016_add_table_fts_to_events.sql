-- Migration number: 0016 	 2024-10-03T23:22:07.301Z
CREATE VIRTUAL TABLE v_events USING fts5(title, description, content=events, content_rowid=id);

INSERT INTO v_events(rowid, title, description) 
SELECT id, title, description FROM events;

CREATE TRIGGER IF NOT EXISTS v_events_insert AFTER INSERT ON events BEGIN
  INSERT INTO v_events(rowid, title, description) 
  VALUES (NEW.id, NEW.title, NEW.description);
END;

CREATE TRIGGER IF NOT EXISTS v_events_delete AFTER DELETE ON events BEGIN
  INSERT INTO v_events(v_events, rowid, title, description) 
  VALUES('delete', OLD.id, OLD.title, OLD.description);
END;

CREATE TRIGGER IF NOT EXISTS v_events_update AFTER UPDATE OF title, description ON events BEGIN
  INSERT INTO v_events(v_events, rowid, title, description) 
  VALUES('delete', OLD.id, OLD.title, OLD.description);
  
  INSERT INTO v_events(rowid, title, description) 
  VALUES(NEW.id, NEW.title, NEW.description);
END;