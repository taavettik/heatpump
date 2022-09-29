-- Verify heatpump:schedule on pg

BEGIN;

SELECT * FROM schedule;

ROLLBACK;
