-- migrate:up
CREATE TABLE revocation_list (
    jwt_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_revocation_user_id ON revocation_list (user_id);
-- migrate:down

DROP TABLE IF EXISTS revocation_list;

