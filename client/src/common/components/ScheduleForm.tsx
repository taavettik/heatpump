import { DateTime } from 'luxon';
import { ComponentProps } from 'preact';
import { Controller, useForm } from 'react-hook-form';
import { FanSlider } from '../../routes/home/FanSlider';
import { weekday } from '../../shared/schema';
import { styled } from '../constants/styled';
import { Button } from './Button';
import { Input } from './Input';
import { Spacing, Stack } from './Layout';
import { Text } from './Text';
import { WeekdaySelector } from './WeekdaySelector';

interface ScheduleData {
  temperature: number;
  fanSpeed: number;
  startTime: Date | null;
  endTime: Date | null;
  weekDays: weekday[] | null;
}

type ScheduleFormData = Omit<ScheduleData, 'startTime' | 'endTime'> & {
  startTime: string | null;
  endTime: string | null;
};

export function ScheduleForm({
  defaultValues,
  onCancel,
  onSubmit,
}: {
  defaultValues?: Partial<ScheduleData>;
  onCancel?: () => void;
  onSubmit?: (data: ScheduleData) => void;
}) {
  const form = useForm<ScheduleFormData>({
    defaultValues: {
      fanSpeed: 0,
      weekDays: null,
      ...defaultValues,
      startTime: defaultValues?.startTime
        ? DateTime.fromJSDate(defaultValues?.startTime).toFormat('HH:mm')
        : null,
      endTime: defaultValues?.endTime
        ? DateTime.fromJSDate(defaultValues?.endTime).toFormat('HH:mm')
        : null,
    },
    mode: 'onBlur',
  });

  console.log(form.formState.errors, form.formState.isValid);

  return (
    <Stack axis="y">
      <Content
        onSubmit={form.handleSubmit((data) => {
          onSubmit?.({
            ...data,
            startTime: data.startTime
              ? DateTime.fromFormat(data.startTime, 'HH:mm').toJSDate()
              : null,
            endTime: data.endTime
              ? DateTime.fromFormat(data.endTime, 'HH:mm').toJSDate()
              : null,
          });
        })}
      >
        <Field area="temperature" axis="y" spacing="xxsmall">
          <Text variant="body" style={{ fontSize: 22 }}>
            Temperature
          </Text>

          <Stack axis="x" align="center" spacing="xxsmall">
            <Input
              css={{ width: 60 }}
              {...form.register('temperature', { required: true })}
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
          <Input
            label="From"
            css={{ width: 150 }}
            {...form.register('startTime', { required: true })}
            type="time"
          />
        </Field>
        <Field area="endTime">
          <Input
            label="To"
            css={{ width: 150 }}
            {...form.register('endTime', { required: true })}
            type="time"
          />
        </Field>

        <Field area="weekdays">
          <Text variant="label">On</Text>

          <Controller
            name="weekDays"
            control={form.control}
            render={({ field: { value, onChange } }) => (
              <WeekdaySelector
                value={value ?? undefined}
                onChange={(val) => onChange(val)}
              />
            )}
          ></Controller>
        </Field>

        <Field area="buttons">
          <Stack axis="x" justify="space-between">
            <Button
              onClick={(e) => {
                e.preventDefault();
                onCancel?.();
              }}
            >
              Cancel
            </Button>

            <Button disabled={!form.formState.isValid} type="submit">
              Save
            </Button>
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

const Content = styled('form', {
  display: 'grid',
  gridTemplateAreas:
    '"temperature fanSpeed" "startTime endTime" "weekdays weekdays" "buttons buttons"',
  gridTemplateColumns: '200px 1fr',
  gridTemplateRows: '1fr',
  gap: '$small',
  '@media(max-width: 600px)': {
    gridTemplateAreas:
      '"temperature" "fanSpeed" "startTime" "endTime" "weekdays" "buttons"',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr 1fr',
    gap: '$small',
  },
});
