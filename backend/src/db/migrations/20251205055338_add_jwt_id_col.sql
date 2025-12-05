-- migrate:up

ALTER TABLE refresh_tokens ADD token Text NOT NULL;


-- migrate:down

ALTER TABLE refresh_tokens DROP COLUMN token;
