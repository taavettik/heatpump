import { ComponentProps } from 'preact';
import { Controller, useForm } from 'react-hook-form';
import { FanSlider } from '../../routes/home/FanSlider';
import { styled } from '../constants/styled';
import { Input } from './Input';
import { Spacing, Stack } from './Layout';
import { Text } from './Text';

interface ScheduleData {
  temperature: number;
  fanSpeed: number;
  startTime: Date | null;
  endTime: Date | null;
}

export function ScheduleForm({
  defaultValues,
}: {
  defaultValues?: ScheduleData;
}) {
  const form = useForm<ScheduleData>({ defaultValues });

  return (
    <Stack axis="y">
      <Content>
        <Field area="temperature" axis="y" spacing="xxsmall">
          <Text variant="body" style={{ fontSize: 22 }}>
            Temperature
          </Text>

          <Stack axis="x" align="center" spacing="xxsmall">
            <Input
              css={{ width: 60 }}
              {...form.register('temperature')}
              type="number"
            />

            <Text variant="body" style={{ fontSize: 24 }}>
              °C
            </Text>
          </Stack>
        </Field>

        <Field area="fanSpeed" axis="x" align="center" spacing="xxsmall">
          <Stack axis="y" spacing="small">
            <Text variant="body" style={{ fontSize: 22 }}>
              Fan Speed
            </Text>

            <Controller
              name="fanSpeed"
              render={({ field: { value, onChange } }) => (
                <FanSlider
                  onChange={(speed) => onChange(speed)}
                  initialValue={value}
                />
              )}
              control={form.control}
            ></Controller>
          </Stack>
        </Field>

        <Field area="startTime">
          <Stack axis="y" spacing="xxsmall">
            <Text variant="label">From</Text>

            <Input
              css={{ width: 150 }}
              {...form.register('startTime')}
              type="time"
            />
          </Stack>
        </Field>
        <Field area="endTime">
          <Stack axis="y" spacing="xxsmall">
            <Text variant="label">To</Text>

            <Input
              css={{ width: 150 }}
              {...form.register('startTime')}
              type="time"
            />
          </Stack>
        </Field>
      </Content>
    </Stack>
  );
}

const Field = ({
  area,
  children,
  ...props
}: ComponentProps<typeof Stack> & { area?: string }) => (
  <Stack {...props} style={{ gridArea: area, ...props.style }}>
    {children}
  </Stack>
);

const Content = styled('div', {
  display: 'grid',
  gridTemplateAreas: '"temperature fanSpeed" "startTime endTime"',
  gridTemplateColumns: '200px 1fr',
  gridTemplateRows: '1fr',
  gap: '$small',
  '@media(max-width: 600px)': {
    gridTemplateAreas: '"temperature" "fanSpeed"',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 1fr',
    gap: '$small',
  },
});
