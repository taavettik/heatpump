import { DateTime } from 'luxon';
import { weekday } from '../../shared/schema';

export function formatTime(time: string) {
  return DateTime.fromFormat(time, 'HH:mm:ss').toFormat('HH:mm');
}

export function parseTime(time: string) {
  return DateTime.fromFormat(time, 'HH:mm:ss');
}

const weekdays: weekday[] = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

export function getWeekday(date: Date) {
  return weekdays[date.getDay()];
}
