import { Service } from 'typedi';
import { Db } from '../common/db';
import { Schedule, tables, weekday } from '../shared/schema';
import { CamelCase } from '../shared/types';
import { DateTime } from 'luxon';

const weekDays: weekday[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

// hardcoded for now
const TIMEZONE = 'europe/helsinki';

@Service()
export class ScheduleDao {
  private readonly table = tables.schedule;

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

  async getCurrent(tx: Db) {
    const day = DateTime.now()
      .setZone(TIMEZONE)
      .weekdayLong.toLocaleLowerCase();

    const schedules = await tx.any<CamelCase<Schedule>>(
      `SELECT * FROM schedule WHERE
        (
          -- schedules spanning the midnight, e.g. 22:00 - 3:00 am
          CASE WHEN end_time < start_time THEN
            (
              (start_time <= (current_time AT TIME ZONE 'utc')::time AND (current_time AT TIME ZONE 'utc')::time <= '23:59:59'::time) OR
              ((current_time AT TIME ZONE 'utc')::time >= '00:00'::time AND (current_time AT TIME ZONE 'utc')::time <= end_time)
            )
          ELSE
            (start_time <= (current_time AT TIME ZONE 'utc')::time AND (current_time AT TIME ZONE 'utc')::time < end_time )
          END
        ) AND ($[day] = ANY(weekdays) OR weekdays IS NULL)`,
      {
        day,
      },
    );

    return schedules;
  }

  getDefault(tx: Db) {
    return tx.oneOrNone<CamelCase<Schedule>>(`
      SELECT * FROM schedule WHERE start_time IS NULL AND end_time IS NULL ORDER BY created_at DESC LIMIT 1;
    `);
  }

  update(tx: Db, id: string, data: Partial<CamelCase<Schedule>>) {
    return tx.one(
      `
      UPDATE ${this.table.tableName} SET
      ${[
        data.temperature !== undefined ? 'temperature = $[temperature]' : '',
        data.fanSpeed !== undefined ? 'fan_speed = $[fanSpeed]' : '',
        data.startTime !== undefined ? 'start_time = $[startTime]' : '',
        data.endTime !== undefined ? 'end_time = $[endTime]' : '',
        data.weekdays !== undefined ? 'weekdays = $[weekdays]::weekday[]' : '',
      ]
        .filter(Boolean)
        .join(',')}
      WHERE id = $[id]
      RETURNING *
    `,
      {
        id,
        ...data,
      },
    );
  }
}
