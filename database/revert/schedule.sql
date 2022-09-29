-- Revert heatpump:schedule from pg

BEGIN;

DROP TABLE schedule;

DROP TYPE weekday;

COMMIT;
