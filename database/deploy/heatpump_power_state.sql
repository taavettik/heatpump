-- Deploy heatpump:heatpump_power_state to pg

BEGIN;

ALTER TABLE heatpump ADD COLUMN power BOOLEAN NOT NULL DEFAULT true;

COMMIT;
