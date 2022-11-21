import { Spacing } from '../../common/components/Layout';
import { Page } from '../../common/components/Page';
import { Text } from '../../common/components/Text';
import { ScheduleTable } from './ScheduleTable';

export function SchedulesPage() {
  return (
    <Page>
      <Text variant="title1">Schedules</Text>

      <Spacing size="normal" />

      <ScheduleTable />
    </Page>
  );
}
