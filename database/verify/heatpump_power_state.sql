-- Verify heatpump:heatpump_power_state on pg

BEGIN;

SELECT power FROM heatpump;

ROLLBACK;
