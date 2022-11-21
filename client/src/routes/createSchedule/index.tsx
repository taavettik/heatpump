import { useMutation } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { route } from 'preact-router';
import { Spacing } from '../../common/components/Layout';
import { Page } from '../../common/components/Page';
import { ScheduleForm } from '../../common/components/ScheduleForm';
import { Text } from '../../common/components/Text';
import { useCreateScheduleMutation } from '../../hooks/mutations';

export function CreateSchedulePage({ startTime }: { startTime?: string }) {
  const mutation = useCreateScheduleMutation({
    onSuccess: () => route('/schedules'),
  });

  return (
    <Page>
      <Text variant="title1">Create Schedule</Text>

      <Spacing size="normal" />

      <ScheduleForm
        defaultValues={{
          startTime: startTime ? new Date(startTime) : null,
        }}
        onCancel={() => history.go(-1)}
        onSubmit={(data) => {
          mutation.mutate({
            startTime: data.startTime
              ? DateTime.fromJSDate(data.startTime).toUTC().toFormat('HH:mm:ss')
              : null,
            endTime: data.endTime
              ? DateTime.fromJSDate(data.endTime).toUTC().toFormat('HH:mm:ss')
              : null,
            fanSpeed: data.fanSpeed,
            temperature: data.temperature,
            weekdays: data.weekDays,
            description: '',
            createdAt: new Date(),
          });
        }}
      />
    </Page>
  );
}
