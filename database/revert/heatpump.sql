-- Revert heatpump:heater from pg

BEGIN;

DROP TABLE heatpump;

DROP TYPE heatpump_mode;

COMMIT;
