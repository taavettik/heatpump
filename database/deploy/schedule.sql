-- Deploy heatpump:schedule to pg

BEGIN;

CREATE TYPE weekday AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'); 

CREATE TABLE schedule (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  created_at TIMESTAMP NOT NULL DEFAULT now(),
  description TEXT NOT NULL DEFAULT '',

  fan_speed INTEGER NOT NULL,
  temperature INTEGER NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  weekdays weekday[] NOT NULL DEFAULT '{}'::weekday[]
);

COMMIT;
