-- Revert heatpump:app_user from pg

BEGIN;

DROP TABLE app_user;

COMMIT;
