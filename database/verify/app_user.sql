-- Verify heatpump:app_user on pg

BEGIN;

SELECT * FROM app_user;

ROLLBACK;
