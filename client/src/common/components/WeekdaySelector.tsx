import { weekday } from '../../shared/schema';
import { styled } from '../constants/styled';
import { Input } from './Input';
import { Stack } from './Layout';
import { Text } from './Text';

interface Props {
  value?: weekday[];
  onChange?: (target: weekday[]) => void;
}

const weekdays: weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export function WeekdaySelector({ value, onChange }: Props) {
  console.log(value);

  const onToggle = (val: weekday, target: boolean) => {
    const current = value ?? weekdays.slice();

    if (target) {
      onChange?.([...new Set([...current, val])]);

      return;
    }

    onChange?.(current.filter((d) => d !== val));

    return;
  };

  const allChecked = weekdays.every((day) => value?.includes(day)) || !value;

  return (
    <Stack axis="y">
      <FieldSet>
        <Legend>
          <Stack axis="x" spacing="xsmall" align="center">
            <Input
              type="checkbox"
              checked={allChecked}
              id={'select-all'}
              onChange={() => onChange?.(allChecked ? [] : weekdays.slice())}
            />
            <Text variant="label" htmlFor={'select-all'}>
              Select all
            </Text>
          </Stack>
        </Legend>

        {weekdays.map((day) => (
          <Stack axis="x" spacing="xsmall" align="center">
            <Input
              type="checkbox"
              checked={value?.includes(day) || !value}
              onChange={(e: any) => onToggle(day, e.target.value)}
              key={day}
              id={day}
            />{' '}
            <Text variant="label" htmlFor={day} style={{ fontSize: '20px' }}>
              {day.slice(0, 1).toLocaleUpperCase() + day.slice(1)}
            </Text>
          </Stack>
        ))}
      </FieldSet>
    </Stack>
  );
}

const FieldSet = styled('fieldset', {
  display: 'flex',
  flexDirection: 'column',
  border: 'none',
});

const Legend = styled('div', {
  borderBottom: '2px solid $muted1',
  paddingBottom: '$xxsmall',
  marginBottom: '$xxsmall',
});
