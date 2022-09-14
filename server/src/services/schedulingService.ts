import { add, parse } from 'date-fns';
import { AcCommand, FanSpeed, Mode } from '../common/schema';
import { IotDao } from '../daos/iotDao';

enum Weekday {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

const WORK_DAYS = [
  Weekday.MONDAY,
  Weekday.TUESDAY,
  Weekday.WEDNESDAY,
  Weekday.THURSDAY,
  Weekday.FRIDAY,
];

const ALL_DAYS = [...WORK_DAYS, Weekday.SATURDAY, Weekday.SUNDAY];

interface Schedule {
  from: Date;
  to: Date;
  weekdays: Weekday[];
  command: Partial<AcCommand>;
}

const defaultCommand: Partial<AcCommand> = {
  temperature: 20,
  fanSpeed: FanSpeed.FAN_SPEED_1,
};

// NOTE: times are in UTC
const schedules: Schedule[] = [
  {
    from: parse('7:00', 'HH:mm', new Date()),
    to: parse('13:00', 'HH:mm', new Date()),
    weekdays: [...WORK_DAYS],
    command: {
      temperature: 20,
      fanSpeed: FanSpeed.FAN_SPEED_5,
    },
  },
  {
    from: parse('22:00', 'HH:mm', new Date()),
    to: parse('02:00', 'HH:mm', new Date()),
    weekdays: [...ALL_DAYS],
    command: {
      temperature: 24,
      fanSpeed: FanSpeed.FAN_SPEED_5,
    },
  },
  {
    from: parse('13:00', 'HH:mm', new Date()),
    to: parse('17:00', 'HH:mm', new Date()),
    weekdays: [...WORK_DAYS],
    command: {
      temperature: 18,
      fanSpeed: FanSpeed.FAN_SPEED_5,
    },
  },
];

/**
 * Returns true if time of 'c' is between that of 'a' and 'b', false otherwise
 *
 * a <= c <= b
 */
function isTimeBetween(a: Date, b: Date, c: Date) {
  const aMinutes = a.getHours() * 60 + a.getMinutes();
  const bMinutes = b.getHours() * 60 + b.getMinutes();

  const lowerBound = aMinutes;
  const upperBound = bMinutes < aMinutes ? bMinutes + 24 * 60 : bMinutes;

  const cMinutes = c.getHours() * 60 + c.getMinutes();

  return cMinutes >= lowerBound && cMinutes <= upperBound;
}

function getCurrentSchedule(schedules: Schedule[]) {
  const schedule = schedules.find((s) => {
    const timeMatches = isTimeBetween(s.from, s.to, new Date());

    const dayMatches = s.weekdays.some((day) => day === new Date().getDay());

    return timeMatches && dayMatches;
  });

  return schedule;
}

export class SchedulingService {
  currentSchedule: Schedule | undefined;

  constructor(private readonly iotDao = new IotDao()) {
    const currentSchedule = getCurrentSchedule(schedules);

    if (!currentSchedule) {
      return;
    }

    this.applySchedule(currentSchedule);
  }

  applySchedule(schedule: Schedule) {
    this.log(`Applying schedule: ${JSON.stringify(schedule)}`);
    this.currentSchedule = schedule;

    this.iotDao.update({
      ...schedule.command,
      scheduled: true,
    });
  }

  run() {
    this.log(`Running...`);
    const newSchedule = getCurrentSchedule(schedules);

    if (newSchedule === this.currentSchedule) {
      return;
    }

    if (!newSchedule && this.currentSchedule) {
      /*
        When switching from a scheduled command to a time outside of the schedule,
        revert back to the default command
      */
      const currentCommand = this.iotDao.get();

      this.iotDao.update(
        currentCommand.scheduled
          ? {
              scheduled: false,
              ...defaultCommand,
            }
          : { scheduled: false },
      );

      this.log(
        `Current schedule ended${
          currentCommand.scheduled ? `, reverting back to default command` : ''
        }`,
      );

      this.currentSchedule = undefined;
    }

    if (!newSchedule) {
      return;
    }
    this.applySchedule(newSchedule);
  }

  private log(msg: string) {
    console.log(`${new Date().toISOString()} [Scheduler]: ${msg}`);
  }
}
