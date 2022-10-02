-- admin / lämpöpumppu69
INSERT INTO app_user (username, password_hash) VALUES ('admin', '$2y$12$mP0k77Kb/9i.nOb5k7.Y0.7F.cFhwY9J03vv9vPgOKn3031YvFKzK');

INSERT INTO heatpump (device_id, temperature, fan_speed, mode) VALUES (1, 20, 0, 'heat');

INSERT INTO schedule (start_time, end_time, weekdays, temperature, fan_speed) VALUES
('07:00', '13:00', '{monday,tuesday,wednesday,thursday,friday}', 20, 4),
('13:00', '17:00', '{monday,tuesday,wednesday,thursday,friday}', 18, 4),
('22:00', '02:00', null, 24, 4),
(null, null, null, 20, 0);