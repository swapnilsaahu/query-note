-- migrate:up
-- create user table

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users_metadata (
    id UUID PRIMARY KEY,
    tabs_structure JSONB,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_addr TEXT,
    revoked BOOLEAN DEFAULT FALSE,
    device_info TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    img_link TEXT NOT NULL UNIQUE,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    vec_emb VECTOR(768),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_tokens ON refresh_tokens (user_id);
CREATE INDEX idx_emb ON notes USING hnsw (vec_emb vector_cosine_ops) WITH (m = 16, ef_construction = 64);

-- migrate:down

DROP INDEX IF EXISTS idx_email;
DROP INDEX IF EXISTS idx_username;
DROP INDEX IF EXISTS idx_tokens;
DROP INDEX IF EXISTS idx_emb;

DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users_metadata;
DROP TABLE IF EXISTS users;


DROP EXTENSION IF EXISTS vector;
