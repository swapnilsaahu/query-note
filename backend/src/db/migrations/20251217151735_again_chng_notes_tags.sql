-- migrate:up
DROP TABLE note_tags;
DROP TABLE tags;
ALTER TABLE notes ADD tag TEXT;

-- migrate:down

