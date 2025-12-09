-- migrate:up
ALTER TABLE notes ADD contents TEXT NOT NULL; 

-- migrate:down
ALTER TABLE notes DROP COLUMN contents;
