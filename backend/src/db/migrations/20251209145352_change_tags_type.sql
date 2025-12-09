-- migrate:up
ALTER TABLE notes
ALTER COLUMN tags TYPE TEXT;

-- migrate:down

