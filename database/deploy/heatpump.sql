-- Deploy heatpump:heater to pg

BEGIN;

CREATE TYPE heatpump_mode AS ENUM ('heat', 'cool');

CREATE TABLE heatpump (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id integer NOT NULL,
  name text,

  temperature integer NOT NULL,
  fan_speed integer NOT NULL,
  mode heatpump_mode NOT NULL,
  scheduled boolean NOT NULL DEFAULT false
);

COMMIT;
