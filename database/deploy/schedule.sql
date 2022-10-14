-- Deploy heatpump:schedule to pg

BEGIN;

CREATE TYPE weekday AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'); 

CREATE TABLE schedule (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  created_at TIMESTAMP NOT NULL DEFAULT now(),
  description TEXT NOT NULL DEFAULT '',

  fan_speed INTEGER NOT NULL,
  temperature INTEGER NOT NULL,
  start_time TIME,
  end_time TIME,
  weekdays weekday[] DEFAULT '{}'::weekday[]
);

COMMIT;
