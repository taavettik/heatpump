import { useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { route } from 'preact-router';
import { useMemo, useState } from 'preact/hooks';
import { api } from '../../common/api';
import { Spacing, Stack } from '../../common/components/Layout';
import { Text } from '../../common/components/Text';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../../common/constants/icons';
import { styled } from '../../common/constants/styled';
import { range } from '../../common/utils/fn';
import { formatTime, getWeekday, parseTime } from '../../common/utils/time';
import { Schedule } from '../../shared/schema';
import { CamelCase } from '../../shared/types';
import { useCurrentHours, useCurrentTime } from './useCurrentHour';

const tableHeight = 500;

export function ScheduleTable() {
  const schedules = useQuery(['schedules'], api.fetchSchedules);

  const [offsetDays, setOffsetDays] = useState(0);

  const now = useCurrentTime();
  const currentHours = useCurrentHours();

  const selected = useMemo(
    () => DateTime.fromJSDate(now).plus({ days: offsetDays }),
    [now.getTime(), offsetDays],
  );

  return (
    <Stack axis="y" align="center">
      <Stack axis="x" align="center" spacing="xxsmall" justify="space-between">
        <CursorButton
          disabled={offsetDays <= -6}
          onClick={() => setOffsetDays((days) => days - 1)}
        >
          <ChevronLeftIcon size={24} />
        </CursorButton>

        <Stack
          width="250px"
          justify="center"
          axis="x"
          align="center"
          spacing="xxsmall"
        >
          <Text variant="title2">{selected.setLocale('en').weekdayLong}</Text>

          <Text variant="title3">
            {offsetDays === -1 && '(Yesterday)'}
            {offsetDays === 0 && '(Today)'}
            {offsetDays === 1 && '(Tomorrow)'}
          </Text>
        </Stack>

        <CursorButton
          disabled={offsetDays >= 6}
          onClick={() => setOffsetDays((days) => days + 1)}
        >
          <ChevronRightIcon size={24} />
        </CursorButton>
      </Stack>

      <Spacing axis="y" size="small" />

      <TableContainer>
        {range(23).map((hour) => (
          <HourTick
            onClick={() =>
              route(
                `/schedules/new?startTime=${DateTime.fromJSDate(now)
                  .set({ hour: hour - 1, minute: 0, second: 0, millisecond: 0 })
                  .toUTC()
                  .toISO()}`,
              )
            }
            css={{
              top: (tableHeight / 24) * (hour - 1),
              height: tableHeight / 24,
            }}
          />
        ))}

        {schedules.data?.map((schedule) => (
          <Schedule
            onClick={() => {
              route(`/schedules/${schedule.id}`);
            }}
            key={schedule.id}
            schedule={schedule}
            date={selected.toJSDate()}
          />
        ))}

        {offsetDays === 0 && (
          <CurrentMarker
            css={{ bottom: (tableHeight / 24) * (24 - currentHours) }}
          >
            <Text variant="body" style={{ fontSize: 20, color: 'black' }}>
              {DateTime.now().toFormat('HH:mm')}
            </Text>
          </CurrentMarker>
        )}
      </TableContainer>
    </Stack>
  );
}

function Schedule({
  schedule,
  onClick,
  date,
}: {
  schedule: CamelCase<Schedule>;
  onClick?: () => void;
  date: Date;
}) {
  const currentHours = useCurrentHours();
  const currentDate = useCurrentTime();
  const weekday = getWeekday(date);

  if (
    !schedule.startTime ||
    !schedule.endTime ||
    (schedule.weekdays && !schedule.weekdays?.some((d) => d === weekday))
  ) {
    return null;
  }

  const startTime = parseTime(schedule.startTime).toLocal();
  const endTime = parseTime(schedule.endTime).toLocal();

  const pixelsPerHour = tableHeight / 24;

  // this should be done in terms of minutes
  const startHours = startTime.hour + startTime.minute / 60;
  const endHours = endTime.hour + endTime.minute / 60 || 24;

  const duration = endHours - startHours;

  const active =
    currentDate.getDay() === date.getDate() && duration < 0
      ? currentHours >= startHours || currentHours <= endHours
      : currentHours >= startHours && currentHours <= endHours;

  const content = (
    <Text variant="body" style={{ fontSize: 20 }}>
      {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}:{' '}
      {schedule.temperature} °C
    </Text>
  );

  // schedules spanning past midnight, e.g. 23:00 - 02:00
  if (duration < 0) {
    return (
      <>
        <ScheduleContainer
          data-active={active}
          onClick={onClick}
          css={{
            top: pixelsPerHour * startHours + 1,
            height: (24 - startHours) * pixelsPerHour - 1,
          }}
        >
          {content}
        </ScheduleContainer>

        <ScheduleContainer
          data-active={active}
          onClick={onClick}
          css={{
            top: 0,
            height: pixelsPerHour * endHours,
          }}
        >
          {content}
        </ScheduleContainer>
      </>
    );
  }

  return (
    <ScheduleContainer
      onClick={onClick}
      data-active={active}
      css={{
        top: pixelsPerHour * startHours + 1,
        height: pixelsPerHour * duration - 1,
      }}
    >
      {content}
    </ScheduleContainer>
  );
}

const TableContainer = styled('div', {
  height: tableHeight,
  width: 300,
  backgroundColor: '$background',
  borderRadius: 4,
  position: 'relative',
  zIndex: 1,
  overflow: 'hidden',
});

const ScheduleContainer = styled('button', {
  cursor: 'pointer',
  width: '100%',
  position: 'absolute',
  backgroundColor: '$primaryBright3',
  border: '1px solid $primaryBright1',
  borderLeftWidth: 0,
  borderRightWidth: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '&[data-active]': {
    backgroundColor: '$primaryBright4',
  },
});

const HourTick = styled('button', {
  position: 'absolute',
  width: '100%',
  borderBottom: '1px solid $muted1',
  background: 'none',
  cursor: 'pointer',
  borderWidth: '0 0 1px 0',
});

const CurrentMarker = styled('div', {
  position: 'absolute',
  width: '100%',
  borderBottom: '2px solid black',
  justifyContent: 'center',
  display: 'flex',
  paddingBottom: '4px',
  pointerEvents: 'none',
});

const CursorButton = styled('button', {
  border: 'none',
  background: 'none',
  color: 'white',
  cursor: 'pointer',
  width: 40,
  height: 40,
  borderRadius: 20,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:focus': {
    outline: 'none',
  },
  '&:hover': {
    backgroundColor: '#ffffff22',
  },
  '&:disabled': {
    background: 'none !important',
    cursor: 'initial',
    color: '$muted2',
  },
});
