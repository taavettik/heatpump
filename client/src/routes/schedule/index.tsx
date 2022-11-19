import { useQuery } from '@tanstack/react-query';
import { api } from '../../common/api';
import { Spacing } from '../../common/components/Layout';
import { Page } from '../../common/components/Page';
import { ScheduleForm } from '../../common/components/ScheduleForm';
import { Text } from '../../common/components/Text';
import { parseTime } from '../../common/utils/time';

export function SchedulePage({ id }: { id: string }) {
  const schedule = useQuery(['schedule', id], () => api.fetchSchedule(id));

  console.log(schedule.data);

  return (
    <Page>
      <Spacing size="xlarge" />

      <Text variant="title1">Edit schedule</Text>

      <Spacing size="normal" />

      {schedule.data ? (
        <ScheduleForm
          defaultValues={{
            temperature: schedule.data.temperature,
            fanSpeed: schedule.data.fanSpeed,
            startTime: schedule.data.startTime
              ? parseTime(schedule.data.startTime).toJSDate()
              : null,
            endTime: schedule.data.endTime
              ? parseTime(schedule.data.endTime).toJSDate()
              : null,
          }}
        />
      ) : null}
    </Page>
  );
}
