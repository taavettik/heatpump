import { parse } from "date-fns";
import { AcCommand, FanSpeed, Mode } from "../common/schema";
import { IotDao } from "../daos/iotDao";

enum Weekday {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

const WORK_DAYS = [Weekday.MONDAY, Weekday.TUESDAY, Weekday.WEDNESDAY, Weekday.THURSDAY, Weekday.FRIDAY];

interface Schedule {
  from: Date;
  to: Date;
  weekdays: Weekday[];
  command: Partial<AcCommand>;
}

const schedules: Schedule[] = [
  {
    from: parse('10:00', 'HH:mm', new Date()),
    to: parse('16:30', 'HH:mm', new Date()),
    weekdays: [...WORK_DAYS],
    command: {
      fanSpeed: FanSpeed.FAN_SPEED_5,
    }
  }
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
  const schedule = schedules.find(s => {
    const timeMatches = isTimeBetween(s.from, s.to, new Date());

    const dayMatches = s.weekdays.some(day => day === new Date().getDay());

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
    this.log(`Applying schedule: ${JSON.stringify(schedule)}`)
    this.currentSchedule = schedule;

    this.iotDao.update({
      ...schedule.command,
      scheduled: true,
    })
  }
  
  run() {
    this.log(`Running...`)
    const newSchedule = getCurrentSchedule(schedules);

    if (newSchedule === this.currentSchedule) {
      return;
    }

    if (!newSchedule && this.currentSchedule) {
      this.iotDao.update({
        scheduled: false,
      });
      this.currentSchedule = undefined;
    }

    if (!newSchedule) {
      return;
    }
    this.applySchedule(newSchedule);
  }

  private log(msg: string) {
    console.log(`${new Date().toISOString()} [Scheduler]: ${msg}`)
  }
}