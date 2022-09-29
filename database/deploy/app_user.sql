-- Deploy heatpump:app_user to pg

BEGIN;

CREATE TABLE app_user (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  username text NOT NULL,
  password_hash text NOT NULL
);

COMMIT;
