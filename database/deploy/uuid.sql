-- Deploy heatpump:uuid to pg

BEGIN;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

COMMIT;
