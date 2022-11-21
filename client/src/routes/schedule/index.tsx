import { useQuery, useQueryClient } from '@tanstack/react-query';
import { route } from 'preact-router';
import { DateTime } from 'luxon';
import { api } from '../../common/api';
import { Spacing } from '../../common/components/Layout';
import { Page } from '../../common/components/Page';
import { ScheduleForm } from '../../common/components/ScheduleForm';
import { Text } from '../../common/components/Text';
import { parseTime } from '../../common/utils/time';
import { useUpdateScheduleMutation } from '../../hooks/mutations';

export function SchedulePage({ id }: { id: string }) {
  const schedule = useQuery(['schedule', id], () => api.fetchSchedule(id));

  const queryClient = useQueryClient();

  const updateSchedule = useUpdateScheduleMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule', id] });
      route('/schedules');
    },
  });

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
            weekDays: schedule.data.weekdays,
          }}
          onCancel={() => history.go(-1)}
          onSubmit={(data) =>
            updateSchedule.mutateAsync({
              id: schedule.data.id,
              temperature: data.temperature,
              fanSpeed: data.fanSpeed,
              startTime: data.startTime
                ? DateTime.fromJSDate(data.startTime)
                    .toUTC()
                    .toFormat('HH:mm:ss')
                : null,
              endTime: data.endTime
                ? DateTime.fromJSDate(data.endTime).toUTC().toFormat('HH:mm:ss')
                : null,
              weekdays: data.weekDays,
            })
          }
        />
      ) : null}
    </Page>
  );
}
