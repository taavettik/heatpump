import { Service } from 'typedi';
import { Db } from '../common/db';
import { Schedule, weekday } from '../shared/schema';
import { CamelCase } from '../shared/types';

const weekDays: weekday[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

@Service()
export class ScheduleDao {
  get(tx: Db, id: string) {
    return tx.oneOrNone<CamelCase<Schedule>>(
      `SELECT * FROM schedule WHERE id = $[id]`,
      {
        id,
      },
    );
  }

  getAll(tx: Db) {
    return tx.any<CamelCase<Schedule>>(`SELECT * FROM schedule`);
  }

  getCurrent(tx: Db) {
    const dayOfWeek = new Date().getUTCDay();
    const day = weekDays[dayOfWeek];

    return tx.any<CamelCase<Schedule>>(
      `SELECT * FROM schedule WHERE
        (
          -- schedules spanning the midnight, e.g. 22:00 - 3:00 am
          CASE WHEN end_time < start_time THEN
            (
              (start_time <= current_time AND current_time <= '23:59:59'::time) OR
              (current_time >= '00:00'::time AND current_time <= end_time)
            )
          ELSE start_time <= current_time AND current_time < end_time 
          END
        ) AND ($[day] = ANY(weekdays) OR weekdays IS NULL)`,
      {
        day,
      },
    );
  }

  getDefault(tx: Db) {
    return tx.oneOrNone<CamelCase<Schedule>>(`
      SELECT * FROM schedule WHERE start_time IS NULL AND end_time IS NULL ORDER BY created_at DESC LIMIT 1;
    `);
  }
}
