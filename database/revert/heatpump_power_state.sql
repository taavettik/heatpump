-- Revert heatpump:heatpump_power_state from pg

BEGIN;

ALTER TABLE heatpump DROP COLUMN power;

COMMIT;
