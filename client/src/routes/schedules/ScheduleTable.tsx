import { useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { route } from 'preact-router';
import { api } from '../../common/api';
import { Spacing, Stack } from '../../common/components/Layout';
import { Text } from '../../common/components/Text';
import { styled } from '../../common/constants/styled';
import { range } from '../../common/utils/fn';
import { formatTime, getWeekday, parseTime } from '../../common/utils/time';
import { Schedule } from '../../shared/schema';
import { CamelCase } from '../../shared/types';
import { useCurrentHours, useCurrentTime } from './useCurrentHour';

const tableHeight = 500;

export function ScheduleTable() {
  const schedules = useQuery(['schedules'], api.fetchSchedules);

  const currentHours = useCurrentHours();

  return (
    <Stack axis="y">
      <Text variant="title2">Today</Text>

      <Spacing axis="y" size="small" />

      <TableContainer>
        {range(23).map((hour) => (
          <HourTick css={{ top: (tableHeight / 24) * hour }} />
        ))}

        {schedules.data?.map((schedule) => (
          <Schedule
            onClick={() => {
              console.log('onclick');

              route(`/schedules/${schedule.id}`);
            }}
            key={schedule.id}
            schedule={schedule}
          />
        ))}

        <CurrentMarker
          css={{ bottom: (tableHeight / 24) * (24 - currentHours) }}
        >
          <Text variant="body" style={{ fontSize: 20, color: 'black' }}>
            {DateTime.now().toFormat('HH:mm')}
          </Text>
        </CurrentMarker>
      </TableContainer>
    </Stack>
  );
}

function Schedule({
  schedule,
  onClick,
}: {
  schedule: CamelCase<Schedule>;
  onClick?: () => void;
}) {
  const currentHours = useCurrentHours();
  const date = useCurrentTime();
  const weekday = getWeekday(date);

  if (
    !schedule.startTime ||
    !schedule.endTime ||
    (schedule.weekdays && !schedule.weekdays?.some((d) => d === weekday))
  ) {
    return null;
  }

  const startTime = parseTime(schedule.startTime);
  const endTime = parseTime(schedule.endTime);

  const duration = endTime.diff(startTime, 'hours').hours;
  const pixelsPerHour = tableHeight / 24;

  // this should be done in terms of minutes
  const startHours = startTime.hour + startTime.minute / 60;
  const endHours = endTime.hour + endTime.minute / 60;
  const active =
    duration < 0
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

const HourTick = styled('div', {
  position: 'absolute',
  width: '100%',
  backgroundColor: '$muted1',
  height: 1,
});

const CurrentMarker = styled('div', {
  position: 'absolute',
  width: '100%',
  borderBottom: '2px solid black',
  justifyContent: 'center',
  display: 'flex',
  paddingBottom: '4px',
});
