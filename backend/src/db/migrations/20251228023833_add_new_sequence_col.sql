-- migrate:up
ALTER TABLE notes ADD sequence NUMERIC(16,8);

CREATE INDEX notes_subject_idx ON notes(tag);
CREATE INDEX notes_sequence_subject_idx on notes(tag,sequence);


-- migrate:down

