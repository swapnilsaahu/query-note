-- migrate:up
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS revocation_list;

CREATE TABLE refresh_tokens (
    jwt_id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)

-- migrate:down

