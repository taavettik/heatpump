-- Revert heatpump:heater from pg

BEGIN;

DROP TABLE heatpump;

COMMIT;
