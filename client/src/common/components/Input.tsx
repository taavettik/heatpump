import { ComponentProps } from 'preact';
import { forwardRef } from 'preact/compat';
import { useId } from 'preact/hooks';
import { useUuid } from '../../hooks/useUuid';
import { styled } from '../constants/styled';
import { Stack } from './Layout';
import { Text } from './Text';

type Props = ComponentProps<typeof BaseInput> & { label?: string };

export const Input = forwardRef(({ label, ...props }: Props, ref) => {
  const id = useUuid();

  return label ? (
    <Stack axis="y" spacing="xxsmall">
      <Text variant="label" htmlFor={id}>
        {label}
      </Text>

      <BaseInput id={id} ref={ref} {...props} />
    </Stack>
  ) : (
    <BaseInput id={id} ref={ref} {...props} />
  );
});

export const BaseInput = styled('input', {
  backgroundColor: '$background',
  color: '$textSecondary',
  fontSize: 24,
  border: 'none',
  borderRadius: 4,

  '&[type="checkbox"]': {
    accentColor: '$colors$primaryBright4',
    color: 'white',
    width: 24,
    height: 24,
  },

  outline: 'none !important',
  padding: 4,

  '&:focus': {
    boxShadow: '0 0 1px 1px black',
  },
});
