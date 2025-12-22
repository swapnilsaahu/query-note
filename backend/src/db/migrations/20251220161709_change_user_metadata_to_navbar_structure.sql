-- migrate:up
DROP TABLE users_metadata;

CREATE TABLE notes_metadata (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    subject TEXT NOT NULL,
    favourite BOOLEAN DEFAULT FALSE
)

-- migrate:down

